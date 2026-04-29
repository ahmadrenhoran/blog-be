"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadBufferToHuggingFace = exports.uploadSingleFile = void 0;
const multer_1 = __importDefault(require("multer"));
const hub_1 = require("@huggingface/hub");
const node_path_1 = __importDefault(require("node:path"));
const errors_1 = require("./errors");
const maxFileSize = Number(process.env.UPLOAD_MAX_FILE_SIZE ?? 1 * 1024 * 1024);
const storage = multer_1.default.memoryStorage();
// Step 1: simpan file sementara di memory agar bisa langsung dikirim ke Hugging Face.
exports.uploadSingleFile = (0, multer_1.default)({
    storage,
    limits: {
        fileSize: maxFileSize,
    },
});
// Step 2: rapikan nama file supaya aman dipakai sebagai path storage.
const sanitizeFileName = (filename) => {
    const extension = node_path_1.default.extname(filename);
    const baseName = node_path_1.default.basename(filename, extension);
    const safeBaseName = baseName
        .toLowerCase()
        .replace(/[^a-z0-9-_]+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
    const safeExtension = extension.toLowerCase().replace(/[^.a-z0-9]/g, "");
    return `${safeBaseName || "file"}${safeExtension}`;
};
// Step 3: ambil nama repo dataset dari env yang sudah Anda siapkan.
const resolveDatasetRepo = () => {
    const repoName = process.env.HF_DATASET_REPO ?? process.env.HF_REVIEW ?? process.env.HF_REVIEW;
    if (!repoName) {
        throw new errors_1.AppError("Hugging Face dataset repo is not configured", 500, "HF_REVIEW_MISSING");
    }
    return repoName;
};
// Step 4: ambil access token untuk proses upload ke Hugging Face.
const resolveAccessToken = () => {
    const accessToken = process.env.HF_ACCESS_TOKEN;
    console.log("HF_ACCESS_TOKEN:", process.env.HF_ACCESS_TOKEN ? "ADA" : "KOSONG");
    console.log("HF_REVIEW:", process.env.HF_REVIEW);
    if (!accessToken) {
        throw new errors_1.AppError("Hugging Face access token is not configured", 500, "HF_TOKEN_MISSING");
    }
    return accessToken;
};
// Step 5: susun folder + nama file unik agar tidak bentrok dengan file lain.
const buildStoragePath = (req, file) => {
    const folder = typeof req.body.folder === "string" && req.body.folder.trim()
        ? req.body.folder.trim().replace(/^\/+|\/+$/g, "")
        : "uploads";
    const uniquePrefix = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    const filename = sanitizeFileName(file.originalname);
    return `${folder}/${uniquePrefix}-${filename}`;
};
const uploadBufferToHuggingFace = async (req, file) => {
    // Step 6: validasi bahwa request benar-benar membawa file.
    if (!file) {
        throw new errors_1.AppError("File is required", 400, "FILE_REQUIRED");
    }
    const repoName = resolveDatasetRepo();
    const accessToken = resolveAccessToken();
    const filePath = buildStoragePath(req, file);
    // Step 7: kirim buffer file ke repo dataset Hugging Face sebagai object storage.
    await (0, hub_1.uploadFile)({
        repo: {
            type: "dataset",
            name: repoName,
        },
        accessToken,
        file: {
            path: filePath,
            content: new Blob([new Uint8Array(file.buffer)], {
                type: file.mimetype || "application/octet-stream",
            }),
        },
        commitTitle: `Upload ${file.originalname}`,
    });
    // Step 8: balikan metadata file dan URL yang nanti bisa disimpan ke tabel mana pun.
    return {
        path: filePath,
        filename: node_path_1.default.basename(filePath),
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        url: `https://huggingface.co/datasets/${repoName}/resolve/main/${filePath}`,
    };
};
exports.uploadBufferToHuggingFace = uploadBufferToHuggingFace;
