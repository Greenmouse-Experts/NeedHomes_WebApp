import apiClient, { type ApiResponse } from "@/api/simpleApi";
import Modal, { type ModalHandle } from "@/components/modals/DialogModal";
import PageLoader from "@/components/layout/PageLoader";
import { Button } from "@/components/ui/Button";
import { extract_message } from "@/helpers/apihelpers";
import AdminROI from "@/routes/-components/ROI";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowUpRight,
  BarChart3,
  Calendar,
  Check,
  ChevronLeft,
  Copy,
  Hash,
  MapPin,
  TrendingUp,
  User,
  XCircle,
} from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { NairaIcon } from "@/components/NairaIcon";

export const Route = createFileRoute("/dashboard/properties/investments/$id/")({
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

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      className="p-1.5 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
      title="Copy to clipboard"
    >
      {copied ? (
        <Check className="w-3.5 h-3.5 text-green-500" />
      ) : (
        <Copy className="w-3.5 h-3.5" />
      )}
    </button>
  );
}

function RouteComponent() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const cancelRef = useRef<ModalHandle>(null);
  const [reason, setReason] = useState("");

  const query = useQuery<ApiResponse<Investment>>({
    queryKey: ["investments-admin", id],
    queryFn: async () => {
      let resp = await apiClient.get(`admin/investments/${id}`);
      return resp.data;
    },
  });

  const cancelMutation = useMutation({
    mutationFn: async () => {
      if (!reason.trim()) throw new Error("A reason is required");
      const resp = await apiClient.patch(`/investments/admin/${id}/cancel`, {
        reason: reason.trim(),
      });
      return resp.data;
    },
    onSuccess: (data: any) => {
      const refunded = data?.data?.refundedAmountNaira;
      toast.success(
        refunded
          ? `Investment cancelled. ₦${Number(refunded).toLocaleString()} refunded to investor.`
          : "Investment cancelled and investor refunded.",
      );
      queryClient.invalidateQueries({ queryKey: ["investments-admin", id] });
      cancelRef.current?.close();
      setReason("");
    },
    onError: (err) => toast.error(extract_message(err)),
  });

  const formatCurrency = (amount: number) => `₦${amount.toLocaleString()}`;

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  return (
    <div className="space-y-8">
      <Button
        onClick={() => navigate({ to: "/dashboard/properties/investments/" })}
        variant="outline"
        leftIcon={<ChevronLeft className="w-5 h-5" />}
      >
        Back to Investments
      </Button>

      <PageLoader query={query}>
        {(data) => {
          const inv = data.data as Investment;
          const isInstallment = inv.paymentOption === "INSTALLMENT";

          return (
            <div className="space-y-8">
              {/* Cancel Modal */}
              {(() => {
                const canCancel = ["ACTIVE", "PENDING"].includes(inv.status);
                return (
                  <Modal
                    ref={cancelRef}
                    title="Cancel Investment"
                    actions={
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          onClick={() => cancelRef.current?.close()}
                        >
                          Back
                        </Button>
                        <Button
                          variant="danger"
                          isLoading={cancelMutation.isPending}
                          disabled={!canCancel || !reason.trim()}
                          onClick={() => cancelMutation.mutate()}
                        >
                          Confirm Cancellation
                        </Button>
                      </div>
                    }
                  >
                    <div className="space-y-4">
                      {!canCancel ? (
                        <div role="alert" className="alert alert-info text-sm">
                          <XCircle className="w-4 h-4 shrink-0" />
                          <p>
                            This investment cannot be cancelled because its
                            current status is <strong>{inv.status}</strong>.
                            Only <strong>ACTIVE</strong> or{" "}
                            <strong>PENDING</strong> investments can be
                            cancelled.
                          </p>
                        </div>
                      ) : (
                        <>
                          <div
                            role="alert"
                            className="alert alert-warning text-sm"
                          >
                            <AlertTriangle className="w-4 h-4 shrink-0" />
                            <p>
                              This will cancel the investment and automatically
                              refund the investor's wallet. This action cannot
                              be undone.
                            </p>
                          </div>
                          <div className="p-3 bg-base-200 rounded-box text-sm space-y-0.5">
                            <p className="text-base-content/60">Investor</p>
                            <p className="font-semibold">
                              {inv.user?.firstName} {inv.user?.lastName}
                            </p>
                            <p className="text-base-content/60">
                              {inv.user?.email}
                            </p>
                          </div>
                          <fieldset className="fieldset">
                            <legend className="fieldset-legend">
                              Reason <span className="text-error">*</span>
                            </legend>
                            <textarea
                              className="textarea textarea-bordered w-full resize-none"
                              rows={3}
                              placeholder="e.g. Property is being removed from the platform"
                              value={reason}
                              onChange={(e) => setReason(e.target.value)}
                            />
                          </fieldset>
                        </>
                      )}
                    </div>
                  </Modal>
                );
              })()}

              {/* ── Hero Header ── */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="h-1.5 bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500" />
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                    {/* Left */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2.5 bg-green-100 rounded-xl shrink-0">
                          <TrendingUp className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
                            Investment Details
                          </h1>
                          <div className="flex items-center gap-2 mt-1">
                            <span
                              className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                inv.status === "ACTIVE"
                                  ? "bg-green-100 text-green-700"
                                  : inv.status === "COMPLETED"
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-yellow-100 text-yellow-700"
                              }`}
                            >
                              {inv.status}
                            </span>
                            <span className="text-xs text-gray-400 font-medium bg-gray-100 px-2 py-0.5 rounded-full">
                              {inv.paymentOption}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Investment ID */}
                      <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 flex items-center gap-3 max-w-md">
                        <Hash className="w-4 h-4 text-gray-400 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-0.5">
                            Investment ID
                          </p>
                          <p className="font-mono text-sm text-gray-800 font-semibold truncate">
                            {inv.id}
                          </p>
                        </div>
                        <CopyButton text={inv.id} />
                      </div>

                      {/* Property ref */}
                      <div className="flex items-center gap-2 mt-3 text-gray-500">
                        <MapPin className="w-3.5 h-3.5 shrink-0" />
                        <span className="text-xs">Property:</span>
                        <span className="font-mono text-xs text-gray-700 truncate">
                          {inv.propertyId}
                        </span>
                        <CopyButton text={inv.propertyId} />
                      </div>
                    </div>

                    {/* Right: current value + cancel */}
                    <div className="shrink-0 flex flex-col items-end gap-3">
                      <button
                        className="btn btn-error btn-outline btn-sm gap-1.5"
                        onClick={() => {
                          setReason("");
                          cancelRef.current?.open();
                        }}
                      >
                        <XCircle className="w-4 h-4" />
                        Cancel Investment
                      </button>
                      <div className="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-100 rounded-xl px-6 py-4 text-center md:text-right">
                        <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-1">
                          Current Value
                        </p>
                        <p className="text-3xl font-bold text-(--color-orange) leading-none">
                          {formatCurrency(inv.currentValue / 100)}
                        </p>
                        <div className="flex items-center gap-1 mt-2 justify-center md:justify-end">
                          <ArrowUpRight className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-semibold text-green-600">
                            +{inv.returnPercentage}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Stats Grid ── */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                  <div className="p-2 bg-blue-50 rounded-lg w-fit mb-3">
                    <NairaIcon className="w-4 h-4 text-blue-600" />
                  </div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-1">
                    Amount Paid
                  </p>
                  <p className="text-xl font-bold text-gray-900">
                    {formatCurrency(inv.amountPaid / 100)}
                  </p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                  <div className="p-2 bg-green-50 rounded-lg w-fit mb-3">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  </div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-1">
                    Total Returns
                  </p>
                  <p className="text-xl font-bold text-green-600">
                    {formatCurrency(inv.totalReturns)}
                  </p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                  <div className="p-2 bg-purple-50 rounded-lg w-fit mb-3">
                    <BarChart3 className="w-4 h-4 text-purple-600" />
                  </div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-1">
                    Slots Bought
                  </p>
                  <p className="text-xl font-bold text-gray-900">
                    {inv.unitsBought}
                  </p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                  <div className="p-2 bg-orange-50 rounded-lg w-fit mb-3">
                    <Calendar className="w-4 h-4 text-orange-500" />
                  </div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-1">
                    Date Invested
                  </p>
                  <p className="text-sm font-bold text-gray-900">
                    {formatDate(inv.createdAt)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* ── Investment Information ── */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="border-b border-gray-100 bg-gray-50 px-6 py-4 flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
                      Investment Information
                    </h3>
                    <Link
                      to="/dashboard/properties/$propertyId"
                      params={{ propertyId: inv.propertyId }}
                      className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-gray-900 text-white text-xs font-semibold rounded-lg hover:bg-gray-800 transition-all shadow-sm active:scale-95"
                    >
                      View Property
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                  <div className="divide-y divide-gray-50">
                    {[
                      { label: "Payment Plan", value: inv.paymentOption },
                      {
                        label: "Total Contract",
                        value: formatCurrency(inv.totalAmount / 100),
                        bold: true,
                      },
                      {
                        label: "Last Valuation",
                        value: inv.lastValuationDate
                          ? formatDate(inv.lastValuationDate)
                          : "N/A",
                      },
                      {
                        label: "Installment",
                        value: isInstallment ? "Yes" : "No",
                      },
                      {
                        label: "Last Updated",
                        value: formatDate(inv.updatedAt),
                      },
                    ].map(({ label, value, bold }) => (
                      <div
                        key={label}
                        className="flex items-center justify-between px-6 py-3.5"
                      >
                        <span className="text-sm text-gray-500">{label}</span>
                        <span
                          className={`text-sm ${bold ? "font-bold text-gray-900" : "font-medium text-gray-700"}`}
                        >
                          {value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ── Investor Info ── */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="border-b border-gray-100 bg-gray-50 px-6 py-4">
                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
                      Investor
                    </h3>
                  </div>
                  {inv.user ? (
                    <>
                      <div className="px-6 py-5 flex items-center gap-4 border-b border-gray-50">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shrink-0">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            {inv.user.firstName} {inv.user.lastName}
                          </p>
                          <p className="text-sm text-gray-500">
                            {inv.user.email}
                          </p>
                        </div>
                      </div>
                      <div className="divide-y divide-gray-50">
                        {[
                          {
                            label: "Account Type",
                            value: inv.user.accountType,
                          },
                          { label: "User ID", value: inv.user.id, mono: true },
                        ].map(({ label, value, mono }) => (
                          <div
                            key={label}
                            className="flex items-center justify-between px-6 py-3.5"
                          >
                            <span className="text-sm text-gray-500">
                              {label}
                            </span>
                            <div className="flex items-center gap-1">
                              <span
                                className={`text-sm font-medium text-gray-700 truncate max-w-[200px] ${mono ? "font-mono" : ""}`}
                              >
                                {value}
                              </span>
                              {mono && <CopyButton text={value} />}
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="px-6 py-8 text-center text-sm text-gray-400">
                      No investor data available
                    </div>
                  )}
                </div>
              </div>

              {/* ── Property Info ── */}
              {inv.property && (
                <>
                  <AdminROI property={inv.property} />
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="border-b border-gray-100 bg-gray-50 px-6 py-4 flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
                        Property
                      </h3>
                      <Link
                        to="/dashboard/properties/$propertyId"
                        params={{ propertyId: inv.propertyId }}
                        className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-gray-900 text-white text-xs font-semibold rounded-lg hover:bg-gray-800 transition-all shadow-sm active:scale-95"
                      >
                        Manage
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                    <div className="flex flex-col md:flex-row gap-0">
                      {inv.property.coverImage && (
                        <div className="md:w-48 shrink-0">
                          <img
                            src={inv.property.coverImage}
                            alt={inv.property.propertyTitle}
                            className="w-full h-40 md:h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="divide-y divide-gray-50 flex-1">
                        {[
                          {
                            label: "Title",
                            value: inv.property.propertyTitle,
                            bold: true,
                          },
                          { label: "Type", value: inv.property.propertyType },
                          {
                            label: "Model",
                            value: inv.property.investmentModel,
                          },
                          { label: "Location", value: inv.property.location },
                          {
                            label: "Base Price",
                            value: formatCurrency(inv.property.basePrice / 100),
                            bold: true,
                          },
                        ].map(({ label, value, bold }) => (
                          <div
                            key={label}
                            className="flex items-center justify-between px-6 py-3.5"
                          >
                            <span className="text-sm text-gray-500">
                              {label}
                            </span>
                            <span
                              className={`text-sm ${bold ? "font-bold text-gray-900" : "font-medium text-gray-700"}`}
                            >
                              {value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          );
        }}
      </PageLoader>
    </div>
  );
}
