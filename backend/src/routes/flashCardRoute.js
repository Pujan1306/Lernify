import express from "express"
import {getFlashCards, getAllFlashCardSets, reviewFlashCard, toggleStarFlashCard, deleteFlashCardSet} from "../controller/app/flashCardController.js"
import { protectRoute } from "../middleware/protectRoute.js"

const router = express.Router()

router.get("/all", protectRoute, getAllFlashCardSets)
router.get("/:documentId", protectRoute, getFlashCards)
router.post("/review/:cardId", protectRoute, reviewFlashCard)
router.post("/toggle-star/:cardId", protectRoute, toggleStarFlashCard)
router.delete("/delete/:id", protectRoute, deleteFlashCardSet) 

export default router