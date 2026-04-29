"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = void 0;
class AppError extends Error {
    message;
    statusCode;
    errorCode;
    constructor(message, statusCode = 400, errorCode // Contoh: 'AUTH_EMAIL_EXISTS'
    ) {
        super(message);
        this.message = message;
        this.statusCode = statusCode;
        this.errorCode = errorCode;
    }
}
exports.AppError = AppError;
