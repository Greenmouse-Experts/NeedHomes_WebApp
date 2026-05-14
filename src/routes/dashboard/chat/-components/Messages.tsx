import apiClient, { type ApiResponse } from "@/api/simpleApi";
import QueryCompLayout from "@/components/layout/QueryCompLayout";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, type RefObject } from "react";
import type { Socket } from "socket.io-client";
interface Sender {
  id: string;
  firstName: string;
  lastName: string;
  profilePicture?: string | null;
}

function isImageUrl(content: string): boolean {
  return /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i.test(content);
}

function groupByDate(messages: Message[]) {
  const groups: { dateKey: string; label: string; messages: Message[] }[] = [];
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  for (const msg of messages) {
    const d = new Date(msg.createdAt);
    const dateKey = d.toDateString();
    const last = groups[groups.length - 1];
    if (last && last.dateKey === dateKey) {
      last.messages.push(msg);
    } else {
      let label: string;
      if (dateKey === today.toDateString()) label = "Today";
      else if (dateKey === yesterday.toDateString()) label = "Yesterday";
      else
        label = d.toLocaleDateString("en-NG", {
          day: "numeric",
          month: "long",
          year: "numeric",
        });
      groups.push({ dateKey, label, messages: [msg] });
    }
  }
  return groups;
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
  sender: Sender;
}

interface Conversation {
  id: string;
  userId: string;
  adminId: string | null;
  status: string;
  lastMessageAt: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  messages: Message[];
}

export default function Messages({
  convoId,
  socket,
}: {
  convoId: string;
  socket: RefObject<Socket>;
}) {
  const queryClient = useQueryClient();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const query = useQuery<ApiResponse<Conversation>>({
    queryKey: ["chats", convoId],
    queryFn: async () => {
      let resp = await apiClient.get("chat/conversations/" + convoId);
      return resp.data;
    },
  });
  useEffect(() => {
    const currentSocket = socket.current;
    if (!currentSocket) return;

    const handleMessage = (message: Message) => {
      if (message.conversationId !== convoId) return;
      queryClient.setQueryData<ApiResponse<Conversation>>(
        ["chats", convoId],
        (oldData) => {
          if (!oldData) return oldData;
          const exists = oldData.data.messages.some((m) => m.id === message.id);
          if (exists) return oldData;
          return {
            ...oldData,
            data: { ...oldData.data, messages: [...oldData.data.messages, message] },
          };
        },
      );
    };

    currentSocket.on("chat:newMessage", handleMessage);
    return () => {
      currentSocket.off("chat:newMessage", handleMessage);
    };
  }, [convoId, socket, queryClient]);

  const messageCount = query.data?.data?.messages?.length;
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messageCount]);

  return (
    <QueryCompLayout query={query}>
      {(data) => {
        const messages = data.data.messages;
        return (
          <>
            {groupByDate(messages).map((group) => (
              <div key={group.dateKey} className="flex flex-col gap-2">
                {/* Sticky floating date label */}
                <div className="sticky top-0 z-10 flex justify-center py-1 pointer-events-none">
                  <span className="bg-gray-100/90 backdrop-blur-sm text-gray-600 text-xs font-medium px-3 py-1 rounded-full shadow-sm">
                    {group.label}
                  </span>
                </div>

                {group.messages.map((message) => {
                  const isAdmin =
                    message.isSystem || message.sender.firstName === "Admin";
                  return (
                    <div
                      key={message.id}
                      className={`chat ${isAdmin ? "chat-end" : "chat-start"}`}
                    >
                      <div className="chat-image avatar placeholder ring fade rounded-full grid place-items-center p-3 bg-primary text-primary-content">
                        {isAdmin ? (
                          <span className="text-sm">AD</span>
                        ) : (
                          <span className="text-sm">
                            {message.sender?.firstName?.[0] || "?"}
                            {message.sender?.lastName?.[0] || ""}
                          </span>
                        )}
                      </div>
                      <div className="chat-header">
                        {isAdmin ? (
                          <>Admin</>
                        ) : (
                          <>
                            {message.sender?.firstName}{" "}
                            {message.sender?.lastName}
                          </>
                        )}
                        <time className="text-xs opacity-50 ml-2">
                          {new Date(message.createdAt).toLocaleTimeString()}
                        </time>
                      </div>
                      <div
                        className={`chat-bubble ${isAdmin ? "chat-bubble-info" : ""} ${isImageUrl(message.content) ? "!p-1 !bg-transparent !shadow-none" : ""}`}
                      >
                        {isImageUrl(message.content) ? (
                          <a
                            href={message.content}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <img
                              src={message.content}
                              alt="shared image"
                              className="max-w-[240px] max-h-[240px] rounded-lg object-cover cursor-zoom-in"
                            />
                          </a>
                        ) : (
                          message.content
                        )}
                      </div>
                      <div className="chat-footer opacity-50">
                        {message.isRead ? "Read" : "Unread"}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </>
        );
      }}
    </QueryCompLayout>
  );
}
