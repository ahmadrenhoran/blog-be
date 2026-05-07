"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.portfolioSchema = exports.portfolioMediaSchema = exports.portfolioSectionSchema = void 0;
const zod_1 = require("zod");
exports.portfolioSectionSchema = zod_1.z.object({
    id: zod_1.z.number().optional(),
    type: zod_1.z.string(),
    title: zod_1.z.string().optional().nullable(),
    content: zod_1.z.any(),
    sort_order: zod_1.z.number().default(0),
});
exports.portfolioMediaSchema = zod_1.z.object({
    id: zod_1.z.number().optional(),
    url: zod_1.z.string(),
    type: zod_1.z.string().default("image"),
    alt: zod_1.z.string().optional().nullable(),
    sort_order: zod_1.z.number().default(0),
});
exports.portfolioSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, "Title is required"),
    slug: zod_1.z.string().min(1, "Slug is required"),
    short_description: zod_1.z.record(zod_1.z.string(), zod_1.z.string()).optional().nullable(),
    category: zod_1.z.string().optional().nullable(),
    cover_image: zod_1.z.string().optional().nullable(),
    live_url: zod_1.z.string().optional().nullable(),
    repo_url: zod_1.z.string().optional().nullable(),
    is_featured: zod_1.z.boolean().default(false),
    is_published: zod_1.z.boolean().default(false),
    custom_fields: zod_1.z.any().optional().nullable(),
    sections: zod_1.z.array(exports.portfolioSectionSchema).optional(),
    media: zod_1.z.array(exports.portfolioMediaSchema).optional(),
    tool_ids: zod_1.z.array(zod_1.z.number()).optional(),
});
