import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import SimpleAvatar from "@/simpleComps/SimpleAvatar";
import ThemeProvider from "@/simpleComps/ThemeProvider";
import { show_logout, useAuth } from "@/store/authStore";
import { Link } from "@tanstack/react-router";
import { Bell, Menu, Search } from "lucide-react";

export default function PatHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  const [user, setUser] = useAuth();
  const img_url = user?.user.profilePicture || "/https://github.com/shadcn.png";

  return (
    <>
      <header className="bg-white border-b border-gray-200 p-2.5 md:p-3 lg:p-4 lg:py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
          <button className="lg:hidden p-1.5 md:p-2 hover:bg-gray-100 rounded-lg shrink-0">
            <label
              htmlFor="my-drawer-3"
              className="btn drawer-button btn-circle lg:hidden"
            >
              <Menu className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
            </label>
          </button>
          <div className="min-w-0">
            <h1 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900 truncate">
              {title || "Partner Dashboard"}
            </h1>
            {subtitle && (
              <p className="text-xs md:text-sm text-gray-600 truncate">
                {subtitle}
              </p>
            )}
          </div>
        </div>
        <div className="flex pr-3 items-center gap-2 md:gap-3 shrink-0">
          <div className="relative">
            <Link to="/partners/notifications">
              {" "}
              <Bell className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-gray-600 cursor-pointer" />
              <Badge className="absolute -top-1 -right-1 bg-green-500 text-white text-[10px] md:text-xs w-4 h-4 md:w-5 md:h-5 flex items-center justify-center p-0"></Badge>
            </Link>
          </div>
          <ThemeProvider>
            <div className="dropdown dropdown-end ">
              <button className="btn btn-circle  p-0 overflow-visible">
                <div className="relative flex justify-center">
                  <Avatar className="w-8 h-8 md:w-10 md:h-10">
                    <AvatarImage src={img_url} />
                  </Avatar>
                  <VerifiedPill />
                </div>
              </button>
              <ul className="menu bg-base-100 shadow ring fade rounded-xl p-2 dropdown-content">
                <li>
                  <Link to="/partners/settings">Profile</Link>
                </li>

                <li
                  onMouseDown={() => {
                    show_logout();
                  }}
                >
                  <a onClick={() => {}}>Logout</a>
                </li>
              </ul>
            </div>
          </ThemeProvider>
        </div>
      </header>
    </>
  );
}

const VerifiedPill = () => {
  const [user] = useAuth();
  const verificationStatus = user?.user.account_verification_status;
  if (!verificationStatus || verificationStatus != "VERIFIED") {
    return (
      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 badge whitespace-nowrap badge-error badge-xs badge-soft ring z-10">
        {verificationStatus === "VERIFIED" ? "Verified" : "Not Verified"}
      </div>
    );
  }
  return (
    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 badge whitespace-nowrap badge-success badge-xs badge-soft ring z-10">
      {verificationStatus === "VERIFIED" ? "Verified" : "Not Verified"}
    </div>
  );
};
