import mongoose from 'mongoose';

const { Schema } = mongoose;

const memberSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    role: {
      type: String,
      enum: ['admin', 'member'],
      default: 'member',
    },

    joinedAt: {
      type: Date,
      default: Date.now,
    },

    lastReadMessageId: {
      type: Schema.Types.ObjectId,
      ref: 'Message',
      default: null,
    },

    lastReadAt: {
      type: Date,
      default: null,
    },
  },
  { _id: false }
);

const lastMessageSchema = new Schema(
  {
    messageId: {
      type: Schema.Types.ObjectId,
      ref: 'Message',
    },

    text: {
      type: String,
      default: null,
    },

    senderId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },

    createdAt: {
      type: Date,
    },
  },
  { _id: false }
);

const conversationSchema = new Schema(
  {
    type: {
      type: String,
      enum: ['direct', 'group'],
      required: true,
    },

    groupName: {
      type: String,
      default: null,
      trim: true,
    },

    groupAvatar: {
      type: String,
      default: null,
    },

    members: {
      type: [memberSchema],
      required: true,
      validate: {
        validator: (members) => members.length >= 2,
        message: 'A conversation must have at least 2 members',
      },
    },

    lastMessage: {
      type: lastMessageSchema,
      default: null,
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Conversation = mongoose.model(
  'Conversation',
  conversationSchema
);

export default Conversation;
