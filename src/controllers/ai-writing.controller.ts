import { NextFunction, Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { ApiResponse } from "../utils/response";
import * as aiWritingService from "../services/ai-writing.service";

export const generateWritingAssistance = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const result = await aiWritingService.generateWritingAssistance(
      Number(req.user.id),
      req.body,
    );

    ApiResponse.success(res, result, "Successfully generated writing assistance", 200);
  } catch (error) {
    next(error);
  }
};
