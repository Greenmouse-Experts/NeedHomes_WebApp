import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/property/")({
  component: RouteComponent,
  validateSearch: (search: any) => {
    return {
      propertyType: search?.propertyType,
      id: search.id,
    };
  },
});

function RouteComponent() {
  return <div>Hello "/property/"!</div>;
}
