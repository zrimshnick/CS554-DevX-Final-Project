import React from "react";
import "../App.css";
import "./Chats.css";

export default function Chat({ chat, currentUserId, activePartnerDetails }) {
  console.log(chat);
  console.log(currentUserId);
  console.log(activePartnerDetails);

  return chat.map(({ senderId, messageBody }, index) => (
    <div
      className={`Chats-message ${
        senderId === currentUserId ? "Chats-message-own" : "Chats-message-other"
      }`}
      key={index}
    >
      <span className="Chats-message-sender">
        {senderId === currentUserId ? "You" : activePartnerDetails.firstName}
      </span>
      &nbsp;&nbsp;
      <span className="Chats-message-body">{messageBody}</span>
    </div>
  ));
}
