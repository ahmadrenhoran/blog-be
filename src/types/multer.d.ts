declare module "multer" {
  import { RequestHandler } from "express";

  interface UploadedFile {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    size: number;
    buffer: Buffer;
  }

  interface Options {
    storage?: any;
    limits?: {
      fileSize?: number;
    };
    fileFilter?: (
      req: any,
      file: UploadedFile,
      callback: (error: Error | null, acceptFile?: boolean) => void,
    ) => void;
  }

  interface MulterInstance {
    single(fieldname: string): RequestHandler;
  }

  interface MulterStatic {
    (options?: Options): MulterInstance;
    memoryStorage(): any;
  }

  const multer: MulterStatic;
  export = multer;
}
