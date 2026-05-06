import express from "express";
import { updateProfile } from "../controllers/user.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { updateProfileSchema } from "../schemas/user.schema";

const userRoutes = express.Router();

userRoutes.patch("/profile", authMiddleware, validate(updateProfileSchema), updateProfile);

export default userRoutes;
