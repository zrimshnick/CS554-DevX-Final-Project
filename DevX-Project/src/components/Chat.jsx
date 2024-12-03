import React from "react";
import "../App.css";
import "./Chats.css";

export default function Chat({ chat }) {
  return chat.map(({ name, message }, index) => (
    <div className="Chats-message" key={index}>
      <div>
        {name}: <span>{message}</span>
      </div>
    </div>
  ));
}
