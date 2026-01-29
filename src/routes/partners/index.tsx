import { createFileRoute } from "@tanstack/react-router";
import { Calendar, Star } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/store/authStore";
import CalendarWidget from "@/components/CalendarWidget";

export const Route = createFileRoute("/partners/")({
  component: PartnerDashboard,
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

function PartnerDashboard() {
  const maxValue = Math.max(...monthlyData.map((d) => d.value));
  const [authRecord] = useAuth();
  const user = authRecord?.user;

  const getCurrentDate = () => {
    const date = new Date();
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Welcome, {user?.firstName?.trim() ?? "Partner"}
        </h1>
        <p className="text-gray-600 text-sm sm:text-base">
          Welcome to your partnership overview and property management.
        </p>
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

            {/* Stats Cards inside orange box */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/30 rounded-xl flex items-center justify-center flex-shrink-0">
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
                  <div className="w-12 h-12 bg-white/30 rounded-xl flex items-center justify-center flex-shrink-0">
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
                  <div className="w-12 h-12 bg-white/30 rounded-xl flex items-center justify-center flex-shrink-0">
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
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-2xl md:text-3xl font-bold text-white">
                      8
                    </p>
                    <p className="text-xs md:text-sm text-white/90 font-medium">
                      Active Projects
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/30 rounded-xl flex items-center justify-center flex-shrink-0">
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
                        d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xl md:text-2xl font-bold text-white">
                      N 35,000,000
                    </p>
                    <p className="text-xs md:text-sm text-white/90 font-medium">
                      Partnership Revenue
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
      </div >


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
                            className={`inline-flex px-2 md:px-3 py-1 rounded-full text-xs font-semibold ${property.status === "Approved"
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
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 md:p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-base md:text-lg font-semibold text-gray-900">
                Wallet
              </h3>
              <button className="text-xs md:text-sm text-gray-500 hover:text-gray-700 font-medium">
                Monthly ▼
              </button>
            </div>

            {/* Balance */}
            <div className="p-4 md:p-6 bg-gradient-to-br from-gray-700 to-gray-900 text-white">
              <p className="text-xs text-gray-300 font-semibold mb-2 tracking-wide">
                TOTAL BALANCE
              </p>
              <div className="flex items-center justify-between">
                <p className="text-2xl md:text-3xl font-bold">N 120,000</p>
                <button className="w-8 h-8 md:w-10 md:h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
                  <svg
                    className="w-4 h-4 md:w-5 md:h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Income/Withdraw */}
            <div className="p-4 md:p-6">
              <div className="grid grid-cols-2 gap-2 md:gap-3 mb-4">
                <div className="bg-green-50 rounded-lg p-2 md:p-3 border border-green-200">
                  <p className="text-xs text-gray-600 font-semibold mb-1">
                    INCOME
                  </p>
                  <p className="text-base md:text-lg font-bold text-gray-900">
                    N 100,000
                  </p>
                </div>
                <div className="bg-red-50 rounded-lg p-2 md:p-3 border border-red-200">
                  <p className="text-xs text-gray-600 font-semibold mb-1">
                    WITHDRAW
                  </p>
                  <p className="text-base md:text-lg font-bold text-gray-900">
                    N 20,000
                  </p>
                </div>
              </div>

              <div className="space-y-2 md:space-y-3">
                <Button
                  variant="outline"
                  className="w-full text-sm md:text-base"
                >
                  Deposit
                </Button>
                <Button className="w-full bg-[var(--color-orange)] hover:bg-[var(--color-orange-dark)] text-white text-sm md:text-base">
                  Withdraw
                </Button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="p-4 md:p-6 border-t border-gray-200">
              <h4 className="text-xs font-semibold text-gray-600 mb-3 uppercase tracking-wide">
                Recent
              </h4>
              <div className="flex items-start gap-2 md:gap-3 p-2 md:p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-4 h-4 md:w-5 md:h-5 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs md:text-sm font-medium text-gray-900">
                    Payment for Vendor reg
                  </p>
                  <p className="text-xs text-gray-500 mt-1">01-02-25</p>
                </div>
                <div className="text-right">
                  <p className="text-xs md:text-sm font-semibold text-gray-900">
                    + N 200,000
                  </p>
                  <p className="text-xs text-green-600 font-medium mt-1">
                    Successful
                  </p>
                </div>
              </div>
            </div>
          </div>
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
    </div >
  );
}
