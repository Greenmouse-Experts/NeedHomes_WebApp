import { Avatar, AvatarImage } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import ThemeProvider from "@/simpleComps/ThemeProvider";
import { show_logout, useAuth } from "@/store/authStore";
import { Link } from "@tanstack/react-router";
import { Bell, CheckCircle2, Clock, Menu, XCircle } from "lucide-react";

export default function InvHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  const [user] = useAuth();
  const img_url = user?.user.profilePicture || "/https://github.com/shadcn.png";
  const verificationStatus = user?.user.account_verification_status;

  const getStatusIcon = () => {
    switch (verificationStatus) {
      case "VERIFIED":
        return (
          <CheckCircle2 className="w-3 h-3 md:w-4 md:h-4 text-green-500 fill-white" />
        );
      case "PENDING":
        return (
          <Clock className="w-3 h-3 md:w-4 md:h-4 text-yellow-500 fill-white" />
        );
      case "REJECTED":
        return (
          <XCircle className="w-3 h-3 md:w-4 md:h-4 text-red-500 fill-white" />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <header className="bg-white border-b border-gray-200 p-3 flex items-center justify-between sticky top-0">
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
              {title || "Investor Dashboard"}
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
            <Link to="/investors/notifications">
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
                  <Link to="/investors/settings">Profile</Link>
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
