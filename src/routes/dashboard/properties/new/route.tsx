import BackButton from "@/components/BackButton";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { createFileRoute, Outlet, useLocation } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/properties/new")({
  component: RouteComponent,
});

function RouteComponent() {
  const location = useLocation();
  if (location.pathname != "/dashboard/properties/new") {
    return (
      <>
        <BackButton />
        <Outlet />
      </>
    );
  }
  return (
    //@ts-ignore
    <>
      <Outlet />
    </>
  );
}
