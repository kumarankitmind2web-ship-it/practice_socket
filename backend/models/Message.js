import mongoose from "mongoose";

const { Schema } = mongoose;

const messageSchema = new Schema(
  {
    conversationId: {
      type: Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
      index: true
    },

    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    type: {
      type: String,
      enum: ["text", "image", "file", "video", "audio", "system"],
      default: "text",
      required: true
    },

    text: {
      type: String,
      default: null,
      trim: true
    },

    attachments: [
      {
        url: {
          type: String,
          required: true
        },

        fileName: {
          type: String,
          default: null
        },

        mimeType: {
          type: String,
          default: null
        },

        size: {
          type: Number,
          default: null
        }
      }
    ],

    replyTo: {
      type: Schema.Types.ObjectId,
      ref: "Message",
      default: null
    },

    reactions: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true
        },

        emoji: {
          type: String,
          required: true
        }
      }
    ],

    readBy: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true
        },

        readAt: {
          type: Date,
          default: Date.now
        }
      }
    ]
  },
  {
    timestamps: true
  }
);

messageSchema.index({
  conversationId: 1,
  createdAt: -1
});

const Message = mongoose.model("Message", messageSchema);

export default Message;
