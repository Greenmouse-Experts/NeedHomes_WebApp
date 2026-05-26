import { Link } from "@tanstack/react-router";
import {
  LayoutGrid,
  Building2,
  User,
  Bell,
  Megaphone,
  Settings,
  LogOut,
  ArrowLeftRight,
  Heart,
} from "lucide-react";
import { show_logout, useAuth, useKyc } from "@/store/authStore";
import ProfileCard from "./ProfileCard";
import { ChatBubbleLeftIcon } from "@heroicons/react/24/outline";
import { NairaIcon } from "../NairaIcon";
import { useQuery } from "@tanstack/react-query";
import apiClient, { type ApiResponse } from "@/api/simpleApi";
import { useEffect } from "react";
import { useAtom } from "jotai/react";
import {
  connectUserChatSocket,
  disconnectUserChatSocket,
  clearUserNewChatCount,
  userNewChatCountAtom,
} from "@/store/userChatSocket";

const RenderChat = (props: {
  link: any;
  isDisabled: boolean;
  activePage?: string;
  handleLinkClick: () => void;
}) => {
  const [newChatCount] = useAtom(userNewChatCountAtom);

  useEffect(() => {
    if (props.activePage === "chat") clearUserNewChatCount();
  }, [props.activePage]);

  const { link, isDisabled, activePage, handleLinkClick } = props;
  return (
    <Link
      key={link.to}
      to={isDisabled ? "#" : link.to}
      onClick={
        isDisabled
          ? (e) => e.preventDefault()
          : () => {
              clearUserNewChatCount();
              handleLinkClick();
            }
      }
      disabled={isDisabled}
      className={`flex items-center gap-2.5 p-2 rounded-lg text-sm transition-colors ${
        activePage === link.activePage
          ? "bg-[var(--color-orange)] text-white"
          : isDisabled
            ? "text-gray-600 cursor-not-allowed opacity-50"
            : "hover:bg-gray-800 text-gray-400"
      }`}
      activeProps={{ className: "bg-[var(--color-orange)] text-white" }}
      activeOptions={link.activeOptions}
    >
      {link.icon}
      <span>{link.label}</span>
      {newChatCount > 0 && (
        <span className="ml-auto w-2 h-2 rounded-full bg-red-500 shrink-0" />
      )}
    </Link>
  );
};

const RenderAnnouncements = (props: {
  link: any;
  isDisabled: boolean;
  activePage?: string;
  handleLinkClick: () => void;
}) => {
  const countQuery = useQuery<ApiResponse<{ unreadCount: number }>>({
    queryKey: ["inv-announcements"],
    queryFn: async () => {
      const resp = await apiClient.get("/announcements/unread-count");
      return resp.data;
    },
  });
  const { link, isDisabled, activePage, handleLinkClick } = props;
  return (
    <Link
      key={link.to}
      to={isDisabled ? "#" : link.to}
      onClick={isDisabled ? (e) => e.preventDefault() : handleLinkClick}
      disabled={isDisabled}
      className={`flex items-center gap-2.5 p-2 rounded-lg text-sm transition-colors ${
        activePage === link.activePage
          ? "bg-[var(--color-orange)] text-white"
          : isDisabled
            ? "text-gray-600 cursor-not-allowed opacity-50"
            : "hover:bg-gray-800 text-gray-400"
      }`}
      activeProps={{ className: "bg-[var(--color-orange)] text-white" }}
      activeOptions={link.activeOptions}
    >
      {link.icon}
      <span>{link.label}</span>
      {(countQuery.data?.data?.unreadCount ?? 0) > 0 && (
        <span className="ml-auto text-xs bg-red-500 text-white px-1.5 py-0.5 rounded-full leading-none">
          {countQuery.data?.data?.unreadCount}
        </span>
      )}
    </Link>
  );
};

