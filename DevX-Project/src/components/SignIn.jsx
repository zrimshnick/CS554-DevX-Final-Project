import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Auth.css";

function SignIn() {
  return (
    <div className="Auth">
      <div className="Auth-form-container">
        <h2 className="Auth-form-header">Sign in to your account</h2>
        <form className="Auth-form">
          <input type="text" placeholder="Username" className="Auth-input" />
          <input
            type="password"
            placeholder="Password"
            className="Auth-input"
          />
          <button type="submit" className="Auth-button">
            Sign In
          </button>
        </form>
        <Link className="Auth-back-button" to="/">
          Go Back
        </Link>
      </div>
    </div>
  );
}

export default SignIn;
