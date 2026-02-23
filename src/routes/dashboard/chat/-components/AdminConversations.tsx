import apiClient from "@/api/simpleApi";
import QueryCompLayout from "@/components/layout/QueryCompLayout";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import ChatBar from "./ChatBar";
import Messages from "./Messages";
import { get_user_value } from "@/store/authStore";

export default function AdminConvos({ convoId }: { convoId?: string }) {
  const socketRef = useRef<Socket | null>(null);
  const auth = get_user_value();

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
  if (!convoId) {
    return (
      <div className="flex-1  bg-base-100 flex flex-col border-l fade">
        <h2 className="p-3.5 border-b fade text-lg font-bold">
          Live Conversations
        </h2>
        <div className="flex-1 p-4 grid place-items-center text-xl font-bold text-current/60">
          NO CONVERSATIONS STARTED
        </div>
      </div>
    );
  }

  return (
    <section className="h-[calc(100dvh-144px)] flex   p-0 isolate w-full b">
      <section className="flex flex-col flex-1 min-h-0 ">
        <QueryCompLayout
          query={query}
          customLoading={
            <>
              <div className="flex-1 grid place-items-center bg-base-100 border fade">
                <h2>....Loading Conversations</h2>
              </div>
            </>
          }
        >
          {(data) => {
            return (
              <div className="bg-base-100 md:border-l fade flex flex-1 min-h-0 flex-col">
                <h2 className="p-3.5 border-b fade text-lg font-bold">
                  Live Conversations
                </h2>
                <div className="p-4 flex-1 flex min-h-0 flex-col overflow-y-scroll">
                  <Messages socket={socketRef} convoId={convoId} />
                </div>
                <div>
                  <ChatBar socket={socketRef} />
                </div>
              </div>
            );
          }}
        </QueryCompLayout>
      </section>
    </section>
  );
}
