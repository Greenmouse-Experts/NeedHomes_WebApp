import type { ApiResponse } from "@/api/simpleApi";
import apiClient from "@/api/simpleApi";
import PageLoader from "@/components/layout/PageLoader";
import CustomTable, { type columnType } from "@/components/tables/CustomTable";
import { type Actions } from "@/components/tables/pop-up";
import { Button } from "@/components/ui/Button";
import { usePagination } from "@/helpers/pagination";
import SearchBar from "@/routes/-components/Searchbar";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Download, X, ChevronDown } from "lucide-react";
import { useState, useRef } from "react";
import { toast } from "sonner";
import { extract_message } from "@/helpers/apihelpers";

export const Route = createFileRoute("/dashboard/properties/investments/")({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>) => ({
    q: (search.q as string) || "",
  }),
});

interface Investment {
  id: string;
  customId?: string;
  userId: string;
  propertyId: string;
  amountPaid: number;
  unitsBought: number;
  sharesBought: number | null;
  paymentOption: "INSTALLMENT" | "OUTRIGHT" | "FULL_PAYMENT";
  status: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  currentValue: number;
  lastValuationDate: string | null;
  returnPercentage: number;
  totalAmount: number;
  totalReturns: number;
  property: {
    id: string;
    propertyTitle: string;
    propertyType: string;
    investmentModel: string;
    location: string;
    basePrice: number;
    coverImage: string;
  };
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    accountType: string;
  };
}

interface Filters {
  status: string;
  accountType: string;
  investmentModel: string;
  startDate: string;
  endDate: string;
}

