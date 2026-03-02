import apiClient from "@/api/simpleApi";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import ThemeProvider from "@/simpleComps/ThemeProvider";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/blogs")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <DashboardLayout title="Super Admin Dashboard" subtitle="Blogs">
      <ThemeProvider>
        <Outlet />
      </ThemeProvider>
    </DashboardLayout>
  );
}
