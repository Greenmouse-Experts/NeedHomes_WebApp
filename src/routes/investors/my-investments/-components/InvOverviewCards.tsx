import apiClient from "@/api/simpleApi";
import { useQuery } from "@tanstack/react-query";
import { Wallet, TrendingUp, Activity, DollarSign, ArrowUpRight, ArrowDownRight } from "lucide-react";

interface OverviewData {
  totalPortfolioValue: number;
  totalReturns: number;
  activeInvestments: number;
  monthlyEarnings: number;
  monthlyEarningsChange: number | null;
  portfolioValueChange: number | null;
  byModel: { model: string; count: number; amountInvested: number; currentValue: number }[];
}

function fmt(kobo: number) {
  const n = kobo / 100;
  if (n >= 1_000_000_000) return `₦${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `₦${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `₦${(n / 1_000).toFixed(0)}K`;
  return `₦${n.toLocaleString()}`;
}

function Change({ value }: { value: number | null }) {
  if (value == null)
    return <span className="text-xs text-base-content/40">No prior data</span>;
  const up = value >= 0;
  return (
    <span className={`flex items-center gap-0.5 text-xs font-semibold ${up ? "text-success" : "text-error"}`}>
      {up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
      {up ? "+" : ""}{value.toFixed(1)}% vs last month
    </span>
  );
}

export default function InvOverviewCards() {
  const { data, isLoading } = useQuery<{ data: OverviewData }>({
    queryKey: ["investor-overview"],
    queryFn: async () => {
      const resp = await apiClient.get("/analytics/investor/overview");
      return resp.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="card bg-base-100 shadow-sm border border-base-200 h-28 animate-pulse" />
        ))}
      </div>
    );
  }

  if (!data) return null;

  const d = data.data;
  const uniqueModels = d.byModel.filter((m) => m.count > 0).length;

  const cards = [
    {
      label: "Total Portfolio Value",
      value: fmt(d.totalPortfolioValue),
      change: <Change value={d.portfolioValueChange} />,
      icon: Wallet,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      label: "Total Returns",
      value: fmt(d.totalReturns),
      change: <Change value={d.portfolioValueChange} />,
      icon: TrendingUp,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      label: "Active Investments",
      value: d.activeInvestments,
      change: (
        <span className="text-xs text-base-content/50">
          Across {uniqueModels} {uniqueModels === 1 ? "category" : "categories"}
        </span>
      ),
      icon: Activity,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      label: "Monthly Earnings",
      value: fmt(d.monthlyEarnings),
      change: <Change value={d.monthlyEarningsChange} />,
      icon: DollarSign,
      iconBg: "bg-orange-100",
      iconColor: "text-orange-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map((c) => (
        <div key={c.label} className="card bg-base-100 shadow-sm border border-base-200">
          <div className="card-body p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-base-content/50 uppercase tracking-wider">
                {c.label}
              </span>
              <div className={`p-2 rounded-lg ${c.iconBg}`}>
                <c.icon className={`w-4 h-4 ${c.iconColor}`} />
              </div>
            </div>
            <p className="text-2xl font-black text-base-content">{c.value}</p>
            <div className="mt-1">{c.change}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
