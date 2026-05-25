import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import {
  RefreshCw,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  BadgeCheck,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";
import apiClient from "@/api/simpleApi";
import { extract_message } from "@/helpers/apihelpers";
import Modal, { type ModalHandle } from "@/components/modals/DialogModal";
import { Button } from "@/components/ui/Button";
import { NairaIcon } from "@/components/NairaIcon";
import { InputNumberFormat } from "@react-input/number-format";

interface PricingData {
  minPrice: number;
  maxPrice: number;
  roi: number;
  units: number;
}

interface Investment {
  id: string;
  status: "ACTIVE" | "PENDING" | "COMPLETED";
  amountPaid: number;
  propertyId: string;
  currentValue: number;
  sharesBought?: number | null;
  unitsBought?: number | null;
  property?: {
    pricePerShare?: number | null;
    pricePerPlot?: number | null;
  } | null;
}

type ResellStatus = "PENDING" | "APPROVED" | "REJECTED" | "SOLD";

interface ResellSlot {
  id: string;
  originalInvestmentId: string;
  units: number;
  soldUnits: number;
  status: ResellStatus;
  rejectionReason: string | null;
  createdAt: string;
  property: {
    id: string;
    propertyTitle: string;
    investmentModel: string;
    coverImage: string;
  };
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
  const [askingPriceDisplay, setAskingPriceDisplay] = useState("");
  const queryClient = useQueryClient();

  const parsePrice = (formatted: string) =>
    parseFloat(formatted.replace(/,/g, "").trim()) || 0;

  const isEligible = investment.status === "COMPLETED";

  const listingsQuery = useQuery<{ data: { data: ResellSlot[] } }>({
    queryKey: ["resell-listings"],
    queryFn: async () => {
      const resp = await apiClient.get("resell/my-listings");
      return resp.data;
    },
    enabled: isEligible,
  });

  const listing = (listingsQuery.data?.data?.data ?? []).find(
    (l) => l.originalInvestmentId === investment.id,
  );

  const canRequest = !listing || listing.status === "REJECTED";

  const pricingQuery = useQuery<{ data: PricingData }>({
    queryKey: ["resell-pricing", investment.id],
    queryFn: async () => {
      const resp = await apiClient.get(`resell/pricing/${investment.id}`);
      return resp.data;
    },
    enabled: isEligible && canRequest,
  });

  const pricing = pricingQuery.data?.data;

  const submitMutation = useMutation({
    mutationFn: async () => {
      const body: Record<string, number> = {};
      if (askingPriceDisplay.trim()) {
        const kobo = Math.round(parsePrice(askingPriceDisplay) * 100);
        if (kobo <= 0) throw new Error("Invalid asking price");
        if (pricing) {
          if (kobo < pricing.minPrice)
            throw new Error(`Asking price must be at least ${formatNaira(pricing.minPrice)}`);
          if (kobo > pricing.maxPrice)
            throw new Error(`Asking price cannot exceed ${formatNaira(pricing.maxPrice)}`);
        }
        body.askingPrice = kobo;
      }
      const resp = await apiClient.post(`resell/${investment.id}`, body);
      return resp.data;
    },
    onSuccess: () => {
      toast.success("Resell request submitted — awaiting admin review");
      queryClient.invalidateQueries({ queryKey: ["resell-listings"] });
      setAskingPriceDisplay("");
      modalRef.current?.close();
    },
    onError: (error) => {
      toast.error(extract_message(error));
    },
  });

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
              disabled={pricingQuery.isLoading}
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

          {pricingQuery.isLoading ? (
            <div className="flex items-center gap-2 text-sm text-base-content/50">
              <span className="loading loading-spinner loading-xs" />
              Loading pricing…
            </div>
          ) : pricing ? (
            <div className="grid grid-cols-4 gap-2 text-sm bg-base-200 rounded-box p-3">
              <div>
                <p className="text-base-content/50 text-xs uppercase tracking-wide">Min Price</p>
                <p className="font-semibold">{formatNaira(pricing.minPrice)}</p>
              </div>
              <div>
                <p className="text-base-content/50 text-xs uppercase tracking-wide">Max Price</p>
                <p className="font-semibold">{formatNaira(pricing.maxPrice)}</p>
              </div>
              <div>
                <p className="text-base-content/50 text-xs uppercase tracking-wide">ROI</p>
                <p className={`font-bold flex items-center gap-1 ${pricing.roi >= 0 ? "text-success" : "text-error"}`}>
                  <TrendingUp className="w-3 h-3" />
                  {pricing.roi >= 0 ? "+" : ""}{pricing.roi.toFixed(2)}%
                </p>
              </div>
              <div>
                <p className="text-base-content/50 text-xs uppercase tracking-wide">Units</p>
                <p className="font-semibold">{pricing.units}</p>
              </div>
            </div>
          ) : null}

          <fieldset className="fieldset">
            <legend className="fieldset-legend">
              Asking Price{" "}
              <span className="text-base-content/40 font-normal">(in ₦)</span>
            </legend>
            <label className="input w-full">
              <span className="text-base-content/40">₦</span>
              <InputNumberFormat
                className="w-full bg-transparent outline-none"
                locales="en-NG"
                format="decimal"
                maximumFractionDigits={2}
                groupDisplay
                placeholder={
                  pricing
                    ? `${(pricing.minPrice / 100).toLocaleString()} – ${(pricing.maxPrice / 100).toLocaleString()}`
                    : "Enter amount"
                }
                value={askingPriceDisplay}
                onChange={(e) => setAskingPriceDisplay(e.target.value)}
              />
            </label>
            <p className="fieldset-label">
              {pricing
                ? `Must be between ${formatNaira(pricing.minPrice)} and ${formatNaira(pricing.maxPrice)}.`
                : "Pricing is loading…"}
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
            (listing.status === "PENDING" || listing.status === "APPROVED") ? (
            <ResellStatusBadge status={listing.status} />
          ) : canRequest ? (
            <button
              className="btn btn-outline btn-sm gap-2"
              onClick={() => modalRef.current?.open()}
            >
              <NairaIcon className="w-4 h-4" />
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
                <p className="text-sm font-semibold">{listing.property.propertyTitle}</p>
                <ResellStatusBadge status={listing.status} />
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-base-content/50">Units</p>
                  <p className="font-bold">{listing.soldUnits} / {listing.units} sold</p>
                </div>
                <div>
                  <p className="text-base-content/50">Model</p>
                  <p className="font-medium">
                    {listing.property.investmentModel.replace(/_/g, " ")}
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
              </div>

              {listing.status === "REJECTED" && (
                <div role="alert" className="alert alert-error text-sm">
                  <XCircle className="w-4 h-4 shrink-0" />
                  <div>
                    <p>Your listing was rejected. You may submit a new resell request.</p>
                    {listing.rejectionReason && (
                      <p className="text-xs mt-1 opacity-80">Reason: {listing.rejectionReason}</p>
                    )}
                  </div>
                </div>
              )}

              {listing.status === "SOLD" && (
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
