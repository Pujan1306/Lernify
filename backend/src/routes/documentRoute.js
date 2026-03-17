import express from "express";
import { UploadDocument, GetDocuments, GetDocumentById, UpdateDocumentById, DeleteDocumentById } from "../controller/app/documentController.js";
import { protectRoute } from "../middleware/protectRoute.js";
import { documentUpload } from "../lib/multer.js";

const router = express.Router();

router.post("/upload", protectRoute, documentUpload.single('file'), UploadDocument);
router.get("/", protectRoute, GetDocuments);
router.get("/:id", protectRoute, GetDocumentById);
router.put("/:id", protectRoute, UpdateDocumentById);
router.delete("/:id", protectRoute, DeleteDocumentById);

export default router;