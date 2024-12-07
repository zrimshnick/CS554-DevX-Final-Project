import React, { useEffect, useRef, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import io from "socket.io-client";
import "../App.css";
import "./Chats.css";
import { Route, Link, Routes } from "react-router-dom";
import Chat from "./Chat";

function Chatroom() {
  const { currentUser } = useContext(AuthContext);
  console.log(currentUser);

  const [state, setState] = useState({
    message: "",
    name: currentUser.displayName,
  });
  const [chat, setChat] = useState([]);
  const [openChats, setOpenChats] = useState([]);
  const [chatRoomId, setChatRoomId] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [partnersDetails, setPartnersDetails] = useState({});
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chat]);

  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = io("http://localhost:4000");
    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  useEffect(() => {
    socketRef.current.on("message", ({ name, message }) => {
      console.log("The server has broadcast message data to all clients");
      setChat([...chat, { name, message }]);
    });
    socketRef.current.on("user_join", function (data) {
      console.log("The server has broadcast user join data to all clients");
      setChat([
        ...chat,
        { name: "ChatBot", message: `${data} has joined the chat` },
      ]);
    });

    return () => {
      socketRef.current.off("message");
      socketRef.current.off("user_join");
    };
  }, [chat]);

  const fetchOpenChats = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/user/${currentUser.email}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) {
        throw new Error("Error fetching current user data");
      }

      const userData = await response.json();
      const openChatPartners = userData.openChatPartners;
      setOpenChats(openChatPartners);
    } catch (error) {
      console.error("Error fetching open chats:", error);
      alert("Could not fetch open chats. Please try again.");
    }
  };

  useEffect(() => {
    fetchOpenChats();
  }, []);

  const userjoin = (name) => {
    console.log("Going to send the user join event to the server");
    socketRef.current.emit("user_join", name, currentUserId);
  };

  const getCurrentUserId = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/user/${currentUser.email}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) {
        throw new Error("Error fetching partner data");
      }

      const currentUserMongoData = await response.json();
      const currentUserId = currentUserMongoData._id;

      setCurrentUserId(currentUserId);

      console.log(currentUserId);
    } catch (error) {
      console.error("Error getting user id:", error);
      alert("Could not fetch user id. Please try again.");
    }
  };

  const getChatPartnerDetails = async (partnerId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/user/id/${partnerId}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) {
        throw new Error("Error fetching partner data");
      }

      const partnerData = await response.json();
      const partnerEmail = partnerData.email;

      setPartnersDetails((prevState) => ({
        ...prevState,
        [partnerId]: partnerEmail,
      }));

      console.log(partnerEmail);
    } catch (error) {
      console.error("Error getting partner emails:", error);
      alert("Could not fetch partner emails. Please try again.");
    }
  };

  useEffect(() => {
    // Fetch details for all open chat partners
    openChats.forEach((partnerId) => {
      getChatPartnerDetails(partnerId);
    });
  }, [openChats]);

  useEffect(() => {
    getCurrentUserId();
  });

  const joinRoom = async (partnerId) => {
    if (!partnersDetails[partnerId]) {
      console.error("Partner details not available yet");
      return;
    }

    try {
      // Make an API call to get the existing chat room ID
      console.log(`currentUserId: `, currentUserId);
      console.log(`partnerId: `, partnerId);
      const response = await fetch(
        `http://localhost:3000/chat/${currentUserId}/${partnerId}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) {
        throw new Error("Error fetching chat room ID");
      }

      const data = await response.json();
      console.log(data);

      const chatRoomId = data._id;

      setChatRoomId(chatRoomId);

      // Join the room using the chatRoomId retrieved from the server
      socketRef.current.emit("join_room", chatRoomId);
    } catch (error) {
      console.error("Error joining room:", error);
      alert("Could not join the chat room. Please try again.");
    }
  };

  /* const onMessageSubmit = (e) => {
    let msgEle = document.getElementById("message");
    console.log([msgEle.name], msgEle.value);
    setState({ ...state, [msgEle.name]: msgEle.value });
    console.log("going to send the message event to the server");

    const roomName = [currentUser.email, state.name].sort().join("-");
    socketRef.current.emit("message", {
      name: state.name,
      message: msgEle.value,
      roomName,
    });
    e.preventDefault();
    setState({ message: "", name: state.name });
    msgEle.value = "";
    msgEle.focus();
  }; */
  const onMessageSubmit = (e) => {
    e.preventDefault();
    let msgEle = document.getElementById("message");
    console.log([msgEle.name], msgEle.value);

    setState({ ...state, [msgEle.name]: msgEle.value });

    console.log("Going to send the message event to the server");

    if (chatRoomId) {
      socketRef.current.emit("message", {
        chatRoomId: chatRoomId,
        senderId: currentUserId,
        messageBody: msgEle.value,
      });
    }

    setState({ message: "", name: state.name });
    msgEle.value = "";
    msgEle.focus();
  };

  return (
    <div className="Chats-container">
      <div className="Chats-sidebar-container">
        <div className="Chats-sidebar-header">Chats</div>
        <div className="Chats-sidebar-links">
          {openChats.map((partnerId) => (
            <button onClick={() => joinRoom(partnerId)}>
              {partnersDetails[partnerId] || "Loading..."}
            </button>
          ))}
        </div>
      </div>
      <div className="Chats-console-container">
        <div className="Chats-console-header">
          <div>Chat with Name</div>
        </div>
        <div className="Chats-console-messages">
          <Chat chat={chat} />
          <div ref={messagesEndRef} />
        </div>
        <form className="Chats-console-form" onSubmit={onMessageSubmit}>
          <input
            name="message"
            id="message"
            variant="outlined"
            label="Message"
            autoFocus
            autoComplete="off"
          />
          <button className="Chats-console-send-button">Send</button>
        </form>
      </div>
    </div>
  );
}

export default Chatroom;
