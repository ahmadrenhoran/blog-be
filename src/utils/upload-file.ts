import multer from "multer";
import { uploadFile } from "@huggingface/hub";
import { Request } from "express";
import path from "node:path";
import { AppError } from "./errors";

export interface UploadedFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

const maxFileSize = Number(process.env.UPLOAD_MAX_FILE_SIZE ?? 1 * 1024 * 1024);

const storage = multer.memoryStorage();

// Step 1: simpan file sementara di memory agar bisa langsung dikirim ke Hugging Face.
export const uploadSingleFile = multer({
  storage,
  limits: {
    fileSize: maxFileSize,
  },
});

// Step 2: rapikan nama file supaya aman dipakai sebagai path storage.
const sanitizeFileName = (filename: string) => {
  const extension = path.extname(filename);
  const baseName = path.basename(filename, extension);

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
  const repoName = process.env.HF_REVIEW;

  if (!repoName) {
    throw new AppError("Hugging Face dataset repo is not configured", 500, "HF_REVIEW_MISSING");
  }

  return repoName;
};

// Step 4: ambil access token untuk proses upload ke Hugging Face.
const resolveAccessToken = () => {
  const accessToken = process.env.HF_ACCESS_TOKEN;
  console.log("HF_ACCESS_TOKEN:", process.env.HF_ACCESS_TOKEN ? "ADA" : "KOSONG");
  console.log("HF_REVIEW:", process.env.HF_REVIEW);
  if (!accessToken) {
    throw new AppError("Hugging Face access token is not configured", 500, "HF_TOKEN_MISSING");
  }

  return accessToken;
};

// Step 5: susun folder + nama file unik agar tidak bentrok dengan file lain.
const buildStoragePath = (req: Request, file: UploadedFile) => {
  const folder = typeof req.body.folder === "string" && req.body.folder.trim()
    ? req.body.folder.trim().replace(/^\/+|\/+$/g, "")
    : "uploads";

  const uniquePrefix = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  const filename = sanitizeFileName(file.originalname);

  return `${folder}/${uniquePrefix}-${filename}`;
};

export const uploadBufferToHuggingFace = async (req: Request, file: UploadedFile | undefined) => {
  // Step 6: validasi bahwa request benar-benar membawa file.
  if (!file) {
    throw new AppError("File is required", 400, "FILE_REQUIRED");
  }

  const repoName = resolveDatasetRepo();
  const accessToken = resolveAccessToken();
  const filePath = buildStoragePath(req, file);

  // Step 7: kirim buffer file ke repo dataset Hugging Face sebagai object storage.
  await uploadFile({
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
    filename: path.basename(filePath),
    originalName: file.originalname,
    mimeType: file.mimetype,
    size: file.size,
    url: `https://huggingface.co/datasets/${repoName}/resolve/main/${filePath}`,
  };
};
