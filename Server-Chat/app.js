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

/* UPDATED SOCKET SERVER */
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

    socket.on("user_join", (name, userId) => {
      console.log(`${name} with userId ${userId} has joined the chat`);
      socket.userId = userId; // Store the userId in the socket object

      socket.join(roomName);

      socket.broadcast
        .to(roomName)
        .emit("user_join", `${name} has joined the chat`);
    });

    socket.on("message", async ({ chatRoomId, senderId, messageBody }) => {
      console.log(
        `Message from ${senderId}: ${messageBody} in chatroom: ${chatRoomId}`
      );

      if (!db) {
        console.error("Database is not connected");
        return;
      }

      console.log(senderId);
      console.log("chatRoomId:", chatRoomId);

      /* CREATE */
      const newMessageContent = {
        chatId: new ObjectId(chatRoomId),
        senderId: new ObjectId(senderId),
        messageBody: messageBody,
      };

      const chatsCollection = db.collection("chats");
      const usersCollection = db.collection("users");

      const foundSender = await usersCollection.findOne({
        _id: new ObjectId(senderId.toString()),
      });
      if (foundSender) {
        console.log("sender exists");
      } else {
        throw "Error: sender not found";
      }

      /* ADD MESSAGE TO CHAT */
      const addedToChat = await chatsCollection.updateOne(
        { _id: new ObjectId(chatRoomId) },
        {
          $addToSet: {
            messages: newMessageContent,
          },
        }
      );

      console.log(addedToChat);

      // Broadcast the message to the specific chatroom
      io.to(chatRoomId).emit("message", { senderId, messageBody });
    });

    // Event when a user disconnects
    socket.on("disconnect", () => {
      console.log("Client disconnected", socket.id);
    });
  });

  // Load chat history for a specific chatroom from MongoDB
  /* const loadChatHistory = async (chatRoomId, socket) => {
    try {
      const chatCollection = db.collection("chats");
      const chatRoom = await chatCollection.findOne({
        $or: [{ user1: chatRoomId }, { user2: chatRoomId }],
      });

      if (chatRoom && chatRoom.messages) {
        // Send the chat history to the user who joined the chatroom
        socket.emit("chat_history", chatRoom.messages);
      }
    } catch (error) {
      console.error("Error loading chat history:", error);
    }
  }; */

  httpServer.listen(4000, () => {
    console.log("Server is running on http://localhost:4000");
  });
});
