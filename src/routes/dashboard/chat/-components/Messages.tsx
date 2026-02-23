import apiClient, { type ApiResponse } from "@/api/simpleApi";
import QueryCompLayout from "@/components/layout/QueryCompLayout";
import { useQuery } from "@tanstack/react-query";
import { readTransformValue } from "framer-motion";
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

export default function Messages({ convoId }: { convoId: string }) {
  const query = useQuery<ApiResponse<Conversation>>({
    queryKey: ["chats", convoId],
    queryFn: async () => {
      let resp = await apiClient.get("chat/conversations/" + convoId);
      return resp.data;
    },
  });
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
