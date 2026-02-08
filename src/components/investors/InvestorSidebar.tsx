import { Link } from "@tanstack/react-router";
import { List, LogOut } from "lucide-react";
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
      icon: (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
          />
        </svg>
      ),
      alwaysEnabled: true,
    },
    {
      to: "/investors/properties",
      activePage: "properties",
      label: "Properties",
      icon: (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
      ),
      alwaysEnabled: false,
    },
    {
      to: "/investors/my-investments",
      activePage: "my-investments",
      label: "My Investment",
      icon: (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      ),
      alwaysEnabled: false,
    },
    {
      to: "/investors/notifications",
      activePage: "notifications",
      label: "Notifications",
      icon: (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
      ),
      alwaysEnabled: false,
    },
    {
      to: "/investors/transactions",
      activePage: "transactions",
      label: "Transaction",
      icon: (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      alwaysEnabled: false,
    },
    {
      to: "/investors/announcements",
      activePage: "announcements",
      label: "Announcement",
      icon: (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
      ),
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
      icon: (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
      alwaysEnabled: true,
    },
  ];

  return (
    <>
      {/* Sidebar */}
      <aside
        className={` bg-[#2A2A2A] text-white flex flex-col justify-between  h-full `}
      >
        {JSON.stringify(isVerified)}
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
