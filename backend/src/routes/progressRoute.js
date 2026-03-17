import express from "express"
import { getDashboard } from "../controller/app/progressController.js"
import { protectRoute } from "../middleware/protectRoute.js"

const router = express.Router()

router.get("/dashboard", protectRoute, getDashboard)

export default router