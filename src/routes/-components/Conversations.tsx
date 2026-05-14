import apiClient from "@/api/simpleApi";
import { extract_message } from "@/helpers/apihelpers";
import { useAuth } from "@/store/authStore";
import { useMutation, type QueryObserverResult } from "@tanstack/react-query";
import { useEffect, useRef, useState, type RefObject } from "react";
import type { Socket } from "socket.io-client";
import { toast } from "sonner";

interface Sender {
  id: string;
  firstName: string;
  lastName: string;
  profilePicture?: string | null;
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

function Avatar({
  isSystem,
  sender,
  isOwn,
  currentUserPicture,
}: {
  isSystem: boolean;
  sender: Sender;
  isOwn: boolean;
  currentUserPicture?: string | null;
}) {
  const picUrl = isOwn ? currentUserPicture : sender?.profilePicture;

  if (isSystem) {
    return (
      <div className="chat-image avatar">
        <div className="w-10 rounded-full ring ring-base-300 overflow-hidden bg-white flex items-center justify-center">
          <img
            src="/favicon.ico"
            alt="NeedHomes"
            className="w-full rounded-full h-full object-contain p-1"
          />
        </div>
      </div>
    );
  }

  if (picUrl) {
    return (
      <div className="chat-image avatar">
        <div className="w-10 rounded-full ring ring-base-300 overflow-hidden">
          <img
            src={picUrl}
            alt="avatar"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="chat-image avatar placeholder">
      <div className="ring fade rounded-full w-10 grid place-items-center bg-primary text-primary-content">
        <span className="text-sm">
          {sender?.firstName?.[0] || "?"}
          {sender?.lastName?.[0] || ""}
        </span>
      </div>
    </div>
  );
}

export default function Conversations({
  convos,
  query,
  socket,
  isSocketConnected,
}: {
  convos: Conversation | null;
  query: QueryObserverResult;
  socket: RefObject<Socket>;
  isSocketConnected: boolean;
}) {
  const [auth] = useAuth();
  const [messages, setMessages] = useState<Message[]>(convos?.messages || []);
  const [typingUser, setTypingUser] = useState<string | null>(null);
  const userId = auth?.user.id;
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sync messages when conversation changes
  useEffect(() => {
    if (convos?.messages) {
      setMessages(convos.messages);
    }
  }, [convos?.id]);

  // Auto-scroll to bottom on new messages or typing indicator
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, typingUser]);

  // Register socket listeners once socket is connected and conversation is known
  useEffect(() => {
    const s = socket?.current;
    if (!s || !isSocketConnected) return;

    // Mark conversation as read on open
    if (convos?.id) {
      s.emit("chat:markAsRead", { conversationId: convos.id });
    }

    const onNewMessage = (message: Message) => {
      console.log("new_message");
      setMessages((prev) => {
        if (prev.some((m) => m.id === message.id)) return prev;
        return [...prev, message];
      });
      if (convos?.id) {
        s.emit("chat:markAsRead", { conversationId: convos.id });
      }
    };

    const onUserTyping = (data: {
      userId: string;
      userName: string;
      isTyping: boolean;
    }) => {
      if (data.userId === userId) return;
      setTypingUser(data.isTyping ? data.userName : null);
    };

    s.on("chat:newMessage", onNewMessage);
    s.on("chat:userTyping", onUserTyping);

    return () => {
      s.off("chat:newMessage", onNewMessage);
      s.off("chat:userTyping", onUserTyping);
    };
  }, [convos?.id, isSocketConnected]);

  const mutation = useMutation({
    mutationFn: async (data: { message: string }) => {
      let resp = await apiClient.post("/chat/conversations", {
        message: data.message,
      });
      return resp.data;
    },
    onSuccess: () => {
      query.refetch();
    },
  });

  if (!convos) {
    return (
      <div className="flex-1 grid place-items-center">
        <div className="text-center">
          <h2 className="text-current/50 text-2xl">No Messages</h2>
          <button
            disabled={mutation.isPending}
            onClick={() => {
              toast.promise(mutation.mutateAsync({ message: "Hello" }), {
                loading: "Starting conversation...",
                error: extract_message,
                success: "Conversation started",
              });
            }}
            className="mt-4 btn btn-primary btn-soft ring fade btn-lg"
          >
            Start Conversation
          </button>
        </div>
      </div>
    );
  }

  const statusConfig: Record<string, { text: string; cls: string }> = {
    PENDING: { text: "Waiting for an admin to join...", cls: "text-warning" },
    ACTIVE: { text: "Admin is connected", cls: "text-success" },
    CLOSED: { text: "Conversation closed", cls: "text-error" },
  };
  const statusInfo = statusConfig[convos.status];

  return (
    <div className="flex flex-col gap-2 flex-1 min-h-0 overflow-y-auto px-4 py-2">
      {statusInfo && (
        <p className={`text-xs text-center py-1 ${statusInfo.cls}`}>
          {statusInfo.text}
        </p>
      )}

      {groupByDate(messages).map((group) => (
        <div key={group.dateKey} className="flex flex-col gap-2">
          {/* Sticky floating date label */}
          <div className="sticky top-0 z-10 flex justify-center py-1 pointer-events-none">
            <span className="bg-gray-100/90 backdrop-blur-sm text-gray-600 text-xs font-medium px-3 py-1 rounded-full shadow-sm">
              {group.label}
            </span>
          </div>

          {group.messages.map((message) => {
            const isOwn = !message.isSystem && message.senderId === userId;
            const isImg = isImageUrl(message.content);

            return (
              <div
                key={message.id}
                className={`chat ${isOwn ? "chat-end" : "chat-start"}`}
              >
                <Avatar
                  isSystem={message.isSystem}
                  sender={message.sender}
                  isOwn={isOwn}
                  currentUserPicture={auth?.user?.profilePicture}
                />
                <div className="chat-header">
                  {message.isSystem ? (
                    <>NeedHomes</>
                  ) : (
                    <>
                      {message.sender?.firstName} {message.sender?.lastName}
                    </>
                  )}
                  <time className="text-xs opacity-50 ml-2">
                    {new Date(message.createdAt).toLocaleTimeString()}
                  </time>
                </div>
                <div
                  className={`chat-bubble ${message.isSystem ? "chat-bubble-primary" : isOwn ? "shadow" : "chat-bubble-primary"} ${isImg ? "!p-1 !bg-transparent !shadow-none" : ""}`}
                >
                  {isImg ? (
                    <a href={message.content} target="_blank" rel="noreferrer">
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
                  {message.isRead ? "Read" : "Sent"}
                </div>
              </div>
            );
          })}
        </div>
      ))}

      {typingUser && (
        <div className="chat chat-start">
          <div className="chat-bubble chat-bubble-ghost text-sm opacity-60">
            {typingUser} is typing...
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
}
