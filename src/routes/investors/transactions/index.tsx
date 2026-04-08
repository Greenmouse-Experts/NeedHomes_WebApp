import { createFileRoute } from "@tanstack/react-router";
import { CreditCard, Download } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/api/simpleApi";
import PageLoader from "@/components/layout/PageLoader";
import CustomTable, { type columnType } from "@/components/tables/CustomTable";
import { usePagination } from "@/helpers/pagination";
import { Button } from "@/components/ui/Button";
import type { Actions } from "@/components/tables/pop-up";
import LocalSelect from "@/simpleComps/inputs/LocalSelect";
import SearchBar from "@/routes/-components/Searchbar";
import ThemeProvider from "@/simpleComps/ThemeProvider";

export const Route = createFileRoute("/investors/transactions/")({
  component: RouteComponent,
});

interface Transaction {
  id: string;
  walletId: string;
  amount: number;
  type: "INVESTMENT" | "DEPOSIT" | "WITHDRAWAL";
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
      <span className="font-semibold">
        ₦{(val / 100).toLocaleString("en-NG", { minimumFractionDigits: 2 })}
      </span>
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

const actions: Actions<Transaction>[] = [
  {
    key: "view",
    label: "View Details",
    action: (item, nav) => {
      nav({ to: "/investors/transactions/$id", params: { id: item.id } });
    },
  },
];

function RouteComponent() {
  const paginationProps = usePagination();
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [projectStartDate, setprojectStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [exporting, setExporting] = useState(false);

  const params = {
    page: paginationProps.page,
    ...(type && { type }),
    ...(status && { status }),
    ...(search && { search }),
    ...(projectStartDate && { projectStartDate }),
    ...(endDate && { endDate }),
  };

  const query = useQuery({
    queryKey: ["transactions", params],
    queryFn: async () => {
      const resp = await apiClient.get("wallet-trx", { params });
      return resp.data;
    },
  });

  const handleExport = async () => {
    setExporting(true);
    try {
      const exportParams = {
        ...(type && { type }),
        ...(status && { status }),
        ...(search && { search }),
        ...(projectStartDate && { projectStartDate }),
        ...(endDate && { endDate }),
      };
      const resp = await apiClient.get("wallet-trx/export", {
        params: exportParams,
        responseType: "blob",
      });
      const url = URL.createObjectURL(resp.data);
      const a = document.createElement("a");
      a.href = url;
      a.download = `transactions-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <CreditCard className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">Transactions</h1>
          </div>
          <p className="text-base-content/60 text-sm">
            View and export your transaction history.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleExport}
          disabled={exporting}
          leftIcon={<Download className="w-4 h-4" />}
        >
          {exporting ? "Exporting…" : "Export CSV"}
        </Button>
      </div>

      {/* Filters */}
      <ThemeProvider className="bg-white border border-gray-200 rounded-xl p-4 flex-none">
        <div className="flex flex-col gap-3">
          <SearchBar
            value={search}
            onChange={(val: string) => setSearch(val)}
          />
          <div className="flex flex-wrap gap-3 items-end">
            <LocalSelect value={type} onChange={(e) => setType(e.target.value)}>
              <option value="">All Types</option>
              <option value="DEPOSIT">Deposit</option>
              <option value="INVESTMENT">Investment</option>
              <option value="WITHDRAWAL">Withdrawal</option>
            </LocalSelect>
            <LocalSelect
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="SUCCESS">Success</option>
              <option value="PENDING">Pending</option>
              <option value="FAILED">Failed</option>
            </LocalSelect>
            <div className="flex-1 min-w-[140px]">
              <div className="fieldset-label font-semibold mb-2">
                <span className="text-sm">From</span>
              </div>
              <input
                type="date"
                value={projectStartDate}
                onChange={(e) => setprojectStartDate(e.target.value)}
                className="input input-bordered w-full"
              />
            </div>
            <div className="flex-1 min-w-[140px]">
              <div className="fieldset-label font-semibold mb-2">
                <span className="text-sm">To</span>
              </div>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="input input-bordered w-full"
              />
            </div>
            {(type || status || search || projectStartDate || endDate) && (
              <button
                className="btn btn-outline btn-sm self-end h-[42px]"
                onClick={() => {
                  setType("");
                  setStatus("");
                  setSearch("");
                  setprojectStartDate("");
                  setEndDate("");
                }}
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </ThemeProvider>

      <PageLoader query={query}>
        {(resp) => {
          const data: Transaction[] = resp.data?.data ?? [];
          const meta = resp.data?.meta;
          return (
            <CustomTable
              data={data}
              columns={columns}
              actions={actions}
              totalCount={meta?.total ?? data.length}
              paginationProps={paginationProps}
            />
          );
        }}
      </PageLoader>
    </div>
  );
}
