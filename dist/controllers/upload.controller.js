"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFile = void 0;
const response_1 = require("../utils/response");
const upload_file_1 = require("../utils/upload-file");
const uploadFile = async (req, res, next) => {
    try {
        // Step 2: controller hanya meneruskan file request ke service util upload.
        const uploadedFile = await (0, upload_file_1.uploadBufferToHuggingFace)(req, req.file);
        // Step 3: kalau upload sukses, balikan metadata file + URL publiknya.
        response_1.ApiResponse.success(res, uploadedFile, "File uploaded successfully", 201);
    }
    catch (error) {
        next(error);
    }
};
exports.uploadFile = uploadFile;
