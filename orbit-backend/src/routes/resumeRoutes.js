import express from "express";
import multer from "multer";
import { uploadResume, getMyResumes, generateRoadmap, getJobMatches, tutorChat } from "../controllers/resumeController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();
const upload = multer();

router.post("/upload", protect, upload.single("resume"), uploadResume);
router.get("/my-resumes", protect, getMyResumes);
router.get("/roadmap", protect, generateRoadmap);
router.get("/jobs", protect, getJobMatches);
router.post("/tutor", protect, tutorChat);

export default router;