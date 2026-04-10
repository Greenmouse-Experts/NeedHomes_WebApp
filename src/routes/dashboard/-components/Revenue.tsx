import apiClient from "@/api/simpleApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import QueryCompLayout from "@/components/layout/QueryCompLayout";
import { useQuery } from "@tanstack/react-query";
import { TrendingUp, Calendar } from "lucide-react";
import { useState } from "react";
import ThemeProvider from "@/simpleComps/ThemeProvider";

interface TrendPoint {
  date: string;
  total: number;
}

interface RevenueTrendData {
  groupBy: "day" | "month";
  total: number;
  data: TrendPoint[];
}

function formatNaira(kobo: number) {
  const naira = kobo / 100;
  if (naira >= 1_000_000) return `₦${(naira / 1_000_000).toFixed(1)}M`;
  if (naira >= 1_000) return `₦${(naira / 1_000).toFixed(1)}K`;
  return `₦${naira.toLocaleString()}`;
}

const currentYear = new Date().getFullYear();
const YEARS = [currentYear, currentYear - 1, currentYear - 2];
const GROUP_OPTIONS = [
  { label: "Monthly", value: "month" },
  { label: "Daily", value: "day" },
] as const;

export default function AdminRevenue() {
  const [year, setYear] = useState(currentYear);
  const [groupBy, setGroupBy] = useState<"month" | "day">("month");

  const startDate = `${year}-01-01`;
  const endDate = `${year}-12-31`;

  const query = useQuery<{ data: RevenueTrendData }>({
    queryKey: ["revenue-trend", year, groupBy],
    queryFn: async () => {
      const resp = await apiClient.get("admin/analytics/revenue-trend", {
        params: { startDate, endDate, groupBy },
      });
      return resp.data;
    },
  });

  const trend = query.data?.data;

  return (
    <Card className="lg:col-span-2">
      <CardHeader className="p-4 md:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <CardTitle className="text-base md:text-lg">
              Revenue Trend
            </CardTitle>
            {trend && (
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xl md:text-2xl font-bold text-green-600">
                  {formatNaira(trend.total)}
                </span>
                <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-green-600" />
                <span className="text-xs text-gray-500">total for {year}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 border border-gray-300 rounded-lg px-2 py-1.5">
              <Calendar className="w-3.5 h-3.5 text-gray-500" />
              <select
                className="text-xs md:text-sm text-gray-700 bg-transparent outline-none"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
              >
                {YEARS.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
            <select
              className="text-xs md:text-sm border border-gray-300 rounded-lg px-2 py-1.5 text-gray-700 outline-none"
              value={groupBy}
              onChange={(e) => setGroupBy(e.target.value as "month" | "day")}
            >
              {GROUP_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 md:p-6">
        <ThemeProvider>
          <QueryCompLayout query={query} loadingText="Loading revenue data...">
            {(data) => {
              const trend = data.data;
              const points: TrendPoint[] = trend?.data ?? [];
              const maxTotal = Math.max(...points.map((p) => p.total), 1);

              if (points.length === 0) {
                return (
                  <div className="h-48 md:h-64 flex items-center justify-center text-sm text-gray-400">
                    No data for selected period.
                  </div>
                );
              }

              return (
                <>
                  <div className="h-48 md:h-64 flex items-end gap-1 md:gap-1.5 overflow-x-auto pb-1">
                    {points.map((point) => {
                      const heightPct = Math.max(
                        (point.total / maxTotal) * 100,
                        2,
                      );
                      return (
                        <div
                          key={point.date}
                          className="flex flex-col items-center gap-1 flex-1 min-w-[28px] group"
                        >
                          <div className="relative w-full flex flex-col items-center">
                            <div className="absolute bottom-full mb-1 hidden group-hover:flex flex-col items-center z-10 pointer-events-none">
                              <div className="bg-gray-800 text-white text-[10px] rounded px-1.5 py-0.5 whitespace-nowrap">
                                {formatNaira(point.total)}
                              </div>
                              <div className="w-1.5 h-1.5 bg-gray-800 rotate-45 -mt-0.5" />
                            </div>
                            <div
                              className="w-full bg-gradient-to-t from-[var(--color-orange)] to-orange-300 rounded-t transition-all duration-300"
                              style={{
                                height: `${(heightPct / 100) * (groupBy === "month" ? 256 : 192)}px`,
                              }}
                            />
                          </div>
                          <span className="text-[9px] md:text-[10px] text-gray-500 truncate max-w-full">
                            {point.date.length === 7
                              ? new Date(point.date + "-01").toLocaleString(
                                  "en",
                                  { month: "short" },
                                )
                              : point.date.slice(5)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                    <div className="w-2.5 h-2.5 rounded bg-[var(--color-orange)]" />
                    <span>Revenue in Naira · grouped by {groupBy}</span>
                  </div>
                </>
              );
            }}
          </QueryCompLayout>
        </ThemeProvider>
      </CardContent>
    </Card>
  );
}
