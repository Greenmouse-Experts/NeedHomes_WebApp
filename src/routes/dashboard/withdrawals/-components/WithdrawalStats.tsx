import apiClient, { type ApiResponse } from "@/api/simpleApi";
import QueryCompLayout from "@/components/layout/QueryCompLayout";
import { useQuery } from "@tanstack/react-query";

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
      <h2 className="text-2xl font-bold mb-4">Withdrawal Stats</h2>
      <QueryCompLayout query={query}>
        {(data) => {
          const { counts, amounts } = data.data;
          return (
            <div className="grid gap-6">
              {/* Amounts Section */}
              <section className="card bg-base-100 shadow-sm ring fade overflow-hidden">
                <div className="px-6 py-4 border-b fade bg-base-50/50">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-base-content/60">
                    Financial Overview
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2">
                  <div className="p-6 flex flex-col gap-2 border-b md:border-b-0 md:border-r border-base-200 hover:bg-base-200/20 transition-colors">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-warning"></div>
                      <span className="text-xs font-bold text-base-content/50 uppercase tracking-tighter">
                        Pending Amount
                      </span>
                    </div>
                    <div className="stat-value text-3xl text-warning">
                      {amounts.pendingNaira}
                    </div>
                  </div>
                  <div className="p-6 flex flex-col gap-2 hover:bg-base-200/20 transition-colors">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-success"></div>
                      <span className="text-xs font-bold text-base-content/50 uppercase tracking-tighter">
                        Completed Amount
                      </span>
                    </div>
                    <div className="stat-value text-3xl text-success">
                      {amounts.completedNaira}
                    </div>
                  </div>
                </div>
              </section>

              {/* Counts Section */}
              <section className="bg-base-100 ring fade rounded-box ">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 p-4 border-b fade">
                  Transaction Volumes
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 p-4">
                  {[
                    {
                      label: "Total",
                      value: counts.total,
                      color: "text-primary",
                    },
                    {
                      label: "Completed",
                      value: counts.completed,
                      color: "text-success",
                    },
                    {
                      label: "Pending",
                      value: counts.pending,
                      color: "text-warning",
                    },
                    {
                      label: "Processing",
                      value: counts.processing,
                      color: "text-info",
                    },
                    {
                      label: "Approved",
                      value: counts.approved,
                      color: "text-blue-500",
                    },
                    {
                      label: "Failed",
                      value: counts.failed,
                      color: "text-error",
                    },
                    {
                      label: "Rejected",
                      value: counts.rejected,
                      color: "text-error",
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="relative flex flex-col p-6 bg-white rounded-2xl border border-gray-100 shadow-sm transition-all hover:shadow-md"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <span className=" font-bold uppercase tracking-widest text-slate-500">
                          {item.label}
                        </span>
                        {/*<div className="p-2 bg-orange-50 rounded-xl">
                          <span className="text-orange-500 font-bold ">$</span>
                        </div>*/}
                      </div>
                      <div className="flex flex-col gap-1">
                        <span
                          className={`stat-value font-black text-slate-900`}
                        >
                          {item.value.toLocaleString()}
                        </span>
                        <span className=" text-slate-400 font-medium">
                          This Month
                        </span>
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
