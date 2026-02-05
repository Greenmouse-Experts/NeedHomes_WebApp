import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { get_user_value, useKyc } from "@/store/authStore";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard")({
  component: RouteComponent,
  beforeLoad: () => {
    const user = get_user_value();
    if (!user) {
      throw redirect({ to: "/login" });
    }
    const isAdmin = !!user.user.roles.find((item) => item == "ADMIN");
    if (!isAdmin) {
      throw redirect({ to: "/investors" });
    }
    // if (user.user.roles.some((item) => item != "ADMIN")) {
    // }
  },
});

function RouteComponent() {
  const [kyc] = useKyc();

  return <Outlet></Outlet>;
}
