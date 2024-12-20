import { users } from "../config/mongoCollections.js";
import * as validation from "../validation.js";
import { ObjectId } from "mongodb";

export const createUser = async (
  firstName,
  lastName,
  email
  /* age,
  bio */
) => {
  /* INPUT VALIDATION */
  firstName = validation.checkName(firstName);
  lastName = validation.checkName(lastName);
  email = validation.checkEmail(email);
  /* age = validation.checkAge(age);
  bio = validation.checkBio(bio); */

  /* CREATE */
  const newUserContent = {
    firstName: firstName,
    lastName: lastName,
    email: email,
    bio: "",
    age: 0,
    streetAddress: "",
    city: "",
    state: "",
    zip: "",
    profilePicture: null,
    preferredGender: [],
    preferredAgeMin: 0,
    preferredAgeMax: 0,
    swiped: [],
    chats: [],
    openChatPartners: [],
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

export const getAllUsers = async () => {
  const usersCollection = await users();

  const allUsers = await usersCollection.find({}).toArray();

  return allUsers;
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

export const updateUserByEmail = async (email, updatedData) => {
  try {
    if (!updatedData || Object.keys(updatedData).length === 0) {
      throw new Error('No fields to update.');
    }
    console.log(updatedData)

    const usersCollection = await users();
    const response = await usersCollection.updateOne(
      { email },
      { $set: updatedData }
    );

    const updatedUser = await usersCollection.findOne({ email });
    return updatedUser;
  } catch (e) {
    console.error('Error updating user:', e);
    throw new Error('Database update failed.');
  }
};

export const getAllEligibleMatches = async (email) => {
  console.log("here")
  try {
    const user = await getUserByEmail(email);
    const allUsers = await getAllUsers();
    let eligibleMatches = allUsers.filter(otherUser => otherUser.zip === user.zip);
    if (eligibleMatches.length === 0) { // loosen the constraints
       eligibleMatches = allUsers.filter(otherUser => otherUser.city === user.city);
    }
    eligibleMatches = eligibleMatches.filter(otherUser => { return !user.swiped.some((swipe) => swipe.email === otherUser.email); }); // do not show previously swiped users
    eligibleMatches = eligibleMatches.filter(otherUser => { return user.preferredGender.includes(otherUser.gender); }); // enforce gender pref
    eligibleMatches = eligibleMatches.filter(otherUser => { return otherUser.age >= user.preferredAgeMin && otherUser.age <= user.preferredAgeMax }); // enforce age range pref
    return eligibleMatches;
  }
  catch (e) {
    console.error('Error fetching eligible matches:', e);
    throw new Error('Fetching eligible matches from DB failed.');
  }
}