import express from "express";
import { generateWritingAssistance } from "../controllers/ai-writing.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { generateWritingSchema } from "../schemas/ai-writing.schema";

const aiWritingRoutes = express.Router();

aiWritingRoutes.post(
  "/writing",
  authMiddleware,
  validate(generateWritingSchema),
  generateWritingAssistance,
);

export default aiWritingRoutes;
