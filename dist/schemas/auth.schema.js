"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
exports.registerSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Name is required"),
    username: zod_1.z
        .string()
        .min(3, "Username must be at least 3 characters")
        .regex(/^[a-z0-9-]+$/, "Username must be lowercase, numbers, or hyphens only (no spaces)"),
    email: zod_1.z.email("Invalid email format"),
    password: zod_1.z
        .string()
        .min(6, "Password must be at least 6 characters"),
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.email("Invalid email format"),
    password: zod_1.z
        .string()
        .min(6, "Password must be at least 6 characters"),
});
