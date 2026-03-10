import apiClient from "@/api/simpleApi";
import { extract_message } from "@/helpers/apihelpers";
import { useAuth } from "@/store/authStore";
import {
  useMutation,
  type QueryObserverResult,
} from "@tanstack/react-query";
import { useEffect, useRef, useState, type RefObject } from "react";
import type { Socket } from "socket.io-client";
import { toast } from "sonner";

interface Sender {
  id: string;
  firstName: string;
  lastName: string;
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
              toast.promise(
                mutation.mutateAsync({ message: "Hello" }),
                {
                  loading: "Starting conversation...",
                  error: extract_message,
                  success: "Conversation started",
                },
              );
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

      {messages.map((message) => {
        const isOwn = !message.isSystem && message.senderId === userId;
        return (
          <div key={message.id} className={`chat ${isOwn ? "chat-end" : "chat-start"}`}>
            <div className="chat-image avatar placeholder ring fade rounded-full grid place-items-center p-3 bg-primary text-primary-content">
              {message.isSystem ? (
                <span className="text-sm">AD</span>
              ) : (
                <span className="text-sm">
                  {message.sender?.firstName?.[0] || "?"}
                  {message.sender?.lastName?.[0] || ""}
                </span>
              )}
            </div>
            <div className="chat-header">
              {message.isSystem ? (
                <>Admin</>
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
              className={`chat-bubble ${message.isSystem ? "chat-bubble-info" : ""}`}
            >
              {message.content}
            </div>
            <div className="chat-footer opacity-50">
              {message.isRead ? "Read" : "Sent"}
            </div>
          </div>
        );
      })}

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
