import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/dashboard/partners/$partnerId/promotions/",
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { partnerId } = Route.useParams();
  return <div>Hello "/dashboard/partners/$partnerId/promotions/"!</div>;
}
