import { Router } from "express";
const router = Router();
import { usersData } from "../data/index.js";
import { ObjectId } from "mongodb";
import { generateUsername } from "unique-username-generator";
import * as validation from "../validation.js";

router
  .route("/")
  .get(async (req, res) => {
    try {
      const allUsers = await usersData.getAllUsers();

      return res.json(allUsers);
    } catch (e) {
      return res.status(500).json({ error: e });
    }
  })
  .post(async (req, res) => {
    const userCreateData = req.body;

    if (!userCreateData || Object.keys(userCreateData).length === 0) {
      return res.status(400).json({ error: "Request body must have fields" });
    }

    const username = generateUsername("", 2, 19);
    /* INPUT VALIDATION */
    try {
      userCreateData.firstName = validation.checkName(userCreateData.firstName);
      userCreateData.lastName = validation.checkName(userCreateData.lastName);
      userCreateData.email = validation.checkEmail(userCreateData.email);
      /* userCreateData.age = validation.checkAge(userCreateData.age);
      userCreateData.bio = validation.checkBio(userCreateData.bio); */
      /* const user = await usersData.getUserByEmail(validatedEmail); // Query the database
      if (user) {
        console.log("user already exists with that email");
        return res.json(user); // Return the user if found
      } */
    } catch (e) {
      return res.status(400).json({ error: e });
    }

    try {
      //const { firstName, lastName, email, age, bio } = userCreateData;
      const { firstName, lastName, email } = userCreateData;
      const userCreated = await usersData.createUser(
        firstName,
        lastName,
        email
        /* age,
        bio */
      );

      return res.json(userCreated);
    } catch (e) {
      return res.status(500).json({ error: e });
    }
  });

/* router.route("/:id").get(async (req, res) => {
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
}); */
router.route("/:email").get(async (req, res) => {
  try {
    req.params.email = validation.checkEmail(req.params.email);
  } catch (e) {
    return res.status(400).json({ error: e });
  }

  try {
    const userFound = await usersData.getUserByEmail(req.params.email);
    return res.json(userFound);
  } catch (e) {
    return res.status(404).json({ error: e });
  }
});
router.route("/id/:id").get(async (req, res) => {
  try {
    req.params.id = validation.checkId(req.params.id);
  } catch (e) {
    return res.status(400).json({ error: e });
  }

  try {
    const userFound = await usersData.getUser(req.params.id);
    console.log(userFound)
    return res.json(userFound);
  } catch (e) {
    return res.status(404).json({ error: e });
  }
});

export default router;
