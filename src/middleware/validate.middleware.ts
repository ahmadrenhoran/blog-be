import { ZodSchema } from "zod";
import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/errors";

export const validate =
  (schema: ZodSchema) =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const message = result.error.issues[0].message;

      return next(new AppError(message, 400, "VALIDATION_ERROR"));
    }

    req.body = result.data;
    next();
  };