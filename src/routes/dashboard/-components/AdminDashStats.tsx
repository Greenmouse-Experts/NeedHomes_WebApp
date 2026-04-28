import apiClient, { type ApiResponse } from "@/api/simpleApi";
import { useQuery } from "@tanstack/react-query";
import {
  Users,
  Handshake,
  TrendingUp,
  UserCheck,
  Megaphone,
} from "lucide-react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

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

function MiniPie({
  data,
  title,
  center,
}: {
  data: { name: string; value: number; color: string }[];
  title: string;
  center?: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
      <p className="text-xs text-gray-500 font-medium mb-2">{title}</p>
      <div className="flex items-center gap-4">
        <div className="w-28 h-28 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={28}
                outerRadius={48}
                dataKey="value"
                strokeWidth={1}
              >
                {data.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number, name: string) => [value, name]}
                contentStyle={{
                  fontSize: 11,
                  borderRadius: 6,
                  padding: "4px 8px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="space-y-1.5 min-w-0">
          {data.map((d) => (
            <div key={d.name} className="flex items-center gap-1.5 text-xs">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: d.color }}
              />
              <span className="text-gray-500 truncate">{d.name}</span>
              <span className="font-semibold text-gray-800 ml-auto pl-2">
                {d.value}
              </span>
            </div>
          ))}
        </div>
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
              <div key={j} className="skeleton h-24 rounded-xl" />
            ))}
          </div>
        ))}
      </div>
    );
  }

  if (!query.data) return null;

  const { users, partners, transactions } = query.data.data;

  const investorOther =
    users.totalInvestorCount -
    users.verifiedInvestorCount -
    users.churnedInvestorCount;

  const partnerOther =
    users.totalPartnerCount -
    partners.verifiedPartnersTotal -
    partners.churnedPartnerCount;

  return (
    <div className="space-y-6 mb-6">
      {/* ── Users ── */}
      <div>
        <SectionHeader title="Users" icon={Users} />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard
            label="Total Registered"
            value={users.totalRegisteredUsers.toLocaleString()}
            sub={`${users.totalInvestorCount} investors · ${users.totalPartnerCount} partners`}
            icon={Users}
            bg="bg-blue-50"
            color="text-blue-600"
          />
          <MiniPie
            title="Investor Breakdown"
            data={[
              {
                name: "Verified",
                value: users.verifiedInvestorCount,
                color: "#10B981",
              },
              {
                name: "Churned",
                value: users.churnedInvestorCount,
                color: "#EF4444",
              },
              {
                name: "Other",
                value: Math.max(0, investorOther),
                color: "#D1D5DB",
              },
            ]}
          />
          <MiniPie
            title="Partner Breakdown"
            data={[
              {
                name: "Verified",
                value: partners.verifiedPartnersTotal,
                color: "#F59E0B",
              },
              {
                name: "Churned",
                value: partners.churnedPartnerCount,
                color: "#EF4444",
              },
              {
                name: "Other",
                value: Math.max(0, partnerOther),
                color: "#D1D5DB",
              },
            ]}
          />
          <div className="grid grid-rows-2 gap-3">
            <StatCard
              label="Investor Active %"
              value={`${users.activeInvestorPercentage.toFixed(1)}%`}
              icon={UserCheck}
              bg="bg-green-50"
              color="text-green-600"
            />
            <StatCard
              label="Partner Active %"
              value={`${users.activePartnerPercentage.toFixed(1)}%`}
              icon={Handshake}
              bg="bg-orange-50"
              color="text-orange-500"
            />
          </div>
        </div>
      </div>

      {/* ── Partners ── */}
      <div>
        <SectionHeader title="Partners" icon={Handshake} />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <StatCard
            label="Agent Activation Rate"
            value={`${partners.partnerAgentActivationRate.toFixed(1)}%`}
            sub={`${partners.verifiedPartnersTotal} verified total`}
            icon={TrendingUp}
            bg="bg-green-50"
            color="text-green-600"
          />
          <MiniPie
            title="Promotions Adoption"
            data={[
              {
                name: "With Promotions",
                value: partners.verifiedPartnersWithPromotions,
                color: "#8B5CF6",
              },
              {
                name: "Without",
                value: Math.max(
                  0,
                  partners.verifiedPartnersTotal -
                    partners.verifiedPartnersWithPromotions,
                ),
                color: "#D1D5DB",
              },
            ]}
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
      {/*<div>
        <SectionHeader title="Transactions" icon={TrendingUp} />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <StatCard
            label="Total Transactions"
            value={transactions.totalTransactions.toLocaleString()}
            sub={`${transactions.transactionSuccessRate.toFixed(1)}% success rate`}
            icon={TrendingUp}
            bg="bg-gray-50"
            color="text-gray-600"
          />
          <MiniPie
            title="Transaction Status Split"
            data={[
              { name: "Successful", value: transactions.totalSuccessful, color: "#10B981" },
              { name: "Pending", value: transactions.totalPending, color: "#F59E0B" },
              { name: "Failed", value: transactions.totalFailed, color: "#EF4444" },
            ]}
          />
          <div className="grid grid-rows-3 gap-3">
            {[
              { label: "Successful", value: transactions.totalSuccessful, color: "#10B981" },
              { label: "Pending", value: transactions.totalPending, color: "#F59E0B" },
              { label: "Failed", value: transactions.totalFailed, color: "#EF4444" },
            ].map((row) => (
              <div
                key={row.label}
                className="bg-white rounded-xl border border-gray-200 shadow-sm px-4 py-2 flex items-center justify-between"
              >
                <span className="text-xs text-gray-500 font-medium">{row.label}</span>
                <span
                  className="text-sm font-bold"
                  style={{ color: row.color }}
                >
                  {row.value.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>*/}
    </div>
  );
}
