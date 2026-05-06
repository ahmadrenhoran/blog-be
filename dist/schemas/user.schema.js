"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfileSchema = void 0;
const zod_1 = require("zod");
exports.updateProfileSchema = zod_1.z.object({
    username: zod_1.z
        .string()
        .min(3, "Username must be at least 3 characters")
        .regex(/^[a-z0-9-]+$/, "Username must be lowercase, numbers, or hyphens only (no spaces)")
        .optional(),
    name: zod_1.z.string().optional(),
});
