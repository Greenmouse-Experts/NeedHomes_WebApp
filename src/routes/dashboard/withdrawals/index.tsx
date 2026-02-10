import apiClient, { type ApiResponseV2 } from "@/api/simpleApi";
import PageLoader from "@/components/layout/PageLoader";
import CustomTable, { type columnType } from "@/components/tables/CustomTable";
import type { Actions } from "@/components/tables/pop-up";
import type { withdrawal_reqeust } from "@/types/withdrawals";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import Toolbar from "../-components/ToolBar";
import ToolbarSec from "../-components/ToolBar";

export const Route = createFileRoute("/dashboard/withdrawals/")({
  component: RouteComponent,
});

function RouteComponent() {
  const query = useQuery<ApiResponseV2<withdrawal_reqeust[]>>({
    queryKey: ["withdrawals"],
    queryFn: async () => {
      let resp = await apiClient.get("/admin/withdrawals");
      return resp.data;
    },
  });

  const columns: columnType<withdrawal_reqeust>[] = [
    {
      key: "user",
      label: "User",
      render: (_, item) => (
        <div className="flex flex-col">
          <span className="font-medium text-base-content">
            {item.user.firstName} {item.user.lastName}
          </span>
          <span className="text-xs opacity-60">{item.user.email}</span>
        </div>
      ),
    },
    {
      key: "amount",
      label: "Amount",
      render: (value) => (
        <span className="font-semibold">
          {new Intl.NumberFormat("en-NG", {
            style: "currency",
            currency: "NGN",
          }).format(value)}
        </span>
      ),
    },
    {
      key: "bankName",
      label: "Bank Details",
      render: (_, item) => (
        <div className="flex flex-col">
          <span className="text-sm">{item.bankName}</span>
          <span className="text-xs opacity-60">{item.accountNumber}</span>
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (value) => (
        <div
          className={`badge badge-sm badge-soft ring fade font-bold ${
            value === "APPROVED"
              ? "badge-success"
              : value === "PENDING"
                ? "badge-warning"
                : "badge-error"
          }`}
        >
          {value}
        </div>
      ),
    },
    {
      key: "createdAt",
      label: "Date",
      render: (value) => new Date(value).toLocaleDateString(),
    },
  ];

  const actions: Actions[] = [
    {
      key: "view",
      label: "View Details",
      action: (item, nav) => {
        console.log("Viewing withdrawal", item.id);
      },
    },
    {
      key: "approve",
      label: "Approve",
      action: (item) => {
        if (item.status === "PENDING") {
          console.log("Approving", item.id);
        }
      },
    },
  ];

  return (
    <PageLoader query={query}>
      {(resp) => {
        const list = resp.data.data;
        return (
          <>
            <section className="p-6 bg-white rounded-xl ring fade">
              <div className="mb-6 ">
                <h1 className="text-xl font-bold">Withdrawal Requests</h1>
                <p className="text-base-content/60">
                  Manage and process user withdrawal requests and bank
                  transfers.
                </p>
              </div>
              <ToolbarSec />
              <CustomTable columns={columns} data={list} actions={actions} />
            </section>
          </>
        );
      }}
    </PageLoader>
  );
}
