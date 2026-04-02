import { useState } from "react";
import { WebSocketContext } from "./WebSocketContext.js";

export default function WebSocketProvider({ children }) {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  const connect = (token) => {
    // ✅ cek koneksi aktif
    if (socket?.readyState === WebSocket.OPEN) return;

    const ws = new WebSocket(`ws://localhost:3000?token=${token}`);

    ws.onopen = () => {
      console.log("✅ Connected");
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("📩 From server:", data);

        // 🔥 HANDLE SEMUA EVENT DARI SERVER
        switch (data.type) {
          case "online_users":
            setOnlineUsers(data.users.map((id) => ({ id })));
            break;

          case "user_online":
            setOnlineUsers((prev) => {
              // cek apakah user sudah ada
              const exists = prev.some((user) => user.id === data.userId);
              if (exists) return prev;

              return [...prev, { id: data.userId }];
            });
            break;

          case "user_offline":
            setOnlineUsers((prev) =>
              prev.filter((user) => user.id !== data.userId)
            );
            break;

          default:
            // message chat atau lainnya
            break;
        }
      } catch (err) {
        console.error("Parse error:", err);
      }
    };

    ws.onclose = () => {
      console.log("❌ Disconnected");
      setSocket(null);
    };

    ws.onerror = (err) => {
      console.error("WebSocket error:", err);
    };

    setSocket(ws);
  };

  const disconnect = () => {
    if (socket) {
      socket.close();
      setSocket(null);
    }
  };

  return (
    <WebSocketContext.Provider
      value={{ socket, connect, disconnect, onlineUsers }}
    >
      {children}
    </WebSocketContext.Provider>
  );
}