import { createFileRoute, Outlet } from "@tanstack/react-router";
import {
  Users,
  Handshake,
  Home,
  HomeIcon,
  Calendar,
  TrendingUp,
  CheckCircle2,
  ArrowUp,
  Eye as EyeIcon,
  ChevronDown,
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Separator } from "@/components/ui/Separator";
import { useAuth } from "@/store/authStore";
import AdminDashStats from "./-components/AdminDashStats";
import { useEffect, useRef } from "react";
import { io, type Socket } from "socket.io-client";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import AdminRevenue from "./-components/Revenue";
import DashIncomeStats from "./-components/DashIncomeStats";
import { NairaIcon } from "@/components/NairaIcon";

export const Route = createFileRoute("/dashboard/")({
  component: DashboardIndexPage,
});

function DashboardIndexPage() {
  const [user] = useAuth();
  const auth = user;

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
      return toast(
        <Link to={`/dashboard/announcements`} className="w-full">
          <h2 className="py-2  text-sm font-bold border-b fade w-full">
            Announcement
          </h2>
          <div className="py-2 line-clamp-2">{data.content}</div>
        </Link>,
      );
    });
    socket.on("notification:new", (data) => {
      console.log("New notification:", data);
      toast.info(
        <Link to={`/dashboard/notifications`} className="w-full">
          <h2 className="py-2  text-sm font-bold border-b fade w-full">
            Notification
          </h2>
          <div className="py-2 line-clamp-2">{data.notification.content}</div>
        </Link>,
      );
    });
    // ✅ DISCONNECT ON UNMOUNT
    return () => {
      console.log("❌ Disconnecting socket...");
      socket.disconnect();
    };
  }, [auth?.accessToken]);
  return (
    <DashboardLayout title="Super Admin Dashboard">
      {/* Stats Cards */}

      {/* Welcome Banner */}
      <Card className="mb-4 md:mb-6 bg-gradient-to-r from-gray-800 to-[var(--color-orange)] text-white relative overflow-hidden">
        <CardContent className="p-4 md:p-6">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4" />
            <span className="text-xs md:text-sm">
              {new Date().toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold mb-1">
            Welcome, Admin 👋
          </h2>
          {/*<>{JSON.stringify(user)}</>*/}

          <div className="absolute top-0 right-0 w-64 h-64 opacity-10">
            <div className="absolute top-10 right-10 w-4 h-4 bg-white rounded-full"></div>
            <div className="absolute top-20 right-20 w-2 h-2 bg-white rounded-full"></div>
            <div className="absolute top-32 right-32 w-3 h-3 bg-white rounded-full"></div>
          </div>
        </CardContent>
      </Card>
      <AdminDashStats />

      <div className="grid ">
        {/* Revenue Chart */}
        <AdminRevenue />
        {/* Wallet */}
      </div>
      <DashIncomeStats />
    </DashboardLayout>
  );
}
