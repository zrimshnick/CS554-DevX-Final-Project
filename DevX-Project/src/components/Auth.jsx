import React, { useState } from "react";
import { Link } from "react-router-dom";
import logoIcon from "../img/logo.png";
import "./Auth.css";
import SignIn from "./SignIn";
import SignUp from "./SignUp";

function Auth() {
  /*   const [view, setView] = useState("intro"); // Tracks the current view

  const handleSignInClick = () => {
    setView("signIn");
  };

  const handleSignUpClick = () => {
    setView("signUp");
  };

  const renderIntro = () => (
    <div className="Auth-intro-container">
      <h1 className="Auth-catchphrase">
        Brew New Friendships, One Coffee at a Time
      </h1>
      <p className="Auth-paragraph">
        Coffee Connections is a social app for coffee enthusiasts looking to
        make new friends over a shared love for coffee. Whether you’re new in
        town, exploring new coffee spots, or simply want to connect, we make it
        easy to find like-minded coffee lovers!
      </p>
      <div className="Auth-buttons-header">Sign up or sign in to continue</div>
      <div className="Auth-buttons-container">
        <button className="Auth-button" onClick={handleSignInClick}>
          Sign In
        </button>
        <button className="Auth-button" onClick={handleSignUpClick}>
          Sign Up
        </button>
      </div>
    </div>
  );

  const renderSignInForm = () => (
    <div className="Auth-form-container">
      <h2 className="Auth-form-header">Sign in to your account</h2>
      <SignIn></SignIn>
      <button className="Auth-back-button" onClick={() => setView("intro")}>
        Go Back
      </button>
    </div>
  );

  const renderSignUpForm = () => (
    <div className="Auth-form-container">
      <h2 className="Auth-form-header">Create Account</h2>
      <SignUp></SignUp>
      <button className="Auth-back-button" onClick={() => setView("intro")}>
        Go Back
      </button>
    </div>
  );

  return (
    <div className="Auth">
      {view === "intro" && renderIntro()}
      {view === "signIn" && renderSignInForm()}
      {view === "signUp" && renderSignUpForm()}
    </div>
  ); */

  return (
    <div className="Auth">
      <div className="Auth-intro-container">
        <h1 className="Auth-catchphrase">
          Brew New Friendships, One Coffee at a Time
        </h1>
        <p className="Auth-paragraph">
          Coffee Connections is a social app for coffee enthusiasts looking to
          make new friends over a shared love for coffee. Whether you’re new in
          town, exploring new coffee spots, or simply want to connect, we make
          it easy to find like-minded coffee lovers!
        </p>
        <div className="Auth-buttons-header">
          Sign in or create an account to continue
        </div>
        <div className="Auth-buttons-container">
          <Link className="Auth-button" to="/signin">
            Sign In
          </Link>
          {/* <div>.</div> */}
          <img
            className="App-auth-logo"
            src={logoIcon}
            alt="Coffee Connections Logo"
          />
          <Link className="Auth-button" to="/signup">
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Auth;
