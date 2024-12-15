import React from "react";
import { Link } from "react-router-dom";
import "../App.css";
import logoIcon from "../img/logo.png";
import profileIcon from "../img/profileIcon.png";

function Navigation() {
  return (
    <div className="App-navbar-container">
      <Link className="App-navbar-title" to="/home">
        <img
          className="App-navbar-logo"
          src={logoIcon}
          alt="Coffee Connections Logo"
        />
        Coffee Connections
      </Link>
      <div className="App-navbar-link-container">
        <Link className="navbarLink" to="/explore">
          Explore
        </Link>
        <Link className="navbarLink" to="/chats">
          Chats
        </Link>
        <Link className="navbarLink" to="/home">
          Home
        </Link>
        <Link className="navbarLink" to="/profile">
          <img
            className="App-navbar-logo"
            src={profileIcon}
            alt="Profile Icon"
          />
        </Link>
      </div>
    </div>
  );
}

export default Navigation;
