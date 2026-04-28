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
import RecentPromotions from "./-components/RecentPromotions";

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
          <RecentPromotions />
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
