import { createFileRoute } from "@tanstack/react-router";
import {
  Calendar,
  MapPin,
  Percent,
  CheckCircle2,
  TrendingUp,
  ChevronLeft,
  RefreshCw,
  Home,
  Wallet,
  Building2,
} from "lucide-react";
import { MediaSlider } from "@/components/property/MediaSlider";
import { useMutation, useQuery } from "@tanstack/react-query";
import apiClient, { type ApiResponse } from "@/api/simpleApi";
import PageLoader from "@/components/layout/PageLoader";
import type { PROPERTY_TYPE, AdditionalFee } from "@/types/property";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";
import { extract_message } from "@/helpers/apihelpers";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import Modal from "@/components/modals/DialogModal";
import { useModal } from "@/store/modals";
import AdditionalFees from "@/routes/partners/-components/Additionalfees";
import InvestmentDetails from "@/routes/dashboard/properties/$propertyId/-components/InvSpecific";
import Maps from "@/routes/investors/properties/-components/Maps";
import { LoadDocuments } from "@/routes/investors/-components/LoadDocuments";
import ShareLink from "@/routes/investors/properties/-components/ShareLink";
import { RenderCustomId } from "@/routes/-components/RenderCustomId";
import RenderDescription from "@/components/RenderDescription";
import PaystackPop from "@paystack/inline-js";

const paystackInstance = new PaystackPop();

export const Route = createFileRoute(
  "/investors/properties/$propertyId/outright/",
)({
  component: PropertyDetailPage,
});

