import mongoose, { Schema } from "mongoose";

const FlashCardSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    documentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Document",
        required: true
    },
    cards: [{
        question: {
            type: String,
            required: true
        },
        answer: {
            type: String,
            required: true
        },
        difficulty: {
            type: String,
            enum: ["easy", "medium", "hard"],
            default: "medium"
        },
        lastReviewed: {
            type: Date,
            default: null
        },
        reviewCount: {
            type: Number,
            default: 0
        },
        isStarred: {
            type: Boolean,
            default: false
        }
    }]
}, {
    timestamps: true
})

// indexed for efficient querying
FlashCardSchema.index({ userId: 1, documentId: 1 })

const FlashCard = mongoose.models.FlashCard || mongoose.model("FlashCard", FlashCardSchema)

export default FlashCard