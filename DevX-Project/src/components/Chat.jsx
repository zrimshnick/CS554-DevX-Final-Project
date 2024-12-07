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
      <span className="Chats-message-sender">
        {senderId === currentUserId ? "You" : senderId}
      </span>
      &nbsp;&nbsp;
      <span className="Chats-message-body">{messageBody}</span>
    </div>
  ));
}
