import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/transactions/$id/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div className="my-4">Hello "/dashboard/transactions/$id/"!</div>;
}
