import { Request, Response, NextFunction } from "express";
import * as toolService from "../services/tool.service";
import { ApiResponse } from "../utils/response";

export const getTools = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const search = req.query.search as string;
    const data = await toolService.getTools(search);
    ApiResponse.success(res, data);
  } catch (error) {
    next(error);
  }
};

export const createTool = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await toolService.createTool(req.body);
    ApiResponse.success(res, data, "Tool created successfully", 201);
  } catch (error) {
    next(error);
  }
};
