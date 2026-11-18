import { z } from "zod";
import mongoose from "mongoose";

const objectIdSchema = z
  .string()
  .refine((id) => mongoose.Types.ObjectId.isValid(id), {
    message: "Invalid ObjectId"
  });

const attachmentSchema = z.object({
  url: z.string().url("Invalid attachment URL"),

  fileName: z.string().nullable().optional(),

  mimeType: z.string().nullable().optional(),

  size: z.number().nonnegative().nullable().optional()
});

const reactionSchema = z.object({
  userId: objectIdSchema,

  emoji: z.string().min(1, "Emoji is required")
});

const readBySchema = z.object({
  userId: objectIdSchema,

  readAt: z.coerce.date().optional()
});

export const messageValidationSchema = z.object({
  conversationId: objectIdSchema,

  senderId: objectIdSchema,

  type: z.enum([
    "text",
    "image",
    "file",
    "video",
    "audio",
    "system"
  ]).default("text"),

  text: z.string().trim().nullable().optional(),

  attachments: z.array(attachmentSchema).optional().default([]),

  replyTo: objectIdSchema.nullable().optional(),

  reactions: z.array(reactionSchema).optional().default([]),

  readBy: z.array(readBySchema).optional().default([])
});