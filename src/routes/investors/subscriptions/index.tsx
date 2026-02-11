import apiClient, { type ApiResponse } from "@/api/simpleApi";
import PageLoader from "@/components/layout/PageLoader";
import Modal from "@/components/modals/DialogModal";
import CustomTable from "@/components/tables/CustomTable";
import { type Actions } from "@/components/tables/pop-up";
import { Button } from "@/components/ui/Button";
import ThemeProvider from "@/simpleComps/ThemeProvider";
import { useAuth } from "@/store/authStore";
import { useModal } from "@/store/modals";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

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
  const queryClient = useQueryClient();
  const { ref, showModal, closeModal } = useModal();
  const [selectedPlan, setSelectedPlan] = useState<SUBSCRIPTIONS | null>(null);
  const [autoRenew, setAutoRenew] = useState(false);

  const query = useQuery<ApiResponse<SUBSCRIPTIONS[]>>({
    queryKey: ["subscriptions-plans", user],
    queryFn: async () => {
      let resp = await apiClient.get("/subscriptions/plans");
      return resp.data;
    },
  });

  const subscribeMutation = useMutation({
    mutationFn: async (payload: { planId: string; autoRenew: boolean }) => {
      const resp = await apiClient.post("/subscriptions/subscribe", payload);
      return resp.data;
    },
    onSuccess: () => {
      toast.success("Subscribed successfully!");
      queryClient.invalidateQueries({ queryKey: ["subscriptions", user] });
      closeModal();
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to subscribe");
    },
  });

  const handleConfirmSubscription = () => {
    if (selectedPlan) {
      subscribeMutation.mutate({
        planId: selectedPlan.id,
        autoRenew: autoRenew,
      });
    }
  };

  const handleSubscribeClick = (plan: SUBSCRIPTIONS) => {
    setSelectedPlan(plan);
    showModal();
  };

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

  const actions: Actions[] = [
    {
      key: "subscribe",
      label: "Subscribe",
      action: (item: SUBSCRIPTIONS) => {
        setSelectedPlan(item);
        showModal();
      },
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.data.map((plan) => (
                  <div
                    key={plan.id}
                    className="card ring fade bg-base-100 shadow-xl border border-base-200"
                  >
                    <div className="card-body">
                      <div className="flex justify-between items-start">
                        <h2 className="card-title text-xl font-bold">
                          {plan.name}
                        </h2>
                        <div className="badge badge-secondary">{plan.type}</div>
                      </div>
                      <p className="text-sm text-gray-500 min-h-[3rem]">
                        {plan.description}
                      </p>

                      <div className="my-4">
                        <span className="text-3xl font-bold">
                          ${plan.price}
                        </span>
                        <span className="text-sm text-gray-500">
                          {" "}
                          / {plan.validity} Days
                        </span>
                      </div>

                      <div className="space-y-2 mb-6">
                        <div className="flex items-center gap-2 text-sm">
                          <span
                            className={
                              plan.canViewPremiumProperty
                                ? "text-success"
                                : "text-error"
                            }
                          >
                            {plan.canViewPremiumProperty ? "✓" : "✕"}
                          </span>
                          <span>Premium Property Access</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-primary">✓</span>
                          <span>Max Investments: {plan.maxInvestments}</span>
                        </div>
                      </div>

                      <div className="card-actions justify-end mt-auto">
                        <Button
                          className="w-full"
                          disabled={!plan.isActive}
                          onClick={() => handleSubscribeClick(plan)}
                        >
                          {plan.isActive ? "Subscribe Now" : "Unavailable"}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        }}
      </PageLoader>

      <Modal
        ref={ref}
        title="Confirm Subscription"
        actions={
          <div className="flex gap-3">
            <Button variant="outline" onClick={closeModal}>
              Cancel
            </Button>
            <Button
              onClick={handleConfirmSubscription}
              disabled={subscribeMutation.isPending}
            >
              Confirm & Pay
            </Button>
          </div>
        }
      >
        {selectedPlan && (
          <div className="space-y-4">
            <div className="rounded-xl fade border border-border bg-card p-5 shadow-sm transition-all">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h4 className="text-xl font-bold tracking-tight text-foreground">
                    {selectedPlan.name}
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {selectedPlan.description}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">
                    ${selectedPlan.price}
                  </div>
                  <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                    One-time payment
                  </div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4 border-t border-border fade pt-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Duration
                  </span>
                  <p className="text-sm font-medium text-foreground">
                    {selectedPlan.validity} Days
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Premium Access
                  </span>
                  <p className="text-sm font-medium text-foreground">
                    {selectedPlan.canViewPremiumProperty
                      ? "Included"
                      : "Standard"}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="autoRenew"
                className="checkbox checkbox-primary checkbox-sm"
                checked={autoRenew}
                onChange={(e) => setAutoRenew(e.target.checked)}
              />
              <label
                htmlFor="autorenew"
                className="text-sm font-medium cursor-pointer"
              >
                Enable Auto-renewal
              </label>
            </div>
            <p className="text-xs text-gray-400">
              By clicking confirm, you agree to be charged the plan amount.
            </p>
          </div>
        )}
      </Modal>
    </ThemeProvider>
  );
}

interface CurrentPlan {
  id: string;
  userId: string;
  planId: string;
  startDate: string;
  endDate: string;
  autoRenew: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  plan: {
    id: string;
    type: string;
    description: string;
    price: number;
    validity: number;
    canViewPremiumProperty: boolean;
    maxInvestments: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
  };
}
const CurrentPlan = () => {
  const [auth] = useAuth();
  const user = auth?.user;
  const query = useQuery<ApiResponse<CurrentPlan>>({
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
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 rounded-xl bg-card p-6 shadow-sm">
                  {sub_data ? (
                    <>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
                            Active Plan
                          </span>
                          {sub_data.autoRenew && (
                            <span className="inline-flex items-center rounded-full bg-success/10 px-3 py-1 text-sm font-semibold text-success">
                              Auto-renew On
                            </span>
                          )}
                        </div>
                        <h3 className="text-2xl font-bold text-foreground">
                          {sub_data.plan?.type} Plan
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {sub_data.autoRenew
                            ? `Renews automatically on ${new Date(
                                sub_data.endDate,
                              ).toLocaleDateString()}`
                            : `Expires on ${new Date(
                                sub_data.endDate,
                              ).toLocaleDateString()}`}
                          . Started on{" "}
                          {new Date(sub_data.startDate).toLocaleDateString()}
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm text-muted-foreground mt-4">
                          <div className="flex items-center gap-2">
                            <span
                              className={
                                sub_data.plan?.canViewPremiumProperty
                                  ? "text-success"
                                  : "text-error"
                              }
                            >
                              {sub_data.plan?.canViewPremiumProperty
                                ? "✓"
                                : "✕"}
                            </span>
                            <span>Premium Property Access</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-primary">✓</span>
                            <span>
                              Max Investments: {sub_data.plan?.maxInvestments}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-start md:items-end gap-3">
                        <span className="text-4xl font-extrabold text-primary">
                          ${sub_data.plan?.price || "0"}
                          <span className="text-base font-normal text-muted-foreground">
                            / {sub_data.plan?.validity} Days
                          </span>
                        </span>
                        <Button variant="outline" size="sm">
                          Manage Billing
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <div className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-sm font-semibold text-muted-foreground">
                          Free Tier
                        </div>
                        <h3 className="text-2xl font-bold text-foreground">
                          Free Plan
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Upgrade to unlock premium properties and higher
                          investment limits.
                        </p>
                      </div>
                      {/*<Button className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-md transition-all">
                        Upgrade Now
                      </Button>*/}
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
