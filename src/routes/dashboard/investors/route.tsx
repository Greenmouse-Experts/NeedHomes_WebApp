import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/investors")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <DashboardLayout title="Investors">
      <Outlet />
    </DashboardLayout>
  );
}
