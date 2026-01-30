import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/api/simpleApi";
import type { ApiResponse } from "@/api/simpleApi";
import {
  Search,
  Filter,
  Trash2,
  List,
  Grid,
  Plus,
  ChevronDown,
  Phone,
  Mail,
  MoreVertical,
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { DropdownMenu, DropdownMenuItem } from "@/components/ui/DropdownMenu";
import type { PARTNER } from "@/types";
import CustomTable, { type columnType } from "@/components/tables/CustomTable";
import type { Actions } from "@/components/tables/pop-up";
import PartnerListCard from "./-components/PartnerListCard";

export const Route = createFileRoute("/dashboard/partners/")({
  component: PartnersPage,
});

function PartnersPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const { data, isLoading, error } = useQuery<ApiResponse<PARTNER[]>>({
    queryKey: ["partners"],
    queryFn: async () => {
      const response = await apiClient.get("admin/users?accountType=PARTNER");
      return response.data;
    },
  });

  const partnersData = data?.data || [];

  const filteredPartners = partnersData.filter(
    (partner) =>
      partner.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      partner.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      partner.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      partner.phone?.includes(searchQuery) ||
      partner.id.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const columns: columnType<PARTNER>[] = [
    {
      key: "profile",
      label: "Profile",
      render: (_, item) => (
        <div className="flex items-center gap-2 md:gap-3">
          <Avatar className="w-8 h-8 md:w-10 md:h-10">
            <AvatarImage className="object-cover" />
            <AvatarFallback>
              {item.firstName?.charAt(0)}
              {item.lastName?.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </div>
      ),
    },
    {
      key: "name",
      label: "Name",
      render: (_, item) => (
        <div>
          <div className="font-medium text-gray-900 text-xs md:text-sm">
            {item.firstName} {item.lastName}
          </div>
          <div className="text-[10px] md:text-xs text-gray-500">Partner</div>
          {item.phone && (
            <div className="text-xs text-gray-600 md:hidden mt-1">
              {item.phone}
            </div>
          )}
          <div className="text-xs text-gray-600 md:hidden">{item.email}</div>
        </div>
      ),
    },
    {
      key: "phone",
      label: "Phone Number",
      render: (_, item) =>
        item.phone && (
          <div className="flex items-center gap-2 md:gap-2.5">
            <div className="p-1 md:p-1.5 bg-green-100 rounded-lg">
              <Phone className="w-3.5 h-3.5 md:w-4 md:h-4 text-green-600" />
            </div>
            <span className="text-xs md:text-sm text-gray-700 font-medium">
              {item.phone}
            </span>
          </div>
        ),
    },
    {
      key: "email",
      label: "Email Address",
      render: (_, item) => (
        <div className="flex items-center gap-2 md:gap-2.5">
          <div className="p-1 md:p-1.5 bg-blue-100 rounded-lg">
            <Mail className="w-3.5 h-3.5 md:w-4 md:h-4 text-blue-600" />
          </div>
          <span className="text-xs md:text-sm text-gray-700 font-medium truncate max-w-50">
            {item.email}
          </span>
        </div>
      ),
    },
  ];

  const actions: Actions[] = [
    {
      key: "view-details",
      label: "View Details",
      action: (item: PARTNER, nav) =>
        nav({
          to: "/dashboard/partners/$partnerId",
          params: { partnerId: item.id },
        }),
    },
    {
      key: "edit",
      label: "Edit",
      action: (item: PARTNER) => console.log("Edit", item.id),
    },
    {
      key: "delete",
      label: "Delete",
      action: (item: PARTNER) => console.log("Delete", item.id),
    },
  ];

  return (
    <DashboardLayout title="Super Admin Dashboard" subtitle="Partners">
      {/* Toolbar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 md:p-4 mb-4 md:mb-6">
        <div className="flex flex-col gap-3 md:gap-4">
          {/* View Toggle */}
          <div className="flex items-center gap-3">
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 md:p-2 transition-colors ${
                  viewMode === "list"
                    ? "bg-brand-orange text-white"
                    : "hover:bg-gray-100 text-gray-600"
                }`}
              >
                <List className="w-3.5 h-3.5 md:w-4 md:h-4" />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 md:p-2 transition-colors border-l border-gray-300 ${
                  viewMode === "grid"
                    ? "bg-brand-orange text-white"
                    : "hover:bg-gray-100 text-gray-600"
                }`}
              >
                <Grid className="w-3.5 h-3.5 md:w-4 md:h-4" />
              </button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-wrap items-center gap-2 md:gap-3 w-full">
            <div className="relative flex-1 min-w-50 md:flex-initial md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 text-sm"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 text-xs md:text-sm"
            >
              <Filter className="w-3.5 h-3.5 md:w-4 md:h-4" />
              <span className="hidden sm:inline">Filter</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Loading & Error States */}
      {isLoading && (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-orange"></div>
        </div>
      )}

      {error && (
        <div className="text-center py-20 text-red-500">
          Failed to load partners. Please try again.
        </div>
      )}

      {/* Partners Grid/List */}
      {!isLoading && !error && viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
          {filteredPartners.length > 0 ? (
            filteredPartners.map((partner) => (
              <>
                <PartnerListCard item={partner} />
              </>
            ))
          ) : (
            <div className="col-span-full text-center py-10 text-gray-500">
              No partners found.
            </div>
          )}
        </div>
      ) : (
        <CustomTable
          data={filteredPartners}
          columns={columns}
          actions={actions}
        />
      )}

      {/* Empty State for filtered results */}
      {!isLoading &&
        !error &&
        filteredPartners.length === 0 &&
        partnersData.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <p className="text-gray-500">
              No partners found matching your search.
            </p>
          </div>
        )}
    </DashboardLayout>
  );
}
