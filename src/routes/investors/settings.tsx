import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  User,
  CreditCard,
  FileText,
  Shield,
  Upload,
  Bell,
  Menu,
} from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { Avatar, AvatarFallback } from "@/components/ui/Avatar";
import { useAuth } from "@/store/authStore";
import { InvestorSidebar } from "@/components/investors/InvestorSidebar";
import type { USER } from "@/types";

export const Route = createFileRoute("/investors/settings")({
  component: SettingsPage,
});

type SettingsTab = "profile" | "bankDetails" | "kyc" | "security";

function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");
  const [authRecord] = useAuth();
  const user: USER | undefined = authRecord?.user;
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    dateOfBirth: "",
  });

  const [bankData, setBankData] = useState({
    accountNumber: "",
    bankName: "",
    accountName: "",
    accountType: "",
  });

  const [kycData, setKycData] = useState({
    idType: "",
    frontUpload: null as File | null,
    backUpload: null as File | null,
    utilityBill: null as File | null,
    address: "",
  });

  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phoneNumber: "", // Assuming phoneNumber is not part of USER type or needs to be fetched
        dateOfBirth: "", // Assuming dateOfBirth is not part of USER type or needs to be fetched
      });
    }
  }, [user]);

  const handleProfileChange = (field: string, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  const handleBankChange = (field: string, value: string) => {
    setBankData((prev) => ({ ...prev, [field]: value }));
  };

  const handleKycChange = (field: string, value: string | File | null) => {
    setKycData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData((prev) => ({ ...prev, [field]: value }));
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Profile update:", profileData);
  };

  const handleBankSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Bank details update:", bankData);
  };

  const handleKycSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("KYC update:", kycData);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    console.log("Password update:", passwordData);
  };

  const tabs = [
    { id: "profile" as SettingsTab, label: "Profile", icon: User },
    {
      id: "bankDetails" as SettingsTab,
      label: "Bank Details",
      icon: CreditCard,
    },
    { id: "kyc" as SettingsTab, label: "KYC", icon: FileText },
    { id: "security" as SettingsTab, label: "Security", icon: Shield },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      <InvestorSidebar
        activePage="settings"
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      {/* Main Content */}
      <main className="md:ml-64 flex-1 p-4 md:p-8 min-h-screen">
        {/* Header */}
        <header className="flex items-center justify-between mb-6 md:mb-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              <Menu className="w-6 h-6 text-gray-600" />
            </button>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                Investor
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full"></span>
            </button>
            <div className="w-8 h-8 md:w-10 md:h-10 bg-linear-to-br from-orange-400 to-orange-600 rounded-full"></div>
          </div>
        </header>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Sidebar Navigation */}
            <div className="w-full md:w-64 bg-gray-50 border-b md:border-b-0 md:border-r border-gray-200">
              <div className="p-4 border-b md:border-b border-gray-200">
                <h2 className="font-semibold text-base md:text-lg">Settings</h2>
              </div>
              <nav className="p-2 flex md:flex-col overflow-x-auto md:overflow-x-visible">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 md:gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm mb-1 whitespace-nowrap ${
                        activeTab === tab.id
                          ? "bg-white text-gray-900 shadow-sm"
                          : "text-gray-600 hover:bg-white/50"
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-4 md:p-6 lg:p-8">
              {/* Profile Tab */}
              {activeTab === "profile" && (
                <div>
                  <div className="mb-4 md:mb-6">
                    <h3 className="text-xs md:text-sm font-semibold text-gray-500 uppercase mb-3 md:mb-4">
                      PROFILE
                    </h3>
                  </div>

                  <form onSubmit={handleProfileSubmit} className="max-w-2xl">
                    {/* Profile Picture */}
                    <div className="mb-4 md:mb-6">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 md:gap-4">
                        <Avatar className="w-20 h-20 md:w-24 md:h-24 bg-linear-to-br from-cyan-400 to-cyan-500">
                          <AvatarFallback className="text-xl md:text-2xl text-white bg-transparent">
                            {user?.firstName
                              ? user.firstName.charAt(0).toUpperCase()
                              : "U"}
                          </AvatarFallback>
                        </Avatar>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="text-xs md:text-sm"
                        >
                          Change Picture
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                      {/* First Name */}
                      <div className="space-y-2">
                        <Label htmlFor="firstName" className="text-sm">
                          First Name
                        </Label>
                        <Input
                          id="firstName"
                          value={profileData.firstName}
                          onChange={(e) =>
                            handleProfileChange("firstName", e.target.value)
                          }
                          placeholder="firstName"
                          className="text-sm md:text-base"
                        />
                      </div>

                      {/* Last Name */}
                      <div className="space-y-2">
                        <Label htmlFor="lastName" className="text-sm">
                          Last Name
                        </Label>
                        <Input
                          id="lastName"
                          value={profileData.lastName}
                          onChange={(e) =>
                            handleProfileChange("lastName", e.target.value)
                          }
                          placeholder="Xylarz"
                          className="text-sm md:text-base"
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-2 mt-4 md:mt-6">
                      <Label htmlFor="email" className="text-sm">
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) =>
                          handleProfileChange("email", e.target.value)
                        }
                        placeholder="testmail@gmail.com"
                        className="text-sm md:text-base"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-4 md:mt-6">
                      {/* Phone Number */}
                      <div className="space-y-2">
                        <Label htmlFor="phoneNumber" className="text-sm">
                          Phone Number
                        </Label>
                        <div className="flex gap-2">
                          <div className="w-12 md:w-16 flex items-center justify-center border border-gray-300 rounded-md shrink-0">
                            <span className="text-xl md:text-2xl">🇳🇬</span>
                          </div>
                          <Input
                            id="phoneNumber"
                            value={profileData.phoneNumber}
                            onChange={(e) =>
                              handleProfileChange("phoneNumber", e.target.value)
                            }
                            placeholder="0700 000 0000"
                            className="flex-1 text-sm md:text-base"
                          />
                        </div>
                      </div>

                      {/* Date of Birth */}
                      <div className="space-y-2">
                        <Label htmlFor="dateOfBirth" className="text-sm">
                          Date of Birth
                        </Label>
                        <div className="relative">
                          <Input
                            id="dateOfBirth"
                            type="date"
                            value={profileData.dateOfBirth}
                            onChange={(e) =>
                              handleProfileChange("dateOfBirth", e.target.value)
                            }
                            placeholder="20/01/2028"
                            className="text-sm md:text-base"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Save Button */}
                    <div className="pt-4 md:pt-6">
                      <Button
                        type="submit"
                        className="bg-brand-orange hover:bg-brand-orange-dark text-white px-6 md:px-12 text-sm md:text-base w-full sm:w-auto"
                      >
                        Save
                      </Button>
                    </div>
                  </form>
                </div>
              )}

              {/* Bank Details Tab */}
              {activeTab === "bankDetails" && (
                <div>
                  <div className="mb-4 md:mb-6">
                    <h3 className="text-xs md:text-sm font-semibold text-gray-500 uppercase mb-3 md:mb-4">
                      Bank Details
                    </h3>
                  </div>

                  <form onSubmit={handleBankSubmit} className="max-w-2xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                      {/* Account Number */}
                      <div className="space-y-2">
                        <Label htmlFor="accountNumber" className="text-sm">
                          Account Number
                        </Label>
                        <Input
                          id="accountNumber"
                          value={bankData.accountNumber}
                          onChange={(e) =>
                            handleBankChange("accountNumber", e.target.value)
                          }
                          placeholder="Enter Acct Number"
                          className="text-sm md:text-base"
                        />
                      </div>

                      {/* Bank Name */}
                      <div className="space-y-2">
                        <Label htmlFor="bankName" className="text-sm">
                          Bank Name
                        </Label>
                        <select
                          id="bankName"
                          value={bankData.bankName}
                          onChange={(e) =>
                            handleBankChange("bankName", e.target.value)
                          }
                          className="w-full px-3 py-2 text-sm md:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent"
                        >
                          <option value="">Select</option>
                          <option value="access">Access Bank</option>
                          <option value="gtb">GTBank</option>
                          <option value="first">First Bank</option>
                          <option value="zenith">Zenith Bank</option>
                          <option value="uba">UBA</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-4 md:mt-6">
                      {/* Account Name */}
                      <div className="space-y-2">
                        <Label htmlFor="accountName" className="text-sm">
                          Account Name
                        </Label>
                        <Input
                          id="accountName"
                          value={bankData.accountName}
                          onChange={(e) =>
                            handleBankChange("accountName", e.target.value)
                          }
                          className="bg-red-50 text-sm md:text-base"
                          disabled
                        />
                      </div>

                      {/* Account Type */}
                      <div className="space-y-2">
                        <Label htmlFor="accountType" className="text-sm">
                          Account Type
                        </Label>
                        <select
                          id="accountType"
                          value={bankData.accountType}
                          onChange={(e) =>
                            handleBankChange("accountType", e.target.value)
                          }
                          className="w-full px-3 py-2 text-sm md:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent"
                        >
                          <option value="">Select</option>
                          <option value="savings">Savings</option>
                          <option value="current">Current</option>
                        </select>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4 md:pt-6">
                      <Button
                        type="submit"
                        className="bg-brand-orange hover:bg-brand-orange-dark text-white px-6 md:px-12 text-sm md:text-base w-full sm:w-auto"
                      >
                        Submit
                      </Button>
                    </div>
                  </form>
                </div>
              )}

              {/* KYC Tab */}
              {activeTab === "kyc" && (
                <div>
                  <div className="mb-4 md:mb-6">
                    <h3 className="text-xs md:text-sm font-semibold text-gray-500 uppercase mb-3 md:mb-4">
                      KYC
                    </h3>
                  </div>

                  <form onSubmit={handleKycSubmit} className="max-w-2xl">
                    {/* ID Type */}
                    <div className="space-y-2 mb-4 md:mb-6">
                      <Label htmlFor="idType" className="text-sm">
                        ID Type
                      </Label>
                      <select
                        id="idType"
                        value={kycData.idType}
                        onChange={(e) =>
                          handleKycChange("idType", e.target.value)
                        }
                        className="flex w-full rounded-xl border-2 border-gray-200 bg-white px-3 md:px-4 py-2 md:py-3 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all duration-300"
                      >
                        <option value="">Select ID Type</option>
                        <option value="national-id">National ID</option>
                        <option value="drivers-license">
                          Driver's License
                        </option>
                        <option value="passport">International Passport</option>
                        <option value="voters-card">Voter's Card</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6">
                      {/* Upload Front */}
                      <div className="space-y-2">
                        <Label className="text-sm">Upload Front</Label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 md:p-8 text-center hover:border-brand-orange transition-colors cursor-pointer">
                          <input
                            type="file"
                            onChange={(e) =>
                              handleKycChange(
                                "frontUpload",
                                e.target.files?.[0] || null,
                              )
                            }
                            className="hidden"
                            id="frontUpload"
                            accept="image/*"
                          />
                          <label
                            htmlFor="frontUpload"
                            className="cursor-pointer"
                          >
                            <Upload className="w-6 h-6 md:w-8 md:h-8 mx-auto mb-2 text-gray-400" />
                            <p className="text-xs md:text-sm text-brand-orange">
                              View File Upload
                            </p>
                          </label>
                        </div>
                      </div>

                      {/* Upload Back */}
                      <div className="space-y-2">
                        <Label className="text-sm">Upload Back</Label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 md:p-8 text-center hover:border-brand-orange transition-colors cursor-pointer">
                          <input
                            type="file"
                            onChange={(e) =>
                              handleKycChange(
                                "backUpload",
                                e.target.files?.[0] || null,
                              )
                            }
                            className="hidden"
                            id="backUpload"
                            accept="image/*"
                          />
                          <label
                            htmlFor="backUpload"
                            className="cursor-pointer"
                          >
                            <Upload className="w-6 h-6 md:w-8 md:h-8 mx-auto mb-2 text-gray-400" />
                            <p className="text-xs md:text-sm text-brand-orange">
                              View File Upload
                            </p>
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Utility Bill */}
                    <div className="space-y-2 mb-4 md:mb-6">
                      <Label className="text-sm">
                        Utility Bill (Proof of Address)
                      </Label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 md:p-8 text-center hover:border-brand-orange transition-colors cursor-pointer">
                        <input
                          type="file"
                          onChange={(e) =>
                            handleKycChange(
                              "utilityBill",
                              e.target.files?.[0] || null,
                            )
                          }
                          className="hidden"
                          id="utilityBill"
                          accept="image/*,application/pdf"
                        />
                        <label htmlFor="utilityBill" className="cursor-pointer">
                          <Upload className="w-6 h-6 md:w-8 md:h-8 mx-auto mb-2 text-gray-400" />
                          <p className="text-xs md:text-sm text-brand-orange">
                            View File Upload
                          </p>
                        </label>
                      </div>
                    </div>

                    {/* Address */}
                    <div className="space-y-2 mb-4 md:mb-6">
                      <Label htmlFor="address" className="text-sm">
                        Address
                      </Label>
                      <Input
                        id="address"
                        value={kycData.address}
                        onChange={(e) =>
                          handleKycChange("address", e.target.value)
                        }
                        placeholder="Zone A 1 Egbi Ewaji St, Wuse, Abuja 900001, Federal Capital Territory, Nigeria"
                        className="text-sm md:text-base"
                      />
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4 md:pt-6">
                      <Button
                        type="submit"
                        className="bg-brand-orange hover:bg-brand-orange-dark text-white px-6 md:px-12 text-sm md:text-base w-full sm:w-auto"
                      >
                        Submit
                      </Button>
                    </div>
                  </form>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === "security" && (
                <div>
                  <div className="mb-4 md:mb-6">
                    <h3 className="text-xs md:text-sm font-semibold text-gray-500 uppercase mb-3 md:mb-4">
                      Change Password
                    </h3>
                  </div>

                  <form
                    onSubmit={handlePasswordSubmit}
                    className="max-w-2xl space-y-4 md:space-y-6"
                  >
                    {/* New Password */}
                    <div className="space-y-2">
                      <Label htmlFor="newPassword" className="text-sm">
                        New Password
                      </Label>
                      <Input
                        id="newPassword"
                        type="password"
                        placeholder="SuperAdmin"
                        value={passwordData.newPassword}
                        onChange={(e) =>
                          handlePasswordChange("newPassword", e.target.value)
                        }
                        required
                        className="text-sm md:text-base"
                      />
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="text-sm">
                        Confirm Password
                      </Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="SuperAdmin"
                        value={passwordData.confirmPassword}
                        onChange={(e) =>
                          handlePasswordChange(
                            "confirmPassword",
                            e.target.value,
                          )
                        }
                        required
                        className="text-sm md:text-base"
                      />
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2 md:pt-4">
                      <Button
                        type="submit"
                        className="bg-brand-orange hover:bg-brand-orange-dark text-white px-6 md:px-12 text-sm md:text-base w-full sm:w-auto"
                      >
                        Update
                      </Button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
