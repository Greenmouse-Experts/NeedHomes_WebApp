import apiClient, { type ApiResponse } from "@/api/simpleApi";
import { useQuery } from "@tanstack/react-query";
import QueryCompLayout from "@/components/layout/QueryCompLayout";
import {
  Wallet,
  Activity,
  CheckCircle2,
  XCircle,
  BarChart3,
} from "lucide-react";

export default function InvStatistics() {
  const query = useQuery<
    ApiResponse<{
      total: number;
      active: number;
      completed: number;
      cancelled: number;
      totalInvested: number;
    }>
  >({
    queryKey: ["investments", "statistics"],
    queryFn: async () => {
      const resp = await apiClient.get("/investments/my-investments/stats");
      return resp.data;
    },
  });

  return (
    <section className="ring fade rounded-box shadow mb-4 mt-4">
      <h2 className="p-6 border-b fade text-xl font-bold">
        Investment Statistics
      </h2>
      <div className="p-6">
        {" "}
        <QueryCompLayout query={query}>
          {(data) => {
            const stats = data.data;
            const items = [
              {
                label: "Total Invested",
                value: `$${stats.totalInvested.toLocaleString()}`,
                icon: Wallet,
                color: "text-primary",
              },
              {
                label: "Total Count",
                value: stats.total,
                icon: BarChart3,
                color: "text-info",
              },
              {
                label: "Active",
                value: stats.active,
                icon: Activity,
                color: "text-success",
              },
              {
                label: "Completed",
                value: stats.completed,
                icon: CheckCircle2,
                color: "text-secondary",
              },
              {
                label: "Cancelled",
                value: stats.cancelled,
                icon: XCircle,
                color: "text-error",
              },
            ];

            return (
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {items.map((item, idx) => (
                  <div
                    key={idx}
                    className="card bg-base-100 shadow-sm border border-base-200"
                  >
                    <div className="card-body p-4 flex-row items-center gap-4">
                      <div
                        className={`p-3 rounded-lg bg-base-200 ${item.color}`}
                      >
                        <item.icon size={24} />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-base-content/60 uppercase tracking-wider">
                          {item.label}
                        </p>
                        <h3 className="text-xl font-bold">{item.value}</h3>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            );
          }}
        </QueryCompLayout>
      </div>
    </section>
  );
}
