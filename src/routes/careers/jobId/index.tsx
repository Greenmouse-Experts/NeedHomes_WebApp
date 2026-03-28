import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/careers/jobId/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/job/jobId/"!</div>;
}
