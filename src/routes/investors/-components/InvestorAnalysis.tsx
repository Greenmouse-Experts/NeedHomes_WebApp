import apiClient, { type ApiResponse } from "@/api/simpleApi";
import { useQuery } from "@tanstack/react-query";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface CashflowMonth {
  month: string;
  year: number;
  monthIndex: number;
  inflow: number;
  outflow: number;
}

const fmt = (kobo: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(kobo / 100);

export default function InvestorAnalysis() {
  const query = useQuery<ApiResponse<CashflowMonth[]>>({
    queryKey: ["partner-analysis"],
    queryFn: async () => {
      let resp = await apiClient.get("/analytics/investor/cashflow");
      return resp.data;
    },
  });

  const chartData = (query.data?.data ?? []).map((d) => ({
    month: d.month,
    inflow: d.inflow / 100,
    outflow: d.outflow / 100,
  }));

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
      <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-4 md:mb-6">
        Monthly Cashflow
      </h3>

      <div className="h-56 md:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 4, right: 8, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorInflow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorOutflow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#EF671D" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#EF671D" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="#6B7280" />
            <YAxis
              tick={{ fontSize: 11 }}
              stroke="#6B7280"
              width={65}
              tickFormatter={(v) =>
                new Intl.NumberFormat("en-NG", {
                  notation: "compact",
                  compactDisplay: "short",
                }).format(v)
              }
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #E5E7EB",
                borderRadius: "8px",
                padding: "8px",
              }}
              formatter={(value: number, name: string) => [
                fmt(value * 100),
                name === "inflow" ? "Inflow" : "Outflow",
              ]}
            />
            <Area
              type="monotone"
              dataKey="inflow"
              stroke="#10B981"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorInflow)"
              name="inflow"
            />
            <Area
              type="monotone"
              dataKey="outflow"
              stroke="#EF671D"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorOutflow)"
              name="outflow"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center gap-4 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="text-xs text-gray-500">Inflow</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[var(--color-orange)]" />
          <span className="text-xs text-gray-500">Outflow</span>
        </div>
      </div>
    </div>
  );
}
