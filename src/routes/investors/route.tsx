import { createFileRoute, Outlet } from "@tanstack/react-router";
import { InvestorSidebar } from "@/components/investors/InvestorSidebar";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "@tanstack/react-router";
import InvHeader from "./-components/InvHeader";
import ThemeProvider from "@/simpleComps/ThemeProvider";
import { get_kyc_value, refresh_kyc, useAuth } from "@/store/authStore";
import { io, Socket } from "socket.io-client";
import { toast } from "sonner";

export const Route = createFileRoute("/investors")({
  component: LayoutComponent,
  beforeLoad: () => {
    const val = get_kyc_value();
    if (!val) return;

    if (val.account_verification_status != "VERIFIED") {
      refresh_kyc();
    }
  },
});

function LayoutComponent() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const [auth, setAuth] = useAuth();
  // Derive active page from path
  const getActivePage = () => {
    const path = location.pathname;
    if (path === "/investors" || path === "/investors/") return "dashboard";
    if (path.includes("/my-investments")) return "my-investments";
    if (path.includes("/properties")) return "properties";
    if (path.includes("/notifications")) return "notifications";
    if (path.includes("/transactions")) return "transactions";
    if (path.includes("/announcements")) return "announcements";
    if (path.includes("/settings")) return "settings";
    return "dashboard";
  };
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
      toast.info(data.content);
    });
    socket.on("notification:new", (data) => {
      console.log("New notification:", data);
      toast.info(data.content);
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
              <InvHeader title="" />
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
            <ul className="menu p-0 bg-[#2A2A2A]  h-screen    w-64">
              {/*//@ts-ignore*/}
              <InvestorSidebar />
            </ul>
          </div>
        </div>
      </ThemeProvider>
    </>
  );
  return (
    <>
      <ThemeProvider>
        <div className="drawer lg:drawer-open">
          <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content  min-h-screen flex flex-col">
            {/*<InvHeader title="" />*/}
            <label
              htmlFor="my-drawer-3"
              className="btn drawer-button lg:hidden"
            >
              Open drawer
            </label>
            <main className="container px-6 py-6  flex-1">
              <Outlet />
            </main>
          </div>
          <div className="drawer-side">
            <div className="w-64 h-full bg-red-200">
              {/*<InvestorSidebar
                activePage={getActivePage()}
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
              />*/}
            </div>
          </div>
        </div>
      </ThemeProvider>
    </>
  );
  return (
    <div className="flex min-h-screen bg-gray-100">
      <main className="min-h-screen md:pl-64 flex-1">
        <InvHeader title="" />
        <div className="flex-1 p-4 md:p-8 min-h-screen pt-16 md:pt-8 ">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
