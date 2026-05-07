"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const tool_controller_1 = require("../controllers/tool.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const toolRoutes = express_1.default.Router();
toolRoutes.use(auth_middleware_1.authMiddleware);
toolRoutes.get("/", tool_controller_1.getTools);
toolRoutes.post("/", tool_controller_1.createTool);
exports.default = toolRoutes;
