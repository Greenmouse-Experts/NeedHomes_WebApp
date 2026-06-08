import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import apiClient, { type ApiResponse } from "@/api/simpleApi";
import PageLoader from "@/components/layout/PageLoader";
import CustomTable, { type columnType } from "@/components/tables/CustomTable";
import { type Actions } from "@/components/tables/pop-up";
import { usePagination } from "@/helpers/pagination";
import { ChevronLeft } from "lucide-react";
import { useState } from "react";
import SearchBar from "@/routes/-components/Searchbar";

export const Route = createFileRoute("/investors/my-investments/list/")({
  component: RouteComponent,
  validateSearch: (search: Record<string, string>) => {
    const { page, investmentModel } = search;
    return { page, investmentModel };
  },
});

interface Investment {
  id: string;
  userId: string;
  propertyId: string;
  amountPaid: number;
  unitsBought: number;
  sharesBought: number | null;
  paymentOption: "OUTRIGHT" | "INSTALLMENT" | "FULL_PAYMENT";
  status:
    | "ACTIVE"
    | "PENDING"
    | "COMPLETED"
    | "EXITED"
    | "CANCELLED"
    | "RESOLD";
  createdAt: string;
  property: {
    basePrice: number;
    id: string;
    investmentModel: string;
    propertyType: string;
    propertyTitle: string;
  };
  currentValue: number;
  totalReturns: number;
}

const MODEL_LABELS: Record<string, string> = {
  FRACTIONAL_OWNERSHIP: "Fractional Ownership",
  LAND_BANKING: "Land Banking",
  SAVE_TO_OWN: "Save to Own",
  OUTRIGHT_PURCHASE: "Outright Purchase",
  CO_DEVELOPMENT: "Co-Development",
};

function RouteComponent() {
  const navigate = useNavigate();
  const { investmentModel } = Route.useSearch();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>("");
  const paginationProps = usePagination();

  const query = useQuery<ApiResponse<Investment[]>>({
    queryKey: [
      "investments",
      paginationProps.page,
      status,
      search,
      investmentModel,
    ],
    queryFn: async () => {
      const resp = await apiClient.get("investments/my-investments", {
        params: {
          page: paginationProps.page,
          limit: paginationProps.pageSize,
          ...(status && { status }),
          ...(search && { search }),
          ...(investmentModel && { investmentModel }),
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
      label: "Slots / Shares",
      render: (_, item) =>
        item.sharesBought != null ? (
          <span className="font-medium">
            {item.sharesBought} share{item.sharesBought !== 1 ? "s" : ""}
          </span>
        ) : (
          <span>{item.unitsBought ?? "—"}</span>
        ),
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
          ACTIVE: "bg-blue-100 text-blue-700",
          PENDING: "bg-yellow-100 text-yellow-700",
          COMPLETED: "bg-green-100 text-green-700",
          EXITED: "bg-orange-100 text-orange-700",
          CANCELLED: "bg-red-100 text-red-700",
          RESOLD: "bg-purple-100 text-purple-700",
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
  ];

  const title = investmentModel
    ? (MODEL_LABELS[investmentModel] ?? investmentModel)
    : "All Investments";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          to="/investors/my-investments"
          className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-gray-900">{title}</h1>
          <p className="text-sm text-gray-500">Your investment history</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <SearchBar value={search} onChange={(val: string) => setSearch(val)} />
        <select
          className="select select-primary"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="PENDING">Pending</option>
          <option value="COMPLETED">Completed</option>
          <option value="EXITED">Exited</option>
          <option value="CANCELLED">Cancelled</option>
          <option value="RESOLD">Resold</option>
        </select>
      </div>

      {/* Table */}
      <PageLoader query={query}>
        {(data) => {
          const investments: Investment[] = data.data.data ?? data.data ?? [];
          return (
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
          );
        }}
      </PageLoader>
    </div>
  );
}
