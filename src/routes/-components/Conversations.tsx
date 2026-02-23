import apiClient from "@/api/simpleApi";
import { extract_message } from "@/helpers/apihelpers";
import { useAuth } from "@/store/authStore";
import {
  useMutation,
  type QueryObserver,
  type QueryObserverResult,
} from "@tanstack/react-query";
import { useEffect, useState, type RefObject } from "react";
import { io, Socket } from "socket.io-client";
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
}: {
  convos: Conversation | null;
  query: QueryObserverResult;
  socket: RefObject<Socket>;
}) {
  useEffect(() => {
    socket?.current.emit("chat:createConversation", {
      conversationId: convos?.id,
    });
    socket.current.on("chat:error", (error) => {
      console.error("Chat error:", error.message);
    });
    socket.current.on("chat:newMessage", (message) => {
      setMessages((prevMessages) => {
        if (!prevMessages.some((msg) => msg.id === message.id)) {
          return [...prevMessages, message];
        }
        return prevMessages;
      });
    });
  }, []);

  const [auth] = useAuth();
  const [messages, setMessages] = useState<Message[]>(convos?.messages || []);
  const userId = auth?.user.id;
  const token = auth?.accessToken;
  const mutation = useMutation({
    mutationFn: async (data: { message: string }) => {
      let resp = await apiClient.post("/chat/conversations", {
        message: data.message,
      });
      return resp.data;
    },
    onSuccess: (data) => {
      query.refetch;
      // client.invalidateQueries({ queryKey: ["chat"] });
    },
  });

  if (!convos) {
    return (
      <div className="flex-1 grid place-items-center">
        <div>
          <h2 className="text-current/50 text-2xl text-center">No Messages</h2>
          <button
            disabled={mutation.isPending}
            onClick={() => {
              toast.promise(
                mutation.mutateAsync({
                  message: "Hello",
                }),
                {
                  loading: "starting convo",
                  error: extract_message,
                  success: "conversation started",
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

  return (
    //messages container
    <div className="flex flex-col gap-4 flex-1 min-h-0 overflow-y-auto  px-4">
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
    </div>
  );
}
