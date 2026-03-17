import express from "express";
import { generateFlashCards, generateQuiz, generateSummary, chat, explainConcept, getChatHistory } from "../controller/ai/aiController.js";
import { protectRoute } from "../middleware/protectRoute.js";
const router = express.Router();

router.post("/generate-flashcards", protectRoute, generateFlashCards);
router.post("/generate-quizzes", protectRoute, generateQuiz);
router.post("/generate-summary", protectRoute, generateSummary);
router.post("/chat", protectRoute, chat);
router.post("/explain-concept", protectRoute, explainConcept);
router.get("/chat-history/:documentId", protectRoute, getChatHistory);

export default router;