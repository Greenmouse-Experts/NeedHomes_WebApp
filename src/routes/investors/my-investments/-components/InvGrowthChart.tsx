import apiClient from "@/api/simpleApi";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { ChevronDown } from "lucide-react";

type Period = "30D" | "6M" | "1Y";
type Metric = "value" | "returns" | "both";

interface GrowthPoint {
  label: string;
  totalValue: number;
  totalReturns: number;
}

interface GrowthData {
  period: Period;
  data: GrowthPoint[];
}

function fmt(kobo: number) {
  const n = kobo / 100;
  if (n >= 1_000_000_000) return `₦${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `₦${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `₦${(n / 1_000).toFixed(0)}K`;
  return `₦${n.toLocaleString()}`;
}

const PERIODS: { label: string; value: Period }[] = [
  { label: "30D", value: "30D" },
  { label: "6M", value: "6M" },
  { label: "1Y", value: "1Y" },
];

const METRICS: { label: string; value: Metric }[] = [
  { label: "Portfolio Value", value: "value" },
  { label: "Returns", value: "returns" },
  { label: "Both", value: "both" },
];

export default function InvGrowthChart() {
  const [period, setPeriod] = useState<Period>("30D");
  const [metric, setMetric] = useState<Metric>("value");

  const { data, isLoading } = useQuery<{ data: GrowthData }>({
    queryKey: ["investor-portfolio-growth", period],
    queryFn: async () => {
      const resp = await apiClient.get("/analytics/investor/portfolio-growth", {
        params: { period },
      });
      return resp.data;
    },
    staleTime: 10 * 60 * 1000,
  });

  const points = (data?.data?.data ?? []).map((p) => ({
    label: p.label,
    value: p.totalValue / 100,
    returns: p.totalReturns / 100,
  }));

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3 mb-5">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Portfolio Growth</h3>
          {/* Period tabs */}
          <div className="flex gap-2 mt-3">
            {PERIODS.map((p) => (
              <button
                key={p.value}
                onClick={() => setPeriod(p.value)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                  period === p.value
                    ? "border-purple-500 text-purple-600 bg-purple-50"
                    : "border-gray-200 text-gray-500 hover:border-gray-300 bg-white"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Metric selector */}
        <div className="relative">
          <select
            value={metric}
            onChange={(e) => setMetric(e.target.value as Metric)}
            className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2.5 pr-9 text-sm font-medium text-gray-700 cursor-pointer focus:outline-none focus:border-purple-300 shadow-sm"
          >
            {METRICS.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Chart */}
      {isLoading ? (
        <div className="flex items-center justify-center h-56 text-gray-400 gap-2 text-sm">
          <span className="loading loading-spinner loading-sm" /> Loading chart…
        </div>
      ) : points.length === 0 ? (
        <div className="flex items-center justify-center h-56 text-gray-400 text-sm">
          No data available for this period.
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <LineChart
            data={points}
            margin={{ top: 8, right: 8, bottom: 0, left: 0 }}
          >
            <CartesianGrid
              strokeDasharray="4 4"
              stroke="#e5e7eb"
              vertical={true}
              horizontal={true}
            />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 12, fill: "#9ca3af" }}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
              dy={8}
            />
            <YAxis
              tick={{ fontSize: 12, fill: "#9ca3af" }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => fmt(v * 100)}
              width={64}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: "1px solid #e5e7eb",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                fontSize: 13,
              }}
              formatter={(value: number, name: string) => [
                fmt(value * 100),
                name === "value" ? "Portfolio Value" : "Returns",
              ]}
            />
            {(metric === "value" || metric === "both") && (
              <Line
                type="linear"
                dataKey="value"
                stroke="#818cf8"
                strokeWidth={2}
                dot={{ r: 3.5, fill: "#818cf8", strokeWidth: 0 }}
                activeDot={{ r: 5, fill: "#6366f1" }}
              />
            )}
            {(metric === "returns" || metric === "both") && (
              <Line
                type="linear"
                dataKey="returns"
                stroke="#f9a8d4"
                strokeWidth={2}
                dot={{ r: 3.5, fill: "#f9a8d4", strokeWidth: 0 }}
                activeDot={{ r: 5, fill: "#ec4899" }}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
