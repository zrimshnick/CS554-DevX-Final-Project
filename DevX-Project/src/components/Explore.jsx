import React, { useEffect, useRef, useState, useContext } from "react";
import "../App.css";
import "./Explore.css";
import { AuthContext } from "../context/AuthContext";
import { Route, Link, Routes, useNavigate } from "react-router-dom";

function Explore() {
  const { currentUser } = useContext(AuthContext);
  console.log(currentUser);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  const getAllUsers = async (e) => {
    /* get all users they can select from */
    try {
      const response = await fetch(`http://localhost:3000/user`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("Error getting all users from MongoDB", error);
        alert("Error getting all users from MongoDB. Please try again.");
        return;
      }

      let allUsers = await response.json();
      console.log(currentUser.email);
      console.log(allUsers);
      allUsers = allUsers.filter((obj) => obj.email !== currentUser.email);
      setUsers(allUsers);
      console.log(allUsers);

      return allUsers;
    } catch (e) {
      console.error("Error connecting to MongoDB API:", e);
      alert("Could not connect to the server. Please try again later.");
    }
  };

  const handleCreateChat = async (otherUserEmail) => {
    try {
      const currentUserResponse = await fetch(
        `http://localhost:3000/user/${currentUser.email}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!currentUserResponse.ok) {
        throw new Error("Error fetching current user details");
      }

      const currentUserData = await currentUserResponse.json();

      const otherUserResponse = await fetch(
        `http://localhost:3000/user/${otherUserEmail}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!otherUserResponse.ok) {
        throw new Error("Error fetching other user details");
      }

      const otherUserData = await otherUserResponse.json();

      // Create a new chat
      const chatResponse = await fetch(`http://localhost:3000/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user1: currentUserData._id,
          user2: otherUserData._id,
        }),
      });

      if (!chatResponse.ok) {
        throw new Error("Error creating chat");
      }

      // Navigate to the chats route
      navigate("/chats");
    } catch (e) {
      console.error("Error handling chat creation:", e);
      alert("Could not create chat. Please try again.");
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  return (
    <div className="Explore-Container">
      <div className="Explore-header">Explore</div>
      <div className="Explore-subheader">Start a chat:</div>
      <div className="Explore-users">
        {users.map((user) => (
          <button
            key={user.email}
            className="user-button"
            onClick={() => handleCreateChat(user.email)}
          >
            {user.name || user.email}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Explore;
