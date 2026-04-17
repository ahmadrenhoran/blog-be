import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/errors';
import { decode } from 'node:punycode';


export interface AuthRequest extends Request {
  user?: any; 
}


export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    
    return next(new AppError("Token missing", 401, "INVALID_HEADER"))
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return next(new AppError("Token format invalid", 401, "INVALID_HEADER"))
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    req.user = decoded;

    next();
  } catch (error) {
    return next(new AppError("Invalid or expired token", 403, "INVALID_HEADER"))
  }
};