import apiClient from "@/api/simpleApi";
import PageLoader from "@/components/layout/PageLoader";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/blogs/$id/details/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();
  const query = useQuery({
    queryKey: ["blog-details", id],
    queryFn: async () => {
      let resp = await apiClient.get("blogs/admin/" + id);
      return resp.data;
    },
  });
  return (
    <PageLoader query={query}>
      {(resp) => {
        let data = resp.data;
        return <div>{JSON.stringify(data)}</div>;
      }}
    </PageLoader>
  );
}
