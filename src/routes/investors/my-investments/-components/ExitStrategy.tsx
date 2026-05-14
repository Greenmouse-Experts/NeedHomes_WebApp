import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import {
  LogOut,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
} from "lucide-react";
import { toast } from "sonner";
import apiClient, { type ApiResponse } from "@/api/simpleApi";
import { extract_message } from "@/helpers/apihelpers";
import Modal, { type ModalHandle } from "@/components/modals/DialogModal";
import { Button } from "@/components/ui/Button";
import QueryCompLayout from "@/components/layout/QueryCompLayout";
import type { PROPERTY_TYPE } from "@/types/property";

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
  property?: {
    investmentModel: string;
  };
}

interface ExitRequest {
  id: string;
  investmentId: string;
  userId: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  reason: string | null;
  adminNote: string | null;
  exitAmount: number | null;
  requestedAt: string;
  processedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

interface ExitRequestsResponse {
  data: ExitRequest[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

function formatNaira(kobo: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(kobo / 100);
}

function getExitPolicyLabel(property: PROPERTY_TYPE): string {
  const model = property.investmentModel;
  if (model === "CO_DEVELOPMENT") {
    return `Exit rule: ${property.exitRule?.replace(/_/g, " ") ?? "N/A"}`;
  }
  if (model === "FRACTIONAL_OWNERSHIP") {
    return `Exit window: ${property.exitWindow?.replace(/_/g, " ") ?? "N/A"}`;
  }
  if (model === "LAND_BANKING") {
    return property.buyBackOption
      ? `Buy-back available after ${property.holdingPeriod ?? "?"} month holding period`
      : "No buy-back option";
  }
  return "Exit not available for this investment type";
}

function StatusBadge({ status }: { status: ExitRequest["status"] }) {
  if (status === "PENDING")
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
        <Clock className="w-3 h-3" /> Pending Review
      </span>
    );
  if (status === "APPROVED")
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
        <CheckCircle2 className="w-3 h-3" /> Approved
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
      <XCircle className="w-3 h-3" /> Rejected
    </span>
  );
}

export default function ExitStrategy({
  investment,
  propertyId,
}: {
  investment: Investment;
  propertyId: string;
}) {
  const modalRef = useRef<ModalHandle>(null);
  const [reason, setReason] = useState("");
  const queryClient = useQueryClient();

  const propertyQuery = useQuery<ApiResponse<PROPERTY_TYPE>>({
    queryKey: ["inv", propertyId],
    queryFn: async () => {
      const resp = await apiClient.get("properties/" + propertyId);
      return resp.data;
    },
  });

  const exitRequestsQuery = useQuery<ApiResponse<ExitRequestsResponse>>({
    queryKey: ["exit-requests", investment.id],
    queryFn: async () => {
      const resp = await apiClient.get("investments/exit-requests/my-requests");
      return resp.data;
    },
    enabled: investment.status === "ACTIVE",
  });

  const submitMutation = useMutation({
    mutationFn: async () => {
      const resp = await apiClient.post(
        `investments/${investment.id}/exit-request`,
        { reason: reason.trim() || undefined },
      );
      return resp.data;
    },
    onSuccess: () => {
      toast.success("Exit request submitted — pending admin review");
      queryClient.invalidateQueries({
        queryKey: ["exit-requests", investment.id],
      });
      setReason("");
      modalRef.current?.close();
    },
    onError: (error) => {
      toast.error(extract_message(error));
    },
  });

  const NON_EXITABLE = ["FRACTIONAL_OWNERSHIP", "OUTRIGHT_PURCHASE"];
  const exitUnavailable =
    investment.status !== "ACTIVE" ||
    NON_EXITABLE.includes(investment.property?.investmentModel ?? "");

  if (exitUnavailable)
    return (
      <div className="bg-white rounded-xl shadow ring fade overflow-hidden h-full">
        <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4 flex items-center gap-2">
          <LogOut className="w-5 h-5 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900">Exit Strategy</h3>
        </div>
        <div className="p-6 flex items-center gap-3 text-sm text-gray-500">
          <XCircle className="w-5 h-5 text-gray-400 shrink-0" />
          Exit strategy is not available for this investment.
        </div>
      </div>
    );

  const allRequests = exitRequestsQuery.data?.data?.data ?? [];

  const pendingRequest = allRequests.find(
    (r) => r.investmentId === investment.id && r.status === "PENDING",
  );

  const latestRequest = allRequests
    .filter((r) => r.investmentId === investment.id)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )[0];

