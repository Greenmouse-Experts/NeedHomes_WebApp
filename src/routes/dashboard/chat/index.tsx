import apiClient, { type ApiResponse } from "@/api/simpleApi";
import QueryCompLayout from "@/components/layout/QueryCompLayout";
import ThemeProvider from "@/simpleComps/ThemeProvider";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";
import { useAuth } from "@/store/authStore";
import { SearchIcon, X } from "lucide-react";
import AdminConvos from "./-components/AdminConversations";
import PendingConversations from "./-components/PendingConversations";

export const Route = createFileRoute("/dashboard/chat/")({
  component: RouteComponent,
  validateSearch: (
    search: Record<string, unknown>,
  ): { convoId?: string } | undefined => {
    if (!search.convoId) return;
    return { convoId: search.convoId as string };
  },
});
interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  accountType: string;
}

interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  isRead: boolean;
  isSystem: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

interface Conversation {
  id: string;
  userId: string;
  adminId: string | null;
  status: "PENDING" | string;
  lastMessageAt: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  user: User;
  messages: Message[];
}

function RouteComponent() {
  const { convoId } = Route.useSearch();
  const [auth] = useAuth();
  const socketRef = useRef<Socket | null>(null);
  const [isSocketConnected, setIsSocketConnected] = useState(false);

  // Search state with debounce
  const [convoSearch, setConvoSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Track latest socket message per conversation and unread status
  const [socketMessages, setSocketMessages] = useState<Map<string, Message>>(
    new Map(),
  );
  const [unreadIds, setUnreadIds] = useState<Set<string>>(new Set());

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
    socket.on("connect", () => setIsSocketConnected(true));
    socket.on("disconnect", () => setIsSocketConnected(false));
    return () => {
      socket.disconnect();
      socketRef.current = null;
      setIsSocketConnected(false);
    };
  }, [auth?.accessToken]);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(convoSearch), 300);
    return () => clearTimeout(t);
  }, [convoSearch]);

  // Listen for incoming messages — update last-message preview and unread indicator
  useEffect(() => {
    const sock = socketRef.current;
    if (!sock || !isSocketConnected) return;

    const handleMsg = (message: Message) => {
      setSocketMessages((prev) =>
        new Map(prev).set(message.conversationId, message),
      );
      if (message.conversationId !== convoId && !message.isSystem) {
        setUnreadIds((prev) => new Set([...prev, message.conversationId]));
      }
    };

    sock.on("chat:newMessage", handleMsg);
    return () => {
      sock.off("chat:newMessage", handleMsg);
    };
  }, [isSocketConnected, convoId]);

  // Clear unread when admin opens a conversation
  useEffect(() => {
    if (!convoId) return;
    setUnreadIds((prev) => {
      const next = new Set(prev);
      next.delete(convoId);
      return next;
    });
  }, [convoId]);

  const query = useQuery<ApiResponse<Conversation[]>>({
    queryKey: ["chat-admin", debouncedSearch],
    queryFn: async () => {
      const qs = debouncedSearch
        ? `?search=${encodeURIComponent(debouncedSearch)}`
        : "";
      const resp = await apiClient.get(`/chat/my-admin-conversations${qs}`);
      return resp.data;
    },
  });

  return (
    <>
      <ThemeProvider className="drawer lg:drawer-open">
        <input id="chat-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content md:h-[calc(100dvh-144px)] flex p-0 isolate w-full">
          <AdminConvos
            convoId={convoId}
            socket={socketRef}
            isSocketConnected={isSocketConnected}
          />
        </div>
        <div className="drawer-side md:h-[calc(100dvh-144px)]">
          <div className="w-80 bg-white overflow-y-auto h-full">
            <PendingConversations socket={socketRef} />
            <div className="border-t fade">
              <h2 className="border-b fade p-4 font-bold flex items-center justify-between">
                Conversations
                {unreadIds.size > 0 && (
                  <span className="badge badge-error badge-sm">
                    {unreadIds.size}
                  </span>
                )}
              </h2>

              {/* Search */}
              <div className="px-3 py-2 border-b fade">
                <label className="input input-sm w-full flex items-center gap-2">
                  <SearchIcon className="w-3.5 h-3.5 text-base-content/40 shrink-0" />
                  <input
                    type="text"
                    className="grow text-sm"
                    placeholder="Search conversations..."
                    value={convoSearch}
                    onChange={(e) => setConvoSearch(e.target.value)}
                  />
                  {convoSearch && (
                    <button
                      type="button"
                      onClick={() => setConvoSearch("")}
                      className="text-base-content/40 hover:text-base-content transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </label>
              </div>

              <QueryCompLayout query={query}>
                {(data) => {
                  const chats = data.data;
                  return (
                    <div className="flex flex-col divide-y divide-gray-100">
                      {chats.length === 0 && (
                        <p className="p-4 text-sm text-gray-400 italic">
                          {debouncedSearch
                            ? `No conversations matching "${debouncedSearch}".`
                            : "No conversations yet."}
                        </p>
                      )}
                      {chats.map((chat) => {
                        const socketMsg = socketMessages.get(chat.id);
                        const lastMessage = socketMsg ?? chat.messages[0];
                        const hasUnread = unreadIds.has(chat.id);
                        const firstName = chat?.user?.firstName ?? "Unknown";
                        const lastName = chat?.user?.lastName ?? "Unknown";
                        const initials = `${firstName[0]}${lastName[0]}`;
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
                                  {firstName} {lastName}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {new Date(
                                    socketMsg?.createdAt ?? chat.lastMessageAt,
                                  ).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </span>
                              </div>
                              <p
                                className={`truncate text-sm ${hasUnread ? "font-semibold text-gray-900" : "text-gray-500"}`}
                              >
                                {lastMessage?.content || "No messages yet"}
                              </p>
                            </div>
                            {hasUnread && (
                              <div className="h-2 w-2 rounded-full bg-blue-500 shrink-0" />
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  );
                }}
              </QueryCompLayout>
            </div>
          </div>
        </div>
      </ThemeProvider>
    </>
  );
}
