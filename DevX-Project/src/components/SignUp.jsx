import React, { useContext, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { doCreateUserWithEmailAndPassword } from "../firebase/FirebaseFunctions";
import {
  checkAge,
  checkBio,
  checkEmail,
  checkName,
  checkPassword,
  checkUsername,
} from "../js/validation.js";
import "./Auth.css";

import SocialSignIn from "./SocialSignIn";

function SignUp() {
  const { currentUser } = useContext(AuthContext);
  const [emailCheck, setEmailCheck] = useState("");
  const [pwMatch, setPwMatch] = useState("");

  const handleEmailChange = (e) => {
    console.log("handling email change");
    setEmailCheck("");
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    let {
      username,
      email,
      passwordOne,
      passwordTwo,
      firstName,
      lastName,
      age,
    } = e.target.elements;

    setEmailCheck("");

    if (email.value === undefined) {
      setEmailCheck("Email cannot be undefined");
      return false;
    }
    if (typeof email.value !== "string") {
      setEmailCheck("Email must be a string");
      return false;
    }
    email.value = email.value.trim();

    if (email.value.length === 0) {
      setEmailCheck("Email cannot be empty");
      return false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}(?:\.[a-zA-Z]{2,})?$/;

    if (!emailPattern.test(email.value)) {
      setEmailCheck(`Email is not a valid email.`);
      return false;
    }

    passwordOne.value = checkPassword(passwordOne.value);
    passwordTwo.value = checkPassword(passwordTwo.value);
    firstName.value = checkName(firstName.value);
    lastName.value = checkName(lastName.value);
    age.value = checkAge(age.value);
    username.value = checkUsername(username.value);

    if (passwordOne.value !== passwordTwo.value) {
      setPwMatch("Passwords do not match!");

      return false;
    } else {
      setPwMatch("");
    }

    try {
      await doCreateUserWithEmailAndPassword(
        email.value,
        passwordOne.value,
        username.value
      );
    } catch (e) {
      alert(e);
    }
  };

  if (currentUser) {
    return <Navigate to="/home" replace={true} />;
  }

  return (
    <div className="Auth">
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
          <input
            type="password"
            name="passwordOne"
            placeholder="Password"
            className="Auth-input"
          />
          <input
            type="password"
            name="passwordTwo"
            placeholder="Confirm Password"
            className="Auth-input"
          />
          {pwMatch && <div className="Auth-form-error">{pwMatch}</div>}
          <div className="Auth-form-names-container">
            <input
              type="text"
              placeholder="First Name"
              name="firstName"
              className="Auth-input-name"
            />
            <input
              type="text"
              placeholder="Last Name"
              name="lastName"
              className="Auth-input-name"
            />
            <input
              type="text"
              placeholder="Age"
              name="age"
              className="Auth-input-age"
            />
          </div>

          <input
            type="text"
            placeholder="Username"
            name="username"
            className="Auth-input"
          />

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
