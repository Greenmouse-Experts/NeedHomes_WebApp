import { Bell } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import apiClient, { type ApiResponseV2 } from "@/api/simpleApi";

interface Notification {
  id: string;
  title: string;
  content: string;
  userId: string;
  createdAt: string;
  type: string;
  date: string;
  isRead: boolean;
}

export default function InvNotifications() {
  const query = useQuery<ApiResponseV2<Notification[]>>({
    queryKey: ["inv-notification"],
    queryFn: async () => {
      const resp = await apiClient.get("/notifications");
      return resp.data;
    },
  });

  const unread = (query.data?.data?.data ?? []).filter((n) => !n.isRead).length;

  return (
    <Link
      to="/investors/notifications"
      className="relative inline-flex items-center justify-center w-9 h-9 rounded-full hover:bg-gray-100 transition-colors"
    >
      <Bell className="w-5 h-5 text-gray-600" />
      {unread > 0 && (
        <span className="absolute top-0.5 right-0.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold leading-none">
          {unread > 99 ? "99+" : unread}
        </span>
      )}
    </Link>
  );
}
