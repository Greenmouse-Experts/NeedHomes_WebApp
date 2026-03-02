import apiClient, { type ApiResponseV2 } from "@/api/simpleApi";
import PageLoader from "@/components/layout/PageLoader";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/blogs/")({
  component: RouteComponent,
});

function RouteComponent() {
  const query = useQuery<ApiResponseV2<[]>>({
    queryKey: ["blogs-admin"],
    queryFn: async () => {
      const response = await apiClient.get("blogs/admin/all");
      return response.data;
    },
  });
  return (
    <>
      <section className="flex flex-col md:flex-row">
        <div className="mb-6 ">
          <h1 className="text-xl font-bold">Blog</h1>
          <p className="text-base-content/60">Blog management page</p>
        </div>
        <Link
          className="btn btn-primary md:ml-auto"
          to="/dashboard/blogs/create"
        >
          Create Blog
        </Link>
      </section>
      <PageLoader query={query}>
        {(data) => {
          const blogs = data.data.data;
          return <div>{JSON.stringify(blogs)}</div>;
        }}
      </PageLoader>
    </>
  );
}
