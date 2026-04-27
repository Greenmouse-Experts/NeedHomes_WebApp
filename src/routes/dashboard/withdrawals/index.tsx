import apiClient, { type ApiResponseV2 } from "@/api/simpleApi";
import PageLoader from "@/components/layout/PageLoader";
import CustomTable, { type columnType } from "@/components/tables/CustomTable";
import type { Actions } from "@/components/tables/pop-up";
import type { withdrawal_reqeust } from "@/types/withdrawals";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import ToolbarSec from "../-components/ToolBar";
import WithdrawalStats from "./-components/WithdrawalStats";
import SearchBar from "@/routes/-components/Searchbar";

type Status = "PENDING" | "COMPLETED" | "FAILED" | "PROCESSING";
type AccountType = "INDIVIDUAL" | "CORPORATE" | "PARTNER" | "ADMIN";

const STATUS_OPTIONS: { label: string; value: Status | "" }[] = [
  { label: "All", value: "" },
  { label: "Pending", value: "PENDING" },
  { label: "Processing", value: "PROCESSING" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Failed", value: "FAILED" },
];

const ACCOUNT_TYPE_OPTIONS: { label: string; value: AccountType | "" }[] = [
  { label: "All Users", value: "" },
  { label: "Individual", value: "INDIVIDUAL" },
  { label: "Corporate", value: "CORPORATE" },
  { label: "Partner", value: "PARTNER" },
  { label: "Admin", value: "ADMIN" },
];

export const Route = createFileRoute("/dashboard/withdrawals/")({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>) => ({
    status: (search.status as Status) || "",
    q: (search.q as string) || "",
    accountType: (search.accountType as AccountType) || "",
  }),
});

function RouteComponent() {
  const navigate = useNavigate();
  const { status, q, accountType } = Route.useSearch();

  const query = useQuery<ApiResponseV2<withdrawal_reqeust[]>>({
    queryKey: ["withdrawals", status, q, accountType],
    queryFn: async () => {
      let resp = await apiClient.get("/admin/withdrawals", {
        params: {
          ...(status && { status }),
          ...(q && { search: q }),
          ...(accountType && { accountType }),
        },
      });
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
          }).format(value / 100)}
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
            value === "APPROVED" || value === "COMPLETED"
              ? "badge-success"
              : value === "PENDING"
                ? "badge-warning"
                : value === "PROCESSING"
                  ? "badge-info"
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
        nav({
          to: `/dashboard/withdrawals/${item.id}`,
        });
      },
    },
    // {
    //   key: "approve",
    //   label: "Approve",
    //   action: (item) => {
    //     if (item.status === "PENDING") {
    //       console.log("Approving", item.id);
    //     }
    //   },
    // },
  ];

  return (
    <>
      <WithdrawalStats />
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
                {/*<ToolbarSec />*/}
                <div className="mb-4">
                  <SearchBar
                    value={q}
                    onChange={(val: string) =>
                      navigate({ search: { status, q: val, accountType }, replace: true })
                    }
                  />
                </div>
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <select
                    value={accountType}
                    onChange={(e) =>
                      navigate({
                        search: { status, q, accountType: e.target.value as AccountType },
                        replace: true,
                      })
                    }
                    className="select select-bordered select-sm"
                  >
                    {ACCOUNT_TYPE_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {STATUS_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() =>
                        navigate({
                          search: { status: opt.value as Status, q, accountType },
                          replace: true,
                        })
                      }
                      className={`btn btn-sm ${
                        status === opt.value ? "btn-primary" : "btn-outline"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
                <CustomTable columns={columns} data={list} actions={actions} />
              </section>
            </>
          );
        }}
      </PageLoader>
    </>
  );
}
