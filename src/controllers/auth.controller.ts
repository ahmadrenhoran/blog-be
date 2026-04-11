import { Request, Response } from 'express';
import * as authService from '../services/auth.service';
import { ApiResponse } from '../utils/response';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;
    const newUser = await authService.registerUser(name, email, password);
    // res.status(201).json({ message: 'Register sukses', data: newUser });
    ApiResponse.success(res, newUser, "Successfully created a new user", 200)
  } catch (error: any) {
    // res.status(400).json({ error: error.message });
    ApiResponse.error(res, null, error.message, 400)
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const result = await authService.loginUser(email, password);
    res.status(200).json({ message: 'Login sukses', data: result });
  } catch (error: any) {
    res.status(401).json({ error: error.message });
  }
};