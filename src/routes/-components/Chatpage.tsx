import apiClient, { type ApiResponse } from "@/api/simpleApi";
import QueryCompLayout from "@/components/layout/QueryCompLayout";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Conversations from "./Conversations";
import ChatInputBar from "./chat-comps/ChatInputBar";
import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { get_user_value } from "@/store/authStore";

export default function ChatPage() {
  const queryClient = useQueryClient();
  const auth = get_user_value();

  const query = useQuery<ApiResponse>({
    queryKey: ["chat"],
    queryFn: async () => {
      let resp = await apiClient.get("/chat/my-conversation");
      return resp.data;
    },
  });

  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!auth?.accessToken) return;

    const socket = io(
      import.meta.env.VITE_BACKEND_URL ||
        "https://needhomes-backend-staging.onrender.com",
      {
        auth: {
          token: auth.accessToken,
        },
        extraHeaders: {
          Authorization: `Bearer ${auth.accessToken}`,
        },
        transports: ["websocket", "polling"],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5,
      },
    );

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("✅ Connected to WebSocket");
    });
    socket.on("connected", (data) => {
      console.log("User data:", data);
    });
    // ✅ DISCONNECT ON UNMOUNT
    return () => {
      console.log("❌ Disconnecting socket...");
      socket.disconnect();
    };
  }, [auth?.accessToken]);

  return (
    <>
      <div className="ring fade rounded-box">
        <div className="p-6 border-b fade">
          <h2 className="text-xl font-bold">Chat</h2>
        </div>
        <div className="">
          <section className="p-4 ">
            <QueryCompLayout query={query}>
              {(data) => {
                const convos = data.data;

                return (
                  <>
                    <Conversations convos={convos} socket={socketRef} />
                    <ChatInputBar convos={convos} socket={socketRef} />
                  </>
                );
              }}
            </QueryCompLayout>
          </section>
        </div>
      </div>
    </>
  );
}
