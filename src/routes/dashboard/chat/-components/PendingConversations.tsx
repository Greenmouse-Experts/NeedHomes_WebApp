import apiClient from "@/api/simpleApi";
import { useEffect, useState, type RefObject } from "react";
import { Link } from "@tanstack/react-router";
import type { Socket } from "socket.io-client";
import { SearchIcon, X } from "lucide-react";

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
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search input 300ms
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Fetch whenever debounced search changes
  useEffect(() => {
    setLoading(true);
    const query = debouncedSearch
      ? `?search=${encodeURIComponent(debouncedSearch)}`
      : "";
    apiClient
      .get(`/chat/pending${query}`)
      .then((resp) => setChats(resp.data?.data ?? []))
      .finally(() => setLoading(false));
  }, [debouncedSearch]);

  // Real-time: skip socket updates while a search is active to avoid polluting filtered results
  useEffect(() => {
    const sock = socket.current;
    if (!sock) return;

    const handleNew = (convo: PendingConvo) => {
      if (debouncedSearch) return;
      setChats((prev) => {
        if (prev.some((c) => c.id === convo.id)) return prev;
        return [convo, ...prev];
      });
    };

    sock.on("chat:newConversation", handleNew);
    return () => {
      sock.off("chat:newConversation", handleNew);
    };
  }, [socket.current, debouncedSearch]);

  return (
    <div>
      <h2 className="p-4 border-b fade font-bold flex items-center justify-between">
        Pending Conversations
        <span className="badge badge-primary badge-sm">{chats.length}</span>
      </h2>

      {/* Search bar */}
      <div className="px-3 py-2 border-b fade">
        <label className="input input-sm w-full flex items-center gap-2">
          <SearchIcon className="w-3.5 h-3.5 text-base-content/40 shrink-0" />
          <input
            type="text"
            className="grow text-sm"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="text-base-content/40 hover:text-base-content transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </label>
      </div>

      {loading ? (
        <div className="p-4 flex items-center gap-2 text-sm text-gray-400">
          <span className="loading loading-spinner loading-xs" /> Loading...
        </div>
      ) : (
        <div className="flex flex-col divide-y divide-gray-100">
          {chats.length === 0 && (
            <p className="p-4 text-sm text-gray-400 italic">
              {debouncedSearch
                ? `No conversations matching "${debouncedSearch}".`
                : "No pending conversations."}
            </p>
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
      )}
    </div>
  );
}
