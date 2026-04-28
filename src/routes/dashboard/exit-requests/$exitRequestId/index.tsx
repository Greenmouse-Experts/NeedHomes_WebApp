import apiClient, { type ApiResponse } from "@/api/simpleApi";
import PageLoader from "@/components/layout/PageLoader";
import { Button } from "@/components/ui/Button";
import { extract_message } from "@/helpers/apihelpers";
import Modal, { type ModalHandle } from "@/components/modals/DialogModal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ChevronLeft,
  CheckCircle2,
  XCircle,
  Clock,
  User,
  Home,
  Calendar,
  FileText,
  Hash,
} from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import ThemeProvider from "@/simpleComps/ThemeProvider";
import { NairaIcon } from "@/components/NairaIcon";

export const Route = createFileRoute(
  "/dashboard/exit-requests/$exitRequestId/",
)({
  component: RouteComponent,
});

type ExitStatus = "PENDING" | "APPROVED" | "REJECTED";

interface ExitRequest {
  id: string;
  investmentId: string;
  userId: string;
  status: ExitStatus;
  reason: string | null;
  adminNote: string | null;
  exitAmount: number | null;
  requestedAt: string;
  processedAt: string | null;
  createdAt: string;
  updatedAt: string;
  investment: {
    id: string;
    status: string;
    amountPaid: number;
    currentValue: number;
    totalAmount: number;
    userId: string;
    property: {
      id: string;
      propertyTitle: string;
      investmentModel: string;
    };
  };
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

function formatNaira(kobo: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(kobo / 100);
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function StatusBadge({ status }: { status: ExitStatus }) {
  switch (status) {
    case "PENDING":
      return (
        <span className="badge badge-warning badge-soft gap-1 font-semibold">
          <Clock className="w-3.5 h-3.5" /> Pending Review
        </span>
      );
    case "APPROVED":
      return (
        <span className="badge badge-success badge-soft gap-1 font-semibold">
          <CheckCircle2 className="w-3.5 h-3.5" /> Approved
        </span>
      );
    case "REJECTED":
      return (
        <span className="badge badge-error badge-soft gap-1 font-semibold">
          <XCircle className="w-3.5 h-3.5" /> Rejected
        </span>
      );
  }
}

function RouteComponent() {
  const { exitRequestId } = Route.useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const approveRef = useRef<ModalHandle>(null);
  const rejectRef = useRef<ModalHandle>(null);

  const [exitAmountNaira, setExitAmountNaira] = useState("");
  const [adminNote, setAdminNote] = useState("");
  const [rejectNote, setRejectNote] = useState("");
  const [manualFallback, setManualFallback] = useState(false);

  const query = useQuery<ApiResponse<ExitRequest>>({
    queryKey: ["exit-request", exitRequestId],
    queryFn: async () => {
      const resp = await apiClient.get(
        `/investments/admin/exit-requests/${exitRequestId}`,
      );
      return resp.data;
    },
  });

  const approveMutation = useMutation({
    mutationFn: async () => {
      const isFractional =
        query.data?.data?.investment?.property?.investmentModel ===
        "FRACTIONAL_OWNERSHIP";

      const body: Record<string, unknown> = {
        adminNote: adminNote.trim() || undefined,
      };

      if (!isFractional || manualFallback) {
        const kobo = Math.round(parseFloat(exitAmountNaira) * 100);
        if (isNaN(kobo) || kobo <= 0)
          throw new Error("Enter a valid exit amount");
        body.exitAmount = kobo;
      }

      await apiClient.patch(
        `/investments/admin/exit-requests/${exitRequestId}/approve`,
        body,
      );
    },
    onSuccess: () => {
      toast.success("Exit request approved and wallet credited");
      queryClient.invalidateQueries({
        queryKey: ["exit-request", exitRequestId],
      });
      queryClient.invalidateQueries({ queryKey: ["exit-requests-admin"] });
      approveRef.current?.close();
      setExitAmountNaira("");
      setAdminNote("");
      setManualFallback(false);
    },
    onError: (error) => toast.error(extract_message(error)),
  });

  const rejectMutation = useMutation({
    mutationFn: async () => {
      if (!rejectNote.trim()) throw new Error("Rejection reason is required");
      await apiClient.patch(
        `/investments/admin/exit-requests/${exitRequestId}/reject`,
        { adminNote: rejectNote.trim() },
      );
    },
    onSuccess: () => {
      toast.success("Exit request rejected");
      queryClient.invalidateQueries({
        queryKey: ["exit-request", exitRequestId],
      });
      queryClient.invalidateQueries({ queryKey: ["exit-requests-admin"] });
      rejectRef.current?.close();
      setRejectNote("");
    },
    onError: (error) => toast.error(extract_message(error)),
  });

  return (
    <div className="space-y-6">
      <Button
        variant="outline"
        leftIcon={<ChevronLeft className="w-4 h-4" />}
        onClick={() => navigate({ to: "/dashboard/exit-requests" })}
      >
        Back to Exit Requests
      </Button>

      <PageLoader query={query}>
        {(data) => {
          const req = data.data;
          const isPending = req.status === "PENDING";

          return (
            <ThemeProvider className="space-y-4">
              {/* Approve Modal */}
              {(() => {
                const isFractional =
                  req.investment?.property?.investmentModel ===
                  "FRACTIONAL_OWNERSHIP";
                return (
                  <Modal
                    ref={approveRef}
                    title="Approve Exit Request"
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
                          onClick={() => approveMutation.mutate()}
                        >
                          Confirm Approval
                        </Button>
                      </div>
                    }
                  >
                    <div className="space-y-4">
                      <div role="alert" className="alert alert-info text-sm">
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                        <p>
                          The investor's wallet will be credited immediately.
                          This action cannot be undone.
                        </p>
                      </div>

                      <div className="p-3 bg-base-200 rounded-box text-sm space-y-1">
                        <p className="text-base-content/60">
                          Current Value (reference)
                        </p>
                        <p className="text-lg font-bold">
                          {formatNaira(req.investment?.currentValue ?? 0)}
                        </p>
                      </div>

                      {isFractional ? (
                        <>
                          {!manualFallback ? (
                            <div
                              role="alert"
                              className="alert alert-success text-sm"
                            >
                              <CheckCircle2 className="w-4 h-4 shrink-0" />
                              <p>
                                Exit payout will be{" "}
                                <strong>auto-calculated</strong> by the backend
                                using the investor's holding duration and the
                                property's configured return rates.
                              </p>
                            </div>
                          ) : (
                            <fieldset className="fieldset">
                              <legend className="fieldset-legend">
                                Exit Amount (₦){" "}
                                <span className="text-error">*</span>
                              </legend>
                              <label className="input w-full">
                                <span className="text-base-content/40">₦</span>
                                <input
                                  type="number"
                                  min="0"
                                  placeholder="Enter payout amount in Naira"
                                  value={exitAmountNaira}
                                  onChange={(e) =>
                                    setExitAmountNaira(e.target.value)
                                  }
                                />
                              </label>
                            </fieldset>
                          )}
                          <label className="flex items-center gap-2 text-sm cursor-pointer">
                            <input
                              type="checkbox"
                              className="checkbox checkbox-sm"
                              checked={manualFallback}
                              onChange={(e) =>
                                setManualFallback(e.target.checked)
                              }
                            />
                            <span className="text-base-content/70">
                              No return rates configured — enter amount manually
                            </span>
                          </label>
                        </>
                      ) : (
                        <fieldset className="fieldset">
                          <legend className="fieldset-legend">
                            Exit Amount (₦){" "}
                            <span className="text-error">*</span>
                          </legend>
                          <label className="input w-full">
                            <span className="text-base-content/40">₦</span>
                            <input
                              type="number"
                              min="0"
                              placeholder="Enter payout amount in Naira"
                              value={exitAmountNaira}
                              onChange={(e) =>
                                setExitAmountNaira(e.target.value)
                              }
                            />
                          </label>
                        </fieldset>
                      )}

                      <fieldset className="fieldset">
                        <legend className="fieldset-legend">
                          Admin Note{" "}
                          <span className="text-base-content/40 font-normal">
                            (optional)
                          </span>
                        </legend>
                        <textarea
                          className="textarea textarea-bordered w-full resize-none"
                          rows={3}
                          placeholder="e.g. Approved at current market value after profit share deduction"
                          value={adminNote}
                          onChange={(e) => setAdminNote(e.target.value)}
                        />
                      </fieldset>
                    </div>
                  </Modal>
                );
              })()}

              {/* Reject Modal */}
              <Modal
                ref={rejectRef}
                title="Reject Exit Request"
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
                      onClick={() => rejectMutation.mutate()}
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
                      The investment will remain active. The investor will be
                      notified with the reason below.
                    </p>
                  </div>

                  <fieldset className="fieldset">
                    <legend className="fieldset-legend">
                      Rejection Reason <span className="text-error">*</span>
                    </legend>
                    <textarea
                      className="textarea textarea-bordered w-full resize-none"
                      rows={4}
                      placeholder="e.g. Exit window has not opened yet. Please reapply after project completion."
                      value={rejectNote}
                      onChange={(e) => setRejectNote(e.target.value)}
                    />
                  </fieldset>
                </div>
              </Modal>

              {/* Header card */}
              <div className="card bg-base-100 shadow-sm ring fade overflow-hidden ">
                <div className="h-1.5 bg-gradient-to-r from-orange-400 via-amber-500 to-yellow-400" />
                <div className="card-body">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h1 className="text-2xl font-bold">Exit Request</h1>
                        <StatusBadge status={req.status} />
                      </div>
                      <div className="flex items-center gap-2 text-sm text-base-content/50">
                        <Hash className="w-3.5 h-3.5" />
                        <span className="font-mono">{req.id}</span>
                      </div>
                      <p className="text-sm text-base-content/60">
                        Requested on {formatDate(req.requestedAt)}
                        {req.processedAt &&
                          ` · Processed on ${formatDate(req.processedAt)}`}
                      </p>
                    </div>

                    {isPending && (
                      <div className="flex gap-2 shrink-0">
                        <button
                          className="btn btn-error btn-outline btn-sm gap-1.5"
                          onClick={() => rejectRef.current?.open()}
                        >
                          <XCircle className="w-4 h-4" />
                          Reject
                        </button>
                        <button
                          className="btn btn-success btn-sm gap-1.5"
                          onClick={() => approveRef.current?.open()}
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          Approve
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    icon: NairaIcon,
                    color: "bg-blue-50 text-blue-600",
                    label: "Amount Paid",
                    value: formatNaira(req.investment?.amountPaid ?? 0),
                  },
                  {
                    icon: NairaIcon,
                    color: "bg-green-50 text-green-600",
                    label: "Current Value",
                    value: formatNaira(req.investment?.currentValue ?? 0),
                  },
                  {
                    icon: NairaIcon,
                    color: req.exitAmount
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-gray-50 text-gray-400",
                    label: "Exit Payout",
                    value: req.exitAmount ? formatNaira(req.exitAmount) : "—",
                  },
                  {
                    icon: Calendar,
                    color: "bg-orange-50 text-orange-500",
                    label: "Requested",
                    value: formatDate(req.requestedAt),
                  },
                ].map(({ icon: Icon, color, label, value }) => (
                  <div
                    key={label}
                    className="bg-base-100 rounded-xl shadow-sm border border-base-200 p-5"
                  >
                    <div className={`p-2 rounded-lg w-fit mb-3 ${color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <p className="text-xs text-base-content/50 uppercase tracking-wider font-medium mb-1">
                      {label}
                    </p>
                    <p className="text-lg font-bold">{value}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Investor info */}
                <div className="card bg-base-100 shadow-sm border border-base-200">
                  <div className="border-b border-base-200 px-6 py-4 flex items-center gap-2">
                    <User className="w-4 h-4 text-base-content/60" />
                    <h3 className="font-semibold text-sm uppercase tracking-wider">
                      Investor
                    </h3>
                  </div>
                  <div className="divide-y divide-base-200">
                    {[
                      {
                        label: "Name",
                        value: `${req.user.firstName} ${req.user.lastName}`,
                      },
                      { label: "Email", value: req.user.email },
                      {
                        label: "Investment Status",
                        value: req.investment?.status,
                      },
                    ].map(({ label, value }) => (
                      <div
                        key={label}
                        className="flex items-center justify-between px-6 py-3"
                      >
                        <span className="text-sm text-base-content/50">
                          {label}
                        </span>
                        <span className="text-sm font-medium">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Property info */}
                <div className="card bg-base-100 shadow-sm border border-base-200">
                  <div className="border-b border-base-200 px-6 py-4 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Home className="w-4 h-4 text-base-content/60" />
                      <h3 className="font-semibold text-sm uppercase tracking-wider">
                        Property
                      </h3>
                    </div>
                    {req.investment?.property?.id && (
                      <Link
                        to="/dashboard/properties/$propertyId"
                        params={{ propertyId: req.investment.property.id }}
                        className="btn ring btn-primary btn-sm fade btn-outline gap-1"
                      >
                        View Property
                      </Link>
                    )}
                  </div>
                  <div className="divide-y divide-base-200">
                    {[
                      {
                        label: "Title",
                        value: req.investment?.property?.propertyTitle,
                      },
                      {
                        label: "Model",
                        value:
                          req.investment?.property?.investmentModel?.replace(
                            /_/g,
                            " ",
                          ),
                      },
                      {
                        label: "Total Contract",
                        value: formatNaira(req.investment?.totalAmount ?? 0),
                      },
                    ].map(({ label, value }) => (
                      <div
                        key={label}
                        className="flex items-center justify-between px-6 py-3"
                      >
                        <span className="text-sm text-base-content/50">
                          {label}
                        </span>
                        <span className="text-sm font-medium">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Exit request details */}
                <div className="card bg-base-100 shadow-sm border border-base-200 lg:col-span-2">
                  <div className="border-b border-base-200 px-6 py-4 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-base-content/60" />
                    <h3 className="font-semibold text-sm uppercase tracking-wider">
                      Request Details
                    </h3>
                  </div>
                  <div className="p-6 space-y-4">
                    <div>
                      <p className="text-xs text-base-content/50 uppercase tracking-wider font-medium mb-1.5">
                        Investor Reason
                      </p>
                      <p className="text-sm">
                        {req.reason ?? (
                          <span className="text-base-content/40">
                            No reason provided
                          </span>
                        )}
                      </p>
                    </div>

                    {req.adminNote && (
                      <div>
                        <p className="text-xs text-base-content/50 uppercase tracking-wider font-medium mb-1.5">
                          Admin Note
                        </p>
                        <p className="text-sm">{req.adminNote}</p>
                      </div>
                    )}

                    {req.status === "APPROVED" && req.exitAmount && (
                      <div role="alert" className="alert alert-success text-sm">
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                        <p>
                          Investor's wallet was credited{" "}
                          <strong>{formatNaira(req.exitAmount)}</strong> on{" "}
                          {req.processedAt ? formatDate(req.processedAt) : "—"}.
                        </p>
                      </div>
                    )}

                    {req.status === "REJECTED" && (
                      <div role="alert" className="alert alert-error text-sm">
                        <XCircle className="w-4 h-4 shrink-0" />
                        <p>
                          Request rejected
                          {req.processedAt
                            ? ` on ${formatDate(req.processedAt)}`
                            : ""}
                          . Investment remains active.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </ThemeProvider>
          );
        }}
      </PageLoader>
    </div>
  );
}
