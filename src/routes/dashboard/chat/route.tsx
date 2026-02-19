import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Outlet } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/chat")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <DashboardLayout subtitle="Chat" title="Super Admin Dashboard">
        <Outlet />
      </DashboardLayout>
    </>
  );
}
