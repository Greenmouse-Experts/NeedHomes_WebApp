import BackButton from "@/components/BackButton";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/properties/edit")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <BackButton />
      <Outlet />
    </>
  );
}