function PropertyDetailPage() {
  const { propertyId } = Route.useParams();
  const navigate = useNavigate();
  const { ref, showModal, closeModal } = useModal();
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<"WALLET" | "BANK_TRANSFER">("WALLET");

  const query = useQuery<ApiResponse<PROPERTY_TYPE>>({
    queryKey: ["property", propertyId],
    queryFn: async () => {
      let resp = await apiClient.get("properties/" + propertyId);
      return resp.data;
    },
  });
  const formatCurrency = (amount: number | null | undefined) => {
    if (amount === null || amount === undefined) return "N/A";
    const fixed = parseFloat(amount.toFixed(2));
    return `₦ ${fixed.toLocaleString()}`;
  };
  const mutate = useMutation({
    mutationFn: async (data: { amountPaid: number; quantity: number }) => {
      let resp = await apiClient.post("/investments", {
        propertyId: propertyId,
        amountPaid: parseFloat(data.amountPaid.toFixed()),
        quantity: data.quantity,
      });
      return resp.data;
    },
    onSuccess: (data: ApiResponse<{ id: string }>) => {
      closeModal();
      navigate({
        to: "/investors/my-investments/$investmentId",
        params: {
          investmentId: data.data.id,
        },
      });
    },
  });

  const bankTransferMutation = useMutation({
    mutationFn: async (payload: { amount: number; quantity: number }) => {
      const resp = await apiClient.post("/wallet/invest/initialize", {
        propertyId,
        amount: payload.amount,
        quantity: payload.quantity,
      });
      return resp.data as { data: { access_code: string } };
    },
    onSuccess: (data) => {
      closeModal();
      paystackInstance.resumeTransaction(data.data.access_code, {
        onSuccess() {
          navigate({ to: "/investors/my-investments" });
        },
      });
    },
  });

  return (
    <PageLoader query={query}>
      {(data) => {
        const property = data.data as PROPERTY_TYPE;
        const totalPrice =
          property.totalPrice / 100 || property.basePrice / 100;
        const additionalFeesTotal = (property.additionalFees || []).reduce(
          (sum: number, fee: AdditionalFee) => sum + fee.amount / 100,
          0,
        );
        const breakdown = {
          totalPrice,
          additionalFees: property.additionalFees || [],
          additionalFeesTotal,
        };
        const additionalFeesTotalKobo = (property.additionalFees || []).reduce(
          (sum: number, fee: AdditionalFee) => sum + fee.amount,
          0,
        );
        const pricePerUnitKobo = property.basePrice;
        const fullAmountKobo = Math.round(quantity * pricePerUnitKobo) + additionalFeesTotalKobo;
        const selectedTotal = (quantity * property.basePrice) / 100 + additionalFeesTotal;
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
                      if (paymentMethod === "BANK_TRANSFER") {
                        return toast.promise(
                          bankTransferMutation.mutateAsync({ amount: fullAmountKobo, quantity }),
                          {
                            loading: "Initializing bank transfer...",
                            success: "Redirecting to payment...",
                            error: extract_message,
                          },
                        );
                      }
                      toast.promise(
                        mutate.mutateAsync({ amountPaid: fullAmountKobo, quantity }),
                        {
                          loading: "Processing payment...",
                          success: "Payment successful!",
                          error: extract_message,
                        },
                      );
                    }}
                    disabled={mutate.isPending || bankTransferMutation.isPending || property.availableUnits === 0}
                  >
                    {paymentMethod === "BANK_TRANSFER"
                      ? `Pay via Bank Transfer ${formatCurrency(selectedTotal)}`
                      : `Confirm & Pay ${formatCurrency(selectedTotal)}`}
                  </Button>
                </div>
              }
            >
              <section>
                {/* Payment Method Selector */}
                <div className="grid grid-cols-2 gap-2 mb-4">
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
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Property</span>
                      <span className="text-sm font-semibold">
                        {property.propertyTitle}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Price per unit</span>
                      <span className="text-sm font-medium">
                        {formatCurrency(property.basePrice / 100)}
                      </span>
                    </div>

                    {/* Quantity selector */}
                    <div className="ring rounded-box overflow-hidden fade">
                      <h2 className="p-3 border-b text-sm font-bold text-gray-900">
                        Select Units
                      </h2>
                      <div className="p-3 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Quantity</span>
                          <div className="flex items-center gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                              disabled={quantity <= 1}
                              className="px-2 py-1"
                            >
                              -
                            </Button>
                            <span className="text-sm font-bold w-8 text-center">
                              {quantity}
                            </span>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                setQuantity((q) =>
                                  Math.min(property.availableUnits, q + 1),
                                )
                              }
                              disabled={quantity >= property.availableUnits}
                              className="px-2 py-1"
                            >
                              +
                            </Button>
                          </div>
                        </div>
                        <div className="flex justify-between items-center border-t pt-2 text-sm text-gray-500">
                          <span>Available</span>
                          <span>{property.availableUnits} units</span>
                        </div>
                      </div>
                    </div>

                    {breakdown.additionalFees.length > 0 && (
                      <section className="rounded-lg border border-gray-200 overflow-hidden">
                        <h2 className="p-3 text-sm font-semibold border-b border-gray-200 bg-gray-100">
                          Management Fees
                        </h2>
                        <ul className="p-3 space-y-2">
                          {breakdown.additionalFees.map((fee, idx) => (
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

                    <div className="pt-2 border-t border-gray-200 flex justify-between items-center">
                      <span className="text-sm font-bold text-gray-900">
                        Total ({quantity} unit{quantity > 1 ? "s" : ""})
                      </span>
                      <span className="text-lg font-bold text-(--color-orange)">
                        {formatCurrency(selectedTotal)}
                      </span>
                    </div>
                  </div>
                </div>
                </div>
              </section>
            </Modal>
            <div className="flex mb-4 flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <Button
                variant="outline"
                leftIcon={<ChevronLeft className="w-5 h-5" />}
                onClick={() => navigate({ to: "/investors/properties" })}
                className="w-full sm:w-auto"
              >
                Back to Properties
              </Button>

              <Button
                variant="primary"
                rightIcon={<TrendingUp className="w-5 h-5" />}
                onClick={showModal}
                disabled={mutate.isPending || bankTransferMutation.isPending || property.availableUnits === 0}
                className="w-full sm:w-auto"
              >
                {property.availableUnits === 0 ? "Sold Out" : "Invest Now"}
              </Button>
            </div>
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {/* Media Slider */}
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
                          route={`/investors/properties/${propertyId}/outright`}
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

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
                    <div className="flex items-center gap-2 md:gap-3 p-3 md:p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="p-2 bg-white rounded-lg shrink-0">
                        <Home className="w-4 h-4 md:w-5 md:h-5 text-(--color-orange)" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-gray-500 whitespace-nowrap">
                          Available Units
                        </p>
                        <p className={`font-semibold text-sm md:text-base truncate ${property.availableUnits === 0 ? "text-red-500" : "text-gray-900"}`}>
                          {property.availableUnits === 0
                            ? "Sold Out"
                            : property.availableUnits}
                        </p>
                      </div>
                    </div>
                    {property.profitSharingRatio && (
                      <div className="flex items-center gap-2 md:gap-3 p-3 md:p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="p-2 bg-white rounded-lg shrink-0">
                          <Percent className="w-4 h-4 md:w-5 md:h-5 text-(--color-orange)" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs text-gray-500 whitespace-nowrap">
                            Profit Sharing
                          </p>
                          <p className="font-semibold text-sm md:text-base text-gray-900 truncate">
                            {property.profitSharingRatio}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Main Content */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
                    <div className="lg:col-span-2 space-y-4 md:space-y-6">
                      {/* Description */}
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">
                          Description
                        </h2>
                        <RenderDescription description={property.description} />
                      </div>

                      {/* Amenities */}

                      {/* Features */}

                      {/* Investment Model Specific Information */}
                      {property.investmentModel === "FRACTIONAL_OWNERSHIP" && (
                        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Investment Details
                          </h3>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-600">
                                Total Shares
                              </p>
                              <p className="text-lg font-semibold text-gray-900">
                                {property.totalShares?.toLocaleString() ||
                                  "N/A"}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">
                                Price Per Slot
                              </p>
                              <p className="text-lg font-semibold text-(--color-orange)">
                                {formatCurrency(property.pricePerShare)}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">
                                Minimum Shares To Buy
                              </p>
                              <p className="text-lg font-semibold text-gray-900">
                                {property.minimumShares || "N/A"}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">
                                Exit Window
                              </p>
                              <p className="text-lg font-semibold text-gray-900">
                                {property.exitWindow || "N/A"}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* System Charges */}

                      {/* Management Fees */}
                      <AdditionalFees fees={property.additionalFees} />
                      <LoadDocuments property_data={property} />
                    </div>

                    {/* Sidebar */}
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
