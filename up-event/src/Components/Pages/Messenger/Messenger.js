import "./Messenger.css";
import React from 'react'
import Conversation from "../Conversation/Conversation"
import Message from "../Message/Message";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../Context/AuthContext";
import axios from "axios";
import io from "socket.io-client";

export default function Messenger() {
  const [visible, setVisible] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const socket = useRef();
  const { user } = useContext(AuthContext);
  const scrollRef = useRef();

  useEffect(() => {
    socket.current = io("ws://localhost:8900");
    socket.current.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });
  }, []);

  useEffect(() => {
    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]);

  useEffect(() => {
    socket.current.emit("addUser", user._id);
    socket.current.on("getUsers", (users) => {
      setOnlineUsers(
        user.followings.filter((f) => users.some((u) => u.userId === f))
      );
    });
  }, [user]);

  useEffect(() => {
    const getConversations = async () => {
      try {
        console.log(user);
        const res = await axios.get("http://localhost:8800/api/conversations/" + user._id);
        console.log(res);
        setConversations(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getConversations();
  }, [user._id]);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await axios.get("http://localhost:8800/api/messages/" + currentChat?._id);
        console.log(res);
        setMessages(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getMessages();
  }, [currentChat]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const message = {
      sender: user._id,
      text: newMessage,
      conversationId: currentChat._id,
    };

    const receiverId = currentChat.members.find(
      (member) => member !== user._id
    );

    socket.current.emit("sendMessage", {
      senderId: user._id,
      receiverId,
      text: newMessage,
    });

    try {
      const res = await axios.post("http://localhost:8800/api/messages", message);
      setMessages([...messages, res.data]);
      setNewMessage("");
    } catch (err) {
      console.log(err);
    }
  };

//   useEffect(() => {
//     scrollRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

  return (
    <div className="messenger">
      <p id="panel-chat-title">Panel Chat</p>
      {!visible ? (
        <div className="chatMenu">
          <div className="chatMenuWrapper">
            {conversations.map((c) => (
              <div
                onClick={() => {
                  setCurrentChat(c);
                  setVisible(true);
                }}
              style={{"backgroundColor":"rgb(49, 48, 48)"}}>
                <Conversation conversation={c} currentUser={user} />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="chatBox">
          
          <div id="chat-back-button">
            <button id="back-menu-button" onClick={() => setVisible(false)}>Back To Menu</button>
          </div>
          
          <div className="chatBoxWrapper">
            {currentChat ? (
              <>
                <div className="chatBoxTop">
                  {messages.map((m) => (
                    <div ref={scrollRef}>
                      <Message message={m} own={m.sender === user._id} />
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <span className="noConversationText">
                Open a conversation to start a chat.
              </span>
            )}
          </div>
          <div className="chatBoxBottom">
            <input
              className="chatMessageInput"
              placeholder="write something..."
              onChange={(e) => setNewMessage(e.target.value)}
              value={newMessage}
            ></input>

            <button className="chatSubmitButton" onClick={handleSubmit}>
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
