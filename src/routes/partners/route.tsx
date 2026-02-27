import {
  get_kyc_value,
  get_user_value,
  refresh_kyc,
  useAuth,
} from "@/store/authStore";
import {
  createFileRoute,
  Outlet,
  redirect,
  useLocation,
} from "@tanstack/react-router";
import { PartnerSidebar } from "@/components/partners/PartnerSidebar";
import { useEffect, useRef, useState } from "react";
import ThemeProvider from "@/simpleComps/ThemeProvider";
import PatHeader from "./-components/PatHeader";
import { io, type Socket } from "socket.io-client";
import { toast } from "sonner";

export const Route = createFileRoute("/partners")({
  component: RouteComponent,
  loader: () => {
    const user = get_user_value();
    if (user?.user?.accountType != "PARTNER") {
      // return redirect({
      //   to: "",
      // });
    }
  },
  beforeLoad: () => {
    const val = get_kyc_value();
    if (!val) return;

    if (val.account_verification_status != "VERIFIED") {
      refresh_kyc();
    }
  },
});

function RouteComponent() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const match = useLocation();
  const path = match.pathname;

  let activePage:
    | "dashboard"
    | "my-investments"
    | "properties"
    | "settings"
    | "notifications"
    | "transactions"
    | "announcements" = "dashboard";
  if (path.includes("my-investments")) activePage = "my-investments";
  else if (path.includes("properties")) activePage = "properties";
  else if (path.includes("settings")) activePage = "settings";
  else if (path.includes("notifications")) activePage = "notifications";
  else if (path.includes("transactions")) activePage = "transactions";
  else if (path.includes("announcements")) activePage = "announcements";
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
      toast.info("New Annoucement", {
        description: data.content,
      });
    });
    socket.on("notification:new", (data) => {
      console.log("New notification:", data);
      toast.info("New Notfications", {
        description: data.content,
      });
    });
    // ✅ DISCONNECT ON UNMOUNT
    return () => {
      console.log("❌ Disconnecting socket...");
      socket.disconnect();
    };
  }, [auth?.accessToken]);
  return (
    <>
      <ThemeProvider>
        <div className="drawer lg:drawer-open">
          <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />

          <div className="drawer-content flex flex-col  min-h-screen">
            {/* Page content here */}
            <div className="w-full sticky top-0 z-20">
              <PatHeader title="" />
            </div>
            <main className="w-full px-6 py-6  flex-1">
              <Outlet />
            </main>
            {/*<label
              htmlFor="my-drawer-3"
              className="btn drawer-button lg:hidden"
            >
              Open drawer
            </label>*/}
          </div>
          <div className="drawer-side z-20">
            <label
              htmlFor="my-drawer-3"
              aria-label="close sidebar"
              className="drawer-overlay"
            ></label>
            <ul className="menu p-0 bg-[#2A2A2A]    min-h-full w-64">
              {/*//@ts-ignore*/}
              <PartnerSidebar />
            </ul>
          </div>
        </div>
      </ThemeProvider>
    </>
  );
  return (
    <div className="flex min-h-screen bg-gray-100">
      <PartnerSidebar
        activePage={activePage}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      {/* Main Content */}
      <main className="md:ml-64 flex-1 p-4 md:p-8 min-h-screen pt-16 md:pt-8">
        <Outlet />
      </main>
    </div>
  );
}
