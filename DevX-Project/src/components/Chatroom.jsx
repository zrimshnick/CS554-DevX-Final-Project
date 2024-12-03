import React, { useEffect, useRef, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import io from "socket.io-client";
import "../App.css";
import "./Chats.css";
import { Route, Link, Routes } from "react-router-dom";
import Chat from "./Chat";

function Chatroom() {
  const { currentUser } = useContext(AuthContext);

  const [state, setState] = useState({
    message: "",
    name: currentUser.displayName,
  });
  const [chat, setChat] = useState([]);
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

  const userjoin = (name) => {
    console.log("Going to send the user join event to the server");
    socketRef.current.emit("user_join", name);
  };

  const onMessageSubmit = (e) => {
    let msgEle = document.getElementById("message");
    console.log([msgEle.name], msgEle.value);
    setState({ ...state, [msgEle.name]: msgEle.value });
    console.log("going to send the message event to the server");

    socketRef.current.emit("message", {
      name: state.name,
      message: msgEle.value,
    });
    e.preventDefault();
    setState({ message: "", name: state.name });
    msgEle.value = "";
    msgEle.focus();
  };

  const chatsArray = [
    { id: 1, name: "Zack Rimshnick" },
    { id: 2, name: "Jalen Brunson" },
    { id: 3, name: "Aaron Judge" },
  ];

  return (
    <div className="Chats-container">
      <div className="Chats-sidebar-container">
        <div className="Chats-sidebar-header">Chats</div>
        <div className="Chats-sidebar-links">
          {chatsArray.map((chat) => (
            <div key={chat.id} className="Chats-sidebar-link">
              {chat.name}
            </div>
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

      {/* {!state.name && (
        <form
          className="usernameform"
          onSubmit={(e) => {
            console.log(document.getElementById("username_input").value);
            e.preventDefault();
            setState({ name: document.getElementById("username_input").value });
          }}
        >
          <div className="form-group">
            <label>
              User Name:
              <br />
              <input id="username_input" />
            </label>
          </div>

          <button type="submit">Click to join</button>
        </form>
      )} */}
    </div>
  );
}

export default Chatroom;
