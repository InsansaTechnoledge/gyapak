// src/hooks/useNotifications.js
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";

const socket = io(import.meta.env.VITE_API_BASE);

export const useNotifications = (sourceCode) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!sourceCode) return;

    (async () => {
      const res = await axios.get(
        `http:localhost://3000/api/notifications`,
        { params: { sourceCode, limit: 50 } }
      );
      setNotifications(res.data.data || []);
    })();

    socket.emit("subscribe-source", sourceCode);

    const handler = (newDocs) => {
      setNotifications((prev) => [...newDocs, ...prev]);
    };

    socket.on("new-notifications", handler);

    return () => {
      socket.off("new-notifications", handler);
    };
  }, [sourceCode]);

  return notifications;
};
