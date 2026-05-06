"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const resume_controller_1 = require("../controllers/resume.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const resumeRoutes = express_1.default.Router();
resumeRoutes.use(auth_middleware_1.authMiddleware);
resumeRoutes.get("/", resume_controller_1.getResumes);
resumeRoutes.post("/upload", resume_controller_1.uploadResume);
resumeRoutes.delete("/:id", resume_controller_1.deleteResume);
resumeRoutes.patch("/:id/primary", resume_controller_1.setPrimaryResume);
exports.default = resumeRoutes;
