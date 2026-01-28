import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useRef } from "react";
import { ChevronLeft, Upload } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { Select } from "@/components/ui/Select";
import AdminKycForm from "@/components/AdminKycForm";

export const Route = createFileRoute("/dashboard/partners/$partnerId/kyc")({
  component: PartnerKYCPage,
});

function PartnerKYCPage() {
  const { partnerId } = Route.useParams();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<"kyc" | "bank">("kyc");

  const frontUploadRef = useRef<HTMLInputElement>(null);
  const backUploadRef = useRef<HTMLInputElement>(null);
  const utilityBillUploadRef = useRef<HTMLInputElement>(null);

  const [kycData, setKycData] = useState({
    idType: "national-id",
    address:
      "Zone 4, 1 ladi Kwali St, Wuse, Abuja 900001, Federal Capital Territory, Nigeria",
    frontUpload: null as File | null,
    backUpload: null as File | null,
    utilityBill: null as File | null,
  });

  const [bankDetails, setBankDetails] = useState({
    accountNumber: "0123456789",
    accountName: "Benson Omotayo",
    bankName: "first-bank",
  });

  const idTypeOptions = [
    { value: "national-id", label: "National ID" },
    { value: "drivers-license", label: "Driver's License" },
    { value: "passport", label: "International Passport" },
  ];

  const bankOptions = [
    { value: "access-bank", label: "Access Bank" },
    { value: "gtbank", label: "Guaranty Trust Bank (GTBank)" },
    { value: "first-bank", label: "First Bank of Nigeria" },
    { value: "uba", label: "United Bank for Africa (UBA)" },
    { value: "zenith-bank", label: "Zenith Bank" },
    { value: "fidelity-bank", label: "Fidelity Bank" },
    { value: "union-bank", label: "Union Bank" },
    { value: "sterling-bank", label: "Sterling Bank" },
    { value: "stanbic-ibtc", label: "Stanbic IBTC Bank" },
    { value: "fcmb", label: "First City Monument Bank (FCMB)" },
    { value: "ecobank", label: "Ecobank Nigeria" },
    { value: "wema-bank", label: "Wema Bank" },
    { value: "polaris-bank", label: "Polaris Bank" },
    { value: "keystone-bank", label: "Keystone Bank" },
    { value: "providus-bank", label: "Providus Bank" },
    { value: "kuda-bank", label: "Kuda Bank" },
    { value: "opay", label: "OPay" },
    { value: "palmpay", label: "PalmPay" },
  ];

  const handleFileUpload = (
    field: "frontUpload" | "backUpload" | "utilityBill",
    file: File | null,
  ) => {
    setKycData((prev) => ({ ...prev, [field]: file }));
  };

  const handleKycSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("KYC update:", kycData);
  };

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
        {activeTab === "bank" && (
          <div className="max-w-3xl">
            <h2 className="text-xl font-semibold mb-6">Bank Details</h2>

            <div className="space-y-6">
              {/* Account Number */}
              <div className="space-y-2">
                <Label htmlFor="accountNumber">Account Number</Label>
                <Input
                  id="accountNumber"
                  value={bankDetails.accountNumber}
                  readOnly
                  className="bg-gray-50"
                />
              </div>

              {/* Account Name */}
              <div className="space-y-2">
                <Label htmlFor="accountName">Account Name</Label>
                <Input
                  id="accountName"
                  value={bankDetails.accountName}
                  readOnly
                  className="bg-gray-50"
                />
              </div>

              {/* Bank Name */}
              <div className="space-y-2">
                <Label htmlFor="bankName">Bank Name</Label>
                <Select
                  id="bankName"
                  options={bankOptions}
                  value={bankDetails.bankName}
                  onChange={(e) =>
                    setBankDetails((prev) => ({
                      ...prev,
                      bankName: e.target.value,
                    }))
                  }
                  className="bg-gray-50"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  className="px-12"
                  onClick={() =>
                    navigate({
                      to: "/dashboard/partners/$partnerId",
                      params: { partnerId },
                    })
                  }
                >
                  Back
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
