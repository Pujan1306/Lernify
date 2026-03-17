import mongoose, { Schema } from "mongoose";

const DocumentSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    title: {
        type: String,
        required: true
    }, 
    fileName: {
        type: String,
        required: true
    },
    filePath: {
        type: String,
        required: true
    },
    fileSize: {
        type: Number,
        required: true
    },
    extractedText: {
        type: String,
        default: ""
    },
    chunks: [{
        content: {
            type: String,
        },
        pageNumber: {
            type: Number,
            default: 0
        },
        chunkIndex: {
            type: Number,
            default: 0
        }
    }],
    uplaodDate: {
        type: Date,
        default: Date.now
    },
    lastAccess: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ["processing", "completed", "failed"],
        default: "processing"
    }
}, {
    timestamps: true
})

// indexed for efficient querying
DocumentSchema.indexes({
    userId: 1,
    uplaodDate: -1
})

const Document = mongoose.models.Document || mongoose.model("Document", DocumentSchema)

export default Document