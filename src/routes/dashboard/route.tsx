import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { get_user_value } from "@/store/authStore";

export const Route = createFileRoute("/dashboard")({
  component: RouteComponent,
  beforeLoad: () => {
    // const user = get_user_value();
    // if (!user) {
    //   throw redirect({ to: "/login" });
    // }
    // if (user.user.accountType == "INVESTOR") {
    //   throw redirect({ to: "/investors" });
    // }
  },
});

function RouteComponent() {
  return <Outlet></Outlet>;
}
