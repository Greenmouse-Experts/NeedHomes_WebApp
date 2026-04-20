import { useQuery } from "@tanstack/react-query";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import apiClient from "@/api/simpleApi";
import type { PROPERTY_TYPE } from "@/types/property";
import type { ADMIN_PROPERTY_LISTING } from "@/types";
import QueryCompLayout from "@/components/layout/QueryCompLayout";
import { TrendingUp, TrendingDown } from "lucide-react";

interface PriceHistoryRecord {
  id: string;
  priceField: string;
  oldPrice: number;
  newPrice: number;
  changedAt: string;
}

interface PriceHistoryResponse {
  statusCode: number;
  message: string;
  data: PriceHistoryRecord[];
}

function formatNaira(kobo: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(kobo / 100);
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-NG", {
    month: "short",
    year: "numeric",
    day: "numeric",
  });
}

export default function AdminROI({
  property,
}: {
  property: PROPERTY_TYPE | ADMIN_PROPERTY_LISTING;
}) {
  const query = useQuery<PriceHistoryResponse>({
    queryKey: ["price-history", property.id],
    queryFn: async () => {
      const resp = await apiClient.get(
        `properties/${property.id}/price-history`,
      );
      return resp.data;
    },
  });

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-(--color-orange)" />
        <h2 className="text-xl font-bold text-base-content">
          Price History & ROI
        </h2>
      </div>
      <QueryCompLayout query={query} loadingText="Loading price history...">
        {(data) => {
          const history = data?.data ?? [];

          if (history.length === 0) {
            return (
              <div className="ring fade shadow rounded-box p-6 text-base-content/50 text-sm">
                No price history recorded yet.
              </div>
            );
          }

          const chartData = history.map((h) => ({
            date: formatDate(h.changedAt),
            price: h.newPrice / 100,
          }));

          const currentPrice = history.at(-1)?.newPrice ?? null;
          const formerPrice = history.at(-1)?.oldPrice ?? null;
          const firstPrice = history[0]?.newPrice ?? null;

          const roi =
            firstPrice && currentPrice
              ? (((currentPrice - firstPrice) / firstPrice) * 100).toFixed(2)
              : null;

          const roiPositive = roi !== null && parseFloat(roi) >= 0;

          return (
            <div className="ring fade shadow rounded-box">
              <div className="grid grid-cols-2 sm:grid-cols-3 divide-x divide-y sm:divide-y-0 fade border-b">
                {formerPrice !== null && (
                  <div className="p-4 space-y-1">
                    <p className="text-xs text-base-content/50 uppercase tracking-wide">
                      Former Price
                    </p>
                    <p className="text-base font-semibold text-base-content">
                      {formatNaira(formerPrice)}
                    </p>
                  </div>
                )}
                {currentPrice !== null && (
                  <div className="p-4 space-y-1">
                    <p className="text-xs text-base-content/50 uppercase tracking-wide">
                      Current Price
                    </p>
                    <p className="text-base font-semibold text-base-content">
                      {formatNaira(currentPrice)}
                    </p>
                  </div>
                )}
                {roi !== null && (
                  <div className="p-4 space-y-1">
                    <p className="text-xs text-base-content/50 uppercase tracking-wide">
                      Overall ROI
                    </p>
                    <div
                      className={`flex items-center gap-1 font-bold text-base ${roiPositive ? "text-success" : "text-error"}`}
                    >
                      {roiPositive ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : (
                        <TrendingDown className="w-4 h-4" />
                      )}
                      {roiPositive ? "+" : ""}
                      {roi}%
                    </div>
                  </div>
                )}
              </div>
              <section className="h-72 w-full overflow-x-scroll p-4">
                <div className="size-full min-w-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={chartData}
                      margin={{ top: 5, right: 16, left: 0, bottom: 5 }}
                    >
                      <defs>
                        <linearGradient
                          id="priceGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#6366f1"
                            stopOpacity={0.3}
                          />
                          <stop
                            offset="95%"
                            stopColor="#6366f1"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                      <YAxis
                        tickFormatter={(v) =>
                          new Intl.NumberFormat("en-NG", {
                            notation: "compact",
                            compactDisplay: "short",
                          }).format(v)
                        }
                        tick={{ fontSize: 11 }}
                        width={70}
                      />
                      <Tooltip
                        formatter={(value: number) => formatNaira(value * 100)}
                        labelFormatter={(label) => `Date: ${label}`}
                      />
                      <Area
                        type="monotone"
                        dataKey="price"
                        stroke="#6366f1"
                        strokeWidth={2}
                        fill="url(#priceGradient)"
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                        name="Price"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </section>
            </div>
          );
        }}
      </QueryCompLayout>
    </div>
  );
}
