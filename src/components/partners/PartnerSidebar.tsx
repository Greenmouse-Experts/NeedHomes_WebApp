import { Link } from "@tanstack/react-router";
import {
  List,
  LogOut,
  LayoutDashboard,
  Building2,
  Bell,
  Wallet,
  Megaphone,
  Settings,
} from "lucide-react";
import { show_logout, useAuth, useKyc } from "@/store/authStore";
import ProfileCard from "../investors/ProfileCard";

interface PartnerSidebarProps {
  activePage?: string;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
}

const NAV_LINKS = [
  {
    to: "/partners",
    label: "Dashboard",
    id: "dashboard",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    to: "/partners/properties",
    label: "Properties",
    id: "properties",
    icon: Building2,
  },
  {
    to: "/partners/notifications",
    label: "Notifications",
    id: "notifications",
    icon: Bell,
  },
  {
    to: "/partners/transactions",
    label: "Transaction",
    id: "transactions",
    icon: Wallet,
  },
  {
    to: "/partners/announcements",
    label: "Announcement",
    id: "announcements",
    icon: Megaphone,
  },
  {
    to: "/investors/subscriptions",
    label: "Subscriptions",
    id: "subscriptions",
    icon: List,
  },
  {
    to: "/partners/settings",
    label: "Setting",
    id: "settings",
    icon: Settings,
  },
];

export function PartnerSidebar({
  activePage,
  setIsSidebarOpen,
}: PartnerSidebarProps) {
  const [authRecord] = useAuth();

  // Close sidebar when route changes on mobile
  const handleLinkClick = () => {
    const close_div = document.getElementById(
      "my-drawer-3",
    ) as HTMLLabelElement;
    if (close_div) close_div.click();
  };
  const [kyc] = useKyc();
  const isVerified = kyc && kyc.account_verification_status == "VERIFIED";

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full w-64 bg-[#2A2A2A] text-white flex flex-col transform transition-transform duration-300 z-40`}
      >
        {/* Logo */}
        <div className="p-4 border-b border-gray-700">
          <Link to="/" className="flex items-center gap-2.5">
            <img
              src="/logo_white.png"
              alt="NeedHomes"
              className="h-8"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
              }}
            />
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {NAV_LINKS.map((link) => {
            const isRestricted =
              !isVerified && link.id !== "dashboard" && link.id !== "settings";

            return (
              <Link
                key={link.to}
                to={isRestricted ? "#" : link.to}
                onClick={
                  isRestricted ? (e) => e.preventDefault() : handleLinkClick
                }
                disabled={isRestricted}
                className={`flex items-center gap-2.5 p-2 rounded-lg text-sm transition-colors ${
                  activePage === link.id
                    ? "bg-(--color-orange) text-white"
                    : "hover:bg-gray-800 text-gray-400"
                } ${isRestricted ? "opacity-50 cursor-not-allowed" : ""}`}
                activeProps={{
                  className: "bg-(--color-orange) text-white",
                }}
                activeOptions={{ exact: link.exact }}
              >
                <link.icon className="size-4" />
                <span>{link.label}</span>
              </Link>
            );
          })}

          <button
            onClick={() => {
              show_logout();
            }}
            className={`w-full flex items-center gap-2.5 p-2 rounded-lg text-sm transition-colors hover:bg-gray-800 text-gray-400`}
          >
            <LogOut className="size-4" /> Logout
          </button>
        </nav>

        {/* Profile Card */}
        <div className="p-4 md:p-6 border-t border-gray-700">
          <ProfileCard />
        </div>
      </aside>
    </>
  );
}
