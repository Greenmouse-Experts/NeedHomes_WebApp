import apiClient from "@/api/simpleApi";
import QueryCompLayout from "@/components/layout/QueryCompLayout";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import ChatBar from "./ChatBar";
import Messages from "./Messages";

export default function AdminConvos({ convoId }: { convoId?: string }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const query = useQuery({
    queryKey: ["convoId", convoId],
    queryFn: async () => {
      let resp = apiClient.patch(
        `https://needhomes-backend-staging.onrender.com/chat/conversations/${convoId}/join`,
      );
      return (await resp).data;
    },
    enabled: !!convoId,
  });

  useEffect(() => {
    if (!convoId) return;
    const token = localStorage.getItem("authToken");
    const newSocket = io(
      import.meta.env.VITE_BACKEND_URL ||
        "https://needhomes-backend-staging.onrender.com",
      {
        auth: { token },
        extraHeaders: { Authorization: `Bearer ${token}` },
        // transports: ["websocket", "polling"],
      },
    );

    newSocket.emit("chat:joinConversation", {
      conversationId: convoId,
    });

    // newSocket.on("new_message", (message) => {
    //   setMessages((prev) => [...prev, message]);
    // });
    newSocket.on("chat:newMessage", (message) => {
      // This event is received by EVERYONE in the conversation room
      console.log("New message:", message);
      // Add to chat UI
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [convoId]);

  if (!convoId) {
    return <div>No conversation selected</div>;
  }

  return (
    <section className="h-[calc(100dvh-144px)] flex   p-0 isolate w-full b">
      <section className="flex flex-col flex-1 min-h-0 ">
        <QueryCompLayout query={query}>
          {(data) => {
            return (
              <div className="bg-base-100 md:border-l fade flex flex-1 min-h-0 flex-col">
                <h2 className="p-3.5 border-b fade text-lg font-bold">
                  Live Conversations
                </h2>
                <div className="p-4 flex-1 flex min-h-0 flex-col overflow-y-scroll">
                  <Messages socket={socket} convoId={convoId} />
                </div>
                <div>
                  <ChatBar socket={socket} />
                </div>
              </div>
            );
          }}
        </QueryCompLayout>
      </section>
    </section>
  );
}
