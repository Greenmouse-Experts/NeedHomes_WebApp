import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import ThemeProvider from "@/simpleComps/ThemeProvider";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/faq")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <DashboardLayout title="Super Admin Dashboard" subtitle="FAQ">
        <ThemeProvider>
          <Outlet />
        </ThemeProvider>
      </DashboardLayout>
    </>
  );
}
