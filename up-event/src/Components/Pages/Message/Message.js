import "./Message.css";
import React from 'react'
import { format } from "timeago.js";

export default function Message({ message, own }) {
  return (
    <div className={own ? "message-panel own" : "message-panel"}>
      <div className="messageTop">
        <p className="messageText">{message.text}</p>
      </div>
      <div className="messageBottom">{format(message.createdAt)}</div>
    </div>
  );
}
