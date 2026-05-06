import { createFileRoute } from "@tanstack/react-router";
import { Star } from "lucide-react";
import { useAuth, useKyc } from "@/store/authStore";
import { useQuery } from "@tanstack/react-query";
import apiClient, { type ApiResponse } from "@/api/simpleApi";
import CalendarWidget from "@/components/CalendarWidget";
import VerificationStatus from "../-components/VerificationStatus";
import UserWallet from "../-components/Wallet";
import RecentProperties from "./-components/RecentProperty";
import InvestorAnalysis from "./-components/InvestorAnalysis";

export const Route = createFileRoute("/investors/")({
  component: InvestorDashboard,
});

function InvestorDashboard() {
  const [authRecord] = useAuth();
  const user = authRecord?.user;
  const [kyc] = useKyc();

  const statsQuery = useQuery<
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
  const stats = statsQuery.data?.data;

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6 sm:mb-8">
        {/* Left Side: Welcome Message */}
        <div>
          <VerificationStatus />
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Welcome, {kyc.companyName ?? user?.firstName?.trim() ?? "User"}
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Welcome to your investment overview and portfolio summary.
          </p>
        </div>

        {/* Right Side: Notifications and Profile */}
        <div className="flex items-start gap-4 self-end sm:self-auto">
          {/* Notification Icon */}

          {/* Profile Section */}
          {/*<ThemeProvider></ThemeProvider>*/}
        </div>
      </div>

      <section className="gap-6 flex flex-col lg:flex-row">
        <div className="flex-5/6 flex flex-col gap-6">
          <section className="flex gap-6 flex-col-reverse lg:flex-row">
            <div className="flex-1 w-full hidden xl:block   xl:max-w-xs">
              <CalendarWidget />
            </div>
            <div className=" flex-1">
              <div className="bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 rounded-xl md:rounded-2xl p-6 md:p-8 relative overflow-hidden shadow-lg h-full flex flex-col justify-between">
                <div className="absolute top-0 right-0 w-32 h-32 md:w-64 md:h-64 opacity-20">
                  <svg viewBox="0 0 200 200" className="w-full h-full">
                    <path
                      fill="white"
                      d="M40,-65C50,-55,55,-40,58,-25C61,-10,62,5,58,18C54,31,45,42,35,50C25,58,14,63,0,63C-14,63,-28,58,-40,50C-52,42,-62,31,-65,18C-68,5,-64,-10,-58,-25C-52,-40,-44,-55,-32,-65C-20,-75,-10,-80,0,-80C10,-80,30,-75,40,-65Z"
                      transform="translate(100 100)"
                    />
                  </svg>
                </div>

                <div className="relative z-10 flex items-center gap-2 text-white/90 mb-6">
                  <Star className="w-4 h-4" />
                  <span className="text-xs md:text-sm font-medium">
                    BASIC STATISTICS
                  </span>
                </div>

                {/* Stats Cards inside welcome box */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white/30 rounded-xl flex items-center justify-center shrink-0">
                        <svg
                          className="w-6 h-6 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-2xl md:text-3xl font-bold text-white">
                          {stats?.total ?? "—"}
                        </p>
                        <p className="text-xs md:text-sm text-white/90 font-medium">
                          Total Investments
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white/30 rounded-xl flex items-center justify-center shrink-0">
                        <svg
                          className="w-6 h-6 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xl md:text-2xl font-bold text-white">
                          {stats
                            ? `₦${(stats.totalInvested / 100).toLocaleString()}`
                            : "—"}
                        </p>
                        <p className="text-xs md:text-sm text-white/90 font-medium">
                          Total Amount Invested
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white/30 rounded-xl flex items-center justify-center shrink-0">
                        <svg
                          className="w-6 h-6 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-2xl md:text-3xl font-bold text-white">
                          {stats?.active ?? "—"}
                        </p>
                        <p className="text-xs md:text-sm text-white/90 font-medium">
                          Active Investments
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white/30 rounded-xl flex items-center justify-center shrink-0">
                        <svg
                          className="w-6 h-6 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xl md:text-2xl font-bold text-white">
                          {stats?.completed ?? "—"}
                        </p>
                        <p className="text-xs md:text-sm text-white/90 font-medium">
                          Completed Investments
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <RecentProperties />
        </div>
        <div className="flex-1/3 flex-col gap-6">
          <UserWallet />
        </div>
      </section>

      <InvestorAnalysis />
      {/*<Example />*/}
    </div>
  );
}
