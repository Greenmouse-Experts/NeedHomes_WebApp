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
  MoreVertical,
  Plus,
  ChevronDown,
  Phone,
  Mail,
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { DropdownMenu, DropdownMenuItem } from "@/components/ui/DropdownMenu";
import type { INVESTOR } from "@/types"; // Assuming INVESTOR type can be reused or a new PARTNER type is defined

export const Route = createFileRoute("/dashboard/partners/")({
  component: PartnersPage,
});

// Define a type for Partner, assuming it's similar to INVESTOR but with relevant fields
type PARTNER = INVESTOR; // Or define a separate interface if structure differs significantly

function PartnersPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const { data, isLoading, error } = useQuery<ApiResponse<PARTNER[]>>({
    queryKey: ["partners"],
    queryFn: async () => {
      const response = await apiClient.get(
        "admin/users?accountType=PARTNER", // Changed accountType to PARTNER
      );
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
                    ? "bg-[var(--color-orange)] text-white"
                    : "hover:bg-gray-100 text-gray-600"
                }`}
              >
                <List className="w-3.5 h-3.5 md:w-4 md:h-4" />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 md:p-2 transition-colors border-l border-gray-300 ${
                  viewMode === "grid"
                    ? "bg-[var(--color-orange)] text-white"
                    : "hover:bg-gray-100 text-gray-600"
                }`}
              >
                <Grid className="w-3.5 h-3.5 md:w-4 md:h-4" />
              </button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-wrap items-center gap-2 md:gap-3 w-full">
            <div className="relative flex-1 min-w-[200px] md:flex-initial md:w-64">
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
            <Button
              variant="outline"
              size="sm"
              className="gap-2 text-xs md:text-sm"
            >
              <Trash2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
              <span className="hidden sm:inline">Filter</span>
            </Button>
            <DropdownMenu
              trigger={
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 text-xs md:text-sm"
                >
                  Action
                  <ChevronDown className="w-3.5 h-3.5 md:w-4 md:h-4" />
                </Button>
              }
            >
              <DropdownMenuItem>Export</DropdownMenuItem>
              <DropdownMenuItem>Import</DropdownMenuItem>
              <DropdownMenuItem>Delete Selected</DropdownMenuItem>
            </DropdownMenu>
            <Button
              variant="primary"
              size="sm"
              className="gap-2 text-xs md:text-sm"
            >
              <Plus className="w-3.5 h-3.5 md:w-4 md:h-4" />
              <span className="hidden sm:inline">Add a New Partners</span>
              <span className="sm:hidden">Add Partner</span>
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
              <div
                key={partner.id}
                className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-xl hover:border-[var(--color-orange)]/30 transition-all duration-300 relative group"
              >
                {/* Three Dots Menu */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <DropdownMenu
                    trigger={
                      <button className="p-1.5 hover:bg-gray-100 rounded-full transition-colors">
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
                    >
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuItem>Delete</DropdownMenuItem>
                  </DropdownMenu>
                </div>

                {/* Profile Picture */}
                <div className="flex justify-center mb-4">
                  <div className="relative">
                    <Avatar className="w-24 h-24 ring-4 ring-gray-100 group-hover:ring-[var(--color-orange)]/20 transition-all duration-300">
                      <AvatarImage
                        src={partner.avatar}
                        alt={`${partner.firstName} ${partner.lastName}`}
                        className="object-cover"
                      />
                      <AvatarFallback>
                        {partner.firstName?.charAt(0)}
                        {partner.lastName?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </div>

                {/* Partner Name */}
                <h3 className="text-center font-bold text-gray-900 mb-1 text-base">
                  {partner.firstName} {partner.lastName}
                </h3>
                <p className="text-center text-xs text-gray-500 mb-4 font-medium">
                  Partner
                </p>

                {/* Phone */}
                {partner.phone && (
                  <div className="flex items-center gap-2.5 mb-3 bg-gray-50 rounded-lg p-2.5 group-hover:bg-orange-50/50 transition-colors">
                    <div className="p-1.5 bg-green-100 rounded-lg">
                      <Phone className="w-4 h-4 text-green-600 flex-shrink-0" />
                    </div>
                    <span className="text-sm text-gray-700 truncate font-medium">
                      {partner.phone}
                    </span>
                  </div>
                )}

                {/* Email */}
                <div className="flex items-center gap-2.5 bg-gray-50 rounded-lg p-2.5 group-hover:bg-orange-50/50 transition-colors">
                  <div className="p-1.5 bg-blue-100 rounded-lg">
                    <Mail className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  </div>
                  <span className="text-sm text-gray-700 truncate font-medium">
                    {partner.email}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-10 text-gray-500">
              No partners found.
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 md:px-4 py-2 md:py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Profile
                  </th>
                  <th className="px-3 md:px-4 py-2 md:py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-3 md:px-4 py-2 md:py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider hidden md:table-cell">
                    Phone Number
                  </th>
                  <th className="px-3 md:px-4 py-2 md:py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider hidden lg:table-cell">
                    Email Address
                  </th>
                  <th className="px-3 md:px-4 py-2 md:py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-10"></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPartners.length > 0 ? (
                  filteredPartners.map((partner) => (
                    <tr key={partner.id} className="hover:bg-gray-50">
                      <td className="px-3 md:px-4 py-3 md:py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 md:gap-3">
                          <Avatar className="w-8 h-8 md:w-10 md:h-10">
                            <AvatarImage
                              src={partner.avatar}
                              alt={`${partner.firstName} ${partner.lastName}`}
                              className="object-cover"
                            />
                            <AvatarFallback>
                              {partner.firstName?.charAt(0)}
                              {partner.lastName?.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                      </td>
                      <td className="px-3 md:px-4 py-3 md:py-4 whitespace-nowrap">
                        <div>
                          <div className="font-medium text-gray-900 text-xs md:text-sm">
                            {partner.firstName} {partner.lastName}
                          </div>
                          <div className="text-[10px] md:text-xs text-gray-500">
                            Partner
                          </div>
                          {partner.phone && (
                            <div className="text-xs text-gray-600 md:hidden mt-1">
                              {partner.phone}
                            </div>
                          )}
                          <div className="text-xs text-gray-600 md:hidden">
                            {partner.email}
                          </div>
                        </div>
                      </td>
                      <td className="px-3 md:px-4 py-3 md:py-4 whitespace-nowrap hidden md:table-cell">
                        {partner.phone && (
                          <div className="flex items-center gap-2 md:gap-2.5">
                            <div className="p-1 md:p-1.5 bg-green-100 rounded-lg">
                              <Phone className="w-3.5 h-3.5 md:w-4 md:h-4 text-green-600" />
                            </div>
                            <span className="text-xs md:text-sm text-gray-700 font-medium">
                              {partner.phone}
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="px-3 md:px-4 py-3 md:py-4 whitespace-nowrap hidden lg:table-cell">
                        <div className="flex items-center gap-2 md:gap-2.5">
                          <div className="p-1 md:p-1.5 bg-blue-100 rounded-lg">
                            <Mail className="w-3.5 h-3.5 md:w-4 md:h-4 text-blue-600" />
                          </div>
                          <span className="text-xs md:text-sm text-gray-700 font-medium truncate max-w-[200px]">
                            {partner.email}
                          </span>
                        </div>
                      </td>
                      <td className="px-3 md:px-4 py-3 md:py-4 whitespace-nowrap">
                        <DropdownMenu
                          trigger={
                            <button className="p-1 hover:bg-gray-100 rounded">
                              <MoreVertical className="w-4 h-4 text-gray-400" />
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
                          >
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem>Delete</DropdownMenuItem>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center py-10 text-gray-500">
                      No partners found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
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
