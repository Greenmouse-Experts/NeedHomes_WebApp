import { Button } from "@/components/ui/Button";
import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { ChevronLeft, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/investors/properties/$propertyId")({
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
          onClick={() => navigate({ to: "/investors/properties" })}
        >
          Back to Properties
        </Button>

        <Button
          variant="primary"
          rightIcon={<TrendingUp className="w-5 h-5" />}
          onClick={() => console.log("Invest Now clicked")}
        >
          Invest Now
        </Button>
      </div>

      <Outlet />
    </div>
  );
}
