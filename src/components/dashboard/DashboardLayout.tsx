import { Link, useLocation } from "@tanstack/react-router";
import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  Handshake,
  Home,
  Eye,
  HomeIcon,
  Plus,
  Receipt,
  CreditCard,
  Megaphone,
  Settings,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  Search,
  Bell,
  LogOut,
} from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { show_logout } from "@/store/authStore";
import ThemeProvider from "@/simpleComps/ThemeProvider";
import { CheckBadgeIcon } from "@heroicons/react/24/outline";

interface NavItem {
  label: string;
  to: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface NavSection {
  id: string;
  title: string;
  items: NavItem[];
}

const NAVIGATION_CONFIG: (NavItem | NavSection)[] = [
  { label: "Dashboards", to: "/dashboard", icon: LayoutDashboard },
  {
    id: "userManagement",
    title: "USER MANAGEMENT",
    items: [
      { label: "Investors", to: "/dashboard/investors", icon: Users },
      {
        label: "Corporate (Investors)",
        to: "/dashboard/investors/corporate",
        icon: Users,
      },
      { label: "Partners", to: "/dashboard/partners", icon: Handshake },
    ],
  },
  {
    id: "propertyManagement",
    title: "PROPERTY MANAGEMENT",
    items: [
      {
        label: "Listed Property",
        to: "/dashboard/properties/listed",
        icon: Home,
      },
      {
        label: "Investments",
        to: "/dashboard/properties/investments",
        icon: HomeIcon,
      },
      {
        label: "Promotions",
        to: "/dashboard/properties/promotions",
        icon: HomeIcon,
      },
      { label: "New property", to: "/dashboard/properties/new", icon: Plus },
    ],
  },
  {
    id: "transaction",
    title: "TRANSACTION",
    items: [
      {
        label: "Receipt",
        to: "/dashboard/transactions/receipts",
        icon: Receipt,
      },
      {
        label: "Payments",
        to: "/dashboard/transactions/payments",
        icon: CreditCard,
      },
      {
        label: "Withdrawals",
        to: "/dashboard/withdrawals",
        icon: CreditCard,
      },
    ],
  },
  {
    id: "kyc",
    title: "KYC",
    items: [{ label: "KYC", to: "/dashboard/verifications", icon: Receipt }],
  },
  { label: "ANNOUNCEMENT", to: "/dashboard/announcements", icon: Megaphone },
  {
    label: "SUBSCRIPTIONS",
    to: "/dashboard/subscriptions",
    icon: CheckBadgeIcon,
  },
  { label: "SETTING", to: "/dashboard/settings", icon: Settings },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export function DashboardLayout({
  children,
  title,
  subtitle,
}: DashboardLayoutProps) {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({
    userManagement: true,
    propertyManagement: true,
    transaction: true,
    kyc: true,
  });

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const NavLink = ({
    to,
    children,
    icon: Icon,
    className = "",
  }: {
    to: string;
    children: React.ReactNode;
    icon?: React.ComponentType<{ className?: string }>;
    className?: string;
  }) => {
    const active = isActive(to);
    return (
      <Link
        to={to}
        onClick={() => setSidebarOpen(false)}
        className={`flex items-center gap-2.5 p-2 rounded-lg transition-colors text-sm ${
          active
            ? "bg-(--color-orange) text-white"
            : "hover:bg-gray-800 text-gray-400"
        } ${className}`}
      >
        {Icon && <Icon className="w-4 h-4" />}
        <span>{children}</span>
      </Link>
    );
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#2A2A2A] text-white flex flex-col transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Logo */}
        <div className="p-4 border-b border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img
              src="/logo_white.png"
              alt="NeedHomes"
              className="h-8"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
                const fallback = target.nextElementSibling as HTMLElement;
                if (fallback) fallback.style.display = "flex";
              }}
            />
            <div className="hidden flex-col">
              <div className="w-6 h-6 border-2 border-(--color-orange) rounded-t-lg"></div>
              <h1 className="text-sm font-bold">NEEDHOMES</h1>
              <p className="text-[10px] text-gray-400">PROPERTY & INVESTMENT</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 hover:bg-gray-800 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {NAVIGATION_CONFIG.map((item, index) => {
            if ("items" in item) {
              return (
                <div key={item.id}>
                  <button
                    onClick={() => toggleSection(item.id)}
                    className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-gray-800 text-gray-300 text-[10px] font-semibold uppercase"
                  >
                    <span>{item.title}</span>
                    {expandedSections[item.id] ? (
                      <ChevronDown className="w-3 h-3" />
                    ) : (
                      <ChevronRight className="w-3 h-3" />
                    )}
                  </button>
                  {expandedSections[item.id] && (
                    <div className="ml-3 mt-1 space-y-0.5">
                      {item.items.map((subItem) => (
                        <NavLink
                          key={subItem.to}
                          to={subItem.to}
                          icon={subItem.icon}
                        >
                          {subItem.label}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              );
            }
            return (
              <NavLink key={item.to} to={item.to} icon={item.icon}>
                {item.label}
              </NavLink>
            );
          })}

          <button
            onClick={() => {
              show_logout();
            }}
            className="flex items-center gap-2.5 p-2 rounded-lg text-sm transition-colors hover:bg-gray-800 text-gray-400 w-full"
          >
            <LogOut className="size-4" /> Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden w-full lg:w-auto">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 p-2.5 md:p-3 lg:p-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-1.5 md:p-2 hover:bg-gray-100 rounded-lg shrink-0"
            >
              <Menu className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
            </button>
            <div className="min-w-0">
              <h1 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900 truncate">
                {title}
              </h1>
              {subtitle && (
                <p className="text-xs md:text-sm text-gray-600 truncate">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 md:gap-3 shrink-0">
            <div className="hidden lg:block relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Enter keyword"
                className="pl-10 w-64 border-gray-300 text-sm"
              />
            </div>
            <div className="relative">
              <Bell className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-gray-600 cursor-pointer" />
              <Badge className="absolute -top-1 -right-1 bg-green-500 text-white text-[10px] md:text-xs w-4 h-4 md:w-5 md:h-5 flex items-center justify-center p-0">
                6
              </Badge>
            </div>
            <ThemeProvider>
              <div className="dropdown dropdown-end">
                <button className="btn btn-circle">
                  <Avatar className="w-8 h-8 md:w-10 md:h-10">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback className="text-xs">AD</AvatarFallback>
                  </Avatar>
                </button>
                <ul className="menu bg-base-100  shadow ring fade rounded-xl p-2 dropdown-content ">
                  <li>
                    <Link to="/dashboard/settings">Profile</Link>
                  </li>
                </ul>
              </div>
            </ThemeProvider>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 bg-gray-100">
          {children}
        </main>
      </div>
    </div>
  );
}
