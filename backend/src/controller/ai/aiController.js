import { dbConnect } from "../../lib/dbConnect.js";
import FlashCard from "../../model/flashCard.js";
import Quiz from "../../model/quizzes.js";
import Document from "../../model/document.js";
import ChatHistory from "../../model/chatHistory.js";
import * as geminiService from "../../lib/geminiService.js";
import { findRelevantChunks } from "../../lib/chunkText.js";

export const generateFlashCards = async (req, res) => {
    try {
        await dbConnect();
        const {documentId, count = 10} = req.body;
        if (!documentId) {
            return res.status(400).json({success: false, message: "Document ID is required"});
        }
        const document = await Document.findOne({_id: documentId, userId: req.user._id, status: "completed"});
        if (!document) {
            return res.status(404).json({success: false, message: "Document not found or processing"});
        }

        const cards = await geminiService.generateFlashcards(document.extractedText, parseInt(count));

        const flashcard = await FlashCard.create({
            userId: req.user._id,
            documentId: document._id,
            cards: cards.map((card) => ({
                question: card.question,
                answer: card.answer,
                difficulty: card.difficulty || "medium",
                reviewCount: 0,
                isStarred: false
            }))
        });
        
        return res.status(200).json({success: true, message: "Flashcards generated successfully", data: flashcard});
    } catch (error) {
        console.error("Error generating flashcards:", error);
        return res.status(500).json({success: false, message: "Internal server error"});
    }
}

export const generateQuiz = async (req, res) => {
    try {
        await dbConnect();
        const {documentId, numQuestions = 5, title} = req.body;
        if (!documentId) {
            return res.status(400).json({success: false, message: "Document ID is required"});
        }
        const document = await Document.findOne({_id: documentId, userId: req.user._id, status: "completed"});
        if (!document) {
            return res.status(404).json({success: false, message: "Document not found or processing"});
        }
        const questions = await geminiService.generateQuiz(document.extractedText, parseInt(numQuestions));

        const quiz = await Quiz.create({
            userId: req.user._id,
            documentId: document._id,
            title: title || `${document.title} - Quiz`,
            questions: questions,
            totalQuestions: questions.length,
            userAnswers: [],
            score: 0
        });

        return res.status(200).json({success: true, message: "Quizzes generated successfully", data: quiz});
    } catch (error) {
        console.error("Error generating quizzes:", error);
        return res.status(500).json({success: false, message: "Internal server error"});
    }
}

export const generateSummary = async (req, res) => {
    try {
        await dbConnect();
        const {documentId} = req.body;
        if (!documentId) {
            return res.status(400).json({success: false, message: "Document ID is required"});
        }
        const document = await Document.findOne({_id: documentId, userId: req.user._id, status: "completed"});
        if (!document) {
            return res.status(404).json({success: false, message: "Document not found or processing"});
        }
        const summary = await geminiService.generateSummary(document.extractedText);
        return res.status(200).json({success: true, message: "Summary generated successfully", data: summary});
    } catch (error) {
        console.error("Error generating summary:", error);
        return res.status(500).json({success: false, message: "Internal server error"});
    }
}

export const chat = async (req, res) => {
    try {
        await dbConnect();
        const {documentId, question} = req.body;
        if (!documentId || !question) {
            return res.status(400).json({success: false, message: "Document ID and question are required"});
        }
        const document = await Document.findOne({_id: documentId, userId: req.user._id, status: "completed"});
        if (!document) {
            return res.status(404).json({success: false, message: "Document not found or processing"});
        }
        const relevantChunks = findRelevantChunks(document.chunks, question, 3);
        const relevantIndices = relevantChunks.map(chunk => chunk.chunkIndex);

        let chatHistory = await ChatHistory.findOne({documentId: documentId});
        if (!chatHistory) {
            chatHistory = await ChatHistory.create({documentId: documentId, userId: req.user._id, messages: []});
        }
 
        const answer = await geminiService.chatWithContext(question, relevantChunks);

        chatHistory.messages.push({
            role: "user",
            content: question,
            timestamp: new Date(),
            relevantChunks: []
        });
        chatHistory.messages.push({
            role: "assistant",
            content: answer,
            timestamp: new Date(),
            relevantChunks: relevantIndices
        });
        await chatHistory.save();
        return res.status(200).json({success: true, message: "Chat response generated successfully", data: {question, answer, relevantChunks: relevantIndices, chatHistoryId: chatHistory._id}});
    } catch (error) {
        console.error("Error generating chat:", error);
        return res.status(500).json({success: false, message: "Internal server error"});
    }
}

export const explainConcept = async (req, res) => {
    try {
        await dbConnect();
        const {documentId, concept} = req.body;
        if (!documentId || !concept) {
            return res.status(400).json({success: false, message: "Document ID and concept are required"});
        }
        const document = await Document.findOne({_id: documentId, userId: req.user._id, status: "completed"});
        if (!document) {
            return res.status(404).json({success: false, message: "Document not found or processing"});
        }
        const relevantChunks = findRelevantChunks(document.chunks, concept, 3);
        const context = relevantChunks.map(chunk => chunk.content).join("\n\n");
        const explanation = await geminiService.explainConcept(concept, context);
        return res.status(200).json({success: true, message: "Concept explanation generated successfully", data: {concept, explanation, relevantChunks: relevantChunks.map((chunk) => chunk.chunkIndex)}});
    } catch (error) {
        console.error("Error generating concept explanation:", error);
        return res.status(500).json({success: false, message: "Internal server error"});
    }
}

export const getChatHistory = async (req, res) => {
    try {
        await dbConnect();
        const {documentId} = req.params;
        if (!documentId) {
            return res.status(400).json({success: false, message: "Document ID is required"});
        }
        const chatHistory = await ChatHistory.findOne({userId: req.user._id, documentId}).select("messages");
        if (!chatHistory) {
            return res.status(404).json({success: false, message: "Chat history not found", data: []});
        }
        return res.status(200).json({success: true, message: "Chat history retrieved successfully", data: chatHistory.messages});
    } catch (error) {
        console.error("Error generating chat history:", error);
        return res.status(500).json({success: false, message: "Internal server error"});
    }
}