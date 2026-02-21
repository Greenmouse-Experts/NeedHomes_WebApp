import { useAuth } from "@/store/authStore";
import { useEffect, useState, type RefObject } from "react";
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
  socket,
}: {
  convos: Conversation | null;
  socket: RefObject<Socket>;
}) {
  useEffect(() => {
    if (convos) {
      socket?.current.emit("chat:joinConversation", {
        conversationId: convos?.id,
      });
      socket.current.on("chat:error", (error) => {
        console.error("Chat error:", error.message);

        // Show error toast

        // Examples:
        // - "Conversation not found"
        // - "Only admins can join conversations"
        // - "You are not part of this conversation"
      });
      socket.current.on("chat:conversationJoined", (data) => {
        console.log("Joined conversation:", data.conversationId);
        // Redirect admin to chat interface
      });
      socket.current.on("chat:newMessage", (message) => {
        // This event is received by EVERYONE in the conversation room
        console.log("New message:", message);
        // Add to chat UI
      });
    }

    // socket?.current.on("chat:newMessage", (message) => {
    //   // This event is received by EVERYONE in the conversation room
    //   console.log("New message:", message);
    //   // Add to chat UI
    // });
  }, [convos?.id]);

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
