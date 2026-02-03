import { createFileRoute, Outlet } from "@tanstack/react-router";
import { InvestorSidebar } from "@/components/investors/InvestorSidebar";
import { useState } from "react";
import { useLocation } from "@tanstack/react-router";
import InvHeader from "./-components/InvHeader";
import ThemeProvider from "@/simpleComps/ThemeProvider";

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
    <>
      <ThemeProvider>
        <div className="drawer lg:drawer-open">
          <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />

          <div className="drawer-content flex flex-col  min-h-screen">
            {/* Page content here */}
            <div className="w-full">
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
            <ul className="menu bg-base-200 min-h-full w-64 p-4">
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
