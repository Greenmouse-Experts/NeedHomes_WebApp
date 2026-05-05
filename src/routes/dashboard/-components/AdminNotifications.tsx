import { Bell, Info, AlertTriangle, CheckCircle2, Clock } from "lucide-react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import apiClient, {
  type ApiResponse,
  type ApiResponseV2,
} from "@/api/simpleApi";

interface Notification {
  id: string;
  title: string;
  content: string;
  type: string;
  date: string;
  isRead: boolean;
}

const getIcon = (type: string) => {
  switch (type) {
    case "alert":
      return <AlertTriangle className="w-4 h-4 text-red-500" />;
    case "success":
      return <CheckCircle2 className="w-4 h-4 text-green-500" />;
    case "update":
      return <Clock className="w-4 h-4 text-blue-500" />;
    default:
      return <Info className="w-4 h-4 text-orange-500" />;
  }
};

export default function AdminNotifications() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const countQuery = useQuery<ApiResponse<{ unreadCount: number }>>({
    queryKey: ["pat-notifications"],
    queryFn: async () => {
      const resp = await apiClient.get("/notifications/unread-count");
      return resp.data;
    },
  });

  const listQuery = useQuery<ApiResponseV2<Notification[]>>({
    queryKey: ["admin-notifications-list"],
    queryFn: async () => {
      const resp = await apiClient.get("/notifications");
      return resp.data;
    },
  });

  const unread = countQuery.data?.data?.unreadCount ?? 0;
  const latest = (listQuery.data?.data?.data ?? []).slice(0, 2);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((p) => !p)}
        className="relative inline-flex items-center justify-center w-9 h-9 rounded-full hover:bg-gray-100 transition-colors"
      >
        <Bell className="w-5 h-5 text-gray-600" />
        {unread > 0 && (
          <span className="absolute top-0.5 right-0.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold leading-none">
            {unread > 99 ? "99+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <span className="text-sm font-semibold text-gray-900">
              Notifications
            </span>
            {unread > 0 && (
              <span className="text-xs bg-red-100 text-red-600 font-semibold px-2 py-0.5 rounded-full">
                {unread} unread
              </span>
            )}
          </div>

          <div className="divide-y divide-gray-50">
            {latest.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-6">
                No notifications
              </p>
            ) : (
              latest.map((n) => (
                <div
                  key={n.id}
                  className={`flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer ${!n.isRead ? "bg-blue-50/40" : ""}`}
                  onClick={() => {
                    setOpen(false);
                    navigate({ to: "/dashboard/notifications" });
                  }}
                >
                  <div className="mt-0.5 shrink-0">{getIcon(n.type)}</div>
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm font-medium truncate ${!n.isRead ? "text-gray-900" : "text-gray-600"}`}
                    >
                      {n.title}
                    </p>
                    <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">
                      {n.content}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-1">{n.date}</p>
                  </div>
                  {!n.isRead && (
                    <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0 mt-1.5" />
                  )}
                </div>
              ))
            )}
          </div>

          <div className="px-4 py-3 border-t border-gray-100">
            <Link
              to="/dashboard/notifications"
              onClick={() => setOpen(false)}
              className="block text-center text-sm font-semibold text-orange-600 hover:text-orange-700 transition-colors"
            >
              View all notifications
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
