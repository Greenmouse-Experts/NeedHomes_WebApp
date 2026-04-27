import apiClient, { type ApiResponse } from "@/api/simpleApi";
import { Button } from "@/components/ui/Button";
import { DropdownMenu, DropdownMenuItem } from "@/components/ui/DropdownMenu";
import { useQuery } from "@tanstack/react-query";
import {
  Building2,
  ChevronDown,
  FileText,
  TrendingUp,
  Wallet,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
const COLORS = ["#10B981", "#F59E0B", "#EF4444"];

interface MonthlyFee {
  month: string;
  year: number;
  monthIndex: number;
  totalFees: number;
}

interface AdminStats {
  users: {
    totalRegisteredUsers: number;
    activeInvestorPercentage: number;
    verifiedInvestorCount: number;
    totalInvestorCount: number;
    activePartnerPercentage: number;
    verifiedPartnerCount: number;
    totalPartnerCount: number;
  };
  partners: {
    partnerAgentActivationRate: number;
    verifiedPartnersTotal: number;
    verifiedPartnersWithPromotions: number;
  };
  transactions: {
    transactionSuccessRate: number;
    totalSuccessful: number;
    totalFailed: number;
    totalPending: number;
    totalTransactions: number;
  };
  generatedAt: string;
}

export default function DashIncomeStats() {
  const query = useQuery<ApiResponse<AdminStats>>({
    queryKey: ["admin_dash_stats"],
    queryFn: async () => {
      const resp = await apiClient.get("analytics/dashboard");
      return resp.data;
    },
  });

  const feesQuery = useQuery<ApiResponse<MonthlyFee[]>>({
    queryKey: ["monthly-additional-fees"],
    queryFn: async () => {
      const resp = await apiClient.get(
        "analytics/dashboard/monthly-additional-fees",
      );
      return resp.data;
    },
  });

  const stats = query.data?.data?.transactions;
  const revenueData = (feesQuery.data?.data ?? []).map((d) => ({
    month: d.month,
    fees: d.totalFees / 100,
  }));

  const chartData = stats
    ? [
        { label: "Successful", count: stats.totalSuccessful },
        { label: "Pending", count: stats.totalPending },
        { label: "Failed", count: stats.totalFailed },
      ]
    : [];

  const pieData = stats
    ? [
        { name: "Successful", value: stats.totalSuccessful },
        { name: "Pending", value: stats.totalPending },
        { name: "Failed", value: stats.totalFailed },
      ]
    : [];

  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mt-8">
      {/* Revenue Trend Chart */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 md:mb-6">
          <div>
            <h3 className="text-base md:text-lg font-bold text-gray-900">
              Additional Fees — Last 12 Months
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <TrendingUp className="w-3.5 h-3.5 md:w-4 md:h-4 text-green-600" />
              <span className="text-xs md:text-sm font-semibold text-green-600">
                {stats
                  ? `${stats.transactionSuccessRate.toFixed(1)}% success rate`
                  : "—"}
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
        <div className="h-48 md:h-64 ">
          <ResponsiveContainer
            width="100%"
            height="100%"
            className={" overflow-hidden"}
          >
            <AreaChart className="-mx-4" data={revenueData}>
              <defs>
                <linearGradient id="colorFees" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="month" stroke="#6B7280" tick={{ fontSize: 11 }} />
              <YAxis
                stroke="#6B7280"
                tick={{ fontSize: 11 }}
                tickFormatter={(v) =>
                  new Intl.NumberFormat("en-NG", {
                    notation: "compact",
                    compactDisplay: "short",
                  }).format(v)
                }
                width={60}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #E5E7EB",
                  borderRadius: "8px",
                  padding: "8px",
                }}
                formatter={(value: number) => [
                  new Intl.NumberFormat("en-NG", {
                    style: "currency",
                    currency: "NGN",
                    minimumFractionDigits: 2,
                  }).format(value),
                  "Additional Fees",
                ]}
              />
              <Area
                type="monotone"
                dataKey="fees"
                stroke="#10B981"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorFees)"
                name="Additional Fees"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-sm text-gray-600">
              Additional Fees (last 12 months)
            </span>
          </div>
        </div>
      </div>

      {/* Income Summary */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 md:mb-6">
          <div>
            <h3 className="text-base md:text-lg font-bold text-gray-900">
              Transaction Summary
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Total:{" "}
              <span className="font-semibold text-gray-700">
                {stats?.totalTransactions?.toLocaleString() ?? "—"}
              </span>{" "}
              transactions
            </p>
          </div>
          {/*<DropdownMenu
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
          </DropdownMenu>*/}
        </div>

        {/* Pie Chart */}
        <div className="h-40 md:h-48 mb-4 md:mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
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
                {pieData.map((_, index) => (
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
          <div className="flex items-center justify-between p-2.5 md:p-3 bg-green-50 rounded-lg">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="p-1.5 md:p-2 bg-green-100 rounded-lg">
                <Building2 className="w-4 h-4 md:w-5 md:h-5 text-green-600" />
              </div>
              <span className="text-xs md:text-sm font-medium text-gray-700">
                Successful
              </span>
            </div>
            <span className="text-base md:text-lg font-bold text-green-600">
              {stats?.totalSuccessful?.toLocaleString() ?? "—"}
            </span>
          </div>
          <div className="flex items-center justify-between p-2.5 md:p-3 bg-yellow-50 rounded-lg">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="p-1.5 md:p-2 bg-yellow-100 rounded-lg">
                <Wallet className="w-4 h-4 md:w-5 md:h-5 text-yellow-600" />
              </div>
              <span className="text-xs md:text-sm font-medium text-gray-700">
                Pending
              </span>
            </div>
            <span className="text-base md:text-lg font-bold text-yellow-600">
              {stats?.totalPending?.toLocaleString() ?? "—"}
            </span>
          </div>
          <div className="flex items-center justify-between p-2.5 md:p-3 bg-red-50 rounded-lg">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="p-1.5 md:p-2 bg-red-100 rounded-lg">
                <FileText className="w-4 h-4 md:w-5 md:h-5 text-red-600" />
              </div>
              <span className="text-xs md:text-sm font-medium text-gray-700">
                Failed
              </span>
            </div>
            <span className="text-base md:text-lg font-bold text-red-600">
              {stats?.totalFailed?.toLocaleString() ?? "—"}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
