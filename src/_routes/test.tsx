import { Input } from "@/components/ui/Input";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/test")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <Input />
      "!
    </div>
  );
}
