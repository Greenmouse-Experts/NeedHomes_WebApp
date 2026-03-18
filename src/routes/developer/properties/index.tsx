import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/developer/properties/")({
  component: RouteComponent,
  loader: () => {
    return redirect({
      to: "/developer/properties/listed",
    });
  },
});

function RouteComponent() {
  return <div>Hello "/developer/properties/"!</div>;
}
