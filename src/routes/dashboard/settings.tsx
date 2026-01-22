import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { User, Lock, Headphones } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";

import { Avatar, AvatarFallback } from "@/components/ui/Avatar";
import { useAuth } from "@/store/authStore";
import type { AUTHRECORD } from "@/store/authStore";

export const Route = createFileRoute("/dashboard/settings")({
  component: SettingsPage,
});

type SettingsTab = "profile" | "password" | "support";

function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");
  const [authRecord, setAuthRecord] = useAuth(); // Destructure directly to get user and setAuthRecord
  const user = authRecord?.user; // Extract the user object from AUTHRECORD
  console.log(user);
  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [profileData, setProfileData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    alternatePhone: "",
    howDidYouHear: "",
    country: "",
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        fullName: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
        email: user.email || "",
        phoneNumber: "", // Assuming phone number is not directly in USER type, or needs to be fetched
        alternatePhone: "", // Assuming alternate phone is not directly in USER type
        howDidYouHear: "", // Assuming this is not directly in USER type
        country: "", // Assuming country is not directly in USER type
      });
    }
  }, [user]);

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData((prev) => ({ ...prev, [field]: value }));
  };

  const handleProfileChange = (field: string, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    console.log("Password update:", passwordData);
    // Here you would typically call an API to update the password
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Profile update:", profileData);
    // Here you would typically call an API to update the profile
    // If you want to update the local user state after a successful API call:
    if (authRecord) {
      const updatedUser = {
        ...authRecord.user,
        firstName: profileData.fullName.split(" ")[0],
        lastName: profileData.fullName.split(" ")[1] || "",
        email: profileData.email,
      };
      setAuthRecord({ ...authRecord, user: updatedUser });
    }
  };

  const tabs = [
    { id: "profile" as SettingsTab, label: "Profile", icon: User },
    { id: "password" as SettingsTab, label: "Password", icon: Lock },
    { id: "support" as SettingsTab, label: "Support", icon: Headphones },
  ];

  const renderPersonalInfoForm = () => (
    <form onSubmit={handleProfileSubmit} className="max-w-3xl">
      {/* Profile Picture */}
      <div className="mb-6">
        <Label className="mb-2">Profile Picture</Label>
        <div className="flex items-center gap-4 mt-2">
          <Avatar className="w-24 h-24 bg-gray-100">
            <AvatarFallback className="text-2xl text-gray-400">
              {user?.firstName ? user.firstName.charAt(0).toUpperCase() : "U"}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Full Name */}
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            value={profileData.fullName}
            onChange={(e) => handleProfileChange("fullName", e.target.value)}
            className="bg-gray-50"
          />
        </div>

        {/* Email Address */}
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            value={profileData.email}
            onChange={(e) => handleProfileChange("email", e.target.value)}
            className="bg-gray-50"
          />
        </div>

        {/* Phone Number */}
        <div className="space-y-2">
          <Label htmlFor="phoneNumber">Phone Number</Label>
          <Input
            id="phoneNumber"
            value={profileData.phoneNumber}
            onChange={(e) => handleProfileChange("phoneNumber", e.target.value)}
            className="bg-gray-50"
          />
        </div>

        {/* Alternate Phone Number */}
        <div className="space-y-2">
          <Label htmlFor="alternatePhone">Alternate Phone Number</Label>
          <Input
            id="alternatePhone"
            value={profileData.alternatePhone}
            onChange={(e) =>
              handleProfileChange("alternatePhone", e.target.value)
            }
            className="bg-gray-50"
          />
        </div>
      </div>

      {/* How did you hear about us */}
      <div className="space-y-2 mt-6">
        <Label htmlFor="howDidYouHear">How did you hear about us?</Label>
        <Input
          id="howDidYouHear"
          value={profileData.howDidYouHear}
          onChange={(e) => handleProfileChange("howDidYouHear", e.target.value)}
          className="bg-gray-50"
        />
      </div>

      {/* Update Button */}
      <div className="pt-6">
        <Button type="submit" variant="primary" size="lg" className="px-12">
          Update
        </Button>
      </div>
    </form>
  );

  return (
    <DashboardLayout title="Super Admin Dashboard" subtitle="">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Sidebar Navigation */}
          <div className="w-full md:w-64 bg-gray-50 border-r border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h2 className="font-semibold text-lg">Settings</h2>
            </div>
            <nav className="p-2">
              <div className="mb-2">
                <p className="text-xs font-semibold text-gray-500 uppercase px-3 py-2">
                  Personal
                </p>
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm ${
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
              </div>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-6 md:p-8">
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div>
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-4">View Details</h3>
                </div>

                {/* Personal Info Content */}
                {renderPersonalInfoForm()}
              </div>
            )}

            {/* Password Tab */}
            {activeTab === "password" && (
              <div>
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-1">
                    CHANGE PASSWORD
                  </h3>
                </div>

                <form
                  onSubmit={handlePasswordSubmit}
                  className="max-w-md space-y-6"
                >
                  {/* New Password */}
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      placeholder="Enter new password"
                      value={passwordData.newPassword}
                      onChange={(e) =>
                        handlePasswordChange("newPassword", e.target.value)
                      }
                      required
                      className="bg-gray-50"
                    />
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm new password"
                      value={passwordData.confirmPassword}
                      onChange={(e) =>
                        handlePasswordChange("confirmPassword", e.target.value)
                      }
                      required
                      className="bg-gray-50"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      className="px-12"
                    >
                      Update
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {/* Support Tab */}
            {activeTab === "support" && (
              <div className="text-center py-12 text-gray-500">
                <Headphones className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p>Support page coming soon...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
