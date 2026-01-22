import { Input } from "@/components/ui/Input";
import SimpleInput from "@/simpleComps/inputs/SimpleInput";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/test")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <SimpleInput />
    </div>
  );
}
