import apiClient, { type ApiResponse } from "@/api/simpleApi";
import PageLoader from "@/components/layout/PageLoader";
import ThemeProvider from "@/simpleComps/ThemeProvider";
import { useAuth } from "@/store/authStore";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/investors/subscriptions/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [auth] = useAuth();
  const user = auth?.user;
  const query = useQuery<ApiResponse<[]>>({
    queryKey: ["subscriptions-plans", user],
    queryFn: async () => {
      let resp = await apiClient.get("/subscriptions/plans");
      return resp.data;
    },
  });

  return (
    <>
      <CurrentPlan />
      <PageLoader query={query}>
        {(data) => {
          return <>{JSON.stringify(data)}</>;
        }}
      </PageLoader>
    </>
  );
}

const CurrentPlan = () => {
  const [auth] = useAuth();
  const user = auth?.user;
  const { data, isLoading, error } = useQuery<ApiResponse<any>>({
    queryKey: ["subscriptions", user],
    queryFn: async () => {
      let resp = await apiClient.get("subscriptions/my-subscription");
      return resp.data;
    },
  });

  return (
    <ThemeProvider>
      <div className="card ring fade p-4 shadow-lg rounded-lg">
        {error && <div className="alert alert-danger">Error fetching plan</div>}
        {isLoading && <div className="spinner"></div>}
        {!data || data.length === 0 ? (
          <div className="card card-primary">
            <h2 className="heading heading-primary">Free Plan</h2>
            <p className="text">This is the free subscription plan.</p>
          </div>
        ) : (
          <div className="card card-success">
            <h2 className="heading heading-success">Current Plan</h2>
          </div>
        )}
      </div>
    </ThemeProvider>
  );
};
