import { createFileRoute, Outlet } from "@tanstack/react-router";
import {
  Users,
  Handshake,
  Home,
  HomeIcon,
  Calendar,
  TrendingUp,
  CheckCircle2,
  ArrowUp,
  Eye as EyeIcon,
  ChevronDown,
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Separator } from "@/components/ui/Separator";
import { useAuth } from "@/store/authStore";
import AdminDashStats from "./-components/AdminDashStats";

export const Route = createFileRoute("/dashboard/")({
  component: DashboardIndexPage,
});

function DashboardIndexPage() {
  const [user] = useAuth();

  return (
    <DashboardLayout title="Super Admin Dashboard">
      {/* Stats Cards */}
      <AdminDashStats />

      {/* Welcome Banner */}
      <Card className="mb-4 md:mb-6 bg-gradient-to-r from-gray-800 to-[var(--color-orange)] text-white relative overflow-hidden">
        <CardContent className="p-4 md:p-6">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4" />
            <span className="text-xs md:text-sm">
              {new Date().toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold mb-1">
            Welcome, Admin 👋
          </h2>
          {/*<>{JSON.stringify(user)}</>*/}

          <div className="absolute top-0 right-0 w-64 h-64 opacity-10">
            <div className="absolute top-10 right-10 w-4 h-4 bg-white rounded-full"></div>
            <div className="absolute top-20 right-20 w-2 h-2 bg-white rounded-full"></div>
            <div className="absolute top-32 right-32 w-3 h-3 bg-white rounded-full"></div>
          </div>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Revenue Chart */}
        <Card className="lg:col-span-2">
          <CardHeader className="p-4 md:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <CardTitle className="text-base md:text-lg">
                  Today Revenue Trend
                </CardTitle>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xl md:text-2xl font-bold text-green-600">
                    24.6%
                  </span>
                  <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-green-600" />
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs md:text-sm text-gray-600 border border-gray-300 rounded-lg px-2 md:px-3 py-1.5 md:py-2">
                <Calendar className="w-3 h-3 md:w-4 md:h-4" />
                <span className="hidden sm:inline">Jan 2024 - Dec 2024</span>
                <span className="sm:hidden">2024</span>
                <ChevronDown className="w-3 h-3 md:w-4 md:h-4" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 md:p-6">
            <div className="h-48 md:h-64 flex items-end justify-between gap-1 md:gap-2">
              {/* Simple bar chart representation */}
              {[40, 60, 45, 80, 65, 90, 75, 85, 70, 95, 88, 100].map(
                (height, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-gradient-to-t from-[var(--color-orange)] to-[var(--color-orange-light)] rounded-t"
                    style={{ height: `${height}%` }}
                  ></div>
                ),
              )}
            </div>
            <div className="mt-3 md:mt-4 text-xs md:text-sm text-gray-600">
              <div className="flex flex-wrap items-center gap-2">
                <div className="w-2 h-2 md:w-3 md:h-3 bg-[var(--color-orange)] rounded"></div>
                <span>N125.2k 12.5%</span>
                <span className="text-gray-400">NOV 1, 2023</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Wallet */}
        <Card>
          <CardHeader className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base md:text-lg">Wallet</CardTitle>
              <select className="text-xs md:text-sm border border-gray-300 rounded px-2 py-1">
                <option>Monthly</option>
              </select>
            </div>
          </CardHeader>
          <CardContent className="p-4 md:p-6 space-y-3 md:space-y-4">
            {/* Total Balance */}
            <Card className="bg-[var(--color-orange)] text-white">
              <CardContent className="p-3 md:p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] md:text-xs opacity-90">
                      TOTAL BALANCE
                    </p>
                    <p className="text-xl md:text-2xl font-bold">N 120,000</p>
                  </div>
                  <EyeIcon className="w-4 h-4 md:w-5 md:h-5" />
                </div>
              </CardContent>
            </Card>

            {/* Income/Expense */}
            <div className="space-y-2 md:space-y-3">
              <div className="flex items-center justify-between p-2.5 md:p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-green-600" />
                  <span className="text-xs md:text-sm font-medium">INCOME</span>
                </div>
                <span className="text-sm md:text-base font-bold text-green-600">
                  N 100,000
                </span>
              </div>
              <div className="flex items-center justify-between p-2.5 md:p-3 bg-red-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <ArrowUp className="w-4 h-4 md:w-5 md:h-5 text-red-600" />
                  <span className="text-xs md:text-sm font-medium">
                    EXPENSE
                  </span>
                </div>
                <span className="text-sm md:text-base font-bold text-red-600">
                  N 20,000
                </span>
              </div>
            </div>

            <Separator />

            {/* Recent Transactions */}
            <div>
              <h3 className="text-xs md:text-sm font-semibold mb-2 md:mb-3">
                RECENT
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <CheckCircle2 className="w-3.5 h-3.5 md:w-4 md:h-4 text-green-600 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs md:text-sm font-medium text-green-600 truncate">
                        + N 200,000
                      </p>
                      <p className="text-[10px] md:text-xs text-gray-500 truncate">
                        Incoming payment
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-2">
                    <p className="text-[10px] md:text-xs text-gray-500">
                      12-02-25
                    </p>
                    <Badge className="bg-green-100 text-green-700 text-[10px] md:text-xs">
                      Successful
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
