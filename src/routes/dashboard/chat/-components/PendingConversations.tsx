import apiClient from "@/api/simpleApi";
import QueryCompLayout from "@/components/layout/QueryCompLayout";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";

export default function PendingConversations({}) {
  const query = useQuery({
    queryKey: ["convos-pending"],
    queryFn: async () => {
      let resp = await apiClient.get("/chat/pending");
      return resp.data;
    },
  });
  return (
    <>
      <div className="">
        <h2 className="p-4 border-b fade font-bold">Pending Convos</h2>
        <QueryCompLayout query={query}>
          {(data) => {
            const chats = data.data;
            return (
              <div className="flex flex-col divide-y divide-gray-100">
                {chats.map((chat) => {
                  const lastMessage = chat.messages[0];
                  const initials = `${chat.user.firstName[0]}${chat.user.lastName[0]}`;
                  return (
                    <Link
                      key={chat.id}
                      to={"/dashboard/chat"}
                      search={{
                        convoId: chat.id,
                      }}
                      className="flex items-center gap-3 p-4 text-left transition-colors hover:bg-gray-50 active:bg-gray-100"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-600">
                        {initials}
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <div className="flex items-center justify-between">
                          <span className="truncate font-medium text-gray-900">
                            {chat.user.firstName} {chat.user.lastName}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(chat.lastMessageAt).toLocaleTimeString(
                              [],
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              },
                            )}
                          </span>
                        </div>
                        <p className="truncate text-sm text-gray-500">
                          {lastMessage?.content || "No messages yet"}
                        </p>
                      </div>
                      {chat.status === "PENDING" && (
                        <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                      )}
                    </Link>
                  );
                })}
              </div>
            );
          }}
        </QueryCompLayout>
      </div>
    </>
  );
}
