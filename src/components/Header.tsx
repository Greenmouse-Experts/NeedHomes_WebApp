import { Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import {
  ChevronDown,
  Menu,
  X,
  Building2,
  FileText,
  HelpCircle,
  LogIn,
  UserPlus,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function Header() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const links = [
    {
      name: "Company",
      path: "/",
      icon: Building2,
    },
    {
      name: "Investment",
      path: "/",
      icon: Building2,
    },
    {
      name: "Resources",
      path: "/",
      icon: FileText,
    },
    {
      name: "Support",
      path: "/",
      icon: HelpCircle,
    },
  ];

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false);
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [mobileMenuOpen]);

  return (
    <div className="h-24 grid place-items-center bg-black sticky top-0 z-50 relative">
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
        <div className="hidden lg:flex items-center space-x-2 h-full">
          {links.map((link, index) => (
            <Link
              to={link.path}
              key={link.name}
              className={`px-4 h-full flex items-center gap-1 font-medium text-sm transition-colors relative ${
                index === 0 ? "text-white" : "text-gray-300 hover:text-white"
              }`}
            >
              {link.name} <ChevronDown size={14} />
            </Link>
          ))}
        </div>
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
            <div className="absolute right-0 mt-2 w-64 bg-[#1a1a2e] rounded-lg shadow-xl border border-gray-700 py-2 z-50">
              {/* Navigation Links */}
              {links.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{link.name}</span>
                  </Link>
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
