import { Request, Response, NextFunction } from "express";
import * as authService from "../services/auth.service";
import { ApiResponse } from "../utils/response";
import { AppError } from "../utils/errors";

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

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const result = await authService.loginUser(email, password);
    res.status(200).json({ message: "Login sukses", data: result });
  } catch (error: any) {
    res.status(401).json({ error: error.message });
  }
};
