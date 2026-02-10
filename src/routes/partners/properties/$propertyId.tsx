import apiClient from "@/api/simpleApi";
import { Button } from "@/components/ui/Button";
import { extract_message } from "@/helpers/apihelpers";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { ChevronLeft, Megaphone } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/partners/properties/$propertyId")({
  component: PropertyLayout,
});

function PropertyLayout() {
  const navigate = useNavigate();
  const { propertyId } = Route.useParams();
  const mutation = useMutation({
    mutationFn: async () => {
      let resp = await apiClient.post("/partners/promotions", {
        propertyId: propertyId,
      });
      return resp.data;
    },
  });
  return (
    <div className="property-container space-y-6">
      {/* Top Navigation Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <Button
          variant="outline"
          leftIcon={<ChevronLeft className="w-5 h-5" />}
          onClick={() => navigate({ to: "/partners/properties" })}
          className="w-full sm:w-auto"
        >
          Back to Properties
        </Button>

        <Button
          variant="primary"
          disabled={mutation.isPending}
          rightIcon={<Megaphone className="w-5 h-5" />}
          onClick={() => {
            toast.promise(mutation.mutateAsync(), {
              loading: "Promoting...",
              success: "Promoted!",
              error: extract_message,
            });
          }}
          className="w-full sm:w-auto"
        >
          Promote Now
        </Button>
      </div>

      {/* This renders index.tsx or photos.tsx */}
      <Outlet />
    </div>
  );
}
