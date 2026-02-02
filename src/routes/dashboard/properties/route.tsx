import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/properties")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <DashboardLayout subtitle="Propert Listing" title="SuperAdmin Dashboard">
        <Outlet />
      </DashboardLayout>
    </>
  );
}
