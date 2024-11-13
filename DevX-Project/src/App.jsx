import { useState } from "react";
import "./App.css";
import logoIcon from "./img/logo.png";
import profileIcon from "./img/profileIcon.png";
import { Route, Link, Routes } from "react-router-dom";
import Home from "./components/Home";
import Profile from "./components/Profile";
import Chats from "./components/Chats";
import Explore from "./components/Explore";

function App() {
  return (
    <div className="App">
      <div className="App-navbar-container">
        <Link className="App-navbar-title" to="/">
          <img
            className="App-navbar-logo"
            src={logoIcon}
            alt={`Coffee Connections Logo`}
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
          <Link className="navbarLink" to="/profile">
            <img
              className="App-navbar-logo"
              src={profileIcon}
              alt={`Profile Icon`}
            />
          </Link>
        </div>
      </div>
      <div className="App-content-container">
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/profile" element={<Profile />}></Route>
          <Route path="/chats" element={<Chats />}></Route>
          <Route path="/explore" element={<Explore />}></Route>
        </Routes>
      </div>
    </div>
  );
}

export default App;
