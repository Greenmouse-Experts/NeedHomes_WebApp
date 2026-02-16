import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useRef } from "react";
import { ChevronLeft, Upload } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { Select } from "@/components/ui/Select";
import AdminKycForm from "@/components/AdminKycForm";
import AdminBankDetails from "@/components/AdminBankDetails";

export const Route = createFileRoute("/dashboard/partners/$partnerId/kyc")({
  component: PartnerKYCPage,
});

function PartnerKYCPage() {
  const { partnerId } = Route.useParams();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<"kyc" | "bank">("kyc");

  const [kycData, setKycData] = useState({
    idType: "national-id",
    address:
      "Zone 4, 1 ladi Kwali St, Wuse, Abuja 900001, Federal Capital Territory, Nigeria",
    frontUpload: null as File | null,
    backUpload: null as File | null,
    utilityBill: null as File | null,
  });

  return (
    <DashboardLayout
      title="Super Admin Dashboard"
      subtitle="Partner KYC Details"
    >
      <div className="bg-white rounded-lg shadow-sm p-6">
        {/* Header with Back Button */}
        <div className="mb-6">
          <button
            onClick={() =>
              navigate({
                to: "/dashboard/partners/$partnerId",
                params: { partnerId },
              })
            }
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="font-medium">Back to Partner Details</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab("kyc")}
              className={`pb-3 px-1 font-medium text-sm transition-colors relative ${
                activeTab === "kyc"
                  ? "text-[var(--color-orange)] border-b-2 border-[var(--color-orange)]"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              KYC Information
            </button>
            <button
              onClick={() => setActiveTab("bank")}
              className={`pb-3 px-1 font-medium text-sm transition-colors relative ${
                activeTab === "bank"
                  ? "text-[var(--color-orange)] border-b-2 border-[var(--color-orange)]"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Bank Details
            </button>
          </div>
        </div>

        {/* KYC Information Tab */}
        {activeTab === "kyc" && <AdminKycForm id={partnerId} />}

        {/* Bank Details Tab */}
        {activeTab === "bank" && <AdminBankDetails id={partnerId} />}
      </div>
    </DashboardLayout>
  );
}
