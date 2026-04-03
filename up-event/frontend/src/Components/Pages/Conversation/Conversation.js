import axios from "axios";
import React from 'react'
import config from "../../../config";
import { useEffect, useState } from "react";
import "./Conversation.css";

export default function Conversation({ conversation, currentUser }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const friendId = conversation.members.find((m) => m !== currentUser._id);
    console.log(friendId)
    const getUser = async () => {
      try {
        const res = await axios(`${config.API_SERVER}/users/` + friendId);
        console.log(res)
        setUser(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getUser();
  }, [currentUser, conversation]);

  return (
    <div className="conversation">
      <span className="conversationName">{user?.name}</span>
    </div>
  );
}
