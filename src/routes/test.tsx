import { Input } from "@/components/ui/Input";
import SimpleInput from "@/simpleComps/inputs/SimpleInput";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/test")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div data-theme="nh-light">
      <button
        className="btn btn-primary"
        onClick={() => {
          const modal = document.getElementById(
            "logout_modal",
          ) as HTMLDialogElement;
          modal.showModal();
        }}
      >
        Click me
      </button>
      <SimpleInput />
    </div>
  );
}
