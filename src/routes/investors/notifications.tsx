import { createFileRoute } from "@tanstack/react-router";
import {
  Bell,
  Check,
  Clock,
  Info,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useMutation, useQuery } from "@tanstack/react-query";
import apiClient, { type ApiResponseV2 } from "@/api/simpleApi";
import PageLoader from "@/components/layout/PageLoader";
import { toast } from "sonner";
import { extract_message } from "@/helpers/apihelpers";

export const Route = createFileRoute("/investors/notifications")({
  component: RouteComponent,
});

type NotificationType = "alert" | "update" | "success" | "INFO";

interface Notification {
  id: string;
  title: string;
  content: string;
  userId: string;
  createdAt: string;
  type: NotificationType;
  date: string;
  isRead: boolean;
}
const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "Investment Successful",
    content:
      'Your investment of N5,000,000 in "4BR Fully Detached Duplex" has been successfully processed.',
    type: "success",
    date: "2 hours ago",
    isRead: false,
    userId: "",
    createdAt: "",
  },
  {
    id: "2",
    title: "New Property Alert",
    content:
      "A new property matching your preferences has been listed in Lekki Phase 1.",
    type: "INFO",
    date: "5 hours ago",
    isRead: false,
    userId: "",
    createdAt: "",
  },
  {
    id: "3",
    title: "KYC Verification Required",
    content:
      "Please update your identification document to complete your KYC verification.",
    type: "alert",
    date: "1 day ago",
    isRead: true,
    userId: "",
    createdAt: "",
  },
  {
    id: "4",
    title: "System Maintenance",
    content:
      "Scheduled maintenance will occur on Saturday, Jan 28th from 2:00 AM to 4:00 AM.",
    type: "update",
    date: "2 days ago",
    isRead: true,
    userId: "",
    createdAt: "",
  },
  {
    id: "5",
    title: "Dividend Payout",
    content:
      "You have received a dividend payout of N250,000 from your co-development investment.",
    type: "success",
    date: "3 days ago",
    isRead: true,
    userId: "",
    createdAt: "",
  },
];

function RouteComponent() {
  const query = useQuery<ApiResponseV2<Notification[]>>({
    queryKey: ["notifications"],
    queryFn: async () => {
      let resp = await apiClient.get("/notifications");
      return resp.data;
    },
  });
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [notifications, setNotifications] =
    useState<Notification[]>(mockNotifications);

  const mutation = useMutation({
    mutationFn: async (fn: any) => await fn(),
    onSuccess: () => {
      query.refetch();
    },
  });

  const markRead = (id: string) => {
    toast.promise(
      mutation.mutateAsync(
        async () => await apiClient.patch(`/notifications/${id}/read`),
      ),
      {
        loading: "Marking as read...",
        success: "Notification marked as read",
        error: extract_message,
      },
    );
  };

  const handleMarkAllAsRead = () => {
    toast.promise(
      mutation.mutateAsync(
        async () => await apiClient.post(`/notifications/read-all`),
      ),
      {
        loading: "Marking all as read...",
        success: "All notifications marked as read",
        error: extract_message,
      },
    );
  };

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case "alert":
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case "success":
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case "update":
        return <Clock className="w-5 h-5 text-blue-500" />;
      case "INFO":
      default:
        return <Info className="w-5 h-5 text-(--color-orange)" />;
    }
  };

  const getBgColor = (type: NotificationType) => {
    switch (type) {
      case "alert":
        return "bg-red-50";
      case "success":
        return "bg-green-50";
      case "update":
        return "bg-blue-50";
      case "INFO":
      default:
        return "bg-orange-50";
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">
            Notifications
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Stay updated with your latest activities
          </p>
        </div>
      </header>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                filter === "all"
                  ? "bg-gray-900 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("unread")}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                filter === "unread"
                  ? "bg-gray-900 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Unread
            </button>
          </div>
          <button
            onClick={handleMarkAllAsRead}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-(--color-orange) hover:bg-orange-50 rounded-lg transition-colors"
          >
            <Check className="w-4 h-4" />
            Mark all as read
          </button>
        </div>

        <section>
          <PageLoader query={query}>
            {(resp) => {
              let list = resp.data.data;
              const filteredList = list.filter((n) => {
                if (filter === "unread") return !n.isRead;
                return true;
              });

              if (filteredList.length === 0) {
                return (
                  <div className="p-8 text-center text-gray-500">
                    No notifications found.
                  </div>
                );
              }

              return (
                <div className="divide-y divide-gray-100">
                  {filteredList.map((notification) => {
                    return (
                      <div
                        key={notification.id}
                        className={`p-4 md:p-6 flex items-start gap-4 hover:bg-gray-50 transition-colors ${
                          !notification.isRead ? "bg-blue-50/30" : ""
                        }`}
                      >
                        <div
                          className={`p-2 rounded-full shrink-0 ${getBgColor(notification.type)}`}
                        >
                          {getIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                            <h3
                              className={`text-sm md:text-base font-semibold ${
                                !notification.isRead
                                  ? "text-gray-900"
                                  : "text-gray-700"
                              }`}
                            >
                              {notification.title}
                            </h3>
                            <span className="text-xs text-gray-500 whitespace-nowrap flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {notification.date}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 leading-relaxed">
                            {notification.content}
                          </p>
                        </div>
                        {!notification.isRead && (
                          <button
                            onClick={() => markRead(notification.id)}
                            className="btn btn-primary btn-sm btn-soft ring fade"
                            title="Mark as read"
                          >
                            Mark Read
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            }}
          </PageLoader>
        </section>
      </div>
    </div>
  );
}
