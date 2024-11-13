import { Router } from "express";
const router = Router();
import { usersData } from "../data/index.js";
import { ObjectId } from "mongodb";
import * as validation from "../validation.js";

router
  .route("/")
  .get(async (req, res) => {
    return "getall";
  })
  .post(async (req, res) => {
    const userCreateData = req.body;

    if (!userCreateData || Object.keys(userCreateData).length === 0) {
      return res.status(400).json({ error: "Request body must have fields" });
    }

    /* INPUT VALIDATION */
    try {
      userCreateData.firstName = validation.checkName(userCreateData.firstName);
      userCreateData.lastName = validation.checkName(userCreateData.lastName);
      userCreateData.username = validation.checkUsername(
        userCreateData.username
      );
      userCreateData.age = validation.checkAge(userCreateData.age);
      userCreateData.bio = validation.checkBio(userCreateData.bio);
    } catch (e) {
      return res.status(400).json({ error: e });
    }

    try {
      const { firstName, lastName, username, age, bio } = userCreateData;
      const userCreated = await usersData.createUser(
        firstName,
        lastName,
        username,
        age,
        bio
      );

      return res.json(userCreated);
    } catch (e) {
      return res.status(500).json({ error: e });
    }
  });

router.route("/:id").get(async (req, res) => {
  /* GET USER */
  try {
    req.params.id = validation.checkId(req.params.id);
  } catch (e) {
    return res.status(400).json({ error: e });
  }

  try {
    const userFound = await usersData.getUser(req.params.id);
    return res.json(userFound);
  } catch (e) {
    return res.status(404).json({ error: e });
  }
});

export default router;
