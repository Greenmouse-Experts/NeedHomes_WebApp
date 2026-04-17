import { createFileRoute } from "@tanstack/react-router";
import {
  CreditCard,
  Download,
  ArrowUpRight,
  ArrowDownLeft,
} from "lucide-react";
import SearchBar from "@/routes/-components/Searchbar";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import apiClient, { type ApiResponseV2 } from "@/api/simpleApi";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";

import { toast } from "sonner";
import { extract_message } from "@/helpers/apihelpers";

export const Route = createFileRoute("/partners/transactions")({
  component: RouteComponent,
});

interface Transaction {
  id: string;
  reference: string;
  type: "PROMOTION" | "WITHDRAWAL";
  amount: number;
  status: "PENDING" | "SUCCESS" | "FAILED";
  createdAt: string;
}

interface TransactionMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

function formatNGN(kobo: number) {
  return `₦ ${(kobo / 100).toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

const STATUS_BADGE: Record<string, string> = {
  SUCCESS: "bg-green-100 text-green-800",
  PENDING: "bg-yellow-100 text-yellow-800",
  FAILED: "bg-red-100 text-red-800",
};

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_BADGE[status] ?? "bg-gray-100 text-gray-800"}`}
    >
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </span>
  );
}

function TypeIcon({ type }: { type: string }) {
  if (type === "PROMOTION") {
    return (
      <div className="p-2 bg-green-100 rounded-full">
        <ArrowDownLeft className="w-4 h-4 text-green-600" />
      </div>
    );
  }
  return (
    <div className="p-2 bg-red-100 rounded-full">
      <ArrowUpRight className="w-4 h-4 text-red-600" />
    </div>
  );
}

function RouteComponent() {
  const [page, setPage] = useState(1);
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [search, setSearch] = useState("");
  const [exportLoading, setExportLoading] = useState(false);

  const params = {
    page,
    limit: 20,
    ...(type && { type }),
    ...(status && { status }),
    ...(startDate && { startDate }),
    ...(endDate && { endDate }),
    ...(search && { search }),
  };

  const query = useQuery<ApiResponseV2<Transaction[]>>({
    queryKey: ["partner-transactions", params],
    queryFn: async () => {
      const res = await apiClient.get("/partners/transactions", { params });
      return res.data;
    },
  });

  const transactions: Transaction[] = query.data?.data?.data ?? [];
  const meta: TransactionMeta = query.data?.data?.meta ?? {
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 1,
  };

  const handleExport = async () => {
    setExportLoading(true);
    try {
      const exportParams = {
        ...(type && { type }),
        ...(status && { status }),
        ...(startDate && { startDate }),
        ...(endDate && { endDate }),
      };
      const res = await apiClient.get("/partners/transactions/export", {
        params: exportParams,
        responseType: "blob",
      });
      const url = URL.createObjectURL(res.data);
      const a = document.createElement("a");
      a.href = url;
      a.download = `partner-transactions-${new Date().toISOString().split("T")[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      toast.error(extract_message(err));
    } finally {
      setExportLoading(false);
    }
  };

  const hasFilters = !!(type || status || startDate || endDate || search);

  return (
    <div className="flex flex-col gap-6">
      <div className="mb-2">
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <CreditCard className="h-6 w-6 text-indigo-600" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Transactions
          </h1>
        </div>
        <p className="text-gray-600 text-sm sm:text-base">
          View your promotion commissions and withdrawals.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Filters */}
        <div className="p-4 border-b border-gray-200 flex flex-col gap-3">
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            <div className="flex-1 max-w-sm">
              <SearchBar
                value={search}
                onChange={(val: string) => {
                  setSearch(val);
                  setPage(1);
                }}
              />
            </div>

            <Select
              className="w-full md:w-44"
              value={type}
              onChange={(e) => {
                setType(e.target.value);
                setPage(1);
              }}
              options={[
                { value: "", label: "All Types" },
                { value: "PROMOTION", label: "Promotion" },
                { value: "WITHDRAWAL", label: "Withdrawal" },
              ]}
            />

            <Select
              className="w-full md:w-44"
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
              options={[
                { value: "", label: "All Statuses" },
                { value: "PENDING", label: "Pending" },
                { value: "SUCCESS", label: "Success" },
                { value: "FAILED", label: "Failed" },
              ]}
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex items-center gap-2 flex-1">
              <Input
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  setPage(1);
                }}
                className="flex-1"
              />
              <span className="text-gray-400 text-sm shrink-0">to</span>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  setPage(1);
                }}
                className="flex-1"
              />
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {hasFilters && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setType("");
                    setStatus("");
                    setStartDate("");
                    setEndDate("");
                    setSearch("");
                    setPage(1);
                  }}
                >
                  Clear
                </Button>
              )}
              <Button
                variant="outline"
                className="flex items-center gap-2 text-gray-600"
                onClick={handleExport}
                disabled={exportLoading}
              >
                <Download className="w-4 h-4" />
                {exportLoading ? "Exporting..." : "Export CSV"}
              </Button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {query.isLoading ? (
            <div className="flex items-center justify-center py-16 text-gray-400 text-sm">
              Loading transactions...
            </div>
          ) : query.isError ? (
            <div className="flex items-center justify-center py-16 text-red-500 text-sm">
              Failed to load transactions.
            </div>
          ) : transactions.length === 0 ? (
            <div className="flex items-center justify-center py-16 text-gray-400 text-sm">
              No transactions found.
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Reference
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions.map((trx) => (
                  <tr
                    key={trx.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <TypeIcon type={trx.type} />
                        <span className="text-sm font-medium text-gray-900">
                          {trx.type.charAt(0) +
                            trx.type.slice(1).toLowerCase()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-500 font-mono">
                        {trx.reference}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(trx.createdAt).toLocaleDateString("en-NG", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          timeZone: "Africa/Lagos",
                        })}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(trx.createdAt).toLocaleTimeString("en-NG", {
                          hour: "2-digit",
                          minute: "2-digit",
                          timeZone: "Africa/Lagos",
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`text-sm font-bold ${trx.type === "PROMOTION" ? "text-green-600" : "text-gray-900"}`}
                      >
                        {formatNGN(trx.amount)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={trx.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            {meta.total > 0 ? (
              <>
                Showing{" "}
                <span className="font-medium">
                  {(meta.page - 1) * meta.limit + 1}
                </span>{" "}
                –{" "}
                <span className="font-medium">
                  {Math.min(meta.page * meta.limit, meta.total)}
                </span>{" "}
                of <span className="font-medium">{meta.total}</span> results
              </>
            ) : (
              "No results"
            )}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1 || query.isLoading}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </Button>
            <span className="text-sm text-gray-500">
              {meta.page} / {meta.totalPages || 1}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= meta.totalPages || query.isLoading}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
