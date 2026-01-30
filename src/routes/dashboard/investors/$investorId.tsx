import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/investors/$investorId")({
  component: InvestorLayout,
});

function InvestorLayout() {
  return <Outlet />;
}
