import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/properties/new")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    //@ts-ignore
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
}
