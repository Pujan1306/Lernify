import mongoose, { Schema } from "mongoose";

const QuizSchema = new Schema({
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
    title: {
        type: String,
        required: true,
        trim: true
    },
    questions: [{
        question: {
            type: String,
            required: true
        },
        options: {
            type: [String],
            required: true,
            validate: {
                validator: function(v) {
                    return v.length >= 2 && v.length <= 4;
                },
                message: 'Options must be between 2 and 4'
            }
        },
        correctAnswer: {
            type: String,
            required: true,
            validate: {
                validator: function(v) {
                    return /^(01|02|03|04)$/.test(v);
                },
                message: 'Correct answer must be 01, 02, 03, or 04'
            }
        },
        explanation: {
            type: String,
            default: ""
        },
        difficulty: {
            type: String,
            enum: ['easy', 'medium', 'hard'],
            default: 'medium'
        }
    }],
    userAnswers: [{
        questionIndex: {
            type: Number,
            required: true
        },
        selectedOption: {
            type: String,
            required: true
        },
        isCorrect: {
            type: Boolean,
            default: false
        },
        answerAt: {
            type: Date,
            default: Date.now
        }
    }],
    score: {
        type: Number,
        default: 0
    },
    totalQuestions: {
        type: Number,
        required: true
    },
    completedAt: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
})

// indexed for efficient querying
QuizSchema.index({ userId: 1, documentId: 1 })

const Quiz = mongoose.models.Quiz || mongoose.model("Quiz", QuizSchema)

export default Quiz
