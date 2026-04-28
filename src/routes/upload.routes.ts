import express from "express";
import { uploadFile } from "../controllers/upload.controller";
import { uploadSingleFile } from "../utils/upload-file";

const uploadRoutes = express.Router();

// Step 1: terima request multipart/form-data dan ambil field file ke memory.
uploadRoutes.post("/", uploadSingleFile.single("file"), uploadFile);

export default uploadRoutes;
