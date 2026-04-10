import {
  createFileRoute,
  Link,
  Outlet,
  redirect,
} from "@tanstack/react-router";
import { get_user_value, useAuth, useKyc } from "@/store/authStore";
import { toast } from "sonner";
import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

export const Route = createFileRoute("/dashboard")({
  component: RouteComponent,
  beforeLoad: () => {
    const user = get_user_value();
    if (!user) {
      throw redirect({ to: "/login" });
    }
    const isAdmin = !!user.user.roles.find((item) => item == "SUPER_ADMIN");
    const accountType = user.user.accountType == "ADMIN";
    console.log("accountType", accountType);
    if (!isAdmin && !accountType) {
      throw redirect({ to: "/investors" });
    }
    // if (user.user.roles.some((item) => item != "ADMIN")) {
    // }
  },
});

function RouteComponent() {
  const [kyc] = useKyc();
  const [auth] = useAuth();
  const socketRef = useRef<Socket>(null);
  interface Announcement {
    id: string;
    content: string;
    target: "ALL_USERS" | string;
    createdAt: string;
  }
  useEffect(() => {
    if (!auth?.accessToken) return;
    const socket = io(
      import.meta.env.VITE_BACKEND_URL ||
        "https://needhomes-backend-staging.onrender.com",
      {
        auth: {
          token: auth.accessToken,
        },
        extraHeaders: {
          Authorization: `Bearer ${auth.accessToken}`,
        },
        transports: ["websocket", "polling"],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5,
      },
    );

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("✅ Connected to WebSocket");
    });
    socket.on("connected", (data) => {
      console.log("User data:", data);
    });
    socket.on("announcement:new", (data: Announcement) => {
      console.log("New announcement:", data);
      toast("New Announcement", {
        description: (
          <Link to="/dashboard/announcements" className="block mt-2">
            <div className="text-sm text-gray-600 line-clamp-2">
              {data.content}
            </div>
            <span className="text-xs font-semibold text-blue-600 mt-2 block">
              View Details
            </span>
          </Link>
        ),
      });
    });
    socket.on("notification:new", (data) => {
      console.log("New notification:", data);
      toast.info("New Notification", {
        description: (
          <Link to="/dashboard/notifications" className="block mt-2">
            <div className="text-sm text-gray-600 line-clamp-1">
              {data.notification.content}
            </div>
            <span className="text-xs font-semibold text-blue-600 mt-2 block">
              View Notifications
            </span>
          </Link>
        ),
      });
    });
    // ✅ DISCONNECT ON UNMOUNT
    return () => {
      console.log("❌ Disconnecting socket...");
      socket.disconnect();
    };
  }, [auth?.accessToken]);

  return <Outlet></Outlet>;
}
