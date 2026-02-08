import { Link } from "@tanstack/react-router";
import {
  LayoutGrid,
  Building2,
  User,
  Bell,
  CircleDollarSign,
  Megaphone,
  List,
  Settings,
  LogOut,
} from "lucide-react";
import { show_logout, useAuth, useKyc } from "@/store/authStore";
import ProfileCard from "./ProfileCard";

interface InvestorSidebarProps {
  activePage?: string;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
}

export function InvestorSidebar({ activePage }: InvestorSidebarProps) {
  const [authRecord] = useAuth();

  const handleLinkClick = () => {
    const close_div = document.getElementById(
      "my-drawer-3",
    ) as HTMLLabelElement;
    if (close_div) close_div.click();
  };
  const [kyc] = useKyc();
  const isVerified = kyc && kyc.account_verification_status == "VERIFIED";

  const navLinks = [
    {
      to: "/investors",
      activePage: "dashboard",
      label: "Dashboard",
      icon: <LayoutGrid className="size-4" />,
      alwaysEnabled: true,
      activeOptions: { exact: true },
    },
    {
      to: "/investors/properties",
      activePage: "properties",
      label: "Properties",
      icon: <Building2 className="size-4" />,
      alwaysEnabled: false,
    },
    {
      to: "/investors/my-investments",
      activePage: "my-investments",
      label: "My Investment",
      icon: <User className="size-4" />,
      alwaysEnabled: false,
    },
    {
      to: "/investors/notifications",
      activePage: "notifications",
      label: "Notifications",
      icon: <Bell className="size-4" />,
      alwaysEnabled: false,
    },
    {
      to: "/investors/transactions",
      activePage: "transactions",
      label: "Transaction",
      icon: <CircleDollarSign className="size-4" />,
      alwaysEnabled: false,
    },
    {
      to: "/investors/announcements",
      activePage: "announcements",
      label: "Announcement",
      icon: <Megaphone className="size-4" />,
      alwaysEnabled: false,
    },
    {
      to: "/investors/subscriptions",
      activePage: "subscriptions",
      label: "Subscriptions",
      icon: <List className="size-4" />,
      alwaysEnabled: false,
    },
    {
      to: "/investors/settings",
      activePage: "settings",
      label: "Setting",
      icon: <Settings className="size-4" />,
      alwaysEnabled: true,
    },
  ];

  return (
    <>
      {/* Sidebar */}
      <aside
        className={` bg-[#2A2A2A] text-white flex flex-col justify-between  h-full `}
      >
        {/*{JSON.stringify(isVerified)}*/}
        <div className="p-4 border-b border-gray-700 ">
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
        <nav className="flex-1 overflow-y-auto p-3 space-y-1  ">
          {navLinks.map((link) => {
            const isDisabled = !isVerified && !link.alwaysEnabled;
            const linkClasses = `flex items-center gap-2.5 p-2 rounded-lg text-sm transition-colors ${
              activePage === link.activePage
                ? "bg-[var(--color-orange)] text-white"
                : isDisabled
                  ? "text-gray-600 cursor-not-allowed opacity-50"
                  : "hover:bg-gray-800 text-gray-400"
            }`;

            return (
              <Link
                key={link.to}
                to={isDisabled ? "#" : link.to}
                onClick={
                  isDisabled ? (e) => e.preventDefault() : handleLinkClick
                }
                disabled={isDisabled}
                className={linkClasses}
                activeOptions={link.activeOptions}
                activeProps={{
                  className: "bg-[var(--color-orange)] text-white",
                }}
              >
                {link.icon}
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
