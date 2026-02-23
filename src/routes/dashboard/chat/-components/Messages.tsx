import apiClient, { type ApiResponse } from "@/api/simpleApi";
import QueryCompLayout from "@/components/layout/QueryCompLayout";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { readTransformValue } from "framer-motion";
import { useEffect, type RefObject } from "react";
import type { Socket } from "socket.io-client";
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

export default function Messages({
  convoId,
  socket,
}: {
  convoId: string;
  socket: RefObject<Socket>;
}) {
  const queryClient = useQueryClient();
  const query = useQuery<ApiResponse<Conversation>>({
    queryKey: ["chats", convoId],
    queryFn: async () => {
      let resp = await apiClient.get("chat/conversations/" + convoId);
      return resp.data;
    },
  });
  const handleNewMessage = (message: Message) => {
    queryClient.setQueryData<ApiResponse<Conversation>>(
      ["chats", convoId],
      (oldData) => {
        if (!oldData) return oldData;

        // Prevent adding duplicate messages
        const messageExists = oldData.data.messages.some(
          (existingMessage) => existingMessage.id === message.id,
        );

        if (messageExists) {
          return oldData;
        }

        return {
          ...oldData,
          data: {
            ...oldData.data,
            messages: [...oldData.data.messages, message],
          },
        };
      },
    );
  };
  useEffect(() => {
    const currentSocket = socket.current;
    if (!currentSocket) return;

    const handleMessage = (message: Message) => {
      console.log("New message:", message);
      handleNewMessage(message);
    };

    currentSocket.on("chat:newMessage", handleMessage);

    return () => {
      currentSocket.off("chat:newMessage", handleMessage);
    };
  }, [convoId, socket, queryClient]);
  return (
    <QueryCompLayout query={query}>
      {(data) => {
        const messages = data.data.messages;
        return (
          <>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`chat ${!message.isSystem ? "chat-end" : "chat-start"}`}
              >
                <div className="chat-image avatar placeholder ring fade rounded-full grid place-items-center p-3 bg-primary text-primary-content">
                  {/*<div className="bg-neutral-focus text-neutral-content  rounded-full w-10">*/}
                  {message.isSystem ? (
                    <>
                      <span className="text-sm">AD</span>
                    </>
                  ) : (
                    <span className="text-sm">
                      {message.sender?.firstName?.[0] || "?"}
                      {message.sender?.lastName?.[0] || ""}
                    </span>
                  )}
                  {/*</div>*/}
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
          </>
        );
      }}
    </QueryCompLayout>
  );
}
