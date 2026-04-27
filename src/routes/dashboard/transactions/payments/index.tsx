import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  TrendingUp,
  Wallet,
  Building2,
  FileText,
  CheckCircle2,
  Clock,
  ChevronDown,
  ArrowUpDown,
} from "lucide-react";
import SearchBar from "@/routes/-components/Searchbar";
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { DropdownMenu, DropdownMenuItem } from "@/components/ui/DropdownMenu";
import { useQuery } from "@tanstack/react-query";
import apiClient, { type ApiResponseV2 } from "@/api/simpleApi";
import PageLoader from "@/components/layout/PageLoader";
import CustomTable, { type columnType } from "@/components/tables/CustomTable";
import type { Actions } from "@/components/tables/pop-up";
import TransStats from "../-components/TransStats";
import { usePagination } from "@/helpers/pagination";

export const Route = createFileRoute("/dashboard/transactions/payments/")({
  component: PaymentsPage,
});

const statusConfig: Record<
  string,
  { color: string; icon: typeof CheckCircle2 }
> = {
  SUCCESS: { color: "bg-green-100 text-green-700", icon: CheckCircle2 },
  PENDING: { color: "bg-orange-100 text-orange-700", icon: Clock },
  FAILED: { color: "bg-red-100 text-red-700", icon: CheckCircle2 },
};

function StatusBadge({ status }: { status: string }) {
  const config = statusConfig[status] ?? statusConfig.PENDING;
  const Icon = config.icon;
  return (
    <div
      className={`${config.color} inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full`}
    >
      <Icon className="w-3.5 h-3.5 flex-shrink-0" />
      <span className="text-sm font-medium whitespace-nowrap">{status}</span>
    </div>
  );
}

const columns: columnType<Transaction>[] = [
  { key: "reference", label: "Transaction ID" },
  {
    key: "createdAt",
    label: "Date",
    render: (value: string) =>
      new Date(value).toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
  },
  {
    key: "wallet",
    label: "User Name",
    render: (_: any, item: Transaction) =>
      `${item.wallet?.user?.firstName ?? ""} ${item.wallet?.user?.lastName ?? ""}`.trim(),
  },
  {
    key: "amount",
    label: "Amount",
    render: (value: number) =>
      `₦${Number(value).toLocaleString("en-NG", { minimumFractionDigits: 2 })}`,
  },
  { key: "type", label: "Type" },
  {
    key: "status",
    label: "Status",
    render: (value: string) => <StatusBadge status={value} />,
  },
];

const actions: Actions<Transaction>[] = [
  {
    key: "view-details",
    label: "View Details",
    action: (item, nav) => {
      nav({ to: `/dashboard/transactions/payments/${item.id}` });
    },
  },
];

function PaymentsPage() {
  const props = usePagination();
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sortBy, setSortBy] = useState<"createdAt" | "amount">("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const query = useQuery<ApiResponseV2<Transaction[]>>({
    queryKey: [
      "admin-transactions",
      props.page,
      search,
      type,
      status,
      startDate,
      endDate,
      sortBy,
      sortOrder,
    ],
    queryFn: async () => {
      let resp = await apiClient.get("admin/transactions/", {
        params: {
          page: props.page,
          ...(search && { search }),
          ...(type && { type }),
          ...(status && { status }),
          ...(startDate && { startDate }),
          ...(endDate && { endDate }),
          sortBy,
          sortOrder,
        },
      });
      return resp.data;
    },
  });

  // Chart data
  const revenueData = [
    { month: "Jan", income: 200, expenses: 150 },
    { month: "Feb", income: 210, expenses: 160 },
    { month: "Mar", income: 220, expenses: 170 },
    { month: "Apr", income: 215, expenses: 165 },
    { month: "May", income: 230, expenses: 180 },
    { month: "Jun", income: 240, expenses: 190 },
    { month: "Jul", income: 235, expenses: 185 },
    { month: "Aug", income: 245, expenses: 195 },
    { month: "Sep", income: 250, expenses: 200 },
    { month: "Oct", income: 248, expenses: 198 },
    { month: "Nov", income: 255, expenses: 205 },
    { month: "Dec", income: 260, expenses: 210 },
  ];

  const incomeSummaryData = [
    { name: "Investment", value: 1754, color: "#3B82F6" },
    { name: "Partners", value: 873, color: "#EF671D" },
    { name: "Projects", value: 685, color: "#6B7280" },
  ];

  const COLORS = ["#3B82F6", "#EF671D", "#6B7280"];

  return (
    <>
      {/* Stats Cards */}
      <TransStats />

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4 md:mb-6 space-y-3">
        {/* Row 1: Search */}
        <SearchBar value={search} onChange={(val: string) => setSearch(val)} />

        {/* Row 2: Type, Status, Date range, Sort */}
        <div className="flex flex-wrap gap-2 items-end">
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="select select-bordered select-sm"
          >
            <option value="">All Types</option>
            <option value="DEPOSIT">Deposit</option>
            <option value="WITHDRAWAL">Withdrawal</option>
            <option value="INVESTMENT">Investment</option>
          </select>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="select select-bordered select-sm"
          >
            <option value="">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="SUCCESS">Success</option>
            <option value="FAILED">Failed</option>
          </select>

          <div className="flex items-end gap-2">
            <div>
              <label className="label label-text text-xs pb-1">From</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="input input-bordered input-sm"
              />
            </div>
            <div>
              <label className="label label-text text-xs pb-1">To</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="input input-bordered input-sm"
              />
            </div>
          </div>

          <div className="flex gap-2 ml-auto">
            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value as "createdAt" | "amount")
              }
              className="select select-bordered select-sm"
            >
              <option value="createdAt">Sort: Date</option>
              <option value="amount">Sort: Amount</option>
            </select>
            <button
              onClick={() =>
                setSortOrder((o) => (o === "asc" ? "desc" : "asc"))
              }
              className="btn btn-sm btn-outline gap-1"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
              {sortOrder === "asc" ? "Asc" : "Desc"}
            </button>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="mb-4 md:mb-6">
        <PageLoader query={query}>
          {(resp) => {
            const data: Transaction[] = resp.data?.data ?? [];
            const total = resp.data?.meta?.total ?? data.length;
            return (
              <CustomTable
                data={data}
                columns={columns}
                actions={actions}
                totalCount={total}
                paginationProps={props}
              />
            );
          }}
        </PageLoader>
      </div>

      {/* Charts Section */}
    </>
  );
}
