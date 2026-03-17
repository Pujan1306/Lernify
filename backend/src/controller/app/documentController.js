import fs from "fs/promises";
import Document from "../../model/document.js";
import FlashCard from "../../model/flashCard.js";
import Quiz from "../../model/quizzes.js";
import { pdfParser } from "../../lib/pdfPraser.js";
import { chunkText } from "../../lib/chunkText.js";
import { dbConnect } from "../../lib/dbConnect.js";
import mongoose from "mongoose";

export const UploadDocument = async (req, res) => {
    await dbConnect();
    try {
        if (!req.file) {
            return res.status(400).json({success: false, message: "No file uploaded"})
        }

        const {title} = req.body || {}

        if (!title) {
            if (req.file) {
                await fs.unlink(req.file.path).catch(() => {});
            }
            return res.status(400).json({success: false, message: "Title is required"})
        }

        // Construct Url for the uploaded file
        const protocol = req.headers["x-forwarded-proto"] || req.protocol;
        const host = req.get("host"); 
        const baseUrl = `${protocol}://${host}`;
        const fileUrl = `${baseUrl}/uploads/documents/${req.file.filename}`;


        const document = await Document.create({
            userId: req.user?._id || "507f1f77bcf86cd799439011", // Temporary user ID for testing
            title,
            fileName: req.file.originalname,
            filePath: fileUrl,
            fileSize: req.file.size,
        })

        // Process PDF in background
        processPDF(document._id, req.file.path).catch((error) => {
            console.error(error);
        })
        
        res.status(200).json({ success: true, message: "Document uploaded successfully, processing in progress", data:document });
    } catch (error) {
        if (req.file) {
            await fs.unlink(req.file.path).catch(() => {});
        }
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// Helper function to process PDF
const processPDF = async (documentId, filePath) => {
    try{
    const { text } = await pdfParser(filePath)
    const chunks = chunkText(text, {
        maxChars: 500,
        overlapSentences: 1,
        minChunkChars: 150
    });

    await Document.findByIdAndUpdate(documentId, {
        extractedText: text,
        chunks,
        status: "completed"
    })
    } catch (error) {
        console.error(error);
        await Document.findByIdAndUpdate(documentId, {
            status: "failed"
        })
    }
}

export const GetDocuments = async (req, res) => {
    try {
        await dbConnect();
        const userId = req.user._id;
        const documents = await Document.aggregate([
            {
                $match: { userId: new mongoose.Types.ObjectId(userId) }
            },
            {
                $lookup: {
                    from: "flashcards",
                    localField: "_id",
                    foreignField: "documentId",
                    as: "flashcards"
                }
            },
            {
                $lookup: {
                    from: "quizzes",
                    localField: "_id",
                    foreignField: "documentId",
                    as: "quizzes"
                }
            },
            {
                $addFields: {
                    totalFlashcards: { $size: "$flashcards" },
                    totalQuizzes: { $size: "$quizzes" }
                }
            },
            {
                $project: {
                    chunks: 0,
                    flashcards: 0,
                    quizzes: 0,
                    extractedText: 0,
                }
            }, 
            {
                $sort: {uplaodDate: -1}
            }
        ])
        res.status(200).json({ success: true, message: "Documents fetched successfully", data: documents, count: documents.length });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const GetDocumentById = async (req, res) => {
    try {
        await dbConnect();
        const document = await Document.findOne({ _id: req.params.id, userId: req.user?._id });
        if (!document) {
            return res.status(404).json({ success: false, message: "Document not found" });
        }

        const flashcardsCount = await FlashCard.countDocuments({ documentId: document._id, userId: req.user?._id});
        const quizzesCount = await Quiz.countDocuments({ documentId: document._id, userId: req.user?._id});

        document.lastAccess = Date.now();
        await document.save();

        const documentData = document.toObject();
        documentData.flashcardsCount = flashcardsCount;
        documentData.quizzesCount = quizzesCount;
        res.status(200).json({ success: true, message: "Document fetched successfully", data: documentData });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const UpdateDocumentById = async (req, res) => {
    try {
        await dbConnect();
        const document = await Document.findOne({ _id: req.params.id, userId: req.user?._id });
        if (!document) {
            return res.status(404).json({ success: false, message: "Document not found" });
        }
        await Document.updateOne({ _id: req.params.id }, { $set: { title: req.body.title } });
        res.status(200).json({ success: true, message: "Document updated successfully" });
    } catch (error) {  
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const DeleteDocumentById = async (req, res) => {
    try {
       await dbConnect();
       const document = await Document.findOne({ _id: req.params.id, userId: req.user?._id });
       if (!document) {
        return res.status(404).json({ success: false, message: "Document not found" });
       }
       
       // Extract filename from the full path
       const filename = document.filePath.split('/').pop();
       const localPath = `src/uploads/documents/${filename}`;
       
       await fs.unlink(localPath).catch(() => {});
       await Document.deleteOne();
       res.status(200).json({ success: true, message: "Document deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};