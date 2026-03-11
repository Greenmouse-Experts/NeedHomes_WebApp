import { createFileRoute } from "@tanstack/react-router";
import {
  TrendingUp,
  Wallet,
  Building2,
  FileText,
  DollarSign,
  CreditCard,
  CheckCircle2,
  Clock,
  ChevronDown,
} from "lucide-react";
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
  const query = useQuery<ApiResponseV2<Transaction[]>>({
    queryKey: ["admin-transactions", props.page],
    queryFn: async () => {
      let resp = await apiClient.get("admin/transactions/", {
        params: {
          page: props.page,
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

      {/* Transactions Table */}
      <div className="mb-4 md:mb-6">
        <PageLoader query={query}>
          {(resp) => {
            const data: Transaction[] = resp.data?.data ?? [];
            return (
              <CustomTable
                data={data}
                columns={columns}
                actions={actions}
                totalCount={data.length}
                paginationProps={props}
              />
            );
          }}
        </PageLoader>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Revenue Trend Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 md:mb-6">
            <div>
              <h3 className="text-base md:text-lg font-bold text-gray-900">
                Today Revenue Trend
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <TrendingUp className="w-3.5 h-3.5 md:w-4 md:h-4 text-green-600" />
                <span className="text-xs md:text-sm font-semibold text-green-600">
                  24.6%
                </span>
              </div>
            </div>
            <DropdownMenu
              trigger={
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 text-xs md:text-sm"
                >
                  <span className="hidden sm:inline">Jan 2024 - Dec 2024</span>
                  <span className="sm:hidden">2024</span>
                  <ChevronDown className="w-3.5 h-3.5 md:w-4 md:h-4" />
                </Button>
              }
            >
              <DropdownMenuItem>Jan 2024 - Dec 2024</DropdownMenuItem>
              <DropdownMenuItem>Jan 2023 - Dec 2023</DropdownMenuItem>
              <DropdownMenuItem>Jan 2022 - Dec 2022</DropdownMenuItem>
            </DropdownMenu>
          </div>

          {/* Chart */}
          <div className="h-48 md:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient
                    id="colorExpenses"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#EF671D" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#EF671D" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis
                  dataKey="month"
                  stroke="#6B7280"
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  stroke="#6B7280"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `${value}K`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #E5E7EB",
                    borderRadius: "8px",
                    padding: "8px",
                  }}
                  formatter={(value: number) => [`₦${value}K`, ""]}
                />
                <Area
                  type="monotone"
                  dataKey="income"
                  stroke="#10B981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorIncome)"
                  name="Income"
                />
                <Area
                  type="monotone"
                  dataKey="expenses"
                  stroke="#EF671D"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorExpenses)"
                  name="Expenses"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-sm text-gray-600">Income</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[var(--color-orange)]"></div>
              <span className="text-sm text-gray-600">Expenses</span>
            </div>
          </div>
        </div>

        {/* Income Summary */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 md:mb-6">
            <h3 className="text-base md:text-lg font-bold text-gray-900">
              Income Summary
            </h3>
            <DropdownMenu
              trigger={
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 text-xs md:text-sm"
                >
                  Sort by
                  <ChevronDown className="w-3.5 h-3.5 md:w-4 md:h-4" />
                </Button>
              }
            >
              <DropdownMenuItem>Amount</DropdownMenuItem>
              <DropdownMenuItem>Date</DropdownMenuItem>
              <DropdownMenuItem>Type</DropdownMenuItem>
            </DropdownMenu>
          </div>

          {/* Pie Chart */}
          <div className="h-40 md:h-48 mb-4 md:mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={incomeSummaryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {incomeSummaryData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #E5E7EB",
                    borderRadius: "8px",
                    padding: "8px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Statistics */}
          <div className="space-y-2 md:space-y-3">
            <div className="flex items-center justify-between p-2.5 md:p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="p-1.5 md:p-2 bg-blue-100 rounded-lg">
                  <Building2 className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
                </div>
                <span className="text-xs md:text-sm font-medium text-gray-700">
                  Investment
                </span>
              </div>
              <span className="text-base md:text-lg font-bold text-blue-600">
                1,754
              </span>
            </div>
            <div className="flex items-center justify-between p-2.5 md:p-3 bg-orange-50 rounded-lg">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="p-1.5 md:p-2 bg-orange-100 rounded-lg">
                  <Wallet className="w-4 h-4 md:w-5 md:h-5 text-[var(--color-orange)]" />
                </div>
                <span className="text-xs md:text-sm font-medium text-gray-700">
                  Partners
                </span>
              </div>
              <span className="text-base md:text-lg font-bold text-[var(--color-orange)]">
                873
              </span>
            </div>
            <div className="flex items-center justify-between p-2.5 md:p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="p-1.5 md:p-2 bg-gray-100 rounded-lg">
                  <FileText className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
                </div>
                <span className="text-xs md:text-sm font-medium text-gray-700">
                  Projects
                </span>
              </div>
              <span className="text-base md:text-lg font-bold text-gray-600">
                685
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
