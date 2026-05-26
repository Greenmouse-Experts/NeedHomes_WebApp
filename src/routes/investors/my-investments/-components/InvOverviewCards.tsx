import apiClient from "@/api/simpleApi";
import { useQuery } from "@tanstack/react-query";
import { Wallet, TrendingUp, Briefcase, Coins, ArrowUpRight, ArrowDownRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";

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
    return <span className="text-xs text-gray-400">No prior data</span>;
  const up = value >= 0;
  return (
    <span className={`flex items-center gap-0.5 text-sm font-medium ${up ? "text-green-500" : "text-red-500"}`}>
      {up ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
      {up ? "+" : ""}{value.toFixed(1)}% vs last month
    </span>
  );
}

interface CardProps {
  label: string;
  value: React.ReactNode;
  change: React.ReactNode;
  Icon: LucideIcon;
  iconBg: string;
  iconColor: string;
}

function OverviewCard({ label, value, change, Icon, iconBg, iconColor }: CardProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3">
      <div className={`w-12 h-12 rounded-full ${iconBg} flex items-center justify-center`}>
        <Icon className={`w-6 h-6 ${iconColor}`} />
      </div>
      <div>
        <p className="text-sm font-bold text-gray-800 mb-1">{label}</p>
        <p className="text-3xl font-black text-gray-900 leading-tight">{value}</p>
      </div>
      <div>{change}</div>
    </div>
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
          <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 animate-pulse h-44">
            <div className="w-12 h-12 rounded-full bg-gray-100 mb-4" />
            <div className="h-3 bg-gray-100 rounded w-2/3 mb-3" />
            <div className="h-8 bg-gray-200 rounded w-1/2 mb-3" />
            <div className="h-3 bg-gray-100 rounded w-3/4" />
          </div>
        ))}
      </div>
    );
  }

  if (!data) return null;

  const d = data.data;
  const uniqueModels = d.byModel.filter((m) => m.count > 0).length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <OverviewCard
        label="Total Portfolio Value"
        value={fmt(d.totalPortfolioValue)}
        change={<Change value={d.portfolioValueChange} />}
        Icon={Wallet}
        iconBg="bg-purple-100"
        iconColor="text-purple-600"
      />
      <OverviewCard
        label="Total Returns"
        value={`+${fmt(d.totalReturns)}`}
        change={<Change value={d.portfolioValueChange} />}
        Icon={TrendingUp}
        iconBg="bg-green-100"
        iconColor="text-green-600"
      />
      <OverviewCard
        label="Active Investments"
        value={d.activeInvestments}
        change={
          <span className="text-sm text-gray-500">
            Across{" "}
            <span className="text-blue-500 font-semibold">{uniqueModels}</span>{" "}
            {uniqueModels === 1 ? "category" : "categories"}
          </span>
        }
        Icon={Briefcase}
        iconBg="bg-blue-100"
        iconColor="text-blue-500"
      />
      <OverviewCard
        label="Monthly Earnings"
        value={fmt(d.monthlyEarnings)}
        change={<Change value={d.monthlyEarningsChange} />}
        Icon={Coins}
        iconBg="bg-yellow-100"
        iconColor="text-yellow-500"
      />
    </div>
  );
}
