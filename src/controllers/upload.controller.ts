import { NextFunction, Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { ApiResponse } from "../utils/response";
import { UploadedFile, uploadBufferToHuggingFace } from "../utils/upload-file";

export const uploadFile = async (
  req: AuthRequest & { file?: UploadedFile },
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // Step 2: controller hanya meneruskan file request ke service util upload.
    const uploadedFile = await uploadBufferToHuggingFace(req, req.file);

    // Step 3: kalau upload sukses, balikan metadata file + URL publiknya.
    ApiResponse.success(res, uploadedFile, "File uploaded successfully", 201);
  } catch (error) {
    next(error);
  }
};
