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

type Period = "30D" | "6M" | "1Y";

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
  { label: "30 Days", value: "30D" },
  { label: "6 Months", value: "6M" },
  { label: "1 Year", value: "1Y" },
];

export default function InvGrowthChart() {
  const [period, setPeriod] = useState<Period>("30D");

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
    <div className="card bg-base-100 shadow-sm border border-base-200">
      <div className="card-body p-5">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
          <h3 className="font-bold text-base-content">Portfolio Growth</h3>
          <div className="flex gap-1">
            {PERIODS.map((p) => (
              <button
                key={p.value}
                onClick={() => setPeriod(p.value)}
                className={`btn btn-xs ${period === p.value ? "btn-primary" : "btn-ghost"}`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-48 text-base-content/40 gap-2 text-sm">
            <span className="loading loading-spinner loading-sm" /> Loading chart…
          </div>
        ) : points.length === 0 ? (
          <div className="flex items-center justify-center h-48 text-base-content/40 text-sm">
            No data available for this period.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={points} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" strokeOpacity={0.08} />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => fmt(v * 100)}
                width={72}
              />
              <Tooltip
                formatter={(value: number, name: string) => [
                  fmt(value * 100),
                  name === "value" ? "Portfolio Value" : "Returns",
                ]}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#6366f1"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="returns"
                stroke="#22c55e"
                strokeWidth={1.5}
                dot={false}
                strokeDasharray="4 2"
                activeDot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}

        <div className="flex items-center gap-4 mt-2 text-xs text-base-content/50">
          <span className="flex items-center gap-1.5">
            <span className="w-4 h-0.5 bg-indigo-500 inline-block rounded" /> Portfolio Value
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-4 h-0.5 bg-green-500 inline-block rounded" /> Returns
          </span>
        </div>
      </div>
    </div>
  );
}
