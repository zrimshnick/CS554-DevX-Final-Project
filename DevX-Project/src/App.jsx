import React, { useEffect, useState } from "react";
import "./App.css";
import logoIcon from "./img/logo.png";
import profileIcon from "./img/profileIcon.png";
import { Route, Link, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import Navigation from "./components/Navigation";
import Auth from "./components/Auth";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import Home from "./components/Home";
import Profile from "./components/Profile";
import Chatroom from "./components/Chatroom";
import Explore from "./components/Explore";
import CompleteProfile from "./components/CompleteProfile";

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Navigation></Navigation>
        <div className="App-content-container">
          <Routes>
            <Route path="/" element={<Auth />}></Route>

            <Route path="/home" element={<PrivateRoute />}>
              <Route path="/home" element={<Home />}></Route>
            </Route>
            <Route path="/signin" element={<SignIn />}></Route>
            <Route path="/signup" element={<SignUp />}></Route>

            {/* <Route path="/profile/:id" element={<Profile />}></Route> */}
            <Route path="/profile" element={<PrivateRoute />}>
              <Route path="/profile" element={<Profile />}></Route>
            </Route>

            <Route path="/chats" element={<PrivateRoute />}>
              <Route path="/chats" element={<Chatroom />}></Route>
            </Route>

            <Route path="/explore" element={<PrivateRoute />}>
              <Route path="/explore" element={<Explore />}></Route>
            </Route>

            <Route path="/complete-profile/:id" element={<PrivateRoute />}>
              <Route path="" element={<CompleteProfile />}></Route>
            </Route>
          </Routes>
        </div>
      </div>
    </AuthProvider>
  );
}

export default App;
