import { Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import {
  ChevronDown,
  Menu,
  X,
  Building2,
  FileText,
  LogIn,
  UserPlus,
  PieChart,
  Headset,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

// Dropdown menu items with enhanced design
const dropdownMenus = {
  Company: [
    {
      name: "About Us",
      path: "/about-us",
      description: "Learn about our mission",
      icon: "🏢"
    },
    {
      name: "Leadership",
      path: "/leadership",
      description: "Meet our team",
      icon: "👥"
    },
    {
      name: "Careers",
      path: "/careers",
      description: "Join our team",
      icon: "💼"
    },
    {
      name: "Partner with us",
      path: "/partner-with-us",
      description: "Collaboration opportunities",
      icon: "🤝"
    },
  ],
  Investment: [
    {
      name: "Fractional Ownership",
      path: "/",
      description: "Own a fraction of prime property",
      icon: "🏘️"
    },
    {
      name: "Co-Development",
      path: "/",
      description: "Develop property together",
      icon: "🏗️"
    },
    {
      name: "Land Banking",
      path: "/",
      description: "Secure land for future",
      icon: "🌍"
    },
  ],
  Resources: [
    {
      name: "Blog",
      path: "/blog",
      description: "Latest updates & insights",
      icon: "📝"
    },
    {
      name: "FAQs",
      path: "/faqs",
      description: "Common questions answered",
      icon: "❓"
    },
    {
      name: "How it works",
      path: "/how-it-works",
      description: "Step-by-step guide",
      icon: "📖"
    },
  ],
  Support: [
    {
      name: "Live Chat",
      path: "/",
      description: "Chat with our team",
      icon: "💬"
    },
    {
      name: "Book a call",
      path: "/",
      description: "Schedule a consultation",
      icon: "📞"
    },
    {
      name: "Support Email",
      path: "/",
      description: "Email us your questions",
      icon: "✉️"
    },
  ],
};

export default function Header() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileExpandedMenu, setMobileExpandedMenu] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const links = [
    {
      name: "Company",
      icon: Building2,
    },
    {
      name: "Investment",
      icon: PieChart,
    },
    {
      name: "Resources",
      icon: FileText,
    },
    {
      name: "Support",
      icon: Headset,
    },
  ];

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setMobileMenuOpen(false);
        setActiveDropdown(null);
      }
    };

    if (mobileMenuOpen || activeDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [mobileMenuOpen, activeDropdown]);

  const handleMobileMenuToggle = (menuName: string) => {
    setMobileExpandedMenu(mobileExpandedMenu === menuName ? null : menuName);
  };

  return (
    <div className="h-24 grid place-items-center bg-black sticky top-0 z-50">
      <nav className="contain mx-auto flex justify-between px-4 md:px-6 items-center w-full h-full">
        <Link
          to="/"
          className="text-xl font-bold flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          <img
            src="/need_homes_logo.png"
            className="h-10 w-auto object-contain"
            alt="NeedHomes Logo"
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-2 h-full">
          {links.map((link, index) => (
            <div
              key={link.name}
              className="relative h-full"
              onMouseEnter={() => setActiveDropdown(link.name)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                className={`cursor-pointer px-4 h-full flex items-center gap-1 font-medium text-sm transition-colors ${index === 0 ? "text-white" : "text-gray-300 hover:text-white"
                  }`}
              >
                {link.name}{" "}
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${activeDropdown === link.name ? "rotate-180" : ""
                    }`}
                />
              </button>

              {/* Desktop Dropdown */}
              {activeDropdown === link.name && (
                <div
                  ref={dropdownRef}
                  className="absolute top-full left-0 mt-1 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-3 duration-300"
                  style={{
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                  }}
                >
                  {/* Header */}
                  <div className="px-5 py-3 bg-gradient-to-r from-orange-50 to-orange-100 border-b border-gray-100">
                    <p className="text-xs font-bold text-orange-600 uppercase tracking-wider">
                      {link.name === "Company" && "About NeedHomes"}
                      {link.name === "Investment" && "Investment Options"}
                      {link.name === "Resources" && "Helpful Resources"}
                      {link.name === "Support" && "Get Support"}
                    </p>
                  </div>

                  {/* Menu Items */}
                  <div className="py-2">
                    {dropdownMenus[link.name as keyof typeof dropdownMenus].map(
                      (item, idx) => (
                        <Link
                          key={item.name}
                          to={item.path}
                          className="group flex items-center gap-4 px-5 py-3.5 hover:bg-orange-50/50 transition-all duration-200 cursor-pointer"
                          onClick={() => setActiveDropdown(null)}
                        >
                          {/* Icon */}
                          <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg flex items-center justify-center text-xl group-hover:scale-110 transition-transform duration-200">
                            {item.icon}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
                                {item.name}
                              </p>
                              <ChevronDown
                                size={16}
                                className="text-orange-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200 -rotate-90"
                              />
                            </div>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {item.description}
                            </p>
                          </div>
                        </Link>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden relative" ref={menuRef}>
          <Button
            variant="ghost"
            size="sm"
            className="p-2 text-white hover:text-gray-300"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>

          {/* Mobile Menu Dropdown */}
          {mobileMenuOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-[#1a1a2e] rounded-lg shadow-xl border border-gray-700 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              {/* Navigation Links with Sub-menus */}
              {links.map((link) => {
                const Icon = link.icon;
                const isExpanded = mobileExpandedMenu === link.name;

                return (
                  <div key={link.name}>
                    <button
                      onClick={() => handleMobileMenuToggle(link.name)}
                      className="w-full flex items-center justify-between px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{link.name}</span>
                      </div>
                      <ChevronDown
                        size={16}
                        className={`transition-transform duration-200 ${isExpanded ? "rotate-180" : ""
                          }`}
                      />
                    </button>

                    {/* Sub-menu items */}
                    {isExpanded && (
                      <div className="bg-gradient-to-br from-orange-50/30 to-orange-100/30 backdrop-blur-sm animate-in slide-in-from-top-2 duration-300">
                        {dropdownMenus[
                          link.name as keyof typeof dropdownMenus
                        ].map((item) => (
                          <Link
                            key={item.name}
                            to={item.path}
                            onClick={() => {
                              setMobileMenuOpen(false);
                              setMobileExpandedMenu(null);
                            }}
                            className="group flex items-center gap-3 pl-12 pr-4 py-3 hover:bg-orange-100/50 transition-all duration-200 cursor-pointer"
                          >
                            {/* Icon */}
                            <div className="flex-shrink-0 w-8 h-8 bg-white rounded-lg flex items-center justify-center text-base shadow-sm group-hover:scale-110 transition-transform duration-200">
                              {item.icon}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-800 group-hover:text-orange-600 transition-colors">
                                {item.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {item.description}
                              </p>
                            </div>

                            {/* Arrow */}
                            <ChevronDown
                              size={14}
                              className="text-orange-400 opacity-0 group-hover:opacity-100 transition-opacity -rotate-90 flex-shrink-0"
                            />
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Divider */}
              <div className="border-t border-gray-700 my-2"></div>

              {/* Auth Buttons */}
              <div className="px-4 py-2 space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-3 border-gray-600 text-white hover:bg-gray-800"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate({ to: "/login" });
                  }}
                >
                  <LogIn className="w-4 h-4" />
                  Sign In
                </Button>
                <Button
                  variant="primary"
                  className="w-full justify-start gap-3"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate({ to: "/account-type" });
                  }}
                >
                  <UserPlus className="w-4 h-4" />
                  Get Free Account
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Desktop Auth Buttons */}
        <div className="space-x-3 hidden lg:flex items-center">
          <Button
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10 hover:border-white/40"
            onClick={() => navigate({ to: "/login" })}
          >
            Sign In
          </Button>
          <Button
            variant="primary"
            className="bg-[var(--color-orange)] hover:bg-[var(--color-orange)]/90"
            onClick={() => navigate({ to: "/account-type" })}
          >
            Get Free Account
          </Button>
        </div>
      </nav>
    </div>
  );
}
