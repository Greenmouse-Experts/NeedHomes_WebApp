import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  User,
  CreditCard,
  FileText,
  Shield,
  Upload,
  Calendar,
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { Avatar, AvatarFallback } from "@/components/ui/Avatar";
import { useAuth } from "@/store/authStore";
import Charges from "./-components/Charges";

export const Route = createFileRoute("/dashboard/settings/")({
  component: SettingsPage,
});

type SettingsTab = "profile" | "bankDetails" | "Charges" | "security";

function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");
  const [authRecord, setAuthRecord] = useAuth();
  const user = authRecord?.user;

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
        phoneNumber: "",
        dateOfBirth: "",
      });
    }
  }, [user]);

  const handleProfileChange = (field: string, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData((prev) => ({ ...prev, [field]: value }));
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Profile update:", profileData);
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

    { id: "security" as SettingsTab, label: "Security", icon: Shield },
    { id: "Charges" as SettingsTab, label: "Charges", icon: Shield },
  ];

  return (
    <DashboardLayout title="Settings" subtitle="">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Sidebar Navigation */}
          <div className="w-full md:w-64 bg-gray-50 border-r border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h2 className="font-semibold text-lg">Settings</h2>
            </div>
            <nav className="p-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm mb-1 ${
                      activeTab === tab.id
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-600 hover:bg-white/50"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-6 md:p-8">
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div>
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase mb-4">
                    PROFILE
                  </h3>
                </div>

                <form onSubmit={handleProfileSubmit} className="max-w-2xl">
                  {/* Profile Picture */}
                  <div className="mb-6">
                    <div className="flex items-center gap-4">
                      <Avatar className="w-24 h-24 bg-gradient-to-br from-cyan-400 to-cyan-500">
                        <AvatarFallback className="text-2xl text-white bg-transparent">
                          {user?.firstName
                            ? user.firstName.charAt(0).toUpperCase()
                            : "U"}
                        </AvatarFallback>
                      </Avatar>
                      <Button type="button" variant="outline" size="sm">
                        Change Picture
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* First Name */}
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={profileData.firstName}
                        onChange={(e) =>
                          handleProfileChange("firstName", e.target.value)
                        }
                        placeholder="firstName"
                      />
                    </div>

                    {/* Last Name */}
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={profileData.lastName}
                        onChange={(e) =>
                          handleProfileChange("lastName", e.target.value)
                        }
                        placeholder="Xylarz"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-2 mt-6">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) =>
                        handleProfileChange("email", e.target.value)
                      }
                      placeholder="testmail@gmail.com"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    {/* Phone Number */}
                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber">Phone Number</Label>
                      <div className="flex gap-2">
                        <div className="w-16 flex items-center justify-center border border-gray-300 rounded-md">
                          <span className="text-2xl">🇳🇬</span>
                        </div>
                        <Input
                          id="phoneNumber"
                          value={profileData.phoneNumber}
                          onChange={(e) =>
                            handleProfileChange("phoneNumber", e.target.value)
                          }
                          placeholder="0700 000 0000"
                          className="flex-1"
                        />
                      </div>
                    </div>

                    {/* Date of Birth */}
                    {/*<div className="space-y-2">
                      <Label htmlFor="dateOfBirth">Date of Birth</Label>
                      <div className="relative">
                        <Input
                          id="dateOfBirth"
                          type="date"
                          value={profileData.dateOfBirth}
                          onChange={(e) =>
                            handleProfileChange("dateOfBirth", e.target.value)
                          }
                          placeholder="20/01/2028"
                        />
                      </div>
                    </div>*/}
                  </div>

                  {/* Save Button */}
                  <div className="pt-6">
                    <Button
                      type="submit"
                      className="bg-[var(--color-orange)] hover:bg-[var(--color-orange-dark)] text-white px-12"
                    >
                      Save
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {/* Bank Details Tab */}

            {/* KYC Tab */}

            {/* Security Tab */}
            {activeTab === "Charges" && <Charges />}
            {activeTab === "security" && (
              <div>
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase mb-4">
                    Change Password
                  </h3>
                </div>

                <form
                  onSubmit={handlePasswordSubmit}
                  className="max-w-2xl space-y-6"
                >
                  {/* New Password */}
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      placeholder="**********"
                      value={passwordData.newPassword}
                      onChange={(e) =>
                        handlePasswordChange("newPassword", e.target.value)
                      }
                      required
                    />
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="**********"
                      value={passwordData.confirmPassword}
                      onChange={(e) =>
                        handlePasswordChange("confirmPassword", e.target.value)
                      }
                      required
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <Button
                      type="submit"
                      className="bg-[var(--color-orange)] hover:bg-[var(--color-orange-dark)] text-white px-12"
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
    </DashboardLayout>
  );
}
