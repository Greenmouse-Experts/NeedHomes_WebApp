import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/api/simpleApi";
import type { ApiResponse } from "@/api/simpleApi";
import {
  Search,
  Filter,
  Calendar,
  List,
  Grid,
  Plus,
  ChevronDown,
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { DropdownMenu, DropdownMenuItem } from "@/components/ui/DropdownMenu";
import type { INVESTOR } from "@/types";
import CustomTable, { type columnType } from "@/components/tables/CustomTable";
import PopUp, { type Actions } from "@/components/tables/pop-up";

export const Route = createFileRoute("/dashboard/investors/corporate/")({
  component: InvestorsPage,
});

function InvestorsPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");

  const { data, isLoading, error } = useQuery<ApiResponse<INVESTOR[]>>({
    queryKey: ["investors", "corporate"],
    queryFn: async () => {
      const response = await apiClient.get("admin/users?accountType=CORPORATE");
      return response.data; // Assuming response.data is directly ApiResponse<INVESTOR[]>
    },
  });

  const investorsData = data?.data || [];

  const filteredInvestors = investorsData.filter(
    (investor) =>
      investor.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      investor.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      investor.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      investor.id.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const investorColumns: columnType<INVESTOR>[] = [
    // {
    //   key: "firstName",
    //   label: "First Name",
    //   render: (value, item) => (
    //     <div className="flex items-center gap-2">
    //       <span>{value}</span>
    //     </div>
    //   ),
    // },
    // { key: "lastName", label: "Last Name" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "accountType", label: "Account Type" },
    { key: "account_status", label: "Status" },
    {
      key: "account_verification_status",
      label: "Verification",
      render: (value) => (
        <span
          className={`badge badge-soft ring fade ${
            value === "ACTIVE"
              ? "badge-success"
              : value === "PENDING"
                ? "badge-warning"
                : "badge-error"
          }`}
        >
          {value}
        </span>
      ),
    },
    {
      key: "createdAt",
      label: "Created At",
      render: (value) => new Date(value).toLocaleDateString(),
    },
    // {
    //   key: "action",
    //   label: "Actions",
    //   render: (value, item) => (
    //     <PopUp
    //       item={item}
    //       actions={[
    //         {
    //           label: "View Details",
    //           onClick: () =>
    //             navigate({ to: `/dashboard/investors/${item.id}` }),
    //         },
    //         { label: "Edit", onClick: () => console.log("Edit", item.id) },
    //         { label: "Delete", onClick: () => console.log("Delete", item.id) },
    //       ]}
    //     />
    //   ),
    // },
  ];
  const actions: Actions[] = [
    {
      key: "view-details",
      label: "View Details",
      action: (item: INVESTOR, nav) =>
        nav({ to: `/dashboard/investors/${item.id}` }),
    },
    // {
    //   key: "edit",
    //   label: "Edit",
    //   action: (item: INVESTOR) => console.log("Edit", item.id),
    // },
    // {
    //   key: "delete",
    //   label: "Delete",
    //   action: (item: INVESTOR) => console.log("Delete", item.id),
    // },
  ];
  return (
    <>
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
          Failed to load investors. Please try again.
        </div>
      )}

      {/* Investors List View */}
      {!isLoading && !error && viewMode === "list" && (
        <CustomTable
          data={filteredInvestors}
          columns={investorColumns}
          actions={actions}
        />
      )}

      {/* Investors Grid View (Placeholder - implement as needed) */}
      {!isLoading && !error && viewMode === "grid" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
          {filteredInvestors.length > 0 ? (
            filteredInvestors.map((investor) => (
              <div
                key={investor.id}
                className="border p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <h3 className="font-semibold text-lg">
                  {investor.firstName} {investor.lastName}
                </h3>
                <p className="text-gray-600">{investor.email}</p>
                <p className="text-gray-500 text-sm">
                  Status: {investor.account_status}
                </p>
                <p className="text-gray-500 text-sm">
                  Verification: {investor.account_verification_status}
                </p>
                <Button
                  variant="link"
                  className="p-0 h-auto mt-2"
                  onClick={() =>
                    navigate({ to: `/dashboard/investors/${investor.id}` })
                  }
                >
                  View Details
                </Button>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-10 text-gray-500">
              No investors found.
            </div>
          )}
        </div>
      )}

      {!isLoading && !error && filteredInvestors.length === 0 && (
        <div className="text-center py-20 text-gray-500">
          No investors match your search.
        </div>
      )}
    </>
  );
}
