import apiClient from "@/api/simpleApi";
import { Input } from "@/components/ui/Input";
import SimpleInput from "@/simpleComps/inputs/SimpleInput";
import ThemeProvider from "@/simpleComps/ThemeProvider";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/test")({
  component: RouteComponent,
});

function RouteComponent() {
  const query = useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => {
      let resp = await apiClient.get("/users/profile");
      return resp.data;
    },
  });

  return (
    <ThemeProvider>
      <button className="btn btn-primary">soso </button>
    </ThemeProvider>
  );

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
