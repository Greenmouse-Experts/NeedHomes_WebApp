import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/partners/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/partners/"!</div>;
}
