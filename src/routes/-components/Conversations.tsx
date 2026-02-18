import { useAuth } from "@/store/authStore";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

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
}: {
  convos: Conversation | null;
}) {
  const [auth] = useAuth();
  const [messages, setMessages] = useState<Message[]>(convos?.messages || []);
  const userId = auth?.user.id;
  const token = auth?.accessToken;

  if (!convos) {
    return <>No Messages</>;
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`chat ${
            message.senderId === userId ? "chat-end" : "chat-start"
          }`}
        >
          <div className="chat-image avatar placeholder">
            <div className="bg-neutral-focus text-neutral-content rounded-full w-10">
              <span className="text-sm">
                {message.sender?.firstName?.[0] || "?"}
                {message.sender?.lastName?.[0] || ""}
              </span>
            </div>
          </div>
          <div className="chat-header">
            {message.sender?.firstName} {message.sender?.lastName}
            <time className="text-xs opacity-50 ml-2">
              {new Date(message.createdAt).toLocaleTimeString()}
            </time>
          </div>
          <div
            className={`chat-bubble ${
              message.isSystem ? "chat-bubble-info" : ""
            }`}
          >
            {message.content}
          </div>
          <div className="chat-footer opacity-50">
            {message.isRead ? "Read" : "Unread"}
          </div>
        </div>
      ))}
    </div>
  );
}
