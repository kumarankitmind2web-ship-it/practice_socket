
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import connectDB from "./config/db.js";
import indexRoutes from "./routes/indexRoutes.js";
import Message from "./models/Message.js";
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5002;

var corsOptions = {
    origin: process.env.origin || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  }

app.use(cors(corsOptions));
app.use(cookieParser())
app.use(express.json());

connectDB();
app.use("/api", indexRoutes);

// Get previous messages
app.get("/api/messages", async (req, res) => {
  try {
    const messages = await Message.find()
      .sort({ createdAt: 1 })
      .limit(50);

    res.json(messages);
  } catch (error) {
    console.error("Failed to get messages:", error);

    res.status(500).json({
      message: "Failed to get messages",
    });
  }
});

// Create HTTP server
const server = http.createServer(app);

// Create Socket.IO server
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);


  socket.on("join-room", (roomId) => {
    if (!roomId) {
      socket.emit("error_message", {
        message: "Room ID is required",
      });
      return;
    }

    socket.join(roomId);

    console.log(`${socket.id} joined room ${roomId}`);

    // Tell other users in the room
    socket.to(roomId).emit("user-joined", {
      userId: socket.id,
    });
  });

socket.on("chatMessage", async (messageData) => {
  try {
    console.log("CHAT MESSAGE RECEIVED:", messageData);

    const { username, text, roomId } = messageData;

    if (!username?.trim() || !text?.trim() || !roomId) {
      console.log("Validation failed");

      socket.emit("error_message", {
        message: "Username, text and roomId are required",
      });

      return;
    }

    console.log("Saving message to MongoDB...");

    const newMessage = await Message.create({
      username: username.trim(),
      text: text.trim(),
      roomId,
    });

    console.log("MESSAGE SAVED:", newMessage);

    console.log("Sending message to room:", roomId);

    io.to(roomId).emit("new_message", newMessage);

  } catch (error) {
    console.error("MESSAGE ERROR:", error);

    socket.emit("error_message", {
      message: "Failed to send message",
    });
  }
});

  socket.on("disconnect", (reason) => {
    console.log("Client disconnected:", socket.id);
    console.log("Reason:", reason);
  });


  socket.on("error", (error) => {
    console.error("Socket.IO error:", error);
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

