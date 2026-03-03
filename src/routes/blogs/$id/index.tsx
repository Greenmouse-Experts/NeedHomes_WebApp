import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/blogs/$id/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();
  return <div>Hello "/blogs/$id/"! {id}</div>;
}
