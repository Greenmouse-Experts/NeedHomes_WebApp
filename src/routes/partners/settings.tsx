import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { User, CreditCard, FileText, Shield, Bell } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { Avatar, AvatarFallback } from "@/components/ui/Avatar";
import { useAuth } from "@/store/authStore";

import type { USER } from "@/types";
import BankDetails from "@/simpleComps/BankDetails";
import KYCForm from "@/components/KYCForm";
import { PhoneInput } from "@/components/CountryPhoneInput";
import UserProfile from "@/components/UserProfile";
import ChangePassword from "@/components/ChangePassword";

export const Route = createFileRoute("/partners/settings")({
  component: SettingsPage,
});

type SettingsTab = "profile" | "bankDetails" | "kyc" | "security";

function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");
  const [authRecord] = useAuth();
  const user: USER | undefined = authRecord?.user;

  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    dateOfBirth: "",
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
    {
      id: "bankDetails" as SettingsTab,
      label: "Bank Details",
      icon: CreditCard,
    },
    { id: "kyc" as SettingsTab, label: "KYC", icon: FileText },
    { id: "security" as SettingsTab, label: "Security", icon: Shield },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">
            Settings
          </h1>
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
            {activeTab === "profile" && <UserProfile />}

            {/* Bank Details Tab */}
            {activeTab === "bankDetails" && (
              <>
                <BankDetails />
              </>
            )}

            {/* KYC Tab */}
            {activeTab === "kyc" && (
              <>
                <KYCForm />
              </>
            )}

            {/* Security Tab */}
            {activeTab === "security" && (
              <>
                <ChangePassword />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
