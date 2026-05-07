import { z } from "zod";

export const portfolioSectionSchema = z.object({
  id: z.number().optional(),
  type: z.string(),
  title: z.string().optional().nullable(),
  content: z.any(),
  sort_order: z.number().default(0),
});

export const portfolioMediaSchema = z.object({
  id: z.number().optional(),
  url: z.string(),
  type: z.string().default("image"),
  alt: z.string().optional().nullable(),
  sort_order: z.number().default(0),
});

export const portfolioSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  short_description: z.record(z.string(), z.string()).optional().nullable(),
  category: z.string().optional().nullable(),
  cover_image: z.string().optional().nullable(),
  live_url: z.string().optional().nullable(),
  repo_url: z.string().optional().nullable(),
  is_featured: z.boolean().default(false),
  is_published: z.boolean().default(false),
  custom_fields: z.any().optional().nullable(),
  sections: z.array(portfolioSectionSchema).optional(),
  media: z.array(portfolioMediaSchema).optional(),
  tool_ids: z.array(z.number()).optional(),
});
