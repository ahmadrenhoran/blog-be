"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.portfolioSchema = void 0;
const zod_1 = require("zod");
exports.portfolioSchema = zod_1.z.object({
    title: zod_1.z.string().optional().nullable(),
    description: zod_1.z.record(zod_1.z.string(), zod_1.z.string()).optional().nullable(), // { id: "...", en: "..." }
    image_url: zod_1.z.string().optional().nullable(),
    tech_stack: zod_1.z.array(zod_1.z.string()).optional().nullable(),
    demo_url: zod_1.z.string().optional().nullable(),
    repo_url: zod_1.z.string().optional().nullable(),
    is_featured: zod_1.z.boolean().optional().nullable(),
});
