import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import ThemeProvider from "@/simpleComps/ThemeProvider";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/resell")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <DashboardLayout title="Super Admin" subtitle="Resell Request">
        <ThemeProvider>
          <Outlet />
        </ThemeProvider>
      </DashboardLayout>
    </>
  );
}
