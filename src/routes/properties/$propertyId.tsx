import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/properties/$propertyId")({
  component: PropertyLayout,
});

function PropertyLayout() {
  return (
    <div className="property-container px-4 space-y-6 container mx-auto pt-12">
      <Outlet />
    </div>
  );
}
