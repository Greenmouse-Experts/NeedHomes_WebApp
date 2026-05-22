import apiClient, { type ApiResponseV2 } from "@/api/simpleApi";
import PageLoader from "@/components/layout/PageLoader";
import CustomTable, { type columnType } from "@/components/tables/CustomTable";
import type { Actions } from "@/components/tables/pop-up";
import { Button } from "@/components/ui/Button";
import Modal, { type ModalHandle } from "@/components/modals/DialogModal";
import { extract_message } from "@/helpers/apihelpers";
import { usePagination } from "@/helpers/pagination";
import SearchBar from "@/routes/-components/Searchbar";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeftRight,
  CheckCircle2,
  XCircle,
  Clock,
  BadgeCheck,
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

interface ResellSlot {
  id: string;
  units: number;
  soldUnits: number;
  status: ResellStatus;
  rejectionReason: string | null;
  createdAt: string;
  property: {
    id: string;
    propertyTitle: string;
    investmentModel: string;
    availableUnits?: number;
  };
  reseller: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  investment: {
    id: string;
    unitsBought: number | null;
    sharesBought: number | null;
  };
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

const columns: columnType<ResellSlot>[] = [
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
    key: "property",
    label: "Property",
    render: (_, item) => (
      <div className="flex flex-col">
        <span className="font-medium">{item.property?.propertyTitle}</span>
        <span className="text-xs opacity-60">
          {item.property?.investmentModel}
        </span>
      </div>
    ),
  },
  {
    key: "units",
    label: "Units",
    render: (_, item) => (
      <span className="font-semibold">
        {item.soldUnits} / {item.units} sold
      </span>
    ),
  },
  {
    key: "status",
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
  const [selectedItem, setSelectedItem] = useState<ResellSlot | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const query = useQuery<ApiResponseV2<ResellSlot[]>>({
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
    mutationFn: async (slotId: string) => {
      await apiClient.patch(`/resell/admin/${slotId}/approve`);
    },
    onSuccess: () => {
      toast.success(
        "Resell request approved — units added back to the property",
      );
      queryClient.invalidateQueries({ queryKey: ["resell-admin-requests"] });
      approveRef.current?.close();
      setSelectedItem(null);
    },
    onError: (error) => toast.error(extract_message(error)),
  });

  const rejectMutation = useMutation({
    mutationFn: async ({
      slotId,
      reason,
    }: {
      slotId: string;
      reason: string;
    }) => {
      if (!reason.trim()) throw new Error("Rejection reason is required");
      await apiClient.patch(`/resell/admin/${slotId}/reject`, { reason });
    },
    onSuccess: () => {
      toast.success("Resell request rejected");
      queryClient.invalidateQueries({ queryKey: ["resell-admin-requests"] });
      rejectRef.current?.close();
      setSelectedItem(null);
      setRejectReason("");
    },
    onError: (error) => toast.error(extract_message(error)),
  });

  const openApprove = (item: ResellSlot) => {
    setSelectedItem(item);
    approveRef.current?.open();
  };

  const openReject = (item: ResellSlot) => {
    setSelectedItem(item);
    rejectRef.current?.open();
  };

  const actions: Actions<ResellSlot>[] = [
    {
      key: "view-investment",
      label: "View Investment",
      action: (item, nav) =>
        nav({
          to: "/dashboard/properties/investments/$id",
          params: { id: item.investment.id },
        }),
    },
    {
      key: "view-property",
      label: "View Property",
      action: (item, nav) =>
        nav({
          //@ts-ignore
          to: "/dashboard/properties/$id",
          //@ts-ignore
          params: { id: item.property.id },
        }),
    },
    {
      key: "approve",
      label: "Approve",
      disabled: (item) => item.status !== "PENDING",
      action: (item) => openApprove(item),
    },
    {
      key: "reject",
      label: "Reject",
      disabled: (item) => item.status !== "PENDING",
      action: (item) => openReject(item),
    },
  ];

  return (
    <>
      {/* Approve Modal */}
      <Modal
        ref={approveRef}
        title="Approve Resell Request"
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
        <div className="space-y-3">
          <div role="alert" className="alert alert-info text-sm">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <p>
              Approving will add <strong>{selectedItem?.units} unit(s)</strong>{" "}
              back to <strong>{selectedItem?.property?.propertyTitle}</strong>.
              The reseller will be notified.
            </p>
          </div>
          {selectedItem && (
            <div className="grid grid-cols-2 gap-2 text-sm bg-base-200 rounded-box p-3">
              <div>
                <p className="text-base-content/50 text-xs uppercase tracking-wide">
                  Reseller
                </p>
                <p className="font-medium">
                  {selectedItem.reseller.firstName}{" "}
                  {selectedItem.reseller.lastName}
                </p>
              </div>
              <div>
                <p className="text-base-content/50 text-xs uppercase tracking-wide">
                  Units
                </p>
                <p className="font-medium">{selectedItem.units}</p>
              </div>
              <div>
                <p className="text-base-content/50 text-xs uppercase tracking-wide">
                  Model
                </p>
                <p className="font-medium">
                  {selectedItem.property.investmentModel}
                </p>
              </div>
              <div>
                <p className="text-base-content/50 text-xs uppercase tracking-wide">
                  Units Bought
                </p>
                <p className="font-medium">
                  {selectedItem.investment.sharesBought ??
                    selectedItem.investment.unitsBought ??
                    "—"}
                </p>
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* Reject Modal */}
      <Modal
        ref={rejectRef}
        title="Reject Resell Request"
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
                  slotId: selectedItem.id,
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
              The reseller will be notified with the reason below. Property
              availability will not be changed.
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
                Review and approve investor property resell requests.
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 border-b border-base-200 flex flex-wrap gap-3 items-center">
          <SearchBar
            value={search}
            onChange={(val: string) =>
              navigate({
                to: ".",
                search: (prev: any) => ({ ...prev, search: val }),
              })
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
                columns={columns}
                actions={actions}
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
