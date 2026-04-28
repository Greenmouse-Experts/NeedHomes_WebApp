import { createFileRoute, Link } from "@tanstack/react-router";
import { Bell, CheckCircle2, Star, Wallet } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/store/authStore";
import CalendarWidget from "@/components/CalendarWidget";
import ThemeProvider from "@/simpleComps/ThemeProvider";
import VerificationStatus from "../-components/VerificationStatus";
import UserWallet from "../-components/Wallet";
import PartnerAnalysis from "./-components/PartnerAnalysis";
import PartnerStatsCard from "./-components/PartnerStatsCards";

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

  const isVerified = user?.isEmailVerified; // Assuming isEmailVerified indicates overall verification
  const profilePicture = user?.profilePicture;

  return (
    <div className="space-y-6">
      {/* Welcome Header */}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6 sm:mb-8">
        {/* Left Side: Welcome Message */}
        <div>
          <VerificationStatus />
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Welcome, {user?.firstName?.trim() ?? "Partner"}
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Welcome to your partnership overview and property management.
          </p>
        </div>

        {/* Right Side: Notifications and Profile */}
      </div>

      {/* Stats Cards in Orange Box + Calendar */}
      <PartnerStatsCard />
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
      <PartnerAnalysis />
    </div>
  );
}
