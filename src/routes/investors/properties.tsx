import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/investors/properties")({
  component: PropertiesLayout,
});

function PropertiesLayout() {
  return (
    <div className="space-y-6">
      <Outlet />
    </div>
  );
}
