import apiClient, { type ApiResponse } from "@/api/simpleApi";
import PageLoader from "@/components/layout/PageLoader";
import CustomTable, { type columnType } from "@/components/tables/CustomTable";
import { type Actions } from "@/components/tables/pop-up";
import { usePagination } from "@/helpers/pagination";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { TrendingUp, Filter, ChevronDown, Plus } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/investors/my-investments/")({
  component: RouteComponent,
});

interface Investment {
  id: string;
  userId: string;
  propertyId: string;
  amountPaid: number;
  unitsBought: number;
  sharesBought: number | null;
  paymentOption: "OUTRIGHT" | "INSTALLMENT";
  status: "ACTIVE" | "PENDING" | "COMPLETED";
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  currentValue: number;
  lastValuationDate: string | null;
  returnPercentage: number;
  totalAmount: number;
  totalReturns: number;
}

function RouteComponent() {
  const [filterOpen, setFilterOpen] = useState(false);
  const [actionOpen, setActionOpen] = useState(false);
  const paginationProps = usePagination();

  const query = useQuery<ApiResponse<Investment[]>>({
    queryKey: ["investments", paginationProps.page],
    queryFn: async () => {
      let resp = await apiClient.get("investments/my-investments", {
        params: {
          page: paginationProps.page,
          limit: paginationProps.pageSize,
        },
      });
      return resp.data;
    },
  });

  const columns: columnType<Investment>[] = [
    {
      key: "createdAt",
      label: "Date",
      render: (value) => new Date(value).toLocaleDateString(),
    },
    {
      key: "amountPaid",
      label: "Amount Paid",
      render: (value) => `₦${value.toLocaleString()}`,
    },
    {
      key: "unitsBought",
      label: "Units",
    },
    {
      key: "paymentOption",
      label: "Method",
      render: (value) => (
        <span className="capitalize">{value.toLowerCase()}</span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (value: string) => {
        const colors: Record<string, string> = {
          ACTIVE: "bg-green-100 text-green-700",
          PENDING: "bg-yellow-100 text-yellow-700",
          COMPLETED: "bg-blue-100 text-blue-700",
        };
        return (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${colors[value] || "bg-gray-100 text-gray-700"}`}
          >
            {value}
          </span>
        );
      },
    },
    {
      key: "totalReturns",
      label: "Returns",
      render: (value) => (
        <span className="text-green-600 font-medium">
          ₦{value.toLocaleString()}
        </span>
      ),
    },
  ];

  const actions: Actions[] = [
    {
      key: "view",
      label: "View Details",
      action: (item, nav) =>
        nav({ to: `/investors/my-investments/${item.id}` }),
    },
    // {
    //   key: "receipt",
    //   label: "Download Receipt",
    //   action: (item) => console.log("Downloading receipt for", item.id),
    // },
  ];

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
            className="flex items-center gap-2 px-4 py-2 border-2 border-(--color-orange) text-(--color-orange) rounded-lg hover:bg-orange-50 transition-colors"
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
            className="flex items-center gap-2 px-4 py-2 border-2 border-(--color-orange) text-(--color-orange) rounded-lg hover:bg-orange-50 transition-colors"
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

        <button className="flex items-center gap-2 px-4 py-2 bg-(--color-orange) text-white rounded-lg hover:bg-orange-600 transition-colors">
          <Plus className="w-4 h-4" />
          Add Investment
        </button>
      </div>

      {/* Investments Table */}
      <PageLoader query={query}>
        {(data) => (
          <CustomTable
            data={data.data}
            columns={columns}
            actions={actions}
            paginationProps={paginationProps}
            totalCount={data.data.length} // Adjust based on API response structure if meta exists
          />
        )}
      </PageLoader>
    </div>
  );
}
