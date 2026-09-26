import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { ENV } from "./lib/env.js";
import authRoute from "./routes/authRoute.js"
import { dbConnect } from "./lib/dbConnect.js";
import documentRoute from "./routes/documentRoute.js";
import flashCardRoute from "./routes/flashCardRoute.js";
import aiRoute from "./routes/aiRoutes.js";
import quizRoute from "./routes/quizRoute.js";
import progressRoute from "./routes/progressRoute.js";
import dns from "node:dns";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import "./lib/passport.js"

dns.setDefaultResultOrder('ipv4first');

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.resolve(__dirname, "../public");

const app = express()
const port = ENV.PORT

app.set('trust proxy', true)

app.use(cors({
    origin: ENV.FRONTEND_URL,
    credentials: true
}))

app.use(express.json())
app.use(cookieParser())

app.use("/uploads/documents", express.static(path.join(__dirname, "uploads/documents")))
app.use("/uploads/profileImage", express.static(path.join(__dirname, "uploads/profileImage")))

// Serve the built frontend (backend/public) if it exists
if (fs.existsSync(publicDir)) {
    app.use(express.static(publicDir))
}

app.get("/api", (req, res) => {
    res.status(200).json({ success: true, message: "Server is Working", statusCode: 200 })
})
app.use("/api/auth", authRoute)
app.use("/api/document", documentRoute)
app.use("/api/flashcard", flashCardRoute)
app.use("/api/ai", aiRoute)
app.use("/api/quizzes", quizRoute)
app.use("/api/progress", progressRoute)

app.use((req, res) => {
    // SPA fallback: serve index.html for any non-API GET route
    const indexHtml = path.join(publicDir, "index.html");
    if (req.method === "GET" && !req.path.startsWith("/api") && !req.path.startsWith("/uploads") && fs.existsSync(indexHtml)) {
        return res.sendFile(indexHtml);
    }
    res.status(404).json({ success: false, message: "Route not found", statusCode: 404 })
})



app.listen(port, async () => {
    await dbConnect()
    console.log(`Server is running on port http://localhost:${port}`)
})
