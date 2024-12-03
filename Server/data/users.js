import { users } from "../config/mongoCollections.js";
import * as validation from "../validation.js";
import { ObjectId } from "mongodb";

export const createUser = async (
  /* firstName,
  lastName,
  username, */
  email
  /* age,
  bio */
) => {
  /* INPUT VALIDATION */
  /* firstName = validation.checkName(firstName);
  lastName = validation.checkName(lastName);
  username = validation.checkUsername(username); */
  email = validation.checkEmail(email);
  /* age = validation.checkAge(age);
  bio = validation.checkBio(bio); */

  /* CREATE */
  const newUserContent = {
    /* firstName: firstName,
    lastName: lastName,
    username: username, */
    email: email,
    /* age: age,
    bio: bio, */
  };

  const usersCollection = await users();
  /* check if username is taken */
  /* const usernameFound = await usersCollection.findOne({ username: username });
  if (usernameFound) throw "Error: username already taken"; */

  const emailFound = await usersCollection.findOne({ email: email });
  if (emailFound) throw "Error: email already associated with an account";

  const insertContent = await usersCollection.insertOne(newUserContent);
  if (!insertContent.acknowledged || !insertContent.insertedId)
    throw "Error: could not create user";

  const user = await usersCollection.findOne({
    _id: new ObjectId(insertContent.insertedId.toString()),
  });
  if (user) {
    user._id = user._id.toString();
    return user;
  } else {
    throw "Error: no user with that id";
  }
};

export const getUser = async (userId) => {
  /* DATA VALIDAITON */
  userId = validation.checkId(userId);

  const usersCollection = await users();
  const user = await usersCollection.findOne({
    _id: new ObjectId(userId),
  });
  if (!user) throw "Error: no user with that userId found";

  user._id = user._id.toString();

  return user;
};

export const getUserByEmail = async (email) => {
  /* DATA VALIDAITON */
  email = validation.checkEmail(email);

  const usersCollection = await users();
  const user = await usersCollection.findOne({
    email: email,
  });
  if (!user) throw "Error: no user with that email found";

  user._id = user._id.toString();

  return user;
};
