import React, { useContext, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { doCreateUserWithEmailAndPassword } from "../firebase/FirebaseFunctions";
import "./Auth.css";

import SocialSignIn from "./SocialSignIn";

function SignUp() {
  const { currentUser } = useContext(AuthContext);
  const [pwMatch, setPwMatch] = useState("");

  const handleSignUp = async (e) => {
    e.preventDefault();
    const { username, email, passwordOne, passwordTwo } = e.target.elements;

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
        {pwMatch && <div className="Auth-form-error">{pwMatch}</div>}
        <form className="Auth-form" onSubmit={handleSignUp}>
          <input
            type="text"
            placeholder="Username"
            name="username"
            className="Auth-input"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="Auth-input"
          />
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
