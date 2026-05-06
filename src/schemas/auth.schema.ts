import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),

  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .regex(/^[a-z0-9-]+$/, "Username must be lowercase, numbers, or hyphens only (no spaces)"),

  email: z.email("Invalid email format"),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),
});


export const loginSchema = z.object({
  email: z.email("Invalid email format"),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),
});