import React from "react";
import "../App.css";
import "./Chats.css";

export default function Chat({ chat, currentUserId }) {
  console.log(chat);
  console.log(currentUserId);

  return chat.map(({ senderId, messageBody }, index) => (
    <div
      className={`Chats-message ${
        senderId === currentUserId ? "Chats-message-own" : "Chats-message-other"
      }`}
      key={index}
    >
      <div>
        <strong>{senderId === currentUserId ? "You" : senderId}</strong>:{" "}
        <span>{messageBody}</span>
      </div>
    </div>
  ));
}
