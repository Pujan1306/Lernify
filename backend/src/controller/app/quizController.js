import { dbConnect } from "../../lib/dbConnect.js";
import Quiz from "../../model/quizzes.js";

export const getQuizzes = async (req, res) => {
    try {
        await dbConnect();
        const quizzes = await Quiz.find({userId: req.user._id, documentId: req.params.documentId }).populate("documentId", "title fileName").sort({ createdAt: -1 });
        if (!quizzes) { 
            return res.status(404).json({success: false, message: "No quizzes found" });
        }
        res.status(200).json({success: true, message: "Quizzes fetched successfully", count: quizzes.length, data: quizzes});
    } catch (error) {
        console.error(error);
        res.status(500).json({success: false, message: "Internal server error" });
    }
};

export const getQuizById = async (req, res) => {
    try {
        await dbConnect();
        const quiz = await Quiz.findById({_id: req.params.id, userId: req.user._id});
        if (!quiz) {
            return res.status(404).json({success: false, message: "Quiz not found" });
        }
        res.status(200).json({success: true, message: "Quiz fetched successfully", data: quiz});
    } catch (error) {
        console.error(error);
        res.status(500).json({success: false, message: "Internal server error" });
    }
};

export const submitQuiz = async (req, res) => {
    try {
        await dbConnect();
        const { answers } = req.body;
        if (!Array.isArray(answers) || answers.length === 0) {
            return res.status(400).json({ success: false, message: "Invalid answers" });
        }
        // TODO: Implement quiz submission logic
        const quiz = await Quiz.findOne({ _id: req.params.id, userId: req.user._id });
        if (!quiz) {
            return res.status(404).json({ success: false, message: "Quiz not found" });
        }
        if (quiz.completedAt) {
            return res.status(400).json({ success: false, message: "Quiz already submitted" });
        }
        
        let correctCount = 0;
        const userAnswers = [];

        answers.forEach((answer) => {
            const { questionIndex, selectedAnswer } = answer;
            const question = quiz.questions[questionIndex];
            if (question.correctAnswer === selectedAnswer) {
                correctCount++;
            }
            userAnswers.push({
                questionIndex,
                selectedOption: selectedAnswer,
                isCorrect: question.correctAnswer === selectedAnswer,
                answeredAt: new Date()
            });
        });

        //Calculate score
        const score = (correctCount / quiz.questions.length) * 100;

        quiz.userAnswers = userAnswers;
        quiz.score = score;
        quiz.totalQuestions = quiz.questions.length;
        quiz.completedAt = new Date();
        await quiz.save();

        res.status(200).json({ success: true, message: "Quiz submitted successfully", data: { quizId: quiz._id, score, correctCount, totalQuestions: quiz.totalQuestions, percentageScore: score, userAnswers } });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getQuizResults = async (req, res) => {
    try {
        await dbConnect();
        const quiz = await Quiz.findOne({_id: req.params.id, userId: req.user._id}).populate("documentId", "title");
        if (!quiz) {
            return res.status(404).json({ success: false, message: "Quiz not found" });
        }
        if (!quiz.completedAt) {
            return res.status(400).json({ success: false, message: "Quiz not completed" });
        }

        const detailedResults = quiz.userAnswers.map((answer) => {
            const question = quiz.questions[answer.questionIndex];
            return {
                questionIndex: answer.questionIndex,
                question: question.question,
                options: question.options,
                selectedOption: answer.selectedOption,
                isCorrect: answer.isCorrect,
                correctAnswer: question.correctAnswer,
                explanation: question.explanation
            };
        });

        res.status(200).json({ success: true, data: { quizId: quiz._id, score: quiz.score, correctCount: quiz.correctCount, totalQuestions: quiz.totalQuestions, completedAt: quiz.completedAt}, results: detailedResults });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteQuiz = async (req, res) => {
    try {
        await dbConnect();
        const quiz = await Quiz.findOne({ _id: req.params.id, userId: req.user._id });
        if (!quiz) {
            return res.status(404).json({ success: false, message: "Quiz not found" });
        }
        await quiz.deleteOne();
        res.status(200).json({ success: true, message: "Quiz deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};