import apiClient, { type ApiResponse } from "@/api/simpleApi";
import QueryCompLayout from "@/components/layout/QueryCompLayout";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Conversations from "./Conversations";
import ChatInputBar from "./chat-comps/ChatInputBar";
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { get_user_value } from "@/store/authStore";
import { toast } from "sonner";

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
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [isClosed, setIsClosed] = useState(false);

  useEffect(() => {
    if (query.data?.data?.status === "CLOSED") {
      setIsClosed(true);
    } else {
      setIsClosed(false);
    }
  }, [query.data?.data?.status]);

  useEffect(() => {
    if (!auth?.accessToken) return;

    const socket = io(
      import.meta.env.VITE_BACKEND_URL ||
        "https://needhomes-backend-staging.onrender.com",
      {
        auth: { token: auth.accessToken },
        extraHeaders: { Authorization: `Bearer ${auth.accessToken}` },
        transports: ["websocket", "polling"],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5,
      },
    );

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("✅ Connected to WebSocket");
      setIsSocketConnected(true);
    });

    socket.on("disconnect", () => {
      setIsSocketConnected(false);
    });

    socket.on("connected", (data) => {
      console.log("User data:", data);
    });

    socket.on("chat:adminJoined", () => {
      toast.success("An admin has joined the chat");
      query.refetch();
    });

    socket.on("chat:conversationClosed", () => {
      toast.info("This conversation has been closed");
      setIsClosed(true);
      query.refetch();
    });

    socket.on("chat:error", (error: { message: string }) => {
      console.log(error);
      toast.error(error?.message || "Chat error occurred");
    });

    return () => {
      console.log("❌ Disconnecting socket...");
      socket.disconnect();
    };
  }, [auth?.accessToken]);

  useEffect(() => {
    const id = query.data?.data?.id;
    if (id) {
      socketRef.current?.emit("chat:createConversation", {
        conversationId: id,
      });
    }
  }, [query.data]);

  return (
    <section className="h-[calc(100dvh-124px)] max-h-[calc(100dvh-124px)] flex isolate w-full">
      <div className="ring fade rounded-box flex flex-col flex-1 isolate">
        <div className="p-6 border-b fade max-h-20 sticky top-0 z-10 bg-base-100">
          <h2 className="text-xl font-bold">Chat</h2>
        </div>
        <section className="flex-1 flex flex-col min-h-0">
          <QueryCompLayout query={query}>
            {(data) => {
              const convos = data.data;
              return (
                <>
                  <Conversations
                    query={query}
                    convos={convos}
                    socket={socketRef}
                    isSocketConnected={isSocketConnected}
                  />
                  <ChatInputBar
                    convos={convos}
                    socket={socketRef}
                    isClosed={isClosed}
                  />
                </>
              );
            }}
          </QueryCompLayout>
        </section>
      </div>
    </section>
  );
}
