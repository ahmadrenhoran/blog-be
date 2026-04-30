"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ai_writing_controller_1 = require("../controllers/ai-writing.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const validate_middleware_1 = require("../middleware/validate.middleware");
const ai_writing_schema_1 = require("../schemas/ai-writing.schema");
const aiWritingRoutes = express_1.default.Router();
aiWritingRoutes.post("/writing", auth_middleware_1.authMiddleware, (0, validate_middleware_1.validate)(ai_writing_schema_1.generateWritingSchema), ai_writing_controller_1.generateWritingAssistance);
exports.default = aiWritingRoutes;
