import { Router } from "express";
const router = Router();
import { usersData } from "../data/index.js";
import { ObjectId } from "mongodb";

router.route("/:id").get(async (req, res) => {
  /* GET USER */
  try {
    const userFound = await usersData.getUser(req.params.id);
    return res.json(`user found: ${userFound}`);
  } catch (e) {
    return res.status(404).json({ error: e });
  }
});

export default router;
