import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/investors/my-investments")({
  component: RouteComponent,
});

function RouteComponent() {
  return <Outlet />;
}
