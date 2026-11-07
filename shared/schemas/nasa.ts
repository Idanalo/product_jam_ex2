import { z } from "zod";

/** Predefined list of astronomical tags allowed for LLM labeling */
export const ALLOWED_TAGS = [
  "galaxy",
  "planet",
  "nebula",
  "earth",
  "sun",
  "moon",
  "star",
  "telescope",
  "black-hole",
  "asteroid",
  "comet",
  "spacecraft",
  "deep-space",
] as const;

/** Schema to validate Gemini's structured output */
export const hebrewExplanationSchema = z.object({
  hebrew_title: z.string().trim().min(1, "Hebrew title cannot be empty"),
  hebrew_summary: z.string().trim().min(1, "Hebrew summary cannot be empty"),
  tags: z
    .array(z.string())
    .min(1, "At least 1 tag is required")
    .max(5, "At most 5 tags are allowed"),
});

/** Schema for saved database cache records in apod_translations */
export const cachedTranslationSchema = z.object({
  date: z.string(),
  original_title: z.string(),
  original_explanation: z.string(),
  hebrew_title: z.string(),
  hebrew_summary: z.string(),
  tags: z.array(z.string()),
  created_at: z.string(),
});

/** Input payload when client asks to explain an APOD picture */
export const explainApodInputSchema = z.object({
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format, expected YYYY-MM-DD"),
});

/** APOD picture object sent to browser */
export const apodPictureSchema = z.object({
  date: z.string(),
  title: z.string(),
  explanation: z.string(),
  url: z.string(),
  hdurl: z.string().optional(),
  media_type: z.string(),
  translation: cachedTranslationSchema.nullable(),
});

export type HebrewExplanation = z.infer<typeof hebrewExplanationSchema>;
export type CachedTranslation = z.infer<typeof cachedTranslationSchema>;
export type ExplainApodInput = z.infer<typeof explainApodInputSchema>;
export type ApodPicture = z.infer<typeof apodPictureSchema>;
