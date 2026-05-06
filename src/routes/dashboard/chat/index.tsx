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

  // Search with debounce
  const [convoSearch, setConvoSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Per-conversation unread counts and last-message preview from socket
  const [unreadCounts, setUnreadCounts] = useState<Map<string, number>>(
    new Map(),
  );
  const [socketMessages, setSocketMessages] = useState<Map<string, Message>>(
    new Map(),
  );
  // Conversations closed via socket — filter these out of the list
  const [closedConvoIds, setClosedConvoIds] = useState<Set<string>>(new Set());

  // Socket creation — join admin rooms immediately on connect
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
      setIsSocketConnected(true);
      const userId = (auth as any).user?.id;
      if (userId) socket.emit("join", { userId });
      socket.emit("joinRoom", "admin-notifications");
    });
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

  // chat:newMessage — update preview, sort order, and unread count
  // chat:conversationClosed — remove from list
  useEffect(() => {
    const sock = socketRef.current;
    if (!sock || !isSocketConnected) return;

    const handleMsg = (message: Message) => {
      setSocketMessages((prev) =>
        new Map(prev).set(message.conversationId, message),
      );
      if (message.conversationId !== convoId && !message.isSystem) {
        setUnreadCounts((prev) => {
          const n = new Map(prev);
          n.set(message.conversationId, (n.get(message.conversationId) ?? 0) + 1);
          return n;
        });
      }
    };

    const handleClosed = ({ conversationId }: { conversationId: string }) => {
      setClosedConvoIds((prev) => new Set([...prev, conversationId]));
    };

    sock.on("chat:newMessage", handleMsg);
    sock.on("chat:conversationClosed", handleClosed);
    return () => {
      sock.off("chat:newMessage", handleMsg);
      sock.off("chat:conversationClosed", handleClosed);
    };
  }, [isSocketConnected, convoId]);

  // When opening a conversation: reset unread optimistically + mark as read on server
  useEffect(() => {
    if (!convoId) return;
    setUnreadCounts((prev) => {
      const n = new Map(prev);
      n.delete(convoId);
      return n;
    });
    apiClient.post(`/chat/conversations/${convoId}/read`).catch(() => {});
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

  const totalUnread = Array.from(unreadCounts.values()).reduce(
    (sum, c) => sum + c,
    0,
  );

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
                {totalUnread > 0 && (
                  <span className="badge badge-error badge-sm">
                    {totalUnread}
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
                  const chats = data.data
                    .filter((c) => !closedConvoIds.has(c.id))
                    .map((c) => {
                      const socketMsg = socketMessages.get(c.id);
                      return {
                        ...c,
                        _sortAt: socketMsg?.createdAt ?? c.lastMessageAt,
                      };
                    })
                    .sort(
                      (a, b) =>
                        new Date(b._sortAt).getTime() -
                        new Date(a._sortAt).getTime(),
                    );

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
                        const unreadCount = unreadCounts.get(chat.id) ?? 0;
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
                                className={`truncate text-sm ${unreadCount > 0 ? "font-semibold text-gray-900" : "text-gray-500"}`}
                              >
                                {lastMessage?.content || "No messages yet"}
                              </p>
                            </div>
                            {unreadCount > 0 && (
                              <span className="badge badge-error badge-xs shrink-0">
                                {unreadCount}
                              </span>
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
