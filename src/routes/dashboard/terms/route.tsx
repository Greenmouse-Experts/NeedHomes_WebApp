import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Outlet } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/terms")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <DashboardLayout
        title="SuperAdmin Dashboard"
        subtitle="Terms and Conditions"
      >
        <Outlet />
      </DashboardLayout>
    </>
  );
}
