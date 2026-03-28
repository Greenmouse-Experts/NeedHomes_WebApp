import { createFileRoute } from "@tanstack/react-router";
import { CreditCard } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/api/simpleApi";
import PageLoader from "@/components/layout/PageLoader";
import CustomTable, { type columnType } from "@/components/tables/CustomTable";
import { usePagination } from "@/helpers/pagination";

export const Route = createFileRoute("/investors/transactions")({
  component: RouteComponent,
});

interface Transaction {
  id: string;
  walletId: string;
  amount: number;
  type: "INVESTMENT" | "DEPOSIT" | "WITHDRAWAL" | "DIVIDEND";
  status: "SUCCESS" | "PENDING" | "FAILED";
  reference: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

const statusBadge: Record<Transaction["status"], string> = {
  SUCCESS: "badge-success",
  PENDING: "badge-warning",
  FAILED: "badge-error",
};

const typeBadge: Record<Transaction["type"], string> = {
  INVESTMENT: "badge-info",
  DEPOSIT: "badge-success",
  WITHDRAWAL: "badge-error",
  DIVIDEND: "badge-secondary",
};

const columns: columnType<Transaction>[] = [
  {
    key: "reference",
    label: "Reference",
    render: (val) => (
      <span className="font-mono text-xs text-base-content/70">{val}</span>
    ),
  },
  {
    key: "type",
    label: "Type",
    render: (val: Transaction["type"]) => (
      <span
        className={`badge badge-soft badge-sm ${typeBadge[val] ?? "badge-ghost"}`}
      >
        {val}
      </span>
    ),
  },
  {
    key: "amount",
    label: "Amount",
    render: (val: number) => (
      <span className="font-semibold">₦{val.toLocaleString("en-NG")}</span>
    ),
  },
  {
    key: "status",
    label: "Status",
    render: (val: Transaction["status"]) => (
      <span
        className={`badge badge-soft badge-sm ${statusBadge[val] ?? "badge-ghost"}`}
      >
        {val}
      </span>
    ),
  },
  {
    key: "createdAt",
    label: "Date",
    render: (val: string) => (
      <span className="text-sm text-base-content/70">
        {new Date(val).toLocaleDateString("en-NG", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })}
      </span>
    ),
  },
];

function RouteComponent() {
  const paginationProps = usePagination();

  const query = useQuery({
    queryKey: ["transactions", paginationProps.page],
    queryFn: async () => {
      let resp = await apiClient.get(
        "/investments/my-investments/transactions",
        { params: { page: paginationProps.page } },
      );
      return resp.data;
    },
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <CreditCard className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Transactions</h1>
        </div>
        <p className="text-base-content/60 text-sm">
          View your investment transaction history.
        </p>
      </div>

      <PageLoader query={query}>
        {(resp) => {
          const data: Transaction[] = resp.data.data ?? [];
          return (
            <CustomTable
              data={data}
              columns={columns}
              totalCount={data.length}
              paginationProps={paginationProps}
            />
          );
        }}
      </PageLoader>
    </div>
  );
}
