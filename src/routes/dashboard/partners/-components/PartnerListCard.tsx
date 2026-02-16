import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { DropdownMenu, DropdownMenuItem } from "@/components/ui/DropdownMenu";
import type { PARTNER } from "@/types";
import { useNavigate } from "@tanstack/react-router";
import {
  Mail,
  MoreVertical,
  Phone,
  Calendar,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  ShieldAlert,
} from "lucide-react";

export default function PartnerListCard({ item }: { item: PARTNER }) {
  const partner = item;
  const navigate = useNavigate();

  return (
    <div
      key={partner.id}
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all duration-300 relative group"
    >
      {/* Three Dots Menu */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <DropdownMenu
          trigger={
            <button className="p-1.5 hover:bg-gray-100 rounded-full transition-colors focus:outline-none">
              <MoreVertical className="w-4 h-4 text-gray-500" />
            </button>
          }
        >
          <DropdownMenuItem
            onClick={() =>
              navigate({
                to: "/dashboard/partners/$partnerId",
                params: { partnerId: partner.id },
              })
            }
            className="hover:bg-gray-100 cursor-pointer"
          >
            View Details
          </DropdownMenuItem>
          {/*<DropdownMenuItem className="hover:bg-gray-100 cursor-pointer">
            Edit
          </DropdownMenuItem>*/}
          {/*<DropdownMenuItem className="hover:bg-gray-100 cursor-pointer text-red-600">
            Delete
          </DropdownMenuItem>*/}
        </DropdownMenu>
      </div>

      <div className="flex flex-col items-center mb-4">
        <div className="relative mb-3">
          <Avatar className="w-20 h-20 border-2 border-gray-100 group-hover:border-brand-orange/30 transition-all duration-300 shadow-sm">
            <AvatarImage />
            <AvatarFallback className="bg-brand-orange/10 text-brand-orange-dark font-semibold text-lg">
              {partner.firstName?.charAt(0)}
              {partner.lastName?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="absolute -bottom-1 -right-1">
            {partner.isEmailVerified ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-500 fill-white" />
            ) : (
              <XCircle className="w-6 h-6 text-red-500 fill-white" />
            )}
          </div>
        </div>

        <h3 className="text-center font-bold text-gray-900 text-base leading-tight">
          {partner.firstName} {partner.lastName}
        </h3>
        <div className="flex items-center gap-1.5 mt-1">
          <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-bold uppercase tracking-wider rounded">
            {partner.accountType}
          </span>
          <span
            className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded ${
              partner.account_status === "ACTIVE"
                ? "bg-emerald-50 text-emerald-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {partner.account_status}
          </span>
        </div>
      </div>

      <div className="space-y-2">
        {/* Contact Info */}
        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
          <Mail className="w-4 h-4 text-gray-400 shrink-0" />
          <span className="text-sm text-gray-700 truncate">
            {partner.email}
          </span>
        </div>

        {partner.phone && (
          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
            <Phone className="w-4 h-4 text-gray-400 shrink-0" />
            <span className="text-sm text-gray-700 truncate">
              {partner.phone}
            </span>
          </div>
        )}

        <hr className="border-gray-100 my-1" />

        {/* Verification & Meta */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <div className="flex items-center gap-2 px-2 py-1">
            {partner.account_verification_status === "PENDING" ? (
              <ShieldAlert className="w-4 h-4 text-amber-500" />
            ) : (
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
            )}
            <span className="text-[11px] font-medium text-gray-500 uppercase tracking-tight">
              {partner.account_verification_status}
            </span>
          </div>
          <div className="flex items-center gap-2 px-2 py-1 justify-end">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="text-[11px] text-gray-500">
              {new Date(partner.createdAt).toLocaleDateString(undefined, {
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
