import { useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { getToken } from "../api";
import { SocketContext } from "./socketContext";

export function SocketProvider({ children }) {
  const socketRef = useRef(null);
  const connectingRef = useRef(false);

  useEffect(() => {
    
    if (socketRef.current?.connected || connectingRef.current) {
      return;
    }

    connectingRef.current = true;
    const URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
    const token = getToken();

    const socket = io(URL, {
      auth: token ? { token } : undefined,
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    socket.on("connect", () => {
      console.log("[SocketProvider] Connected:", socket.id);
      connectingRef.current = false;
    });

    socket.on("disconnect", () => {
      console.log("[SocketProvider] Disconnected");
    });

    socketRef.current = socket;

    return () => {
      
      
    };
  }, []);

  const emit = (event, payload) => {
    socketRef.current?.emit(event, payload);
  };

  const on = (event, handler) => {
    const socket = socketRef.current;
    if (!socket) return () => {};

    socket.on(event, handler);
    return () => {
      socket.off(event, handler);
    };
  };

  const joinRoom = (showId) => {
    if (!showId) return;
    emit("join_show", { showId });
  };

  const leaveRoom = (showId) => {
    if (!showId) return;
    emit("leave_show", { showId });
  };

  const value = {
    socket: socketRef.current,
    emit,
    on,
    joinRoom,
    leaveRoom,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
}
