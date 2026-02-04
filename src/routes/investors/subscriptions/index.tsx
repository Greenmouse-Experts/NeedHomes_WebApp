import apiClient from "@/api/simpleApi";
import { useAuth } from "@/store/authStore";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/investors/subscriptions/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [auth] = useAuth();
  const user = auth?.user;
  const query = useQuery({
    queryKey: ["subscriptions", user],
    queryFn: async () => {
      let resp = await apiClient.get("/subscriptions/plans");
      return resp.data;
    },
  });

  return (
    <>
      <CurrentPlan />
    </>
  );
}

const CurrentPlan = () => {
  const [auth] = useAuth();
  const user = auth?.user;
  const query = useQuery({
    queryKey: ["subscriptions", user],
    queryFn: async () => {
      let resp = await apiClient.get("subscriptions/my-subscription");
      return resp.data;
    },
  });
  return <div>current plan</div>;
};
