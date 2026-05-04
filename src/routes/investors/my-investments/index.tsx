import apiClient, { type ApiResponse } from "@/api/simpleApi";
import PageLoader from "@/components/layout/PageLoader";
import CustomTable, { type columnType } from "@/components/tables/CustomTable";
import { type Actions } from "@/components/tables/pop-up";
import { usePagination } from "@/helpers/pagination";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { TrendingUp, Filter, ChevronDown, Plus } from "lucide-react";
import { useState } from "react";
import InvStatistics from "./-components/InvStatistics";
import ExitStrategy from "./-components/ExitStrategy";
import { Link } from "@tanstack/react-router";
import SearchBar from "@/routes/-components/Searchbar";

export const Route = createFileRoute("/investors/my-investments/")({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>) => ({
    search: (search.search as string) ?? "",
  }),
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
  property: {
    basePrice: number;
    id: string;
    investmentModel: string;
    propertyType: string;
    propertyTitle: string;
  };
  updatedAt: string;
  deletedAt: string | null;
  currentValue: number;
  lastValuationDate: string | null;
  returnPercentage: number;
  totalAmount: number;
  totalReturns: number;
}

function RouteComponent() {
  const navigate = useNavigate();
  const { search } = Route.useSearch();
  const [filterOpen, setFilterOpen] = useState(false);
  const [status, setStatus] = useState<
    null | "ACTIVE" | "CANCELLED" | "COMPLETED" | "EXITED"
  >(null);
  const [actionOpen, setActionOpen] = useState(false);
  const paginationProps = usePagination();

  const query = useQuery<ApiResponse<Investment[]>>({
    queryKey: ["investments", paginationProps.page, status, search],
    queryFn: async () => {
      let resp = await apiClient.get("investments/my-investments", {
        params: {
          page: paginationProps.page,
          limit: paginationProps.pageSize,
          ...(status && { status }),
          ...(search && { search }),
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
      key: "property.propertyTitle",
      label: "Property",
      render: (_, item) => item.property.propertyTitle,
    },
    {
      key: "amountPaid",
      label: "Amount Paid",
      render: (value) => `₦${(value / 100).toLocaleString()}`,
    },
    {
      key: "unitsBought",
      label: "Slots",
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
      <InvStatistics />

      {/* Filters Bar */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <SearchBar
          value={search}
          onChange={(val: string) =>
            navigate({ search: (prev) => ({ ...prev, search: val }) })
          }
        />
        <div className="relative">
          <select
            className="select select-primary"
            value={status ?? ""}
            onChange={(e) =>
              setStatus(
                e.target.value === ""
                  ? null
                  : (e.target.value as typeof status),
              )
            }
          >
            <option value="">All</option>
            <option value="ACTIVE">Active</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="COMPLETED">Completed</option>
            <option value="EXITED">Exited</option>
          </select>
        </div>

        <Link
          to="/investors/properties"
          viewTransition
          className="flex items-center gap-2 px-4 py-2 bg-(--color-orange) text-white rounded-lg hover:bg-orange-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Investment
        </Link>
      </div>

      {/* Investments Table */}
      <PageLoader query={query}>
        {(data) => {
          const investments: Investment[] = data.data.data ?? data.data ?? [];
          return (
            <>
              <CustomTable
                //@ts-ignore
                data={investments}
                columns={columns}
                onRowClick={(item) =>
                  navigate({
                    to: "/investors/my-investments/$investmentId",
                    params: { investmentId: item.id },
                  })
                }
                actions={actions}
                paginationProps={paginationProps}
                totalCount={data.data.length}
              />
            </>
          );
        }}
      </PageLoader>
    </div>
  );
}
