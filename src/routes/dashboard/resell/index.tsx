import apiClient, { type ApiResponseV2 } from "@/api/simpleApi";
import PageLoader from "@/components/layout/PageLoader";
import CustomTable, { type columnType } from "@/components/tables/CustomTable";
import { Button } from "@/components/ui/Button";
import Modal, { type ModalHandle } from "@/components/modals/DialogModal";
import { extract_message } from "@/helpers/apihelpers";
import { usePagination } from "@/helpers/pagination";
import SearchBar from "@/routes/-components/Searchbar";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeftRight,
  CheckCircle2,
  XCircle,
  Clock,
  BadgeCheck,
  Eye,
} from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/resell/")({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>) => ({
    search: (search.search as string) ?? "",
    status: (search.status as string) ?? "",
  }),
});

type ResellStatus = "PENDING" | "APPROVED" | "REJECTED" | "SOLD";

interface ResellListing {
  id: string;
  propertyTitle: string;
  location: string;
  basePrice: number;
  totalPrice: number;
  isResell: boolean;
  resellStatus: ResellStatus;
  published: boolean;
  resellerId: string;
  originalInvestmentId: string;
  additionalFees: { id: string; label: string; amount: number }[];
  reseller: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  createdAt: string;
}

function formatNaira(kobo: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(kobo / 100);
}

const statusBadge = (status: ResellStatus) => {
  switch (status) {
    case "PENDING":
      return (
        <span className="badge badge-sm badge-soft badge-warning font-bold gap-1">
          <Clock className="w-3 h-3" /> Pending
        </span>
      );
    case "APPROVED":
      return (
        <span className="badge badge-sm badge-soft badge-success font-bold gap-1">
          <CheckCircle2 className="w-3 h-3" /> Approved
        </span>
      );
    case "REJECTED":
      return (
        <span className="badge badge-sm badge-soft badge-error font-bold gap-1">
          <XCircle className="w-3 h-3" /> Rejected
        </span>
      );
    case "SOLD":
      return (
        <span className="badge badge-sm badge-soft badge-info font-bold gap-1">
          <BadgeCheck className="w-3 h-3" /> Sold
        </span>
      );
  }
};

