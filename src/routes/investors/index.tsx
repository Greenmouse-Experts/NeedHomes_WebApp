import { createFileRoute, Link } from "@tanstack/react-router";
import { Bell, CheckCircle2, Star } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/store/authStore";
import CalendarWidget from "@/components/CalendarWidget";
import ThemeProvider from "@/simpleComps/ThemeProvider";
import VerificationStatus from "../-components/VerificationStatus";
import UserWallet from "../-components/Wallet";

export const Route = createFileRoute("/investors/")({
  component: InvestorDashboard,
});

const recentProperties = [
  {
    id: "01",
    type: "4BR Duplex",
    amount: "N 10,000,000",
    date: "24-02-25",
    status: "Approved",
  },
  {
    id: "02",
    type: "Semi Detached",
    amount: "N 10,000,000",
    date: "24-02-25",
    status: "Pending",
  },
  {
    id: "03",
    type: "Fully Detached",
    amount: "N 10,000,000",
    date: "24-02-25",
    status: "Approved",
  },
  {
    id: "04",
    type: "4BR Duplex",
    amount: "N 10,000,000",
    date: "24-02-25",
    status: "Declined",
  },
  {
    id: "05",
    type: "Semi Detached",
    amount: "N 10,000,000",
    date: "24-02-25",
    status: "Approved",
  },
  {
    id: "06",
    type: "Semi Detached",
    amount: "N 10,000,000",
    date: "24-02-25",
    status: "Approved",
  },
];

const monthlyData = [
  { month: "Jan", value: 40000 },
  { month: "Feb", value: 25000 },
  { month: "Mar", value: 30000 },
  { month: "Apr", value: 50000 },
  { month: "May", value: 20000 },
  { month: "Jun", value: 35000 },
  { month: "Jul", value: 28000 },
  { month: "Aug", value: 55000 },
  { month: "Sep", value: 32000 },
  { month: "Oct", value: 45000 },
  { month: "Nov", value: 38000 },
  { month: "Dec", value: 42000 },
];

function InvestorDashboard() {
  const maxValue = Math.max(...monthlyData.map((d) => d.value));
  const [authRecord] = useAuth();
  const user = authRecord?.user;

  const isVerified = user?.account_verification_status === "VERIFIED";
  const profilePictureUrl =
    user?.profilePicture ||
    "https://images.unsplash.com/photo-1635194936300-08a36d3a90de?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6 sm:mb-8">
        {/* Left Side: Welcome Message */}
        <div>
          <VerificationStatus />
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Welcome, {user?.firstName?.trim() ?? "User"}
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

      {/* Stats Cards in Orange Box + Calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-full">
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
                      10
                    </p>
                    <p className="text-xs md:text-sm text-white/90 font-medium">
                      Total Property
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
                      N 20,000,000
                    </p>
                    <p className="text-xs md:text-sm text-white/90 font-medium">
                      Total Amount Paid
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
                      5
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
                      N 45,000,000
                    </p>
                    <p className="text-xs md:text-sm text-white/90 font-medium">
                      Portfolio Value
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <CalendarWidget />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Recent Property */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 md:p-6 border-b border-gray-200">
              <h3 className="text-base md:text-lg font-semibold text-gray-900">
                Recent Property
              </h3>
            </div>
            <div className="overflow-x-auto -mx-4 md:mx-0">
              <div className="inline-block min-w-full align-middle px-4 md:px-0">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 md:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        #
                      </th>
                      <th className="px-3 md:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Property Type
                      </th>
                      <th className="px-3 md:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-3 md:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden sm:table-cell">
                        Date Added
                      </th>
                      <th className="px-3 md:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentProperties.map((property) => (
                      <tr
                        key={property.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm text-gray-900 whitespace-nowrap">
                          {property.id}
                        </td>
                        <td className="px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm text-gray-900 whitespace-nowrap">
                          {property.type}
                        </td>
                        <td className="px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm text-gray-900 font-medium whitespace-nowrap">
                          {property.amount}
                        </td>
                        <td className="px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm text-gray-500 hidden sm:table-cell whitespace-nowrap">
                          {property.date}
                        </td>
                        <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 md:px-3 py-1 rounded-full text-xs font-semibold ${
                              property.status === "Approved"
                                ? "bg-green-100 text-green-700"
                                : property.status === "Pending"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-red-100 text-red-700"
                            }`}
                          >
                            {property.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Wallet */}
        <div className="lg:col-span-1">
          <UserWallet />
        </div>
      </div>

      {/* Monthly Analysis */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
        <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-4 md:mb-6">
          Monthly Analysis
        </h3>
        <div className="flex items-end justify-between h-48 md:h-64 gap-1 md:gap-2 lg:gap-4 overflow-x-auto pb-2">
          {monthlyData.map((data) => (
            <div
              key={data.month}
              className="flex-1 min-w-[24px] md:min-w-0 flex flex-col items-center gap-1 md:gap-2"
            >
              <div
                className="w-full flex items-end justify-center"
                style={{ height: "180px" }}
              >
                <div
                  className="w-full bg-gradient-to-t from-gray-600 to-gray-800 rounded-t-lg hover:from-[var(--color-orange)] hover:to-orange-600 transition-all duration-300 cursor-pointer"
                  style={{
                    height: `${(data.value / maxValue) * 100}%`,
                    minHeight: "8px",
                  }}
                  title={`${data.month}: N ${data.value.toLocaleString()}`}
                ></div>
              </div>
              <span className="text-xs text-gray-500 font-medium whitespace-nowrap">
                {data.month}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between text-xs text-gray-400 px-2 overflow-x-auto">
          <span className="whitespace-nowrap">N0M</span>
          <span className="whitespace-nowrap hidden sm:inline">N10M</span>
          <span className="whitespace-nowrap hidden md:inline">N20M</span>
          <span className="whitespace-nowrap hidden lg:inline">N30M</span>
          <span className="whitespace-nowrap hidden md:inline">N40M</span>
          <span className="whitespace-nowrap hidden sm:inline">N50M</span>
          <span className="whitespace-nowrap">N60M</span>
        </div>
      </div>
    </div>
  );
}
