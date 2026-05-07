import express from "express";
import { getTools, createTool } from "../controllers/tool.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const toolRoutes = express.Router();

toolRoutes.use(authMiddleware);

toolRoutes.get("/", getTools);
toolRoutes.post("/", createTool);

export default toolRoutes;
