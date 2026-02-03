import { createFileRoute, Outlet } from "@tanstack/react-router";
import { InvestorSidebar } from "@/components/investors/InvestorSidebar";
import { useState } from "react";
import { useLocation } from "@tanstack/react-router";
import InvHeader from "./-components/InvHeader";

export const Route = createFileRoute("/investors")({
  component: LayoutComponent,
});

function LayoutComponent() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

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

  return (
    <div className="flex min-h-screen bg-gray-100">
      <InvestorSidebar
        activePage={getActivePage()}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      {/* Main Content */}
      <main className="min-h-screen md:ml-64">
        <InvHeader title="" />
        <div className="flex-1 p-4 md:p-8 min-h-screen pt-16 md:pt-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
