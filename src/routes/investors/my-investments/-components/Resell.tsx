import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import {
  RefreshCw,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  CircleDollarSign,
  BadgeCheck,
} from "lucide-react";
import { toast } from "sonner";
import apiClient, { type ApiResponseV2 } from "@/api/simpleApi";
import { extract_message } from "@/helpers/apihelpers";
import Modal, { type ModalHandle } from "@/components/modals/DialogModal";
import { Button } from "@/components/ui/Button";

interface Investment {
  id: string;
  status: "ACTIVE" | "PENDING" | "COMPLETED";
  amountPaid: number;
  propertyId: string;
}

type ResellStatus = "PENDING" | "APPROVED" | "REJECTED" | "SOLD";

interface ResellListing {
  id: string;
  propertyTitle: string;
  basePrice: number;
  totalPrice: number;
  resellStatus: ResellStatus;
  published: boolean;
  originalInvestmentId: string;
  additionalFees: { id: string; label: string; amount: number }[];
  createdAt: string;
  updatedAt: string;
}

function formatNaira(kobo: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(kobo / 100);
}

function ResellStatusBadge({ status }: { status: ResellStatus }) {
  switch (status) {
    case "PENDING":
      return (
        <span className="badge badge-warning gap-1">
          <Clock className="w-3 h-3" /> Pending Review
        </span>
      );
    case "APPROVED":
      return (
        <span className="badge badge-success gap-1">
          <CheckCircle2 className="w-3 h-3" /> Approved & Live
        </span>
      );
    case "REJECTED":
      return (
        <span className="badge badge-error gap-1">
          <XCircle className="w-3 h-3" /> Rejected
        </span>
      );
    case "SOLD":
      return (
        <span className="badge badge-info gap-1">
          <BadgeCheck className="w-3 h-3" /> Sold
        </span>
      );
  }
}

export default function Resell({ investment }: { investment: Investment }) {
  const modalRef = useRef<ModalHandle>(null);
  const [askingPriceNaira, setAskingPriceNaira] = useState("");
  const queryClient = useQueryClient();

  const listingsQuery = useQuery<ApiResponseV2<ResellListing[]>>({
    queryKey: ["resell-listings"],
    queryFn: async () => {
      const resp = await apiClient.get("resell/my-listings");
      return resp.data;
    },
    enabled: investment.status === "COMPLETED",
  });

  const submitMutation = useMutation({
    mutationFn: async () => {
      const body: Record<string, number> = {};
      if (askingPriceNaira.trim()) {
        const kobo = Math.round(parseFloat(askingPriceNaira) * 100);
        if (isNaN(kobo) || kobo <= 0) throw new Error("Invalid asking price");
        body.askingPrice = kobo;
      }
      const resp = await apiClient.post(`resell/${investment.id}`, body);
      return resp.data;
    },
    onSuccess: () => {
      toast.success("Resell request submitted — awaiting admin review");
      queryClient.invalidateQueries({ queryKey: ["resell-listings"] });
      setAskingPriceNaira("");
      modalRef.current?.close();
    },
    onError: (error) => {
      toast.error(extract_message(error));
    },
  });

  const listing = (listingsQuery.data?.data?.data ?? []).find(
    (l) => l.originalInvestmentId === investment.id,
  );

  const canRequest = !listing || listing.resellStatus === "REJECTED";
  const isEligible = investment.status === "COMPLETED";

  return (
    <>
      <Modal
        ref={modalRef}
        title="Request Resell Listing"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => modalRef.current?.close()}>
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
        <div className="space-y-4">
          <div role="alert" className="alert alert-info text-sm">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <p>
              Your resell listing will be reviewed by an admin before going
              live. Once approved, other investors can purchase it and your
              wallet will be credited automatically.
            </p>
          </div>

          <fieldset className="fieldset">
            <legend className="fieldset-legend">
              Asking Price{" "}
              <span className="text-base-content/40 font-normal">
                (optional — in ₦)
              </span>
            </legend>
            <label className="input w-full">
              <span className="text-base-content/40">₦</span>
              <input
                type="number"
                min="0"
                placeholder="Leave empty to use original price"
                value={askingPriceNaira}
                onChange={(e) => setAskingPriceNaira(e.target.value)}
              />
            </label>
            <p className="fieldset-label">
              If left empty, the original property base price will be used.
            </p>
          </fieldset>
        </div>
      </Modal>

      <div className="card bg-base-100 shadow border-base-200 ring fade">
        <div className="border-b border-base-200 px-6 py-4 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-base-content/60" />
            <h3 className="text-lg font-semibold">Resell Listing</h3>
          </div>

          {!isEligible ? (
            <span className="badge badge-ghost gap-1">
              <Clock className="w-3 h-3" /> Available when fully paid
            </span>
          ) : listing &&
            (listing.resellStatus === "PENDING" ||
              listing.resellStatus === "APPROVED") ? (
            <ResellStatusBadge status={listing.resellStatus} />
          ) : canRequest ? (
            <button
              className="btn btn-outline btn-sm gap-2"
              onClick={() => modalRef.current?.open()}
            >
              <CircleDollarSign className="w-4 h-4" />
              Request Resell
            </button>
          ) : null}
        </div>

        <div className="card-body pt-4">
          {!isEligible ? (
            <p className="text-sm text-base-content/50">
              Resell is only available once your investment is fully paid
              (status: COMPLETED).
            </p>
          ) : listing ? (
            <div className="border border-base-200 rounded-box p-4 space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <p className="text-sm font-semibold">{listing.propertyTitle}</p>
                <ResellStatusBadge status={listing.resellStatus} />
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-base-content/50">Asking Price</p>
                  <p className="font-bold">{formatNaira(listing.basePrice)}</p>
                </div>
                <div>
                  <p className="text-base-content/50">Total (incl. fees)</p>
                  <p className="font-medium">
                    {formatNaira(listing.totalPrice)}
                  </p>
                </div>
                <div>
                  <p className="text-base-content/50">Submitted</p>
                  <p className="font-medium">
                    {new Date(listing.createdAt).toLocaleDateString("en-NG", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-base-content/50">Published</p>
                  <p className="font-medium">
                    {listing.published ? "Yes" : "No"}
                  </p>
                </div>
              </div>

              {listing.resellStatus === "REJECTED" && (
                <div role="alert" className="alert alert-error text-sm">
                  <XCircle className="w-4 h-4 shrink-0" />
                  <p>
                    Your listing was rejected. You may submit a new resell
                    request.
                  </p>
                </div>
              )}

              {listing.resellStatus === "SOLD" && (
                <div role="alert" className="alert alert-success text-sm">
                  <BadgeCheck className="w-4 h-4 shrink-0" />
                  <p>
                    Your property was sold and the proceeds have been credited
                    to your wallet.
                  </p>
                </div>
              )}
            </div>
          ) : listingsQuery.isLoading ? (
            <div className="flex items-center gap-2 text-sm text-base-content/50">
              <span className="loading loading-spinner loading-xs" />
              Loading resell status...
            </div>
          ) : (
            <p className="text-sm text-base-content/50">
              No resell listing submitted yet. Your investment is fully paid —
              you can list it for resale.
            </p>
          )}
        </div>
      </div>
    </>
  );
}
