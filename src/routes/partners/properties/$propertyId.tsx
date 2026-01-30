import { Button } from "@/components/ui/Button";
import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { ChevronLeft, Megaphone } from "lucide-react";

export const Route = createFileRoute("/partners/properties/$propertyId")({
  component: PropertyLayout,
});

function PropertyLayout() {
  const navigate = useNavigate();
  return (
    <div className="property-container space-y-6">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          leftIcon={<ChevronLeft className="w-5 h-5" />}
          onClick={() => navigate({ to: "/partners/properties" })}
        >
          Back to Properties
        </Button>

        <Button
          variant="primary"
          rightIcon={<Megaphone className="w-5 h-5" />}
          onClick={() => console.log("Promote Now clicked")}
        >
          Promote Now
        </Button>
      </div>

      {/* This renders index.tsx or photos.tsx */}
      <Outlet />
    </div>
  );
}
