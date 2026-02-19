import apiClient, { type ApiResponse } from "@/api/simpleApi";
import QueryCompLayout from "@/components/layout/QueryCompLayout";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { HomeIcon } from "@heroicons/react/24/outline";
import { useQuery } from "@tanstack/react-query";
import { Handshake, Home, Users } from "lucide-react";
interface AdminStats {
  users: {
    totalRegisteredUsers: number;
    activeInvestorPercentage: number;
    verifiedInvestorCount: number;
    totalInvestorCount: number;
    activePartnerPercentage: number;
    verifiedPartnerCount: number;
    totalPartnerCount: number;
  };
  partners: {
    partnerAgentActivationRate: number;
    verifiedPartnersTotal: number;
    verifiedPartnersWithPromotions: number;
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

export default function AdminDashStats() {
  const query = useQuery<ApiResponse<AdminStats>>({
    queryKey: ["admin_dash_stats"],
    queryFn: async () => {
      const resp = await apiClient.get("analytics/dashboard");
      return resp.data;
    },
  });
  return (
    <QueryCompLayout query={query}>
      {(data) => {
        const stats = data.data;
        return (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-4 md:mb-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    {stats.users.totalInvestorCount} Investors
                  </CardTitle>
                  <Users className="w-5 h-5 text-[var(--color-orange)]" />
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    {stats.users.totalPartnerCount} Partners
                  </CardTitle>
                  <Handshake className="w-5 h-5 text-[var(--color-orange)]" />
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    {stats.transactions.totalSuccessful} Successful
                  </CardTitle>
                  <HomeIcon className="w-5 h-5 text-[var(--color-orange)]" />
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    {stats.transactions.totalTransactions} Total Transactions
                  </CardTitle>
                  <Home className="w-5 h-5 text-[var(--color-orange)]" />
                </CardHeader>
              </Card>
            </div>
          </>
        );
      }}
    </QueryCompLayout>
  );
}
