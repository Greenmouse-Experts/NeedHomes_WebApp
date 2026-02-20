import apiClient from "@/api/simpleApi";
import QueryCompLayout from "@/components/layout/QueryCompLayout";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

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

    newSocket.on("connect", () => {
      console.log("✅ Connected to WebSocket");
      newSocket.emit("join_room", convoId);
    });

    newSocket.on("new_message", (message) => {
      setMessages((prev) => [...prev, message]);
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
    <section className="bg-base-100 ">
      <QueryCompLayout query={query}>
        {(data) => {
          return (
            <div className=" ">
              <h2 className="p-4 border-b fade text-lg font-bold">
                Live Conversations
              </h2>
              <pre>{JSON.stringify(data, null, 2)}</pre>
              <div className="mt-4">
                <h3 className="font-bold">Live Messages:</h3>
                {messages.map((msg, i) => (
                  <div key={i} className="p-2 border-b">
                    {msg.content || JSON.stringify(msg)}
                  </div>
                ))}
              </div>
            </div>
          );
        }}
      </QueryCompLayout>
    </section>
  );
}
