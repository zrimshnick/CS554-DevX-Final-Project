import { users, chats } from "../config/mongoCollections.js";
import * as validation from "../validation.js";
import { ObjectId } from "mongodb";

export const createChat = async (user1, user2) => {
  /* INPUT VALIDATION */
  user1 = validation.checkId(user1);
  user2 = validation.checkId(user2);

  /* CREATE */
  const newChatContent = {
    user1: new ObjectId(user1),
    user2: new ObjectId(user2),
    messages: [],
  };

  const chatsCollection = await chats();
  const usersCollection = await users();

  const foundUser1 = await usersCollection.findOne({
    _id: new ObjectId(user1.toString()),
  });
  if (foundUser1) {
    console.log("user 1 exists");
  } else {
    throw "Error: user 1 not found";
  }

  const foundUser2 = await usersCollection.findOne({
    _id: new ObjectId(user2.toString()),
  });
  if (foundUser2) {
    console.log("user 2 exists");
  } else {
    throw "Error: user 2 not found";
  }

  console.log(foundUser1);
  if (foundUser1.openChatPartners.includes(user2)) {
    console.log("user 1 already has an open chat with user 2!");
    throw "Error: user 1 already has an open chat with user 2";
  }
  if (foundUser2.openChatPartners.includes(user1)) {
    console.log("user 2 already has an open chat with user 1!");
    throw "Error: user 2 already has an open chat with user 1";
  }

  const insertedContent = await chatsCollection.insertOne(newChatContent);
  if (!insertedContent.acknowledged || !insertedContent.insertedId)
    throw "Error: could not create chat in mongo";

  const addedToUser1 = await usersCollection.updateOne(
    { _id: new ObjectId(user1) },
    {
      $addToSet: {
        chats: insertedContent.insertedId,
        openChatPartners: user2,
      },
    }
  );

  if (addedToUser1.matchedCount === 0) {
    console.log("user 1 not found v2");
    throw "Error: user 1 not found v2";
  } else if (addedToUser1.modifiedCount > 1) {
    console.log("chat id successfully added to user 1");
  }

  const addedToUser2 = await usersCollection.updateOne(
    { _id: new ObjectId(user2) },
    {
      $addToSet: {
        chats: insertedContent.insertedId,
        openChatPartners: user1,
      },
    }
  );
  if (addedToUser2.matchedCount === 0) {
    console.log("user 2 not found v2");
    throw "Error: user 2 not found v2";
  } else if (addedToUser2.modifiedCount > 1) {
    console.log("chat id successfully added to user 2");
  }
};

export const getChatById = async (chatId) => {
  /* DATA VALIDAITON */
  chatId = validation.checkId(chatId);

  const chatsCollection = await chats();
  const chat = await chatsCollection.findOne({
    _id: new ObjectId(chatId),
  });
  if (!chat) throw "Error: no chat with that chatId found";

  chat._id = chat._id.toString();

  return chat;
};

export const getChatByUsers = async (user1id, user2id) => {
  /* DATA VALIDATION */
  user1id = validation.checkId(user1id);
  user2id = validation.checkId(user2id);

  const chatsCollection = await chats();
  const chat = await chatsCollection.findOne({
    $or: [
      {
        $and: [
          { user1: new ObjectId(user1id) },
          { user2: new ObjectId(user2id) },
        ],
      },
      {
        $and: [
          { user1: new ObjectId(user2id) },
          { user2: new ObjectId(user1id) },
        ],
      },
    ],
  });

  return chat;
};

export const createMessage = async (chatId, senderId, messageBody) => {
  /* INPUT VALIDATION */
  chatId = validation.checkId(chatId);
  senderId = validation.checkId(senderId);
  messageBody = validation.checkMessage(messageBody);

  /* CREATE */
  const newMessageContent = {
    chatId: new ObjectId(chatId),
    senderId: new ObjectId(senderId),
    messageBody: messageBody,
  };

  const chatsCollection = await chats();
  const usersCollection = await users();

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
    { _id: new ObjectId(chatId) },
    {
      $addToSet: {
        messages: newMessageContent,
      },
    }
  );

  console.log(addedToChat);
};

export const getAllMessages = async (chatId) => {
  /* DATA VALIDAITON */
  chatId = validation.checkId(chatId);

  const chatsCollection = await chats();
  const chat = await chatsCollection.findOne({
    _id: new ObjectId(chatId),
  });
  if (!chat) throw "Error: no chat with that chatId found";

  chat._id = chat._id.toString();

  return chat.messages;
};
