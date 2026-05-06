import { Response, NextFunction } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import * as userService from "../services/user.service";
import { ApiResponse } from "../utils/response";

export const updateProfile = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user.id;
    const { username, name } = req.body;

    const updatedUser = await userService.updateProfile(userId, { username, name });

    ApiResponse.success(res, updatedUser, "Profile updated successfully");
  } catch (error) {
    next(error);
  }
};
