import apiClient, { type ApiResponse } from "@/api/simpleApi";
import QueryCompLayout from "@/components/layout/QueryCompLayout";
import { useQuery } from "@tanstack/react-query";
import { ArrowDownCircle, ArrowUpCircle, Clock } from "lucide-react";

interface TransactionStats {
  deposits: {
    total: number;
    count: number;
  };
  withdrawals: {
    total: number;
    count: number;
  };
  investments: {
    total: number;
    count: number;
  };
  pending: number;
  failed: number;
}

function fmt(value: number) {
  return `₦${Number(value).toLocaleString("en-NG", { minimumFractionDigits: 2 })}`;
}

export default function TransStats() {
  const query = useQuery<ApiResponse<TransactionStats>>({
    queryKey: ["admin-transactions-stats"],
    queryFn: async () => {
      let resp = await apiClient.get("/admin/transactions/stats");
      return resp.data;
    },
  });

  const NairaIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <text
        x="12"
        y="18"
        textAnchor="middle"
        fontSize="20"
        fill="currentColor"
        fontWeight="bold"
      >
        ₦
      </text>
    </svg>
  );

  return (
    <QueryCompLayout query={query}>
      {(resp) => {
        const data = resp.data as TransactionStats;
        const cards = [
          {
            label: "Total Investments",
            value: fmt(data.investments.total),
            sub: `${data.investments.count} transaction${data.investments.count !== 1 ? "s" : ""}`,
            icon: NairaIcon,
          },
          {
            label: "Total Deposits",
            value: fmt(data.deposits.total),
            sub: `${data.deposits.count} transaction${data.deposits.count !== 1 ? "s" : ""}`,
            icon: ArrowDownCircle,
          },
          {
            label: "Total Withdrawals",
            value: fmt(data.withdrawals.total),
            sub: `${data.withdrawals.count} transaction${data.withdrawals.count !== 1 ? "s" : ""}`,
            icon: ArrowUpCircle,
          },
          {
            label: "Pending Payments",
            value: data.pending.toString(),
            sub: `${data.failed} failed`,
            icon: Clock,
          },
        ];
        return (
          <div className="my-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 mb-4 md:mb-6">
              {cards.map(({ label, value, sub, icon: Icon }) => (
                <div
                  key={label}
                  className="bg-white rounded-xl shadow-md border border-gray-200 p-4 md:p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center justify-between mb-3 md:mb-4">
                    <h3 className="text-xs md:text-sm font-semibold text-gray-600 uppercase tracking-wide">
                      {label}
                    </h3>
                    <div className="p-1.5 md:p-2 bg-orange-100 rounded-lg">
                      <Icon className="w-4 h-4 md:w-5 md:h-5 text-[var(--color-orange)]" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xl md:text-2xl font-bold text-gray-900">
                      {value}
                    </p>
                    <p className="text-[10px] md:text-xs text-gray-500">
                      {sub}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      }}
    </QueryCompLayout>
  );
}
