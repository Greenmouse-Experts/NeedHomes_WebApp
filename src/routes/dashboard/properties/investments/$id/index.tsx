import apiClient, { type ApiResponse } from "@/api/simpleApi";
import PageLoader from "@/components/layout/PageLoader";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/properties/investments/$id/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();
  const query = useQuery<ApiResponse<any>>({
    queryKey: ["investments-admin", id],
    queryFn: async () => {
      let resp = await apiClient.get(`/investments/${id}`);
      return resp.data;
    },
  });

  return (
    <>
      <PageLoader query={query}>
        {(data) => {
          const inv_data = data.data;
          return <></>;
        }}
      </PageLoader>
    </>
  );
}
