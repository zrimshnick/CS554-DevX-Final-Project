import React, { useEffect, useRef, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import io from "socket.io-client";
import "../App.css";
import "./Chats.css";
import { Route, Link, Routes } from "react-router-dom";
import Chat from "./Chat";

function Chatroom() {
  const { currentUser } = useContext(AuthContext);
  /* console.log(currentUser); */

  const [state, setState] = useState({
    message: "",
    name: currentUser.displayName,
  });
  const [chat, setChat] = useState([]);
  const [openChats, setOpenChats] = useState([]);
  const [chatRoomId, setChatRoomId] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [activePartnerId, setActivePartnerId] = useState(null);
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
    socketRef.current.on("message", (newMessage) => {
      console.log("New message received:", newMessage);
      setChat((prevChat) => [...prevChat, newMessage]);
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
      console.log("PARTNER DATA HERERERERERERERER");
      console.log(partnerData);
      console.log("...............................");
      const partnerEmail = partnerData.email;

      setPartnersDetails((prevState) => ({
        ...prevState,
        /* [partnerId]: partnerEmail, */
        [partnerId]: partnerData,
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
      const messages = data.messages || [];
      console.log(messages);

      setChatRoomId(chatRoomId);
      setChat(messages);
      console.log("CHAT HERE:");
      console.log(chat);

      console.log(`joined room: ${chatRoomId}`);
      socketRef.current.emit("join_room", chatRoomId);

      setActivePartnerId(partnerId);
    } catch (error) {
      console.error("Error joining room:", error);
      alert("Could not join the chat room. Please try again.");
    }
  };

  useEffect(() => {
    if (chatRoomId) {
      socketRef.current.emit("join_room", chatRoomId);
      console.log(`Joined room ${chatRoomId}`);
    }
  }, [chatRoomId]);

  const onMessageSubmit = async (e) => {
    e.preventDefault();
    let msgEle = document.getElementById("message");

    if (!chatRoomId || !msgEle.value.trim()) return;

    console.log([msgEle.name], msgEle.value);

    const newMessage = {
      chatRoomId: chatRoomId,
      senderId: currentUserId,
      messageBody: msgEle.value,
    };

    console.log(`emitting message client side: ${newMessage}`);
    socketRef.current.emit("message", newMessage);

    /* setChat((prevChat) => [...prevChat, newMessage]); */

    console.log("Going to send the message event to the server");

    /* MONGO CALL */
    try {
      const response = await fetch(
        `http://localhost:3000/chat/${chatRoomId}/add-messages`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newMessage),
        }
      );

      if (!response.ok) {
        throw new Error("Error saving message to database");
      }
    } catch (e) {
      console.error("Error saving message to mongodb:", e);
      alert("Could save the message. try again");
    }

    msgEle.value = "";
    msgEle.focus();
  };

  useEffect(() => {
    socketRef.current.on("message", (newMessage) => {
      console.log("New message received:", newMessage);
      setChat((prevChat) => [...prevChat, newMessage]);
    });

    return () => {
      socketRef.current.off("message");
    };
  }, []);

  console.log("PARTNER DETAILS-----------:");
  console.log(partnersDetails);
  console.log("-----------------------");

  return (
    <div className="Chats-container">
      <div className="Chats-sidebar-container">
        <div className="Chats-sidebar-header">Chats</div>
        <div className="Chats-sidebar-links">
          {openChats.map((partnerId) => (
            <button
              key={partnerId}
              className="Chats-sidebar-link"
              onClick={() => joinRoom(partnerId)}
              style={{
                backgroundColor: activePartnerId === partnerId ? "#af8f6f" : "",
              }}
            >
              {partnersDetails[partnerId] === undefined
                ? "Loading..."
                : `${partnersDetails[partnerId].firstName} ${partnersDetails[partnerId].lastName}`}
            </button>
          ))}
        </div>
      </div>
      <div className="Chats-console-container">
        <div className="Chats-console-header">
          <div>
            {partnersDetails[activePartnerId] === undefined
              ? "Start Connecting!"
              : `Chat with ${partnersDetails[activePartnerId].firstName}`}
          </div>
        </div>
        <div className="Chats-console-messages">
          <Chat
            chat={chat}
            currentUserId={currentUserId}
            activePartnerDetails={partnersDetails[activePartnerId]}
          />
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
