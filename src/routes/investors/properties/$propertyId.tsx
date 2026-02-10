import apiClient from "@/api/simpleApi";
import { Button } from "@/components/ui/Button";
import { extract_message } from "@/helpers/apihelpers";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { ChevronLeft, TrendingUp } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/investors/properties/$propertyId")({
  component: PropertyLayout,
});

function PropertyLayout() {
  const navigate = useNavigate();
  const { propertyId } = Route.useParams();

  return (
    <div className="property-container space-y-6">
      {/* Top Navigation Bar */}
      <Outlet />
    </div>
  );
}
