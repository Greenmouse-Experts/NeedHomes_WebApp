import { createFileRoute } from "@tanstack/react-router";
import {
  MapPin,
  TrendingUp,
  ChevronLeft,
  RefreshCw,
  AlertTriangle,
  Clock,
  CalendarCheck,
  Wallet,
  Building2,
} from "lucide-react";
import ShareLink from "@/routes/investors/properties/-components/ShareLink";
import { MediaSlider } from "@/components/property/MediaSlider";
import { useMutation, useQuery } from "@tanstack/react-query";
import apiClient, { type ApiResponse } from "@/api/simpleApi";
import PageLoader from "@/components/layout/PageLoader";
import type { PROPERTY_TYPE, AdditionalFee } from "@/types/property";
import { Button } from "@/components/ui/Button";
import PageFavoriteButton from "@/components/favorites/PageFaouritebutton";
import { toast } from "sonner";
import { extract_message } from "@/helpers/apihelpers";
import { useNavigate } from "@tanstack/react-router";
import Modal from "@/components/modals/DialogModal";
import { useModal } from "@/store/modals";
import { Controller, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import AdditionalFees from "@/routes/partners/-components/Additionalfees";
import InvestmentDetails from "@/routes/dashboard/properties/$propertyId/-components/InvSpecific";
import Maps from "@/routes/investors/properties/-components/Maps";
import { LoadDocuments } from "@/routes/investors/-components/LoadDocuments";
import { RenderCustomId } from "@/routes/-components/RenderCustomId";
import RenderDescription from "@/components/RenderDescription";
import PaystackPop from "@paystack/inline-js";

const paystackInstance = new PaystackPop();

export const Route = createFileRoute(
  "/investors/properties/$propertyId/fractional/",
)({
  component: PropertyDetailPage,
});

function PropertyDetailPage() {
  const { propertyId } = Route.useParams();
  const navigate = useNavigate();
  const { ref, showModal, closeModal } = useModal();
  const [paymentMethod, setPaymentMethod] = useState<"WALLET" | "BANK_TRANSFER">("WALLET");

  const query = useQuery<ApiResponse<PROPERTY_TYPE>>({
    queryKey: ["property", propertyId],
    queryFn: async () => {
      const resp = await apiClient.get("properties/" + propertyId);
      return resp.data;
    },
  });

  const formatCurrency = (amount: number | null | undefined) => {
    if (amount === null || amount === undefined) return "N/A";
    return `₦ ${parseFloat(amount.toFixed(2)).toLocaleString()}`;
  };

  const mutate = useMutation({
    mutationFn: async (data: {
      amountPaid: number;
      quantity: number;
      selectedReturnDays: number;
    }) => {
      const resp = await apiClient.post("/investments", {
        propertyId,
        amountPaid: Math.round(data.amountPaid),
        quantity: data.quantity,
        selectedReturnDays: data.selectedReturnDays,
        paymentOption: "FULL_PAYMENT",
      });
      return resp.data;
    },
    onSuccess: (data: ApiResponse<{ id: string }>) => {
      closeModal();
      navigate({
        to: "/investors/my-investments/$investmentId",
        params: { investmentId: data.data.id },
      });
    },
  });

  const bankTransferMutation = useMutation({
    mutationFn: async (payload: { amount: number; quantity: number; selectedReturnDays: number }) => {
      const resp = await apiClient.post("/wallet/invest/initialize", {
        propertyId,
        amount: payload.amount,
        quantity: payload.quantity,
        selectedReturnDays: payload.selectedReturnDays,
      });
      return resp.data as { data: { access_code: string } };
    },
    onSuccess: (data) => {
      closeModal();
      paystackInstance.resumeTransaction(data.data.access_code, {
        onSuccess() {
          navigate({
            to: "/investors/my-investments",
          });
        },
      });
    },
  });

  const form = useForm({
    defaultValues: {
      quantity: 1,
      selectedReturnDays: 0,
    },
  });

  // Set quantity to minimumShares once property data loads
  useEffect(() => {
    const min = query.data?.data?.minimumShares;
    if (min && min > 1) form.setValue("quantity", min);
  }, [query.data]);

  return (
    <PageLoader query={query}>
      {(data) => {
        const property = data.data as PROPERTY_TYPE;

        const tierOptions = Object.entries(property.returnTiers ?? {})
          .sort((a, b) => Number(a[0]) - Number(b[0]))
          .map(([days, rate]) => ({ days: Number(days), rate }));

        const additionalFeesTotal = (property.additionalFees || []).reduce(
          (sum: number, fee: AdditionalFee) => sum + fee.amount / 100,
          0,
        );
        const quantity = form.watch("quantity");
        const selectedReturnDays = form.watch("selectedReturnDays");
        const selectedTier = tierOptions.find(
          (t) => t.days === selectedReturnDays,
        );
        const sharesTotal = quantity * (property.pricePerShare / 100);
        const fullAmount = sharesTotal + additionalFeesTotal;
        const fullAmountKobo = Math.round(fullAmount * 100);

        const expectedPayout = selectedTier
          ? Math.round(fullAmountKobo * (1 + selectedTier.rate / 100))
          : null;

        const availableShares = property.availableShares ?? 0;
        const minimumShares = property.minimumShares || 1;

        const today = new Date();
        const fmtDate = (d: Date) =>
          d.toLocaleDateString("en-NG", {
            day: "numeric",
            month: "short",
            year: "numeric",
          });
        const startDate = fmtDate(today);
        const endDate = selectedReturnDays
          ? fmtDate(
              new Date(
                today.getTime() + selectedReturnDays * 24 * 60 * 60 * 1000,
              ),
            )
          : null;

        return (
          <>
            <Modal
              ref={ref}
              title="Confirm Investment"
              actions={
                <div className="flex gap-2">
                  <Button variant="outline" onClick={closeModal}>
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => {
                      if (!selectedReturnDays) {
                        toast.error("Please select a return duration.");
                        return;
                      }
                      if (paymentMethod === "BANK_TRANSFER") {
                        return toast.promise(
                          bankTransferMutation.mutateAsync({
                            amount: fullAmountKobo,
                            quantity: form.getValues("quantity"),
                            selectedReturnDays,
                          }),
                          {
                            loading: "Initializing bank transfer...",
                            success: "Redirecting to payment...",
                            error: extract_message,
                          },
                        );
                      }
                      toast.promise(
                        mutate.mutateAsync({
                          amountPaid: fullAmountKobo,
                          quantity: form.getValues("quantity"),
                          selectedReturnDays,
                        }),
                        {
                          loading: "Processing payment...",
                          success: "Investment successful!",
                          error: extract_message,
                        },
                      );
                    }}
                    disabled={mutate.isPending || bankTransferMutation.isPending || !selectedReturnDays}
                  >
                    {paymentMethod === "BANK_TRANSFER"
                      ? `Pay via Bank Transfer ${formatCurrency(fullAmount)}`
                      : `Confirm & Pay ${formatCurrency(fullAmount)}`}
                  </Button>
                </div>
              }
            >
              <div className="space-y-4">
                {/* Payment Method Selector */}
                <div className="grid grid-cols-2 gap-2">
                  {(["WALLET", "BANK_TRANSFER"] as const).map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setPaymentMethod(method)}
                      className={`flex flex-col items-center gap-1.5 p-3 rounded-lg border-2 transition-colors text-sm font-medium ${
                        paymentMethod === method
                          ? "border-(--color-orange) bg-orange-50 text-(--color-orange)"
                          : "border-gray-200 text-gray-500 hover:border-gray-300"
                      }`}
                    >
                      {method === "WALLET" ? (
                        <Wallet className="w-5 h-5" />
                      ) : (
                        <Building2 className="w-5 h-5" />
                      )}
                      {method === "WALLET" ? "Wallet Payment" : "Bank Transfer"}
                    </button>
                  ))}
                </div>
                {/* Shares */}
                <div className="ring rounded-box fade">
                  <h2 className="p-3 border-b fade text-sm font-bold text-gray-900">
                    Shares
                  </h2>
                  <div className="p-3 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Price Per Slot
                      </span>
                      <span className="text-sm font-bold">
                        {formatCurrency(property.pricePerShare / 100)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center border-t border-gray-100 pt-2">
                      <span className="text-sm text-gray-600">
                        Available Shares
                      </span>
                      <span className="text-sm">{availableShares}</span>
                    </div>
                  </div>
                </div>

                {/* Quantity */}
                <Controller
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <div className="ring rounded-box fade">
                      <div className="p-3 border-b fade flex items-center justify-between">
                        <h2 className="text-sm font-bold text-gray-900">
                          Select Shares
                        </h2>
                        <span className="text-xs text-orange-600 font-medium bg-orange-50 px-2 py-0.5 rounded-full">
                          Min: {minimumShares} share
                          {minimumShares !== 1 ? "s" : ""}
                        </span>
                      </div>
                      <div className="p-3 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">
                            Quantity
                          </span>
                          <div className="flex items-center gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                field.value > minimumShares &&
                                field.onChange(field.value - 1)
                              }
                              disabled={field.value <= minimumShares}
                              className="px-2 py-1"
                            >
                              −
                            </Button>
                            <span className="text-sm font-bold w-8 text-center">
                              {field.value}
                            </span>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                field.value < availableShares &&
                                field.onChange(field.value + 1)
                              }
                              disabled={field.value >= availableShares}
                              className="px-2 py-1"
                            >
                              +
                            </Button>
                          </div>
                        </div>
                        <div className="flex justify-between items-center border-t border-gray-100 pt-2">
                          <span className="text-sm text-gray-600">
                            Subtotal ({field.value} shares)
                          </span>
                          <span className="text-sm font-bold">
                            {formatCurrency(
                              field.value * (property.pricePerShare / 100),
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                />
                {(property.additionalFees || []).length > 0 && (
                  <section className="rounded-lg border border-gray-200 overflow-hidden">
                    <h2 className="p-3 text-sm font-semibold border-b border-gray-200 bg-gray-100">
                      Management Fees
                    </h2>
                    <ul className="p-3 space-y-2">
                      {property.additionalFees.map((fee, idx) => (
                        <li
                          key={idx}
                          className="flex justify-between items-center"
                        >
                          <span className="text-sm text-gray-600">
                            {fee.label}
                          </span>
                          <span className="text-sm font-medium">
                            {formatCurrency(fee.amount / 100)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </section>
                )}

                {/* Return Duration */}
                <div className="ring rounded-box fade">
                  <h2 className="p-3 border-b fade text-sm font-bold text-gray-900">
                    Select Return Duration
                  </h2>
                  <div className="p-3 space-y-2">
                    {tierOptions.length === 0 ? (
                      <p className="text-xs text-gray-400 italic">
                        No return tiers available.
                      </p>
                    ) : (
                      tierOptions.map((tier) => (
                        <label
                          key={tier.days}
                          className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                            selectedReturnDays === tier.days
                              ? "border-orange-400 bg-orange-50"
                              : "border-gray-200 hover:border-orange-200"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              className="radio radio-warning radio-sm"
                              checked={selectedReturnDays === tier.days}
                              onChange={() =>
                                form.setValue("selectedReturnDays", tier.days)
                              }
                            />
                            <div>
                              <p className="text-sm font-semibold text-gray-900">
                                {tier.days} days
                              </p>
                              {selectedReturnDays === tier.days ? (
                                <p className="text-xs text-orange-600 font-medium">
                                  {startDate} → {fmtDate(new Date(today.getTime() + tier.days * 24 * 60 * 60 * 1000))}
                                </p>
                              ) : (
                                <p className="text-xs text-gray-500">
                                  Holding period:{" "}
                                  {property.fractionalHoldingPeriodDays ?? "—"}{" "}
                                  days
                                </p>
                              )}
                            </div>
                          </div>
                          <span className="text-sm font-bold text-green-600">
                            {tier.rate}% return
                          </span>
                        </label>
                      ))
                    )}
                  </div>
                </div>

                {/* Payout preview */}
                {selectedTier && expectedPayout && endDate && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-green-800 font-medium">
                        Expected payout after {selectedTier.days} days
                      </span>
                      <span className="text-sm font-bold text-green-700">
                        {formatCurrency(expectedPayout / 100)}
                      </span>
                    </div>
                    <p className="text-xs text-green-700">
                      Start: {startDate} &nbsp;·&nbsp; End: {endDate}
                    </p>
                  </div>
                )}

                {/* Fees */}
              </div>
            </Modal>

            {/* Page Header */}
            <div className="flex mb-4 flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <Button
                variant="outline"
                leftIcon={<ChevronLeft className="w-5 h-5" />}
                onClick={() => navigate({ to: "/investors/properties" })}
                className="w-full sm:w-auto"
              >
                Back to Properties
              </Button>

              <PageFavoriteButton propertyId={propertyId} />

              <Button
                variant="primary"
                rightIcon={<TrendingUp className="w-5 h-5" />}
                onClick={showModal}
                disabled={mutate.isPending}
                className="w-full sm:w-auto"
              >
                Invest Now
              </Button>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <MediaSlider
                  images={property.galleryImages || []}
                  videos={property.videos ? [property.videos] : []}
                  coverImage={property.coverImage}
                />

                <div className="p-4 md:p-6 lg:p-8">
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                          {property.propertyTitle}
                        </h1>
                        <ShareLink
                          route={`/investors/properties/${propertyId}/fractional`}
                        />
                      </div>
                      <RenderCustomId property={property} />
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="w-4 h-4 md:w-5 md:h-5 shrink-0" />
                        <span className="text-sm md:text-lg">
                          {property.location}
                        </span>
                      </div>

                      <div className="mt-3">
                        <Maps
                          location={property.location}
                          latitude={property.latitude}
                          longitude={property.longitude}
                        />
                      </div>
                    </div>
                    <div className="sm:text-right">
                      <p className="text-2xl md:text-3xl font-bold text-(--color-orange)">
                        {formatCurrency(property.basePrice / 100)}
                      </p>
                    </div>
                  </div>

                  {/* Main Content */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
                    <div className="lg:col-span-2 space-y-4 md:space-y-6">
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">
                          Description
                        </h2>
                        <RenderDescription description={property.description} />
                      </div>

                      {/* Fractional Details */}
                      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                          Investment Details
                        </h3>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-600">
                              Total Shares
                            </p>
                            <p className="text-lg font-semibold text-gray-900">
                              {property.totalShares?.toLocaleString() || "N/A"}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">
                              Price Per Slot
                            </p>
                            <p className="text-lg font-semibold text-(--color-orange)">
                              {formatCurrency(property.pricePerShare / 100)}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">
                              Minimum Shares
                            </p>
                            <p className="text-lg font-semibold text-gray-900">
                              {property.minimumShares || "N/A"}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">
                              Available Shares
                            </p>
                            <p className="text-lg font-semibold text-gray-900">
                              {availableShares}
                            </p>
                          </div>
                          {property.fractionalHoldingPeriodDays && (
                            <div className="flex items-center gap-2 col-span-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                              <Clock className="w-4 h-4 text-yellow-600 shrink-0" />
                              <div>
                                <p className="text-sm font-medium text-yellow-800">
                                  Minimum Holding Period
                                </p>
                                <p className="text-xs text-yellow-700">
                                  Hold for at least{" "}
                                  {property.fractionalHoldingPeriodDays} days to
                                  avoid early exit penalty.
                                </p>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Return Tiers */}
                        {tierOptions.length > 0 && (
                          <div>
                            <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                              <CalendarCheck className="w-4 h-4" /> Return Tiers
                            </p>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                              {tierOptions.map((tier) => (
                                <div
                                  key={tier.days}
                                  className="bg-white rounded-lg p-3 border border-blue-100 text-center"
                                >
                                  <p className="text-xs text-gray-500 mb-1">
                                    {tier.days} days
                                  </p>
                                  <p className="text-lg font-bold text-green-600">
                                    {tier.rate}%
                                  </p>
                                  <p className="text-[10px] text-gray-400">
                                    return
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <AdditionalFees fees={property.additionalFees} />
                      <LoadDocuments property_data={property} />
                    </div>

                    <div className="space-y-4 md:space-y-6">
                      <InvestmentDetails
                        type={property.investmentModel}
                        inv={property}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        );
      }}
    </PageLoader>
  );
}
