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
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import "./lib/passport.js"
dns.setDefaultResultOrder('ipv4first');
const app = express()
const port = ENV.PORT


app.set('trust proxy', true)
app.use(cors({
    origin: [
        ENV.FRONTEND_URL,
        /^https?:\/\/(.+\.)*onrender\.com$/
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use(express.json())
app.use(cookieParser())
app.use("/uploads/documents", express.static("src/uploads/documents"))
app.use("/uploads/profileImage", express.static("src/uploads/profileImage"))




app.get("/", (req, res) => {
    res.status(200).json({success: true, message: "Server is Working", statusCode: 200})
})

app.use("/api/auth", authRoute)
app.use("/api/document", documentRoute)
app.use("/api/flashcard", flashCardRoute)
app.use("/api/ai", aiRoute)
app.use("/api/quizzes", quizRoute)
app.use("/api/progress", progressRoute)
app.use((req, res) => {
    res.status(404).json({success: false, message: "Route not found", statusCode: 404})
})

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  app.use(express.static(path.join(__dirname, '../frontend/dist')));
  app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
  });
}

app.listen(port, async () => {
    await dbConnect()
    console.log(`Server is running on port http://localhost:${port}`)
})