import React, { useContext, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import SocialSignIn from "./SocialSignIn";
import { AuthContext } from "../context/AuthContext";
import "./Auth.css";
import {
  doSignInWithEmailAndPassword,
  doPasswordReset,
} from "../firebase/FirebaseFunctions";

function SignIn() {
  const { currentUser } = useContext(AuthContext);
  const [signInCheck, setSignInCheck] = useState("");

  const handleSignInChange = (e) => {
    setSignInCheck("");
  };

  const handleLogIn = async (e) => {
    e.preventDefault();
    let { email, password } = e.target.elements;
    let errors = {};

    setSignInCheck("");

    try {
      await doSignInWithEmailAndPassword(email.value, password.value);
    } catch (e) {
      errors.signin = "Incorrect email or password";
      setSignInCheck(errors.signin);
      return false;
      //alert(e);
    }
  };

  const passwordReset = (e) => {
    e.preventDefault();
    let email = document.getElementById("email").value;
    if (email) {
      doPasswordReset(email);
      alert("Password email was sent to your inbox");
    } else {
      alert("Please enter an email address below to reset password");
    }
  };

  if (currentUser) {
    return <Navigate to="/home" replace={true} />;
  }

  return (
    <div className="Auth">
      <div className="Auth-form-container">
        <h2 className="Auth-form-header">Sign in to your account</h2>
        <form className="Auth-form" onSubmit={handleLogIn}>
          <input
            type="text"
            name="email"
            id="email"
            placeholder="Email"
            required
            autoFocus={true}
            className="Auth-input"
            onChange={handleSignInChange}
          />
          <input
            type="password"
            name="password"
            autoComplete="off"
            required
            placeholder="Password"
            className="Auth-input"
            onChange={handleSignInChange}
          />
          {signInCheck && <div className="Auth-form-error">{signInCheck}</div>}

          <button type="submit" className="Auth-button">
            Sign In
          </button>

          <button
            className="Auth-forgotPassword-button"
            onClick={passwordReset}
          >
            Forgot Password?
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

export default SignIn;
