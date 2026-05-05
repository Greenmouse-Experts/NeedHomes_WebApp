import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/store/authStore";
import CalendarWidget from "@/components/CalendarWidget";
import VerificationStatus from "../-components/VerificationStatus";
import UserWallet from "../-components/Wallet";
import PartnerAnalysis from "./-components/PartnerAnalysis";
import PartnerStatsCard from "./-components/PartnerStatsCards";
import RecentPromotions from "./-components/RecentPromotions";

export const Route = createFileRoute("/partners/")({
  component: PartnerDashboard,
});

function PartnerDashboard() {
  const [authRecord] = useAuth();
  const user = authRecord?.user;

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6 sm:mb-8">
        <div>
          <VerificationStatus />
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Welcome, {user?.firstName?.trim() ?? "Partner"}
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Welcome to your partnership overview and property management.
          </p>
        </div>
      </div>

      <section className="gap-6 flex flex-col lg:flex-row">
        <div className="flex-5/6 flex flex-col gap-6">
          <section className="flex gap-6 flex-col-reverse lg:flex-row">
            <div className="flex-1 w-full lg:max-w-xs">
              <CalendarWidget />
            </div>
            <div className="flex-1">
              <PartnerStatsCard />
            </div>
          </section>

          <RecentPromotions />
        </div>
        <div className="flex-1/3 flex-col gap-6">
          <UserWallet />
        </div>
      </section>

      <PartnerAnalysis />
    </div>
  );
}
