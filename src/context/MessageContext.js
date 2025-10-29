// contexts/MessageContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import io from "socket.io-client";

const MessageContext = createContext();
export const useMessages = () => useContext(MessageContext);

export const MessageProvider = ({ children }) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const socket = io("http://localhost:7000", { transports: ["websocket"] });

    // Listen for unread message updates from server
    socket.on("unread_messages", (count) => {
      setUnreadCount(count);
    });

    // Listen for new messages
    socket.on("new_message", (msg) => {
      setMessages((prev) => [...prev, msg]);
      setUnreadCount((prev) => prev + 1);
    });

    // On component unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <MessageContext.Provider value={{ unreadCount, messages, setUnreadCount }}>
      {children}
    </MessageContext.Provider>
  );
};
