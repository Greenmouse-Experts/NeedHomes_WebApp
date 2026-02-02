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
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <Button
          variant="outline"
          leftIcon={<ChevronLeft className="w-5 h-5" />}
          onClick={() => navigate({ to: "/investors/properties" })}
          className="w-full sm:w-auto"
        >
          Back to Properties
        </Button>

        <Button
          variant="primary"
          rightIcon={<TrendingUp className="w-5 h-5" />}
          onClick={() => console.log("Invest Now clicked")}
          className="w-full sm:w-auto"
        >
          Invest Now
        </Button>
      </div>

      <Outlet />
    </div>
  );
}
