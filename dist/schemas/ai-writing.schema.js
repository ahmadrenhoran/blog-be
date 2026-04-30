"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateWritingSchema = exports.aiWritingActions = void 0;
const zod_1 = require("zod");
exports.aiWritingActions = ["title", "outline", "draft", "improve", "cta"];
exports.generateWritingSchema = zod_1.z.object({
    action: zod_1.z.enum(exports.aiWritingActions),
    prompt: zod_1.z.string().trim().max(4000, "Prompt is too long").default(""),
    title: zod_1.z.string().trim().max(255, "Title is too long").optional(),
    content: zod_1.z.string().trim().max(20000, "Content is too long").optional(),
}).refine((value) => value.prompt || value.title || value.content, {
    message: "Prompt, title, or content is required",
});