  return (
    <QueryCompLayout query={propertyQuery}>
      {(propData) => {
        const property = propData.data;
        if (!property) return null;

        const holdingPeriodMonths =
          property.investmentModel === "LAND_BANKING" && property.buyBackOption
            ? Number(property.holdingPeriod)
            : null;
        const monthsHeld = holdingPeriodMonths
          ? Math.floor(
              (Date.now() - new Date(investment.createdAt).getTime()) /
                (1000 * 60 * 60 * 24 * 30.44),
            )
          : null;
        const holdingReached =
          !holdingPeriodMonths ||
          (monthsHeld !== null && monthsHeld >= holdingPeriodMonths);
        const monthsRemaining =
          holdingPeriodMonths && monthsHeld !== null
            ? Math.max(0, holdingPeriodMonths - monthsHeld)
            : 0;

        return (
          <>
            <Modal
              ref={modalRef}
              title="Request Investment Exit"
              actions={
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => modalRef.current?.close()}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    isLoading={submitMutation.isPending}
                    onClick={() => submitMutation.mutate()}
                  >
                    Submit Request
                  </Button>
                </div>
              }
            >
              <div className="space-y-4 ">
                <div className="flex items-start gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
                  <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                  <p>
                    Your exit request will be reviewed by an admin. Eligibility
                    is verified automatically based on your investment's exit
                    policy.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500 mb-1">Exit Policy</p>
                    <p className="font-medium text-gray-800">
                      {getExitPolicyLabel(property)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Current Value</p>
                    <p className="font-bold text-gray-900">
                      {formatNaira(investment.currentValue)}
                    </p>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">
                    Reason{" "}
                    <span className="text-gray-400 font-normal">
                      (optional)
                    </span>
                  </label>
                  <textarea
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/40"
                    rows={3}
                    placeholder="e.g. Need liquidity for other commitments"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  />
                </div>
              </div>
            </Modal>

            <div className="bg-white rounded-xl shadow ring fade overflow-hidden">
              <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4 flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <LogOut className="w-5 h-5 text-gray-600" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    Exit Strategy
                  </h3>
                </div>
                {pendingRequest ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-yellow-50 text-yellow-700 border border-yellow-200">
                    <Clock className="w-4 h-4" /> Exit Requested — Pending
                    Review
                  </span>
                ) : (
                  <Button
                    variant="outline"
                    leftIcon={<LogOut className="w-4 h-4" />}
                    disabled={!holdingReached}
                    onClick={() => modalRef.current?.open()}
                  >
                    {holdingReached
                      ? "Request Exit"
                      : `${monthsRemaining}mo remaining`}
                  </Button>
                )}
              </div>

              <div className="p-6 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-12">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-1">
                      Exit Policy
                    </p>
                    <p className="text-sm font-medium text-gray-800">
                      {getExitPolicyLabel(property)}
                    </p>
                  </div>
                  <div className="sm:ml-auto sm:text-right">
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-1">
                      Current Value
                    </p>
                    <p className="text-sm font-bold text-gray-900">
                      {formatNaira(investment.currentValue)}
                    </p>
                  </div>
                </div>

                {holdingPeriodMonths !== null && (
                  <div
                    className={`flex items-start gap-2 p-3 rounded-lg text-sm border ${
                      holdingReached
                        ? "bg-blue-50 border-blue-100 text-blue-700"
                        : "bg-amber-50 border-amber-200 text-amber-800"
                    }`}
                  >
                    <Info className="w-4 h-4 mt-0.5 shrink-0" />
                    {holdingReached ? (
                      <span>
                        Minimum holding period of{" "}
                        <strong>{holdingPeriodMonths} months</strong> reached (
                        {monthsHeld} months held).
                      </span>
                    ) : (
                      <span>
                        Minimum holding period: <strong>{holdingPeriodMonths} months</strong>.
                        You have held for <strong>{monthsHeld} months</strong> —{" "}
                        <strong>{monthsRemaining} months</strong> remaining
                        before you can request an exit.
                      </span>
                    )}
                  </div>
                )}

                {latestRequest && (
                  <div className="rounded-lg border border-gray-200 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-gray-700">
                        Latest Exit Request
                      </p>
                      <StatusBadge status={latestRequest.status} />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-gray-500">Requested</p>
                        <p className="font-medium text-gray-900">
                          {new Date(
                            latestRequest.requestedAt,
                          ).toLocaleDateString("en-NG", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                      </div>

                      {latestRequest.processedAt && (
                        <div>
                          <p className="text-gray-500">Processed</p>
                          <p className="font-medium text-gray-900">
                            {new Date(
                              latestRequest.processedAt,
                            ).toLocaleDateString("en-NG", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                      )}

                      {latestRequest.exitAmount !== null && (
                        <div>
                          <p className="text-gray-500">Payout Amount</p>
                          <p className="font-bold text-green-700">
                            {formatNaira(latestRequest.exitAmount)}
                          </p>
                        </div>
                      )}

                      {latestRequest.reason && (
                        <div className="sm:col-span-2">
                          <p className="text-gray-500">Your Reason</p>
                          <p className="font-medium text-gray-900">
                            {latestRequest.reason}
                          </p>
                        </div>
                      )}

                      {latestRequest.adminNote && (
                        <div className="sm:col-span-2">
                          <p className="text-gray-500">Admin Note</p>
                          <p className="font-medium text-gray-900">
                            {latestRequest.adminNote}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {!latestRequest && !exitRequestsQuery.isLoading && (
                  <p className="text-sm text-gray-400">
                    No exit requests submitted yet.
                  </p>
                )}
              </div>
            </div>
          </>
        );
      }}
    </QueryCompLayout>
  );
}
