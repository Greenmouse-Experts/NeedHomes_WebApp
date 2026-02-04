import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/subscriptions")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <DashboardLayout title="SuperAdmin Dashboard" subtitle="subscriptions">
      <Outlet />
    </DashboardLayout>
  );
}
