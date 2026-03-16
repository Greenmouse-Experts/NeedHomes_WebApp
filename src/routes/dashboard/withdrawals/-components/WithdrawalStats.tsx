import apiClient, { type ApiResponse } from "@/api/simpleApi";
import QueryCompLayout from "@/components/layout/QueryCompLayout";
import { useQuery } from "@tanstack/react-query";
import {
  AlertTriangle,
  ArrowDownCircle,
  Banknote,
  CheckCircle2,
  CircleCheck,
  Clock,
  Layers,
  RefreshCw,
  XCircle,
} from "lucide-react";

interface WithdrawalStatsData {
  counts: {
    pending: number;
    processing: number;
    approved: number;
    completed: number;
    rejected: number;
    failed: number;
    total: number;
  };
  amounts: {
    pendingKobo: number;
    pendingNaira: string;
    completedKobo: number;
    completedNaira: string;
  };
}

export default function WithdrawalStats() {
  const query = useQuery<ApiResponse<WithdrawalStatsData>>({
    queryKey: ["withdrawals", "stats"],
    queryFn: async () => {
      let resp = await apiClient.get("admin/withdrawals/stats");
      return resp.data;
    },
  });

  return (
    <div className="mb-6">
      <QueryCompLayout query={query}>
        {(data) => {
          const { counts, amounts } = data.data;

          const statItems = [
            {
              label: "Total",
              value: counts.total,
              icon: <Layers className="w-5 h-5" />,
              iconBg: "bg-primary/10",
              iconColor: "text-primary",
              valueColor: "text-base-content",
            },
            {
              label: "Completed",
              value: counts.completed,
              icon: <CircleCheck className="w-5 h-5" />,
              iconBg: "bg-success/10",
              iconColor: "text-success",
              valueColor: "text-success",
            },
            {
              label: "Pending",
              value: counts.pending,
              icon: <Clock className="w-5 h-5" />,
              iconBg: "bg-warning/10",
              iconColor: "text-warning",
              valueColor: "text-warning",
            },
            {
              label: "Processing",
              value: counts.processing,
              icon: <RefreshCw className="w-5 h-5" />,
              iconBg: "bg-info/10",
              iconColor: "text-info",
              valueColor: "text-info",
            },
            {
              label: "Approved",
              value: counts.approved,
              icon: <CheckCircle2 className="w-5 h-5" />,
              iconBg: "bg-blue-500/10",
              iconColor: "text-blue-500",
              valueColor: "text-blue-500",
            },
            {
              label: "Rejected",
              value: counts.rejected,
              icon: <XCircle className="w-5 h-5" />,
              iconBg: "bg-error/10",
              iconColor: "text-error",
              valueColor: "text-error",
            },
            {
              label: "Failed",
              value: counts.failed,
              icon: <AlertTriangle className="w-5 h-5" />,
              iconBg: "bg-error/10",
              iconColor: "text-error",
              valueColor: "text-error",
            },
          ];

          return (
            <div className="grid gap-4">
              {/* Financial Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="card bg-base-100 ring fade overflow-hidden">
                  <div className="p-6 flex items-center gap-4">
                    <div className="p-3 bg-warning/10 rounded-2xl shrink-0">
                      <Clock className="w-6 h-6 text-warning" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold uppercase tracking-widest text-base-content/50 mb-1">
                        Pending Amount
                      </p>
                      <p className="text-3xl font-black text-warning truncate">
                        {amounts.pendingNaira}
                      </p>
                    </div>
                  </div>
                  <div className="h-1 bg-warning/20">
                    <div className="h-full w-1/2 bg-warning/60 rounded-full" />
                  </div>
                </div>

                <div className="card bg-base-100 ring fade overflow-hidden">
                  <div className="p-6 flex items-center gap-4">
                    <div className="p-3 bg-success/10 rounded-2xl shrink-0">
                      <Banknote className="w-6 h-6 text-success" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold uppercase tracking-widest text-base-content/50 mb-1">
                        Completed Amount
                      </p>
                      <p className="text-3xl font-black text-success truncate">
                        {amounts.completedNaira}
                      </p>
                    </div>
                  </div>
                  <div className="h-1 bg-success/20">
                    <div className="h-full w-3/4 bg-success/60 rounded-full" />
                  </div>
                </div>
              </div>

              {/* Counts Grid */}
              <section className="card bg-base-100 ring fade overflow-hidden">
                <div className="px-6 py-4 border-b fade flex items-center gap-2">
                  <ArrowDownCircle className="w-4 h-4 text-primary" />
                  <h3 className="text-xs font-bold uppercase tracking-widest text-base-content/60">
                    Transaction Volumes
                  </h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-px bg-base-200">
                  {statItems.map((item) => (
                    <div
                      key={item.label}
                      className="flex flex-col gap-3 p-5 bg-base-100 hover:bg-base-200/40 transition-colors"
                    >
                      <div
                        className={`p-2 ${item.iconBg} rounded-xl w-fit ${item.iconColor}`}
                      >
                        {item.icon}
                      </div>
                      <div>
                        <p
                          className={`text-2xl font-black ${item.valueColor}`}
                        >
                          {item.value.toLocaleString()}
                        </p>
                        <p className="text-xs font-bold uppercase tracking-widest text-base-content/40 mt-0.5">
                          {item.label}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          );
        }}
      </QueryCompLayout>
    </div>
  );
}
