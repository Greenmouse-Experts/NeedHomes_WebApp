import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/properties/$propertyId")({
  component: PropertyLayout,
});

function PropertyLayout() {
  const { propertyId } = Route.useParams();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref");
    if (ref) {
      localStorage.setItem(`ref_${propertyId}`, ref);
    }
  }, [propertyId]);

  return (
    <div className="property-container px-4 space-y-6 container mx-auto pt-12">
      <Outlet />
    </div>
  );
}