const STATUS_OPTIONS = [
  { label: "All Statuses", value: "" },
  { label: "Active", value: "ACTIVE" },
  { label: "Pending", value: "PENDING" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Cancelled", value: "CANCELLED" },
  { label: "Exited", value: "EXITED" },
  { label: "Resold", value: "RESOLD" },
];

const INVESTMENT_MODEL_OPTIONS = [
  { label: "All Models", value: "" },
  { label: "Outright Purchase", value: "OUTRIGHT_PURCHASE" },
  { label: "Co-Development", value: "CO_DEVELOPMENT" },
  { label: "Fractional Ownership", value: "FRACTIONAL_OWNERSHIP" },
  { label: "Land Banking", value: "LAND_BANKING" },
  { label: "Save to Own", value: "SAVE_TO_OWN" },
];

const ACCOUNT_TYPE_OPTIONS = [
  { label: "All Account Types", value: "" },
  { label: "Individual", value: "INDIVIDUAL" },
  { label: "Corporate", value: "CORPORATE" },
  { label: "Partner", value: "PARTNER" },
];

const STATUS_COLORS: Record<string, string> = {
  ACTIVE: "bg-blue-100 text-blue-700",
  COMPLETED: "bg-green-100 text-green-700",
  PENDING: "bg-yellow-100 text-yellow-700",
  CANCELLED: "bg-red-100 text-red-700",
  EXITED: "bg-orange-100 text-orange-700",
  RESOLD: "bg-purple-100 text-purple-700",
};

const columns: columnType<Investment>[] = [
  {
    key: "customId",
    label: "ID",
    render: (value) => (
      <span className="text-xs font-mono text-gray-500">{value || "—"}</span>
    ),
  },
  {
    key: "property",
    label: "Property",
    render: (_, item) => (
      <div className="flex flex-col">
        <span className="font-medium">{item.property?.propertyTitle}</span>
        <span className="text-xs opacity-60">{item.property?.location}</span>
      </div>
    ),
  },
  {
    key: "user",
    label: "Investor",
    render: (_, item) => (
      <div className="flex flex-col">
        <span className="font-medium">
          {item.user?.firstName} {item.user?.lastName}
        </span>
        <span className="text-xs opacity-60">{item.user?.email}</span>
        <span className="text-xs opacity-40">{item.user?.accountType}</span>
      </div>
    ),
  },
  {
    key: "property",
    label: "Model",
    render: (_, item) => (
      <span className="text-xs">
        {item.property?.investmentModel?.replace(/_/g, " ")}
      </span>
    ),
  },
  {
    key: "amountPaid",
    label: "Amount Paid",
    render: (value) => `₦${(value / 100).toLocaleString()}`,
  },
  {
    key: "totalAmount",
    label: "Total",
    render: (value) => `₦${(value / 100).toLocaleString()}`,
  },
  {
    key: "createdAt",
    label: "Date",
    render: (value) => new Date(value).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" }),
  },
  {
    key: "status",
    label: "Status",
    render: (value: string) => (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[value] ?? "bg-gray-100 text-gray-600"}`}>
        {value}
      </span>
    ),
  },
];

const actions: Actions[] = [
  {
    key: "view",
    label: "View Details",
    action: (item, nav) => {
      nav({
        to: "/dashboard/properties/investments/$investmentId",
        params: { investmentId: item.id },
      });
    },
  },
];

const DEFAULT_FILTERS: Filters = {
  status: "",
  accountType: "",
  investmentModel: "",
  startDate: "",
  endDate: "",
};

function RouteComponent() {
  const navigate = useNavigate();
  const { q: searchQuery } = Route.useSearch();
  const props = usePagination();
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [showFilters, setShowFilters] = useState(false);
  const [exporting, setExporting] = useState(false);

  const setFilter = (key: keyof Filters, value: string) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  const hasActiveFilters =
    Object.values(filters).some(Boolean) || !!searchQuery;

  const buildParams = () => ({
    page: props.page,
    limit: props.pageSize,
    ...(searchQuery && { search: searchQuery }),
    ...(filters.status && { status: filters.status }),
    ...(filters.accountType && { accountType: filters.accountType }),
    ...(filters.investmentModel && { investmentModel: filters.investmentModel }),
    ...(filters.startDate && { startDate: filters.startDate }),
    ...(filters.endDate && { endDate: filters.endDate }),
  });

  const query = useQuery<ApiResponse<{ data: Investment[]; meta: { total: number } }>>({
    queryKey: ["investments-admin", props.page, searchQuery, filters],
    queryFn: async () => {
      const resp = await apiClient.get("/investments/admin/all", { params: buildParams() });
      return resp.data;
    },
  });

  const handleExport = async () => {
    setExporting(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set("search", searchQuery);
      if (filters.status) params.set("status", filters.status);
      if (filters.accountType) params.set("accountType", filters.accountType);
      if (filters.investmentModel) params.set("investmentModel", filters.investmentModel);
      if (filters.startDate) params.set("startDate", filters.startDate);
      if (filters.endDate) params.set("endDate", filters.endDate);

      const resp = await apiClient.get(`/investments/admin/export?${params.toString()}`, {
        responseType: "blob",
      });

      const contentDisposition = resp.headers["content-disposition"] ?? "";
      const match = contentDisposition.match(/filename="(.+?)"/);
      const filename = match ? match[1] : "investments_export.csv";

      const url = URL.createObjectURL(new Blob([resp.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Export downloaded");
    } catch (err) {
      toast.error(extract_message(err));
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="bg-base-100 ring fade rounded-box shadow overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b border-base-200">
        <div>
          <h2 className="text-xl font-semibold">Investments</h2>
          <p className="text-sm text-base-content/50 mt-0.5">All investor transactions</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          isLoading={exporting}
          onClick={handleExport}
          leftIcon={<Download className="w-4 h-4" />}
        >
          Export CSV
        </Button>
      </div>

      {/* Search + Filter bar */}
      <div className="p-4 border-b border-base-200 space-y-3">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex-1 min-w-48">
            <SearchBar
              value={searchQuery}
              onChange={(val: string) =>
                navigate({ search: { q: val }, replace: true })
              }
            />
          </div>
          <button
            onClick={() => setShowFilters((p) => !p)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
              showFilters || Object.values(filters).some(Boolean)
                ? "border-primary text-primary bg-primary/5"
                : "border-base-300 text-base-content/70 hover:border-base-400"
            }`}
          >
            <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? "rotate-180" : ""}`} />
            Filters
            {Object.values(filters).some(Boolean) && (
              <span className="bg-primary text-primary-content text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {Object.values(filters).filter(Boolean).length}
              </span>
            )}
          </button>
          {hasActiveFilters && (
            <button
              onClick={() => {
                setFilters(DEFAULT_FILTERS);
                navigate({ search: { q: "" }, replace: true });
              }}
              className="flex items-center gap-1 text-sm text-error hover:underline"
            >
              <X className="w-3.5 h-3.5" /> Clear all
            </button>
          )}
        </div>

        {showFilters && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-1">
            <select
              className="select select-sm select-bordered w-full"
              value={filters.status}
              onChange={(e) => setFilter("status", e.target.value)}
            >
              {STATUS_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>

            <select
              className="select select-sm select-bordered w-full"
              value={filters.accountType}
              onChange={(e) => setFilter("accountType", e.target.value)}
            >
              {ACCOUNT_TYPE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>

            <select
              className="select select-sm select-bordered w-full"
              value={filters.investmentModel}
              onChange={(e) => setFilter("investmentModel", e.target.value)}
            >
              {INVESTMENT_MODEL_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>

            <div className="flex flex-col gap-0.5">
              <label className="text-xs text-base-content/50 pl-0.5">From</label>
              <input
                type="date"
                className="input input-sm input-bordered w-full"
                value={filters.startDate}
                max={filters.endDate || undefined}
                onChange={(e) => setFilter("startDate", e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-0.5">
              <label className="text-xs text-base-content/50 pl-0.5">To</label>
              <input
                type="date"
                className="input input-sm input-bordered w-full"
                value={filters.endDate}
                min={filters.startDate || undefined}
                onChange={(e) => setFilter("endDate", e.target.value)}
              />
            </div>
          </div>
        )}
      </div>

      {/* Table */}
      <PageLoader query={query}>
        {(data) => {
          const investments = data.data.data ?? [];
          const total = data.data.meta?.total ?? investments.length;
          return (
            <CustomTable
              paginationProps={props}
              ring={false}
              columns={columns}
              data={investments}
              actions={actions}
              totalCount={total}
              onRowClick={(item) =>
                navigate({
                  to: "/dashboard/properties/investments/$investmentId",
                  params: { investmentId: item.id },
                })
              }
            />
          );
        }}
      </PageLoader>
    </div>
  );
}
