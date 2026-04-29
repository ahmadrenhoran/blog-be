"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const errors_1 = require("../utils/errors");
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return next(new errors_1.AppError("Token missing", 401, "INVALID_HEADER"));
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
        return next(new errors_1.AppError("Token format invalid", 401, "INVALID_HEADER"));
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (error) {
        return next(new errors_1.AppError("Invalid or expired token", 403, "INVALID_HEADER"));
    }
};
exports.authMiddleware = authMiddleware;
