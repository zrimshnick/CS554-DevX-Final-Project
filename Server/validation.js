import { ObjectId } from "mongodb";

export const checkName = (name) => {
  if (name === undefined) throw "Error: All fields need to be supplied";
  if (typeof name !== "string") throw "Error: name must be a string";
  name = name.trim();
  if (name.length === 0) throw "Error: name cannot be empty";
  if (name.length < 2) throw "Error: name must have at least 2 characters";
  if (name.length > 25) throw "Error: name must have at most 25 characters";

  return name;
};

export const checkUsername = (username) => {
  if (username === undefined) throw "Error: All fields need to be supplied";
  if (typeof username !== "string") throw "Error: username must be a string";
  username = username.trim();

  if (username.length === 0) throw "Error: username cannot be empty";
  if (username.length < 5)
    throw "Error: username must have at least 5 characters";
  if (username.length > 19)
    throw "Error: username must have at most 19 characters";

  if (!/^[a-zA-Z0-9]*$/.test(username))
    throw "Error: username can only have English letters or numbers";

  return username;
};

export const checkEmail = (email) => {
  if (email === undefined) throw "Error: All fields need to be supplied";
  if (typeof email !== "string") throw "Error: email must be a string";
  email = email.trim();

  if (email.length === 0) throw "Error: email cannot be empty";

  const emailPattern = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}(?:\.[a-zA-Z]{2,})?$/;

  if (!emailPattern.test(email)) {
    throw `Error: email is not a valid email.`;
  }

  return email;
};

export const checkAge = (age) => {
  if (age === undefined) throw "Error: All fields need to be supplied";
  if (typeof age !== "number") throw "Error: age must be a number";
  if (age < 0 || age > 110) throw "Error: invalid age";
  if (!Number.isInteger(age)) throw "Error: age must be whole number";

  return age;
};

export const checkBio = (bio) => {
  if (bio === undefined) throw "Error: All fields need to be supplied";
  if (typeof bio !== "string") throw "Error: bio must be a string";
  bio = bio.trim();
  if (bio.length === 0) {
    bio = "No bio yet";
  }
  if (bio.length > 250) throw "Error: bio character limit is 250";

  return bio;
};

export const checkId = (id) => {
  if (!id) throw "Error: id not provided";
  if (typeof id !== "string") throw "Error: id must be a string";
  id = id.trim();
  if (id.length === 0) throw "Error: id cannot be blank";
  if (!ObjectId.isValid(id)) throw "Error: id is invalid ObjectId";

  return id;
};
