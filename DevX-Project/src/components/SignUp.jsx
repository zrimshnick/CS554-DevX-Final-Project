import React, { useContext, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { doCreateUserWithEmailAndPassword } from "../firebase/FirebaseFunctions";
import "./Auth.css";
import { generateUsername } from "unique-username-generator";

import SocialSignIn from "./SocialSignIn";

function SignUp() {
  const { currentUser } = useContext(AuthContext);
  const [emailCheck, setEmailCheck] = useState("");
  const [emailExistsCheck, setEmailExistsCheck] = useState("");
  const [pwCheck, setPwCheck] = useState("");
  /* const [usernameCheck, setUsernameCheck] = useState(""); */
  const [firstNameCheck, setFirstNameCheck] = useState("");
  const [lastNameCheck, setLastNameCheck] = useState("");
  /*const [ageCheck, setAgeCheck] = useState(""); */
  const [pwMatch, setPwMatch] = useState("");
  const [userId, setUserId] = useState(null);  // state to store the MongoDB ObjectId

  const handleEmailChange = (e) => {
    console.log("handling email change");
    setEmailCheck("");
    setEmailExistsCheck("");
  };
  const handlePasswordOneChange = (e) => {
    console.log("handling pw1 change");
    setPwCheck("");
  };
  const handlePasswordTwoChange = (e) => {
    console.log("handling pw2 change");
    setPwMatch("");
  };
  /* const handleUsernameChange = (e) => {
    console.log("handling username change");
    setUsernameCheck("");
  }; */
  const handleFirstNameChange = (e) => {
    console.log("handling first name change");
    setFirstNameCheck("");
  };
  const handleLastNameChange = (e) => {
    console.log("handling last name change");
    setLastNameCheck("");
  };
  /*
  const handleAgeChange = (e) => {
    console.log("handling age change");
    setAgeCheck("");
  }; */

  const handleSignUp = async (e) => {
    e.preventDefault();
    /* let { email, passwordOne, passwordTwo, firstName, lastName, age } =
      e.target.elements; */
    let { email, passwordOne, passwordTwo, firstName, lastName } =
      e.target.elements;

    let errors = {};

    /* INPUT VALIDATION */
    setEmailCheck("");
    setEmailExistsCheck("");
    setPwCheck("");
    /* setUsernameCheck(""); */
    setPwMatch("");
    setFirstNameCheck("");
    setLastNameCheck("");
    /*setAgeCheck(""); */

    /* EMAIL */
    email.value = email.value?.trim();
    if (!email.value) {
      errors.email = "Email cannot be empty";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}(?:\.[a-zA-Z]{2,})?$/.test(email.value)
    ) {
      errors.email = "Email is not valid";
    }

    /* PASSWORD */
    if (passwordOne.value === undefined) {
      setPwCheck("Password must be supplied");
      return false;
    }
    if (typeof passwordOne.value !== "string") {
      setPwCheck("Password is invalid");
      return false;
    }
    passwordOne.value = passwordOne.value.trim();
    if (passwordOne.value.length === 0) {
      setPwCheck("Password must be supplied");
      return false;
    }
    if (passwordOne.value.length < 7) {
      setPwCheck("Password must have at least 7 characters");
      return false;
    }

    passwordOne.value = passwordOne.value?.trim();
    if (!passwordOne.value) {
      errors.password = "Password must be supplied";
    } else if (passwordOne.value.length < 7) {
      errors.password = "Password must have at least 7 characters";
    } else if (
      !/^(?=.*[A-Z])(?=(?:.*\d.*){2,})(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{7,}$/.test(
        passwordOne.value
      )
    ) {
      errors.password =
        "Password must have at least 7 characters, 1 uppercase character, 2 numbers, and 1 special character";
    }

    /* USERNAME */
    /* username.value = username.value?.trim();
    if (!username.value) {
      errors.username = "Username must be supplied";
    } else if (username.value.length < 5 || username.value.length > 19) {
      errors.username = "Username must be between 5 and 19 characters";
    } else if (!/^[a-zA-Z0-9]*$/.test(username.value)) {
      errors.username = "Username can only contain English letters or numbers";
    } */

    /* FIRST NAME */
    firstName.value = firstName.value?.trim();
    if (!firstName.value) {
      errors.firstName = "First name must be supplied";
    } else if (firstName.value.length < 2 || firstName.value.length > 25) {
      errors.firstName = "First name must be between 2 and 25 characters";
    }

    /* LAST NAME */
    lastName.value = lastName.value?.trim();
    if (!lastName.value) {
      errors.lastName = "Last name must be supplied";
    } else if (lastName.value.length < 2 || lastName.value.length > 25) {
      errors.lastName = "Last name must be between 2 and 25 characters";
    }

    /* age.value = age.value?.trim();
    age.value = parseInt(age.value);
    if (!age.value) {
      errors.age = "Age must be supplied";
    } else if (!Number.isInteger(Number(age.value))) {
      errors.age = "Age must be a whole number";
    } else if (Number(age.value < 18) || age.value > 110) {
      errors.age = "Age must be between 18 and 110";
    } */

    /* PASSWORDS MATCHING */
    if (passwordOne.value !== passwordTwo.value) {
      errors.passwordMatch = "Passwords do not match!";
    }

    setEmailCheck(errors.email || "");
    setPwCheck(errors.password || "");
    /* setUsernameCheck(errors.username || ""); */
    setPwMatch(errors.passwordMatch || "");
    setFirstNameCheck(errors.firstName || "");
    setLastNameCheck(errors.lastName || "");
    /*setAgeCheck(errors.age || ""); */

    if (Object.keys(errors).length > 0) {
      return false;
    }

    /*  */
    /* const generatedUsername = generateUsername("", 2, 19); */
    try {
      await doCreateUserWithEmailAndPassword(email.value, passwordOne.value);
    } catch (e) {
      errors.emailExists = "A user already exists with this email!";
      setEmailExistsCheck(errors.emailExists);
      return;
    }

    /* CREATE IN MONGODB */
    const userData = {
      firstName: firstName.value.trim(),
      lastName: lastName.value.trim(),
      email: email.value.trim(),
      /* age: parseInt(age.value.trim(), 10),
      bio: "", */ // You can collect the bio in the form if needed.
    };

    try {
      const response = await fetch("http://18.222.71.218:3000/user/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("Error creating user in MongoDB:", error);
        alert("Error saving user data. Please try again.");
        return;
      }

      const createdUser = await response.json();
      setUserId(createdUser._id);
      console.log("User successfully created in MongoDB");
    } catch (e) {
      console.error("Error connecting to MongoDB API:", e);
      alert("Could not connect to the server. Please try again later.");
    }
  };

  if (currentUser) {
    return <Navigate to="/home" replace={true} />;
  }

  return (
    <div className="Auth">
      <div className="Auth-background"></div>
      <div className="Auth-form-container">
        <h2 className="Auth-form-header">Create Account</h2>
        <form className="Auth-form" onSubmit={handleSignUp}>
          <input
            type="text"
            name="email"
            placeholder="Email"
            className="Auth-input"
            onChange={handleEmailChange}
          />
          {emailCheck && <div className="Auth-form-error">{emailCheck}</div>}
          {emailExistsCheck && (
            <div className="Auth-form-error">{emailExistsCheck}</div>
          )}
          <input
            type="password"
            name="passwordOne"
            placeholder="Password"
            className="Auth-input"
            onChange={handlePasswordOneChange}
          />
          {pwCheck && <div className="Auth-form-error">{pwCheck}</div>}
          <input
            type="password"
            name="passwordTwo"
            placeholder="Confirm Password"
            className="Auth-input"
            onChange={handlePasswordTwoChange}
          />
          {pwMatch && <div className="Auth-form-error">{pwMatch}</div>}

          {/* <input
            type="text"
            placeholder="Pick a username"
            name="username"
            className="Auth-input"
            onChange={handleUsernameChange}
          />
          {usernameCheck && (
            <div className="Auth-form-error">{usernameCheck}</div>
          )} */}

          <div className="Auth-form-break"></div>

          <div className="Auth-form-names-container">
            <input
              type="text"
              placeholder="First Name"
              name="firstName"
              className="Auth-input-name"
              onChange={handleFirstNameChange}
            />
            <input
              type="text"
              placeholder="Last Name"
              name="lastName"
              className="Auth-input-name"
              onChange={handleLastNameChange}
            />
            {/* <input
              type="text"
              placeholder="Age"
              name="age"
              className="Auth-input-age"
              onChange={handleAgeChange}
            /> */}
          </div>
          {firstNameCheck && (
            <div className="Auth-form-error">{firstNameCheck}</div>
          )}
          {lastNameCheck && (
            <div className="Auth-form-error">{lastNameCheck}</div>
          )}
          {/* {ageCheck && <div className="Auth-form-error">{ageCheck}</div>} */}
          <button
            type="submit"
            id="submitButton"
            name="submitButton"
            className="Auth-button"
          >
            Sign Up
          </button>
        </form>
        <SocialSignIn />
        <Link className="Auth-back-button" to="/">
          Go Back
        </Link>
      </div>
    </div>
  );
}

export default SignUp;
