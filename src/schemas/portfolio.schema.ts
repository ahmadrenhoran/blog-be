import { z } from "zod";

export const portfolioSchema = z.object({
  title: z.string().optional().nullable(),
  description: z.record(z.string(), z.string()).optional().nullable(), // { id: "...", en: "..." }
  image_url: z.string().optional().nullable(),
  tech_stack: z.array(z.string()).optional().nullable(),
  demo_url: z.string().optional().nullable(),
  repo_url: z.string().optional().nullable(),
  is_featured: z.boolean().optional().nullable(),
});
