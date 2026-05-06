import { z } from "zod";

export const updateProfileSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .regex(/^[a-z0-9-]+$/, "Username must be lowercase, numbers, or hyphens only (no spaces)")
    .optional(),
  name: z.string().optional(),
});