const RenderNotifications = (props: {
  link: any;
  isDisabled: boolean;
  activePage?: string;
  handleLinkClick: () => void;
}) => {
  const countQuery = useQuery<ApiResponse<{ unreadCount: number }>>({
    queryKey: ["inv-notifications"],
    queryFn: async () => {
      const resp = await apiClient.get("/notifications/unread-count");
      return resp.data;
    },
  });
  const { link, isDisabled, activePage, handleLinkClick } = props;
  return (
    <Link
      key={link.to}
      to={isDisabled ? "#" : link.to}
      onClick={isDisabled ? (e) => e.preventDefault() : handleLinkClick}
      disabled={isDisabled}
      className={`flex items-center gap-2.5 p-2 rounded-lg text-sm transition-colors ${
        activePage === link.activePage
          ? "bg-[var(--color-orange)] text-white"
          : isDisabled
            ? "text-gray-600 cursor-not-allowed opacity-50"
            : "hover:bg-gray-800 text-gray-400"
      }`}
      activeProps={{ className: "bg-[var(--color-orange)] text-white" }}
      activeOptions={link.activeOptions}
    >
      {link.icon}
      <span>{link.label}</span>
      {(countQuery.data?.data?.unreadCount ?? 0) > 0 && (
        <span className="ml-auto text-xs bg-red-500 text-white px-1.5 py-0.5 rounded-full leading-none">
          {countQuery.data?.data?.unreadCount}
        </span>
      )}
    </Link>
  );
};

interface InvestorSidebarProps {
  activePage?: string;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
}

export function InvestorSidebar({ activePage }: InvestorSidebarProps) {
  const [authRecord] = useAuth();

  useEffect(() => {
    const token = authRecord?.accessToken;
    const userId = authRecord?.user?.id;
    if (!token || !userId) return;
    connectUserChatSocket(token, userId);
    return () => disconnectUserChatSocket();
  }, [authRecord?.accessToken]);

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
      to: "/investors/resell",
      activePage: "resell",
      label: "Resell",
      icon: <ArrowLeftRight className="size-4" />,
      alwaysEnabled: false,
    },
    {
      to: "/investors/favourites",
      activePage: "favourites",
      label: "Favourites",
      icon: <Heart className="size-4" />,
      alwaysEnabled: false,
    },
    {
      to: "/investors/notifications",
      activePage: "notifications",
      label: "Notifications",
      icon: <Bell className="size-4" />,
      alwaysEnabled: false,
      render: RenderNotifications,
    },
    {
      to: "/investors/transactions",
      activePage: "transactions",
      label: "Transaction",
      icon: <NairaIcon className="size-4" />,
      alwaysEnabled: false,
    },
    {
      to: "/investors/chat",
      activePage: "chat",
      label: "chat",
      icon: <ChatBubbleLeftIcon className="size-4" />,
      alwaysEnabled: false,
      render: RenderChat,
    },

    {
      to: "/investors/announcements",
      activePage: "announcements",
      label: "Announcement",
      icon: <Megaphone className="size-4" />,
      alwaysEnabled: false,
      render: RenderAnnouncements,
    },
    // {
    //   to: "/investors/applications",
    //   activePage: "applications",
    //   label: "Applications",
    //   icon: <Briefcase className="size-4" />,
    //   alwaysEnabled: false,
    // },
    // {
    //   to: "/investors/subscriptions",
    //   activePage: "subscriptions",
    //   label: "Subscriptions",
    //   icon: <List className="size-4" />,
    //   alwaysEnabled: false,
    // },
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
            if ((link as any).render) {
              return (link as any).render({
                link,
                isDisabled,
                activePage,
                handleLinkClick,
              });
            }
            return (
              <Link
                key={link.to}
                to={isDisabled ? "#" : link.to}
                onClick={
                  isDisabled ? (e) => e.preventDefault() : handleLinkClick
                }
                disabled={isDisabled}
                className={`flex items-center gap-2.5 p-2 rounded-lg text-sm transition-colors ${
                  activePage === link.activePage
                    ? "bg-[var(--color-orange)] text-white"
                    : isDisabled
                      ? "text-gray-600 cursor-not-allowed opacity-50"
                      : "hover:bg-gray-800 text-gray-400"
                }`}
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
