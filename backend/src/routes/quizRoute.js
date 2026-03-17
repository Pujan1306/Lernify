import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { getQuizzes, getQuizById, submitQuiz, getQuizResults, deleteQuiz } from "../controller/app/quizController.js";

const router = express.Router();

router.get("/:documentId", protectRoute, getQuizzes);
router.get("/quiz/:id", protectRoute, getQuizById);
router.post("/:id/submit", protectRoute, submitQuiz);
router.get("/:id/results", protectRoute, getQuizResults);
router.delete("/:id", protectRoute, deleteQuiz);

export default router;