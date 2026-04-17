import { Request, Response, NextFunction } from "express";
import * as authService from "../services/auth.service";
import { ApiResponse } from "../utils/response";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    
    const { name, email, password } = req.body;
    const newUser = await authService.registerUser(name, email, password);
    
    ApiResponse.success(res, newUser, "Successfully created a new user", 200);
  } catch (error: any) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;
    const result = await authService.loginUser(email, password);

    ApiResponse.success(res, result, "Successfully login", 200);
  } catch (error: any) {
    next(error);
  }
};


