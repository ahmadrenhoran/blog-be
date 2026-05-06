import { Response, NextFunction } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import * as resumeService from "../services/resume.service";
import { ApiResponse } from "../utils/response";

export const getResumes = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user.id;
    const data = await resumeService.getResumes(userId);
    ApiResponse.success(res, data);
  } catch (error) {
    next(error);
  }
};

export const uploadResume = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user.id;
    const data = await resumeService.uploadResume(userId, req.body);
    ApiResponse.success(res, data, "Resume uploaded successfully", 201);
  } catch (error) {
    next(error);
  }
};

export const deleteResume = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user.id;
    const id = req.params.id as string;
    await resumeService.deleteResume(parseInt(id), userId);
    ApiResponse.success(res, null, "Resume deleted successfully");
  } catch (error) {
    next(error);
  }
};

export const setPrimaryResume = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user.id;
    const id = req.params.id as string;
    const data = await resumeService.setPrimaryResume(parseInt(id), userId);
    ApiResponse.success(res, data, "Primary resume set successfully");
  } catch (error) {
    next(error);
  }
};
