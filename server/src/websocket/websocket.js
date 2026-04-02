import { WebSocketServer } from "ws";
import Jwt from "@hapi/jwt";

const connectedUsers = new Map();

export const initWebSocket = (server, messageService, conversationService) => {
  const wss = new WebSocketServer({
    server: server.listener,
  });

  const broadcast = (data) => {
    connectedUsers.forEach((client) => {
      if (client.readyState === 1) {
        try {
          client.send(JSON.stringify(data));
        } catch (err) {
          console.error("Broadcast send error:", err);
        }
      }
    });
  };

  wss.on("connection", (ws, request) => {
    let userId = null;

    try {
      const url = new URL(request.url, "http://localhost");
      const token = url.searchParams.get("token");

      if (!token) {
        ws.close();
        return;
      }

      // decode token
      const getDecoded = Jwt.token.decode(token);

      if (!getDecoded || !getDecoded.decoded?.payload?.id) {
        ws.close();
        return;
      }

      userId = getDecoded.decoded.payload.id;

      // 🔥 simpan user yang sedang connect
      connectedUsers.set(userId, ws);

      // kirim daftar user yang sedang online ke user ini
      ws.send(
        JSON.stringify({
          type: "online_users",
          users: Array.from(connectedUsers.keys()),
        })
      );

      // broadcast bahwa user ini online
      broadcast({
        type: "user_online",
        userId
      });

      console.log(`User ${userId} connected`);
      console.log("Connected users:", connectedUsers.size);

      ws.on("message", async (message) => {
        try {
          const data = JSON.parse(message);

          const { conversationId, receiveId, text } = data;

          if (!receiveId || !text) {
            return;
          }

          let isExistConversationId = conversationId;
          let getNewListContactForDoctorLogin = [];

          if (!isExistConversationId) {
            isExistConversationId = await conversationService.saveConversation(userId, receiveId);
            getNewListContactForDoctorLogin = await conversationService.getListContactFromHistoryConversation(receiveId, 'user');
          }

          const savedMessage = await messageService.saveMessage(
            isExistConversationId,
            userId,
            text
          );

          const payload = {
            type: "chat_message",
            message: savedMessage,
          };

          const payloadContact = {
            type: "new_contact",
            contact: getNewListContactForDoctorLogin
          };

          const payloadUpdateConversationId = {
            type: "update_conversation_id",
            updateConversationId: isExistConversationId
          };

          // cek apakah receiver online
          const receiverSocket = connectedUsers.get(receiveId);

          if (receiverSocket && receiverSocket.readyState === 1) {
            if (getNewListContactForDoctorLogin.length > 0) {
              receiverSocket.send(JSON.stringify(payloadContact));
            }
            receiverSocket.send(JSON.stringify(payload));
          }

          if (ws.readyState === 1) {
            if (getNewListContactForDoctorLogin.length > 0) {
              ws.send(JSON.stringify(payloadContact));
            }
            if (!conversationId) {
              ws.send(JSON.stringify(payloadUpdateConversationId));
            }
            ws.send(JSON.stringify(payload));
          }

        } catch (err) {
          console.error("Message handling error:", err);
        }
      });

      ws.on("close", () => {
        // pastikan socket yang sama yang dihapus
        if (userId && connectedUsers.get(userId) === ws) {
          connectedUsers.delete(userId);
        }

        console.log(`User ${userId} disconnected`);
        console.log("Connected users:", connectedUsers.size);

        broadcast({
          type: "user_offline",
          userId,
        });
      });

      ws.on("error", (err) => {
        console.error("WebSocket connection error:", err);
      });

    } catch (err) {
      console.error("WebSocket error:", err);
      ws.close();
    }
  });
};