import { Link } from "@tanstack/react-router";
import { LogOut, Menu, X } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/Avatar";
import { logout, useAuth } from "@/store/authStore";
import { useEffect } from "react";

interface InvestorSidebarProps {
  activePage?: string;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
}

export function InvestorSidebar({
  activePage,
  isSidebarOpen,
  setIsSidebarOpen,
}: InvestorSidebarProps) {
  const [authRecord] = useAuth();
  const user = authRecord?.user;

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isSidebarOpen && window.innerWidth < 768) {
        if (
          !target.closest("aside") &&
          !target.closest('button[aria-label="Toggle menu"]')
        ) {
          setIsSidebarOpen(false);
        }
      }
    };

    if (isSidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      // Prevent body scroll when sidebar is open on mobile
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "";
    };
  }, [isSidebarOpen, setIsSidebarOpen]);

  // Close sidebar when route changes on mobile
  const handleLinkClick = () => {
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Overlay/Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-[#2A2A2A] text-white rounded-lg shadow-lg hover:bg-[#3A3A3A] transition-colors"
        aria-label="Toggle menu"
      >
        {isSidebarOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Menu className="w-6 h-6" />
        )}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full w-64 bg-[#2A2A2A] text-white flex flex-col transform transition-transform duration-300 z-40 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Logo */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center gap-2.5">
            <img
              src="/logo_white.png"
              alt="NeedHomes"
              className="h-8"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
              }}
            />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          <Link
            to="/investors"
            onClick={handleLinkClick}
            className={`flex items-center gap-2.5 p-2 rounded-lg text-sm transition-colors ${
              activePage === "dashboard"
                ? "bg-[var(--color-orange)] text-white"
                : "hover:bg-gray-800 text-gray-400"
            }`}
          >
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
            <span>Dashboard</span>
          </Link>

          <Link
            to="/investors/my-investments"
            onClick={handleLinkClick}
            className={`flex items-center gap-2.5 p-2 rounded-lg text-sm transition-colors ${
              activePage === "my-investments"
                ? "bg-[var(--color-orange)] text-white"
                : "hover:bg-gray-800 text-gray-400"
            }`}
          >
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
            <span>My Investment</span>
          </Link>

          <Link
            to="/investors/properties"
            onClick={handleLinkClick}
            className={`flex items-center gap-2.5 p-2 rounded-lg text-sm transition-colors ${
              activePage === "properties"
                ? "bg-[var(--color-orange)] text-white"
                : "hover:bg-gray-800 text-gray-400"
            }`}
          >
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
            <span>Properties</span>
          </Link>

          <Link
            to="/investors/notifications"
            onClick={handleLinkClick}
            className={`flex items-center gap-2.5 p-2 rounded-lg text-sm transition-colors ${
              activePage === "notifications"
                ? "bg-[var(--color-orange)] text-white"
                : "hover:bg-gray-800 text-gray-400"
            }`}
          >
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
            <span>Notifications</span>
          </Link>

          <Link
            to="/investors/transactions"
            onClick={handleLinkClick}
            className={`flex items-center gap-2.5 p-2 rounded-lg text-sm transition-colors ${
              activePage === "transactions"
                ? "bg-[var(--color-orange)] text-white"
                : "hover:bg-gray-800 text-gray-400"
            }`}
          >
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
            <span>Transaction</span>
          </Link>

          <Link
            to="/investors/announcements"
            onClick={handleLinkClick}
            className={`flex items-center gap-2.5 p-2 rounded-lg text-sm transition-colors ${
              activePage === "announcements"
                ? "bg-[var(--color-orange)] text-white"
                : "hover:bg-gray-800 text-gray-400"
            }`}
          >
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
            <span>Announcement</span>
          </Link>

          <Link
            to="/investors/settings"
            onClick={handleLinkClick}
            className={`flex items-center gap-2.5 p-2 rounded-lg text-sm transition-colors ${
              activePage === "settings"
                ? "bg-[var(--color-orange)] text-white"
                : "hover:bg-gray-800 text-gray-400"
            }`}
          >
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
            <span>Setting</span>
          </Link>
          <button
            onClick={() => {
              logout();
            }}
            className={`flex items-center gap-2.5 p-2 rounded-lg text-sm transition-colors ${
              activePage === "announcements"
                ? "bg-[var(--color-orange)] text-white"
                : "hover:bg-gray-800 text-gray-400"
            }`}
          >
            <LogOut className="size-4" /> Logout
          </button>
        </nav>

        {/* Profile Card */}
        <div className="p-4 md:p-6 border-t border-gray-700">
          <div className="bg-white rounded-xl p-4 text-center">
            <Avatar className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 mx-auto mb-3">
              <AvatarFallback className="text-xl text-white bg-transparent">
                {user?.firstName ? user.firstName.charAt(0).toUpperCase() : "U"}
              </AvatarFallback>
            </Avatar>
            <h3 className="text-gray-900 font-bold text-sm mb-1">Profile</h3>
            <p className="text-gray-500 text-xs mb-3">
              {user?.firstName && user?.lastName
                ? `${user.firstName} ${user.lastName}`
                : "John Doe"}
            </p>
            <Link
              to="/investors/settings"
              onClick={handleLinkClick}
              className="w-full bg-orange-500 text-white text-xs font-medium py-2 rounded-lg hover:bg-orange-600 transition-colors block"
            >
              Profile
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
