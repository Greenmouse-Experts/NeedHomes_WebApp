import apiClient, { type ApiResponse } from "@/api/simpleApi";
import PageLoader from "@/components/layout/PageLoader";
import CustomTable from "@/components/tables/CustomTable";
import { Button } from "@/components/ui/Button";
import ThemeProvider from "@/simpleComps/ThemeProvider";
import { useAuth } from "@/store/authStore";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/investors/subscriptions/")({
  component: RouteComponent,
});

interface SUBSCRIPTIONS {
  id: string;
  name: string;
  type: string;
  description: string;
  price: number;
  validity: number;
  canViewPremiumProperty: boolean;
  maxInvestments: number;
  isActive: boolean;
}
function RouteComponent() {
  const [auth] = useAuth();
  const user = auth?.user;
  const query = useQuery<ApiResponse<SUBSCRIPTIONS[]>>({
    queryKey: ["subscriptions-plans", user],
    queryFn: async () => {
      let resp = await apiClient.get("/subscriptions/plans");
      return resp.data;
    },
  });
  const columns = [
    { key: "name", label: "Name" },
    { key: "type", label: "Type" },
    { key: "description", label: "Description" },
    { key: "price", label: "Price" },
    { key: "validity", label: "Validity" },
    {
      key: "canViewPremiumProperty",
      label: "Can View Premium Property",
      render: (value: boolean) => (value ? "Yes" : "No"),
    },
    { key: "maxInvestments", label: "Max Investments" },
    {
      key: "isActive",
      label: "Is Active",
      render: (value: boolean) => (value ? "Yes" : "No"),
    },
  ];
  return (
    <ThemeProvider className="space-y-6">
      <CurrentPlan />
      <PageLoader query={query}>
        {(data) => {
          return (
            <div className="space-y-4">
              <h2 className="text-lg font-bold">Available Plans</h2>
              <CustomTable
                data={data.data}
                columns={columns}
                ring={true}
                actions={[]}
              />
            </div>
          );
        }}
      </PageLoader>
    </ThemeProvider>
  );
}

const CurrentPlan = () => {
  const [auth] = useAuth();
  const user = auth?.user;
  const query = useQuery<ApiResponse<any>>({
    queryKey: ["subscriptions", user],
    queryFn: async () => {
      let resp = await apiClient.get("subscriptions/my-subscription");
      return resp.data;
    },
  });

  return (
    <ThemeProvider>
      <div className="card ring fade overflow-hidden border-none shadow-lg">
        <div className="bg-primary/80 text-primary-content via-transparent to-transparent p-6">
          <h2 className="text-2xl font-bold tracking-tight">
            Your Current Subscription
          </h2>
          <p className=" text-sm">
            Manage your membership details and billing cycle.
          </p>
        </div>

        <div className=" pt-0">
          <PageLoader query={query}>
            {(data) => {
              const sub_data = data.data;
              return (
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 rounded-xl  bg-card p-6 shadow-sm">
                  {sub_data ? (
                    <>
                      <div className="space-y-1">
                        <div className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                          Active Plan
                        </div>
                        <h3 className="text-2xl font-bold text-foreground">
                          {sub_data.plan?.name || "Premium Plan"}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Renews on{" "}
                          {new Date(sub_data.expiryDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex flex-col items-start md:items-end gap-2">
                        <span className="text-3xl font-bold">
                          ${sub_data.plan?.price || "0"}
                          <span className="text-sm font-normal text-muted-foreground">
                            /mo
                          </span>
                        </span>
                        <Button variant="outline" size="sm">
                          Manage Billing
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="space-y-1">
                        <div className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
                          Free Tier
                        </div>
                        <h3 className="text-2xl font-bold text-foreground">
                          Free Plan
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Upgrade to unlock premium properties and higher
                          limits.
                        </p>
                      </div>
                      <Button className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-md transition-all">
                        Upgrade Now
                      </Button>
                    </>
                  )}
                </div>
              );
            }}
          </PageLoader>
        </div>
      </div>
    </ThemeProvider>
  );
};
