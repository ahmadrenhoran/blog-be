import express from "express";
import {
  getResumes,
  uploadResume,
  deleteResume,
  setPrimaryResume,
} from "../controllers/resume.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const resumeRoutes = express.Router();

resumeRoutes.use(authMiddleware);

resumeRoutes.get("/", getResumes);
resumeRoutes.post("/upload", uploadResume);
resumeRoutes.delete("/:id", deleteResume);
resumeRoutes.patch("/:id/primary", setPrimaryResume);

export default resumeRoutes;
