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
      console.log(userCreated)

      return res.json(userCreated);
    } catch (e) {
      return res.status(500).json({ error: e });
    }
  })
  .patch(async (req, res) => {
    const updatedData = req.body;
  
    if (!updatedData || Object.keys(updatedData).length === 0) {
      return res.status(400).json({ error: "Request body must have fields to update" });
    }
  
    // Input validation
    // try {
    //   if (updatedUser.firstName) {
    //     updatedUser.firstName = validation.checkAge(updatedUser.firstName);
    //   }
    //   if (updatedUser.lastName) {
    //     updatedUser.lastName = validation.checkAge(updatedUser.lastName);
    //   }
    //   if (updatedUser.email) {
    //     updatedUser.email = validation.checkAge(updatedUser.email); 
    //   }
    //   if (updatedUser.bio) {
    //     updatedUser.bio = validation.checkAge(updatedUser.bio);
    //   }
    //   if (updatedUser.age) {
    //     updatedUser.age = validation.checkAge(updatedUser.age);
    //   }
    //   if (updatedUser.gender) {
    //     formData.gender = validation.checkName(updatedUser.gender);
    //   }
    //   if (updatedUser.streetAddress) {
    //     formData.streetAddress = validation.checkName(formData.streetAddress);
    //   }
    //   if (updatedUser.city) {
    //     updatedUser.city = validation.checkName(updatedUser.city);
    //   }
    //   if (updatedUser.state) {
    //     updatedUser.state = validation.checkName(updatedUser.state);
    //   }
    //   if (updatedUser.preferredGender) {
    //     if (!Array.isArray(updatedUser.preferredGender)) {
    //       throw new Error("Preferred gender should be an array");
    //     }
    //     updatedUser.preferredGender = validation.checkName(updatedUser.preferredGender);
    //   }
    //   if (formData.preferredAgeMin) {
    //     formData.preferredAgeMin = validation.checkAge(formData.preferredAgeMin);
    //   }
    //   if (formData.preferredAgeMax) {
    //     formData.preferredAgeMax = validation.checkAge(formData.preferredAgeMax);
    //   }
    // } catch (e) {
    //   return res.status(400).json({ error: e.message });
    // }
  
    try {
      const updatedUser = await usersData.updateUserByEmail(req.body.email, updatedData);
  
      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }
  
      return res.json(updatedUser);
    } catch (e) {
      return res.status(500).json({ error: e.message });
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
