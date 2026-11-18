import { z } from "zod";
import mongoose from "mongoose";

const objectIdSchema = z
  .string()
  .refine((id) => mongoose.Types.ObjectId.isValid(id), {
    message: "Invalid ObjectId"
  });

// Member schema
const memberSchema = z.object({
  userId: objectIdSchema,

  role: z.enum(["admin", "member"]).default("member"),

  joinedAt: z.coerce.date().optional(),

  lastReadMessageId: objectIdSchema.nullable().optional(),

  lastReadAt: z.coerce.date().nullable().optional()
});

// Last message schema
const lastMessageSchema = z.object({
  messageId: objectIdSchema.optional(),

  text: z.string().nullable().optional(),

  senderId: objectIdSchema.optional(),

  createdAt: z.coerce.date().optional()
});

// Conversation schema
export const conversationValidationSchema = z.object({
  type: z.enum(["direct", "group"]),

  groupName: z.string().trim().nullable().optional(),

  groupAvatar: z.string().nullable().optional(),

  members: z
    .array(memberSchema)
    .min(2, "A conversation must have at least 2 members"),

  lastMessage: lastMessageSchema.nullable().optional(),

  createdBy: objectIdSchema

}).superRefine((data, ctx) => {

  // Direct conversation must have exactly 2 members
  if (data.type === "direct" && data.members.length !== 2) {
    ctx.addIssue({
      code: "custom",
      path: ["members"],
      message: "A direct conversation must have exactly 2 members"
    });
  }

  // Group conversation should have a group name
  if (data.type === "group" && !data.groupName) {
    ctx.addIssue({
      code: "custom",
      path: ["groupName"],
      message: "Group name is required"
    });
  }

  // Prevent duplicate members
  const userIds = data.members.map((member) => member.userId);

  if (new Set(userIds).size !== userIds.length) {
    ctx.addIssue({
      code: "custom",
      path: ["members"],
      message: "Duplicate members are not allowed"
    });
  }

});