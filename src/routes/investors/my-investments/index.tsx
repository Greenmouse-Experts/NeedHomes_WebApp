import apiClient from "@/api/simpleApi";
import PageLoader from "@/components/layout/PageLoader";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  TrendingUp,
  MoreVertical,
  Filter,
  ChevronDown,
  Plus,
} from "lucide-react";
import { useState } from "react";
export const Route = createFileRoute("/investors/my-investments/")({
  component: RouteComponent,
});

const investments = [
  {
    id: 1,
    propertyId: "LAG-CAT-001",
    propertyName: "Semi Detached Duplex",
    location: "Lekki Phase 1, Lagos",
    amount: "₦10,000,000",
    investmentType: "Outright Purchase",
    status: "Active",
    dateInvested: "Jan 20, 2024",
    returns: "+12.5%",
  },
  {
    id: 2,
    propertyId: "LAG-CAT-002",
    propertyName: "3BR Terrace Duplex",
    location: "Ikeja GRA, Lagos",
    amount: "₦5,500,000",
    investmentType: "Fractional Ownership",
    status: "Active",
    dateInvested: "Feb 15, 2024",
    returns: "+8.3%",
  },
  {
    id: 3,
    propertyId: "LAG-CAT-003",
    propertyName: "Luxury Apartment",
    location: "Victoria Island, Lagos",
    amount: "₦15,000,000",
    investmentType: "Co-Development",
    status: "Pending",
    dateInvested: "Mar 10, 2024",
    returns: "N/A",
  },
];

function RouteComponent() {
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [actionOpen, setActionOpen] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "completed":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const query = useQuery({
    queryKey: ["investments"],
    queryFn: async () => {
      let resp = await apiClient.get("investments/my-investments");
      return resp.data;
    },
  });
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-2 bg-purple-100 rounded-lg">
            <TrendingUp className="h-6 w-6 text-purple-600" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            My Investments
          </h1>
        </div>
        <p className="text-gray-600 text-sm sm:text-base">
          Track your investment portfolio and monitor performance.
        </p>
      </div>

      {/* Filters Bar */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="relative">
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className="flex items-center gap-2 px-4 py-2 border-2 border-[var(--color-orange)] text-[var(--color-orange)] rounded-lg hover:bg-orange-50 transition-colors"
          >
            <Filter className="w-4 h-4" />
            Filter
          </button>
          {filterOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setFilterOpen(false)}
              />
              <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20 p-2">
                <button className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded">
                  All Investments
                </button>
                <button className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded">
                  Active
                </button>
                <button className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded">
                  Pending
                </button>
                <button className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded">
                  Completed
                </button>
              </div>
            </>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => setActionOpen(!actionOpen)}
            className="flex items-center gap-2 px-4 py-2 border-2 border-[var(--color-orange)] text-[var(--color-orange)] rounded-lg hover:bg-orange-50 transition-colors"
          >
            Action
            <ChevronDown className="w-4 h-4" />
          </button>
          {actionOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setActionOpen(false)}
              />
              <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20 p-2">
                <button className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded">
                  Export Data
                </button>
                <button className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded">
                  View Reports
                </button>
              </div>
            </>
          )}
        </div>

        <button className="flex items-center gap-2 px-4 py-2 bg-[var(--color-orange)] text-white rounded-lg hover:bg-orange-600 transition-colors">
          <Plus className="w-4 h-4" />
          Add Investment
        </button>
      </div>

      {/* Investments Table */}
      <PageLoader query={query}>
        {(data) => {
          return <></>;
        }}
      </PageLoader>
    </div>
  );
}
