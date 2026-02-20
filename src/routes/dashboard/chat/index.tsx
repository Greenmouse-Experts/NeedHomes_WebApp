import apiClient, { type ApiResponse } from "@/api/simpleApi";
import QueryCompLayout from "@/components/layout/QueryCompLayout";
import ThemeProvider from "@/simpleComps/ThemeProvider";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import AdminConvos from "./-components/AdminConversations";

export const Route = createFileRoute("/dashboard/chat/")({
  component: RouteComponent,
  validateSearch: (
    search: Record<string, unknown>,
  ): { convoId?: string } | undefined => {
    if (!search.convoId) return;
    return { convoId: search.convoId as string };
  },
});
interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  accountType: string;
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
}

interface Conversation {
  id: string;
  userId: string;
  adminId: string | null;
  status: "PENDING" | string;
  lastMessageAt: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  user: User;
  messages: Message[];
}

function RouteComponent() {
  const { convoId } = Route.useSearch();
  const query = useQuery<ApiResponse<Conversation[]>>({
    queryKey: ["chat-admin"],
    queryFn: async () => {
      let resp = await apiClient.get("/chat/pending");
      return resp.data;
    },
  });
  return (
    <>
      <ThemeProvider className="drawer lg:drawer-open">
        <input id="chat-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
          <AdminConvos convoId={convoId} />
          {/* Page content here */}
          {/*<label htmlFor="chat-drawer" className="btn drawer-button lg:hidden">
            Open drawer
          </label>*/}
        </div>
        <div className="drawer-side">
          <div className="w-80 bg-white">
            <h2 className="border-b fade p-4 font-bold">Conversations </h2>
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
                                {new Date(
                                  chat.lastMessageAt,
                                ).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
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
        </div>
      </ThemeProvider>
    </>
  );
  return (
    <div className="flex ">
      <div className="flex flex-1"></div>
    </div>
  );
}
