import { Router } from "express";
const router = Router();
import { chatsData } from "../data/index.js";
import { ObjectId } from "mongodb";
import * as validation from "../validation.js";

router
  .route("/")
  .get(async (req, res) => {
    return "getall";
  })
  .post(async (req, res) => {
    const chatCreateData = req.body;

    if (!chatCreateData || Object.keys(chatCreateData).length === 0) {
      return res.status(400).json({ error: "Request body must have fields" });
    }

    /* INPUT VALIDATION */
    try {
      chatCreateData.user1 = validation.checkId(chatCreateData.user1);
      chatCreateData.user2 = validation.checkId(chatCreateData.user2);
    } catch (e) {
      return res.status(400).json({ error: e });
    }

    /* CALL MONGO */
    try {
      const { user1, user2 } = chatCreateData;
      console.log(user1);
      console.log(user2);
      const chatCreated = await chatsData.createChat(user1, user2);

      return res.json(chatCreated);
    } catch (e) {
      return res.status(500).json({ error: e });
    }
  });

router.route("/:id").get(async (req, res) => {
  return "getall";
});

router.route("/:id/messages").get(async (req, res) => {
  try {
    try {
      req.params.id = validation.checkId(req.params.id);
    } catch (e) {
      return res.status(400).json({ error: e });
    }

    try {
      const messagesFound = await chatsData.getAllMessages(req.params.id);
      return res.json(messagesFound);
    } catch (e) {
      return res.status(404).json({ error: e });
    }
  } catch (e) {
    return res.status(500).json({ error: e });
  }
});

router.route("/:id/add-messages").post(async (req, res) => {
  try {
    req.params.id = validation.checkId(req.params.id);
  } catch (e) {
    return res.status(400).json({ error: e });
  }

  const messageCreateData = req.body;

  if (!messageCreateData || Object.keys(messageCreateData).length === 0) {
    return res.status(400).json({ error: "Request body must have fields" });
  }

  /* INPUT VALIDATION */
  try {
    messageCreateData.senderId = validation.checkId(messageCreateData.senderId);
    messageCreateData.messageBody = validation.checkMessage(
      messageCreateData.messageBody
    );
  } catch (e) {
    return res.status(400).json({ error: e });
  }

  /* CALL MONGO */
  try {
    const { senderId, messageBody } = messageCreateData;
    console.log(senderId);
    console.log(messageBody);

    const messageCreated = await chatsData.createMessage(
      req.params.id,
      senderId,
      messageBody
    );

    return res.json(messageCreated);
  } catch (e) {
    return res.status(500).json({ error: e });
  }
});

router.route("/:user1id/:user2id").get(async (req, res) => {
  try {
    try {
      req.params.user1id = validation.checkId(req.params.user1id);
      req.params.user2id = validation.checkId(req.params.user2id);
    } catch (e) {
      return res.status(400).json({ error: e });
    }

    try {
      const chatFound = await chatsData.getChatByUsers(
        req.params.user1id,
        req.params.user2id
      );
      return res.json(chatFound);
    } catch (e) {
      return res.status(404).json({ error: e });
    }
  } catch (e) {
    return res.status(500).json({ error: e });
  }
});

export default router;