const columns: columnType<ResellListing>[] = [
  {
    key: "reseller",
    label: "Reseller",
    render: (_, item) => (
      <div className="flex flex-col">
        <span className="font-medium">
          {item.reseller?.firstName} {item.reseller?.lastName}
        </span>
        <span className="text-xs opacity-60">{item.reseller?.email}</span>
      </div>
    ),
  },
  {
    key: "propertyTitle",
    label: "Property",
    render: (value, item) => (
      <div className="flex flex-col">
        <span className="font-medium">{value}</span>
        <span className="text-xs opacity-60">{item.location}</span>
      </div>
    ),
  },
  {
    key: "basePrice",
    label: "Asking Price",
    render: (value) => (
      <span className="font-semibold">{formatNaira(value)}</span>
    ),
  },
  {
    key: "totalPrice",
    label: "Total Price",
    render: (value) => formatNaira(value),
  },
  {
    key: "resellStatus",
    label: "Status",
    render: (value) => statusBadge(value),
  },
  {
    key: "createdAt",
    label: "Submitted",
    render: (value) =>
      new Date(value).toLocaleDateString("en-NG", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
  },
];

function RouteComponent() {
  const navigate = useNavigate();
  const { search, status } = Route.useSearch();
  const props = usePagination();
  const queryClient = useQueryClient();
  const approveRef = useRef<ModalHandle>(null);
  const rejectRef = useRef<ModalHandle>(null);
  const [selectedItem, setSelectedItem] = useState<ResellListing | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const query = useQuery<ApiResponseV2<ResellListing[]>>({
    queryKey: ["resell-admin-requests", props.page, search, status],
    queryFn: async () => {
      const resp = await apiClient.get("/resell/admin/requests", {
        params: {
          page: props.page,
          limit: 20,
          search: search || undefined,
          status: status || undefined,
        },
      });
      return resp.data;
    },
  });

  const approveMutation = useMutation({
    mutationFn: async (propertyId: string) => {
      await apiClient.patch(`/resell/admin/${propertyId}/approve`);
    },
    onSuccess: () => {
      toast.success("Resell listing approved and published");
      queryClient.invalidateQueries({ queryKey: ["resell-admin-requests"] });
      approveRef.current?.close();
      setSelectedItem(null);
    },
    onError: (error) => toast.error(extract_message(error)),
  });

  const rejectMutation = useMutation({
    mutationFn: async ({
      propertyId,
      reason,
    }: {
      propertyId: string;
      reason: string;
    }) => {
      if (!reason.trim()) throw new Error("Rejection reason is required");
      await apiClient.patch(`/resell/admin/${propertyId}/reject`, { reason });
    },
    onSuccess: () => {
      toast.success("Resell listing rejected");
      queryClient.invalidateQueries({ queryKey: ["resell-admin-requests"] });
      rejectRef.current?.close();
      setSelectedItem(null);
      setRejectReason("");
    },
    onError: (error) => toast.error(extract_message(error)),
  });

  const openApprove = (item: ResellListing) => {
    setSelectedItem(item);
    approveRef.current?.open();
  };

  const openReject = (item: ResellListing) => {
    setSelectedItem(item);
    rejectRef.current?.open();
  };

  const columnsWithActions: columnType<ResellListing>[] = [
    ...columns,
    {
      key: "action",
      label: "Actions",
      render: (_, item) => (
        <div className="flex gap-2 flex-wrap">
          <Link
            to="/dashboard/properties/investments/$id"
            params={{ id: item.originalInvestmentId }}
            onClick={(e) => e.stopPropagation()}
            className="btn btn-xs btn-outline gap-1"
          >
            <Eye className="w-3 h-3" /> View Investment
          </Link>
          {item.resellStatus === "PENDING" && (
            <>
              <button
                className="btn btn-xs btn-error btn-outline gap-1"
                onClick={(e) => {
                  e.stopPropagation();
                  openReject(item);
                }}
              >
                <XCircle className="w-3 h-3" /> Reject
              </button>
              <button
                className="btn btn-xs btn-success gap-1"
                onClick={(e) => {
                  e.stopPropagation();
                  openApprove(item);
                }}
              >
                <CheckCircle2 className="w-3 h-3" /> Approve
              </button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      {/* Approve Modal */}
      <Modal
        ref={approveRef}
        title="Approve Resell Listing"
        actions={
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => approveRef.current?.close()}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              isLoading={approveMutation.isPending}
              onClick={() =>
                selectedItem && approveMutation.mutate(selectedItem.id)
              }
            >
              Confirm Approval
            </Button>
          </div>
        }
      >
        <div role="alert" className="alert alert-info text-sm">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <p>
            <strong>{selectedItem?.propertyTitle}</strong> will be published and
            visible to investors. The reseller will be notified.
          </p>
        </div>
      </Modal>

      {/* Reject Modal */}
      <Modal
        ref={rejectRef}
        title="Reject Resell Listing"
        actions={
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => rejectRef.current?.close()}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              isLoading={rejectMutation.isPending}
              onClick={() =>
                selectedItem &&
                rejectMutation.mutate({
                  propertyId: selectedItem.id,
                  reason: rejectReason,
                })
              }
            >
              Confirm Rejection
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div role="alert" className="alert alert-warning text-sm">
            <XCircle className="w-4 h-4 shrink-0" />
            <p>
              The reseller will be notified with the reason below. The listing
              will remain unpublished.
            </p>
          </div>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">
              Rejection Reason <span className="text-error">*</span>
            </legend>
            <textarea
              className="textarea textarea-bordered w-full resize-none"
              rows={4}
              placeholder="e.g. The asking price is above the acceptable market rate for this property."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
          </fieldset>
        </div>
      </Modal>

      <div className="bg-base-100 rounded-xl ring fade overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-base-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <ArrowLeftRight className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Resell Requests</h1>
              <p className="text-base-content/60 text-sm mt-0.5">
                Review and approve investor property resell listings.
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 border-b border-base-200 flex flex-wrap gap-3 items-center">
          <SearchBar
            value={search}
            onChange={(val: string) =>
              navigate({ to: ".", search: (prev: any) => ({ ...prev, search: val }) })
            }
          />
          <select
            className="select select-bordered select-sm"
            value={status}
            onChange={(e) =>
              navigate({
                to: ".",
                search: (prev: any) => ({ ...prev, status: e.target.value }),
              })
            }
          >
            <option value="">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
            <option value="SOLD">Sold</option>
          </select>
        </div>

        <PageLoader query={query}>
          {(data) => {
            const list = data.data.data ?? [];
            return (
              <CustomTable
                ring={false}
                columns={columnsWithActions}
                data={list}
                paginationProps={props}
                totalCount={data.data.meta?.total ?? list.length}
              />
            );
          }}
        </PageLoader>
      </div>
    </>
  );
}
