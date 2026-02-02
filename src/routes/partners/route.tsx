import { get_user_value } from "@/store/authStore";
import {
  createFileRoute,
  Outlet,
  redirect,
  useLocation,
} from "@tanstack/react-router";
import { PartnerSidebar } from "@/components/partners/PartnerSidebar";
import { useState } from "react";

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
