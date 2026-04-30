import { z } from "zod";

export const aiWritingActions = ["title", "outline", "draft", "improve", "cta"] as const;

export const generateWritingSchema = z.object({
  action: z.enum(aiWritingActions),
  prompt: z.string().trim().max(4000, "Prompt is too long").default(""),
  title: z.string().trim().max(255, "Title is too long").optional(),
  content: z.string().trim().max(20000, "Content is too long").optional(),
}).refine((value) => value.prompt || value.title || value.content, {
  message: "Prompt, title, or content is required",
});

export type AIWritingAction = (typeof aiWritingActions)[number];
export type GenerateWritingPayload = z.infer<typeof generateWritingSchema>;
