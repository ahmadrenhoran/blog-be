"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const upload_controller_1 = require("../controllers/upload.controller");
const upload_file_1 = require("../utils/upload-file");
const uploadRoutes = express_1.default.Router();
// Step 1: terima request multipart/form-data dan ambil field file ke memory.
uploadRoutes.post("/", upload_file_1.uploadSingleFile.single("file"), upload_controller_1.uploadFile);
exports.default = uploadRoutes;
