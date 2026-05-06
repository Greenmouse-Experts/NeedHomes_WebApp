import apiClient, {
  type ApiResponse,
  type ApiResponseV2,
} from "@/api/simpleApi";
import PageLoader from "@/components/layout/PageLoader";
import CustomTable, { type columnType } from "@/components/tables/CustomTable";
import type { Actions } from "@/components/tables/pop-up";
import { usePagination } from "@/helpers/pagination";
import { InputNumberFormat } from "@react-input/number-format";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeftRight, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/investors/resell/")({
  component: RouteComponent,
});

type ResellStatus = "PENDING" | "APPROVED" | "REJECTED" | "SOLD";

interface ResellListing {
  id: string;
  propertyTitle: string;
  propertyType: string;
  investmentModel: string;
  location: string;
  basePrice: number;
  totalPrice: number;
  coverImage?: string;
  isResell: boolean;
  resellStatus: ResellStatus;
  published: boolean;
  originalInvestmentId: string;
  additionalFees: { id: string; label: string; amount: number }[];
  createdAt: string;
  updatedAt: string;
}

interface MyListingsResponse {
  data: ResellListing[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

const STATUS_COLORS: Record<ResellStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  APPROVED: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-700",
  SOLD: "bg-blue-100 text-blue-700",
};

function RouteComponent() {
  const paginationProps = usePagination();
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<ResellStatus | "">("");
  const [showRequestModal, setShowRequestModal] = useState(false);
  const nav = useNavigate();
  const query = useQuery<ApiResponseV2<ResellListing[]>>({
    queryKey: ["resell-my-listings", paginationProps.page, statusFilter],
    queryFn: async () => {
      const resp = await apiClient.get("resell/my-listings", {
        params: {
          page: paginationProps.page,
          limit: paginationProps.pageSize,
          ...(statusFilter ? { status: statusFilter } : {}),
        },
      });
      return resp.data;
    },
  });

  const columns: columnType<ResellListing>[] = [
    {
      key: "createdAt",
      label: "Date",
      render: (value) => new Date(value).toLocaleDateString(),
    },
    {
      key: "propertyTitle",
      label: "Property",
    },
    {
      key: "location",
      label: "Location",
    },
    {
      key: "basePrice",
      label: "Asking Price",
      render: (value) => `₦${(value / 100).toLocaleString()}`,
    },
    {
      key: "totalPrice",
      label: "Total Price",
      render: (value) => `₦${(value / 100).toLocaleString()}`,
    },
    {
      key: "resellStatus",
      label: "Status",
      render: (value: ResellStatus) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[value] || "bg-gray-100 text-gray-700"}`}
        >
          {value}
        </span>
      ),
    },
  ];

  const actions = [
    {
      label: "View Invesment",
      key: "view",
      action: (item, nav) =>
        nav({
          to: `/investors/my-investments/${item.originalInvestmentId}`,
          // params: {},
        }),
    },
  ] satisfies Actions<ResellListing>[];
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-2 bg-orange-100 rounded-lg">
            <ArrowLeftRight className="h-6 w-6 text-orange-600" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            My Resell Listings
          </h1>
        </div>
        <p className="text-gray-600 text-sm sm:text-base">
          Manage your property resell requests and track their status.
        </p>
      </div>

      {/* Filters + Action */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <select
          className="select select-bordered select-sm"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as ResellStatus | "")}
        >
          <option value="">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
          <option value="SOLD">Sold</option>
        </select>

        {/*<button
          className="btn btn-sm bg-(--color-orange) text-white hover:opacity-90 border-none ml-auto"
          onClick={() => setShowRequestModal(true)}
        >
          + Request Resell
        </button>*/}
      </div>

      {/* Table */}
      <PageLoader query={query}>
        {(data) => {
          const listings = data.data.data ?? [];
          const meta = data.data.meta;
          return (
            <CustomTable
              data={listings}
              columns={columns}
              paginationProps={paginationProps}
              totalCount={meta?.total ?? listings.length}
              actions={actions}
            />
          );
        }}
      </PageLoader>

      {/* Request Resell Modal */}
      {showRequestModal && (
        <ResellRequestModal
          onClose={() => setShowRequestModal(false)}
          onSuccess={() => {
            setShowRequestModal(false);
            queryClient.invalidateQueries({ queryKey: ["resell-my-listings"] });
          }}
        />
      )}
    </div>
  );
}

interface ResellRequestModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

interface CompletedInvestment {
  id: string;
  property: { propertyTitle: string; basePrice: number };
  amountPaid: number;
  status: string;
}

function ResellRequestModal({ onClose, onSuccess }: ResellRequestModalProps) {
  const [investmentId, setInvestmentId] = useState("");
  const [askingPrice, setAskingPrice] = useState("");

  const investmentsQuery = useQuery<
    ApiResponse<{ data: CompletedInvestment[] }>
  >({
    queryKey: ["investments-completed"],
    queryFn: async () => {
      const resp = await apiClient.get("investments/my-investments", {
        params: { status: "COMPLETED", limit: 100 },
      });
      return resp.data;
    },
  });

  const completedInvestments: CompletedInvestment[] = (() => {
    const raw = investmentsQuery.data?.data;
    if (!raw) return [];
    const arr = (raw as any).data ?? raw;
    return Array.isArray(arr)
      ? arr.filter((i: CompletedInvestment) => i.status === "COMPLETED")
      : [];
  })();

  const mutation = useMutation({
    mutationFn: async () => {
      const body: Record<string, any> = {};
      if (askingPrice) {
        const parsed = parseFloat(askingPrice);
        if (isNaN(parsed) || parsed <= 0)
          throw new Error("Invalid asking price");
        body.askingPrice = Math.round(parsed * 100);
      }
      const resp = await apiClient.post(`resell/${investmentId}`, body);
      return resp.data;
    },
    onSuccess: () => {
      toast.success("Resell request submitted. Awaiting admin review.");
      onSuccess();
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.message ?? err?.message ?? "Something went wrong";
      toast.error(Array.isArray(msg) ? msg.join(", ") : msg);
    },
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-base-100 rounded-2xl shadow-xl w-full max-w-md p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">Request Resell</h2>
          <button
            className="btn btn-ghost btn-sm btn-circle"
            onClick={onClose}
            disabled={mutation.isPending}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="label">
              <span className="label-text font-medium">
                Completed Investment
              </span>
            </label>
            <select
              className="select select-bordered w-full"
              value={investmentId}
              onChange={(e) => setInvestmentId(e.target.value)}
              disabled={investmentsQuery.isLoading}
            >
              <option value="">
                {investmentsQuery.isLoading
                  ? "Loading..."
                  : "Select an investment"}
              </option>
              {completedInvestments.map((inv) => (
                <option key={inv.id} value={inv.id}>
                  {inv.property.propertyTitle} — ₦
                  {(inv.property.basePrice / 100).toLocaleString()}
                </option>
              ))}
            </select>
            {!investmentsQuery.isLoading &&
              completedInvestments.length === 0 && (
                <p className="text-xs text-base-content/50 mt-1">
                  No completed investments available for resell.
                </p>
              )}
          </div>

          <div>
            <label className="label">
              <span className="label-text font-medium">
                Asking Price (₦){" "}
                <span className="text-base-content/50 font-normal">
                  — optional
                </span>
              </span>
            </label>
            {/*<InputNumberFormat
              locales="en"
              maximumFractionDigits={2}
              // type="number"
              // min="0"
              // step="0.01"
              // className="input input-bordered w-full"
              // placeholder="Leave blank to use original price"
              // value={askingPrice}
              // onChange={(e) => setAskingPrice(e.target.value)}
            />*/}
          </div>
        </div>

        <div className="flex gap-3 justify-end pt-2">
          <button
            className="btn btn-ghost btn-sm"
            onClick={onClose}
            disabled={mutation.isPending}
          >
            Cancel
          </button>
          <button
            className="btn btn-sm bg-(--color-orange) text-white hover:opacity-90 border-none"
            onClick={() => mutation.mutate()}
            disabled={!investmentId || mutation.isPending}
          >
            {mutation.isPending ? "Submitting..." : "Submit Request"}
          </button>
        </div>
      </div>
    </div>
  );
}
