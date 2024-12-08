import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import { ObjectId, MongoClient } from "mongodb";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  },
});

const uri =
  "mongodb+srv://developer:passw0rd123!@devx-project.wrdgk.mongodb.net/";
const dbName = "DevX-Project-Database";
let db;

const connectToDb = async () => {
  try {
    const client = await MongoClient.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = client.db(dbName);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

connectToDb().then(() => {
  io.on("connection", (socket) => {
    console.log("New client connected", socket.id);

    // User joins a specific chatroom
    socket.on("join_room", (chatRoomId) => {
      socket.join(chatRoomId);
      console.log(`User ${socket.id} joined chatroom: ${chatRoomId}`);
    });

    // Handle sending a message
    socket.on("message", async ({ chatRoomId, senderId, messageBody }) => {
      console.log(
        `Message from ${senderId}: ${messageBody} in chatroom: ${chatRoomId}`
      );

      if (!db) {
        console.error("Database is not connected");
        return;
      }

      // Create message object
      const newMessageContent = {
        chatId: new ObjectId(chatRoomId),
        senderId: new ObjectId(senderId),
        messageBody: messageBody,
      };

      const chatsCollection = db.collection("chats");

      // Add message to the database
      await chatsCollection.updateOne(
        { _id: new ObjectId(chatRoomId) },
        { $push: { messages: newMessageContent } }
      );

      // Emit the message to everyone in the room
      console.log(`emitting to room: ${chatRoomId}`);
      console.log(`Socket rooms:`, Array.from(socket.rooms));
      io.to(chatRoomId).emit("message", {
        senderId,
        messageBody,
      });
    });

    // Event when a user disconnects
    socket.on("disconnect", () => {
      console.log("Client disconnected", socket.id);
    });
  });

  httpServer.listen(4000, () => {
    console.log("Server is running on http://localhost:4000");
  });
});
