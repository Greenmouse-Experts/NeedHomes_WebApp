import apiClient, { type ApiResponse } from "@/api/simpleApi";
import { useQuery } from "@tanstack/react-query";
import {
  Users,
  Handshake,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  Clock,
  XCircle,
  UserCheck,
  Megaphone,
} from "lucide-react";

interface AdminStats {
  users: {
    totalRegisteredUsers: number;
    activeInvestorPercentage: number;
    verifiedInvestorCount: number;
    totalInvestorCount: number;
    activePartnerPercentage: number;
    verifiedPartnerCount: number;
    totalPartnerCount: number;
    investorChurnRate: number;
    churnedInvestorCount: number;
  };
  partners: {
    partnerAgentActivationRate: number;
    verifiedPartnersTotal: number;
    verifiedPartnersWithPromotions: number;
    partnerChurnRate: number;
    churnedPartnerCount: number;
  };
  transactions: {
    transactionSuccessRate: number;
    totalSuccessful: number;
    totalFailed: number;
    totalPending: number;
    totalTransactions: number;
  };
  generatedAt: string;
}

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  color = "text-gray-600",
  bg = "bg-gray-50",
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ElementType;
  color?: string;
  bg?: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex items-start gap-3">
      <div className={`p-2 rounded-lg ${bg} shrink-0`}>
        <Icon className={`w-4 h-4 ${color}`} />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-gray-500 font-medium truncate">{label}</p>
        <p className={`text-xl font-bold ${color}`}>{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

function SectionHeader({
  title,
  icon: Icon,
}: {
  title: string;
  icon: React.ElementType;
}) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <Icon className="w-4 h-4 text-gray-500" />
      <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
        {title}
      </h3>
    </div>
  );
}

export default function AdminDashStats() {
  const query = useQuery<ApiResponse<AdminStats>>({
    queryKey: ["admin_dash_stats"],
    queryFn: async () => {
      const resp = await apiClient.get("analytics/dashboard");
      return resp.data;
    },
  });

  if (query.isLoading) {
    return (
      <div className="space-y-6 mb-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[1, 2, 3, 4].map((j) => (
              <div key={j} className="skeleton h-20 rounded-xl" />
            ))}
          </div>
        ))}
      </div>
    );
  }

  if (!query.data) return null;

  const { users, partners, transactions } = query.data.data;

  return (
    <div className="space-y-6 mb-6">
      {/* ── Users ── */}
      <div>
        <SectionHeader title="Users" icon={Users} />
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
          <StatCard
            label="Total Registered"
            value={users.totalRegisteredUsers.toLocaleString()}
            icon={Users}
            bg="bg-blue-50"
            color="text-blue-600"
          />
          <StatCard
            label="Total Investors"
            value={users.totalInvestorCount.toLocaleString()}
            sub={`${users.verifiedInvestorCount} verified · ${users.activeInvestorPercentage.toFixed(1)}% active`}
            icon={UserCheck}
            bg="bg-green-50"
            color="text-green-600"
          />
          <StatCard
            label="Investor Churn Rate"
            value={`${users.investorChurnRate.toFixed(1)}%`}
            sub={`${users.churnedInvestorCount} churned`}
            icon={TrendingDown}
            bg="bg-red-50"
            color="text-red-500"
          />
          <StatCard
            label="Total Partners"
            value={users.totalPartnerCount.toLocaleString()}
            sub={`${users.verifiedPartnerCount} verified · ${users.activePartnerPercentage.toFixed(1)}% active`}
            icon={Handshake}
            bg="bg-orange-50"
            color="text-orange-500"
          />
          <StatCard
            label="Partner Churn Rate"
            value={`${partners.partnerChurnRate.toFixed(1)}%`}
            sub={`${partners.churnedPartnerCount} churned`}
            icon={TrendingDown}
            bg="bg-red-50"
            color="text-red-500"
          />
        </div>
      </div>

      {/* ── Partners ── */}
      <div>
        <SectionHeader title="Partners" icon={Handshake} />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <StatCard
            label="Agent Activation Rate"
            value={`${partners.partnerAgentActivationRate.toFixed(1)}%`}
            icon={TrendingUp}
            bg="bg-green-50"
            color="text-green-600"
          />
          <StatCard
            label="Verified Partners"
            value={partners.verifiedPartnersTotal.toLocaleString()}
            icon={UserCheck}
            bg="bg-blue-50"
            color="text-blue-600"
          />
          <StatCard
            label="Partners with Promotions"
            value={partners.verifiedPartnersWithPromotions.toLocaleString()}
            sub={`of ${partners.verifiedPartnersTotal} verified`}
            icon={Megaphone}
            bg="bg-purple-50"
            color="text-purple-600"
          />
        </div>
      </div>

      {/* ── Transactions ── */}
      <div>
        <SectionHeader title="Transactions" icon={TrendingUp} />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard
            label="Total Transactions"
            value={transactions.totalTransactions.toLocaleString()}
            icon={TrendingUp}
            bg="bg-gray-50"
            color="text-gray-600"
          />
          <StatCard
            label="Success Rate"
            value={`${transactions.transactionSuccessRate.toFixed(1)}%`}
            sub={`${transactions.totalSuccessful} successful`}
            icon={CheckCircle2}
            bg="bg-green-50"
            color="text-green-600"
          />
          <StatCard
            label="Pending"
            value={transactions.totalPending.toLocaleString()}
            icon={Clock}
            bg="bg-yellow-50"
            color="text-yellow-600"
          />
          <StatCard
            label="Failed"
            value={transactions.totalFailed.toLocaleString()}
            icon={XCircle}
            bg="bg-red-50"
            color="text-red-500"
          />
        </div>
      </div>
    </div>
  );
}
