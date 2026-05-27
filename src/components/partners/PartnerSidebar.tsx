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
  Heart,
} from "lucide-react";
import { show_logout, useAuth, useKyc } from "@/store/authStore";
import ProfileCard from "../investors/ProfileCard";
import { ChatBubbleLeftIcon } from "@heroicons/react/24/outline";
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

interface PartnerSidebarProps {
  activePage?: string;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
}
const RenderChat = (props: {
  link: any;
  isRestricted: boolean;
  activePage?: string;
  handleLinkClick: () => void;
}) => {
  const [newChatCount] = useAtom(userNewChatCountAtom);

  useEffect(() => {
    if (props.activePage === "chat") clearUserNewChatCount();
  }, [props.activePage]);

  const { link, isRestricted, activePage, handleLinkClick } = props;
  return (
    <Link
      key={link.to}
      to={isRestricted ? "#" : link.to}
      onClick={
        isRestricted
          ? (e) => e.preventDefault()
          : () => {
              clearUserNewChatCount();
              handleLinkClick();
            }
      }
      disabled={isRestricted}
      className={`flex items-center gap-2.5 p-2 rounded-lg text-sm transition-colors ${
        activePage === link.id
          ? "bg-(--color-orange) text-white"
          : "hover:bg-gray-800 text-gray-400"
      } ${isRestricted ? "opacity-50 cursor-not-allowed" : ""}`}
      activeProps={{ className: "bg-(--color-orange) text-white" }}
      activeOptions={{ exact: link.exact }}
    >
      <link.icon className="size-4" />
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
    queryKey: ["pat-announcements"],
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
      <link.icon className="size-4" />
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
  isRestricted: boolean;
  activePage?: string;
  handleLinkClick: (
    e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>,
  ) => void;
}) => {
  const countQuery = useQuery<ApiResponse<{ unreadCount: number }>>({
    queryKey: ["pat-notifications"],
    queryFn: async () => {
      const resp = await apiClient.get("/notifications/unread-count");
      return resp.data;
    },
  });
  const { link, isRestricted, activePage, handleLinkClick } = props;
  return (
    <Link
      key={link.to}
      to={isRestricted ? "#" : link.to}
      onClick={isRestricted ? (e) => e.preventDefault() : handleLinkClick}
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
      <span className="ml-auto text-sm bg-red-500/20 ring fade  p-1 text-white rounded-sm">
        {countQuery.data?.data?.unreadCount}
      </span>
    </Link>
  );
};

const RenderFavourites = (props: {
  link: any;
  isRestricted: boolean;
  activePage?: string;
  handleLinkClick: () => void;
}) => {
  const countQuery = useQuery<ApiResponse<{ count: number }>>({
    queryKey: ["pat-favourites-count"],
    queryFn: async () => {
      const resp = await apiClient.get("/favorites/count");
      return resp.data;
    },
  });
  const { link, isRestricted, activePage, handleLinkClick } = props;
  const count = countQuery.data?.data?.count ?? 0;
  return (
    <Link
      key={link.to}
      to={isRestricted ? "#" : link.to}
      onClick={isRestricted ? (e) => e.preventDefault() : handleLinkClick}
      disabled={isRestricted}
      className={`flex items-center gap-2.5 p-2 rounded-lg text-sm transition-colors ${
        activePage === link.id
          ? "bg-(--color-orange) text-white"
          : "hover:bg-gray-800 text-gray-400"
      } ${isRestricted ? "opacity-50 cursor-not-allowed" : ""}`}
      activeProps={{ className: "bg-(--color-orange) text-white" }}
      activeOptions={{ exact: link.exact }}
    >
      <link.icon className="size-4" />
      <span>{link.label}</span>
      {count > 0 && (
        <span className="ml-auto text-xs bg-red-500 text-white px-1.5 py-0.5 rounded-full leading-none">
          {count}
        </span>
      )}
    </Link>
  );
};

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
    to: "/partners/promotions",
    label: "Promotions",
    id: "promotions",
    icon: List,
  },
  {
    to: "/partners/notifications",
    label: "Notifications",
    id: "notifications",
    icon: Bell,
    render: RenderNotifications,
  },
  {
    to: "/partners/transactions",
    label: "Transaction",
    id: "transactions",
    icon: Wallet,
  },
  {
    to: "/partners/chat",
    label: "Chat",
    id: "chat",
    icon: ChatBubbleLeftIcon,
    render: RenderChat,
  },
  {
    to: "/partners/announcements",
    label: "Announcement",
    id: "announcements",
    icon: Megaphone,
    render: RenderAnnouncements,
  },

  {
    to: "/partners/favourites",
    label: "Favourites",
    id: "favourites",
    icon: Heart,
    render: RenderFavourites,
  },
  {
    to: "/partners/settings",
    label: "Setting",
    id: "settings",
    icon: Settings,
  },
];

export function PartnerSidebar({ activePage }: PartnerSidebarProps) {
  const [authRecord] = useAuth();

  useEffect(() => {
    const token = authRecord?.accessToken;
    const userId = authRecord?.user?.id;
    if (!token || !userId) return;
    connectUserChatSocket(token, userId);
    return () => disconnectUserChatSocket();
  }, [authRecord?.accessToken]);

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
            if (link.render) {
              return link.render({
                link,
                isRestricted,
                activePage,
                handleLinkClick,
              });
            }
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
