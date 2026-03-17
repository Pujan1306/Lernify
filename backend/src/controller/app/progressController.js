import Document from "../../model/document.js";
import FlashCard from "../../model/flashCard.js";
import Quiz from "../../model/quizzes.js";
import { dbConnect } from "../../lib/dbConnect.js";

export const getDashboard = async (req, res) => {
    try {
        await dbConnect();
        const user = req.user;
        const totalDocuments = await Document.countDocuments({ userId: user._id });
        const totalFlashCards = await FlashCard.countDocuments({ userId: user._id });
        const totalQuizzes = await Quiz.countDocuments({ userId: user._id });
        const completedQuizzes = await Quiz.countDocuments({ userId: user._id, completedAt: { $ne: null } });
        const flashCards = await FlashCard.find({ userId: user._id });

        let totalFlashCardsCount = 0;
        let reviewedFlashCards = 0;
        let starredFlashCards = 0;
        
        flashCards.forEach(flashCard => {
            totalFlashCardsCount += flashCard.cards.length;
            reviewedFlashCards += flashCard.cards.filter(card => card.reviewed > 0).length;
            starredFlashCards += flashCard.cards.filter(card => card.starred).length;
        });

        const quizzes = await Quiz.find({ userId: user._id, completedAt: { $ne: null } });
        const averageScore = quizzes.length > 0 ? Math.round(quizzes.reduce((acc, quiz) => acc + quiz.score, 0) / quizzes.length) : 0;
        
        const recentDocuments = await Document.find({ userId: user._id }).sort({ lastAccess: -1 }).limit(5).select("title fileName lastAccess status");
        const recentQuizzes = await Quiz.find({ userId: user._id }).sort({ completedAt: -1 }).limit(5).populate("documentId", "title").select("title score totalScore completedAt");

        // Calculate study streak (consecutive days with any study activity)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // Get last 30 days of study activity (quizzes + flashcard reviews)
        const thirtyDaysAgo = new Date(today);
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const quizActivity = await Quiz.find({ 
            userId: user._id, 
            completedAt: { $gte: thirtyDaysAgo } 
        }).select("completedAt");
        
        const flashcardActivity = await FlashCard.find({
            userId: user._id,
            "cards.lastReviewed": { $gte: thirtyDaysAgo }
        }).select("cards.lastReviewed");
        
        // Combine all study dates
        const studyDates = new Set();
        
        // Add quiz dates
        quizActivity.forEach(quiz => {
            const date = new Date(quiz.completedAt);
            date.setHours(0, 0, 0, 0);
            studyDates.add(date.toISOString());
        });
        
        // Add flashcard review dates
        flashcardActivity.forEach(fc => {
            fc.cards.forEach(card => {
                if (card.lastReviewed) {
                    const date = new Date(card.lastReviewed);
                    date.setHours(0, 0, 0, 0);
                    studyDates.add(date.toISOString());
                }
            });
        });
        
        // Calculate consecutive streak
        let studyStreakCount = 0;
        let currentDate = new Date(today);
        
        while (studyDates.has(currentDate.toISOString())) {
            studyStreakCount++;
            currentDate.setDate(currentDate.getDate() - 1);
        }
        
        res.status(200).json({ 
        success: true, 
        data: {
            overview: {
                totalDocuments,
                totalFlashCards,
                totalQuizzes,
                completedQuizzes,
                totalFlashCardsCount,
                reviewedFlashCards,
                starredFlashCards,
                averageScore,
                studyStreakCount
            },
            recentActivities: {
                recentDocuments,
                recentQuizzes
            }
        }
    });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
