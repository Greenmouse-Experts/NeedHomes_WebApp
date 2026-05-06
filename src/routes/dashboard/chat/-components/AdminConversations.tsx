import apiClient from "@/api/simpleApi";
import QueryCompLayout from "@/components/layout/QueryCompLayout";
import { useQuery } from "@tanstack/react-query";
import { useEffect, type RefObject } from "react";
import type { Socket } from "socket.io-client";
import ChatBar from "./ChatBar";
import Messages from "./Messages";

export default function AdminConvos({
  convoId,
  socket,
  isSocketConnected,
}: {
  convoId?: string;
  socket: RefObject<Socket | null>;
  isSocketConnected: boolean;
}) {
  const query = useQuery({
    queryKey: ["convoId", convoId],
    queryFn: async () => {
      const resp = await apiClient.patch(
        `chat/conversations/${convoId}/join`,
      );
      return resp.data;
    },
    enabled: !!convoId,
  });

  useEffect(() => {
    if (!convoId || !isSocketConnected) return;
    socket.current?.emit("chat:createConversation", {
      conversationId: convoId,
    });
  }, [convoId, isSocketConnected]);
  if (!convoId) {
    return (
      <div className="flex-1  bg-base-100 flex flex-col border-l fade">
        <h2 className="p-3.5 border-b fade text-lg font-bold">
          Live Conversations
        </h2>
        <div className="flex-1 p-4 grid place-items-center text-xl font-bold text-current/60">
          NO CONVERSATIONS STARTED
        </div>
      </div>
    );
  }

  return (
    <section className="h-[calc(100dvh-144px)] flex   p-0 isolate w-full b">
      <section className="flex flex-col flex-1 min-h-0 ">
        <QueryCompLayout
          query={query}
          customLoading={
            <>
              <div className="flex-1 grid place-items-center bg-base-100 border fade">
                <h2>....Loading Conversations</h2>
              </div>
            </>
          }
        >
          {(data) => {
            return (
              <div className="bg-base-100 md:border-l fade flex flex-1 min-h-0 flex-col">
                <h2 className="p-3.5 border-b fade text-lg font-bold">
                  Live Conversations
                </h2>
                <div className="p-4 flex-1 flex min-h-0 flex-col overflow-y-scroll">
                  <Messages key={convoId} socket={socket} convoId={convoId} />
                </div>
                <div>
                  <ChatBar socket={socket} />
                </div>
              </div>
            );
          }}
        </QueryCompLayout>
      </section>
    </section>
  );
}
