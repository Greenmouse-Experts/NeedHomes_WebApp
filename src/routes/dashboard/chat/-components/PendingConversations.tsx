import apiClient from "@/api/simpleApi";
import { useEffect, useRef, useState, type RefObject } from "react";
import { Link } from "@tanstack/react-router";
import type { Socket } from "socket.io-client";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  accountType: string;
  companyName?: string | null;
}

interface PendingConvo {
  id: string;
  userId: string;
  status: string;
  lastMessageAt: string;
  createdAt: string;
  user: User;
  messages: { id: string; content: string; createdAt: string }[];
}

export default function PendingConversations({
  socket,
}: {
  socket: RefObject<Socket | null>;
}) {
  const [chats, setChats] = useState<PendingConvo[]>([]);
  const [loading, setLoading] = useState(true);

  // Initial REST fetch
  useEffect(() => {
    apiClient
      .get("/chat/pending")
      .then((resp) => setChats(resp.data?.data ?? []))
      .finally(() => setLoading(false));
  }, []);

  // Real-time: new pending conversations
  useEffect(() => {
    const sock = socket.current;
    if (!sock) return;

    const handleNew = (convo: PendingConvo) => {
      setChats((prev) => {
        if (prev.some((c) => c.id === convo.id)) return prev;
        return [convo, ...prev];
      });
    };

    sock.on("chat:newConversation", handleNew);
    return () => {
      sock.off("chat:newConversation", handleNew);
    };
  }, [socket.current]);

  if (loading) {
    return (
      <div className="p-4 flex items-center gap-2 text-sm text-gray-400">
        <span className="loading loading-spinner loading-xs" /> Loading...
      </div>
    );
  }

  return (
    <div>
      <h2 className="p-4 border-b fade font-bold flex items-center justify-between">
        Pending Conversation
        <span className="badge badge-primary badge-sm">{chats.length}</span>
      </h2>
      <div className="flex flex-col divide-y divide-gray-100">
        {chats.length === 0 && (
          <p className="p-4 text-sm text-gray-400 italic">No pending conversations.</p>
        )}
        {chats.map((chat) => {
          const lastMessage = chat.messages[0];
          const firstName = chat?.user?.firstName ?? "?";
          const lastName = chat?.user?.lastName ?? "";
          const initials = `${firstName[0]}${lastName[0] ?? ""}`;
          return (
            <Link
              key={chat.id}
              to="/dashboard/chat"
              search={{ convoId: chat.id }}
              className="flex items-center gap-3 p-4 text-left transition-colors hover:bg-gray-50 active:bg-gray-100"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-600">
                {initials}
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="truncate font-medium text-gray-900">
                    {firstName} {lastName} {chat.user?.companyName}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(chat.lastMessageAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <p className="truncate text-sm text-gray-500">
                  {lastMessage?.content || "No messages yet"}
                </p>
              </div>
              {chat.status === "PENDING" && (
                <div className="h-2 w-2 rounded-full bg-blue-500 shrink-0" />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
