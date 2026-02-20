import { createFileRoute } from "@tanstack/react-router";
import {
  Calendar,
  MapPin,
  Percent,
  CheckCircle2,
  TrendingUp,
  ChevronLeft,
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
import Modal from "@/components/modals/DialogModal";
import { useModal } from "@/store/modals";
import SimpleInput from "@/simpleComps/inputs/SimpleInput";
import { useForm, FormProvider } from "react-hook-form";
import AdditionalFees from "@/routes/partners/-components/Additionalfees";

export const Route = createFileRoute(
  "/investors/properties/$propertyId/outright/",
)({
  component: PropertyDetailPage,
});

function PropertyDetailPage() {
  const { propertyId } = Route.useParams();
  const navigate = useNavigate();
  const { ref, showModal, closeModal } = useModal();

  const query = useQuery<ApiResponse<PROPERTY_TYPE>>({
    queryKey: ["property", propertyId],
    queryFn: async () => {
      let resp = await apiClient.get("properties/" + propertyId);
      return resp.data;
    },
  });
  const formatCurrency = (amount: number | null | undefined) => {
    if (amount === null || amount === undefined) return "N/A";
    return `₦${amount.toLocaleString()}`;
  };
  const mutate = useMutation({
    mutationFn: async (data: { amountPaid: number; quantity: number }) => {
      let resp = await apiClient.post("/investments", {
        propertyId: propertyId,
        amountPaid: data.amountPaid,
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

  const mutateIns = useMutation({
    mutationFn: async (data: { amountPaid: number; quantity: number }) => {
      let resp = await apiClient.post(
        "/investments/installments/:paymentId/pay",
        {
          propertyId: propertyId,
          amountPaid: data.amountPaid,
          quantity: data.quantity,
        },
      );
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

  const onSubmit = (data: { amountPaid: number; quantity: number }) => {
    toast.promise(mutate.mutateAsync(data), {
      loading: "Investing...",
      success: "Investment successful!",
      error: extract_message,
    });
  };
  interface OUTRIGHTDATA {
    paymentOption: "FULL_PAYMENT" | "INSTALLMENT";
    minimumInstallmentAmount?: number;
    installmentDuraion?: number;
  }
  return (
    <PageLoader query={query}>
      {(data) => {
        const property = data.data as PROPERTY_TYPE & OUTRIGHTDATA;

        // Calculate total price including additional fees if they exist
        const totalPrice = property.totalPrice || property.basePrice;
        const percentage_totalPrice = (2 / 100) * totalPrice;
        let breakdown: {
          totalPrice: number;
          additionalFees: AdditionalFee[];
          additionalFeesTotal: number;
          installmentAmount?: number;
          installmentDuration?: number;
        } = {
          totalPrice: totalPrice + percentage_totalPrice,
          additionalFees: property.additionalFees || [],
          additionalFeesTotal: (property.additionalFees || []).reduce(
            (sum: number, fee: AdditionalFee) => sum + fee.amount,
            0,
          ),
        };

        if (property.paymentOption === "INSTALLMENT") {
          breakdown.installmentAmount = property.minimumInvestmentAmount;
          //@ts-ignore
          breakdown.installmentDuration = property.installmentDuration;
        }
        const payOption = property.paymentOption;

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
                      if (payOption == "INSTALLMENT") {
                        return toast.promise(
                          mutate.mutateAsync({
                            amountPaid: property.minimumInstallmentAmount,
                            quantity: 1,
                          }),
                          {
                            loading: "Processing payment...",
                            success: "Payment successful!",
                            error: extract_message,
                          },
                        );
                      }
                      toast.promise(
                        mutate.mutateAsync({
                          amountPaid: breakdown.totalPrice,
                          quantity: 1,
                        }),
                        {
                          loading: "Processing payment...",
                          success: "Payment successful!",
                          error: extract_message,
                        },
                      );
                    }}
                    disabled={mutate.isPending}
                  >
                    Confirm & Pay{" "}
                    {payOption == "INSTALLMENT"
                      ? property.minimumInstallmentAmount?.toLocaleString()
                      : breakdown.totalPrice.toLocaleString()}
                  </Button>
                </div>
              }
            >
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Property</span>
                    <span className="text-sm font-semibold">
                      {property.propertyTitle}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Base Price</span>
                    <span className="text-sm font-medium">
                      {formatCurrency(property.basePrice / 100)}
                    </span>
                  </div>
                  {breakdown.additionalFees.map((fee, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center"
                    >
                      <span className="text-sm text-gray-600">{fee.label}</span>
                      <span className="text-sm font-medium">
                        {formatCurrency(fee.amount)}
                      </span>
                    </div>
                  ))}
                  <div className="pt-2 border-t border-gray-200 flex justify-between items-center">
                    <span className="text-sm font-bold text-gray-900">
                      Total Due
                    </span>
                    <span className="text-lg font-bold text-(--color-orange)">
                      {formatCurrency(
                        (totalPrice +
                          breakdown.additionalFeesTotal +
                          percentage_totalPrice) /
                          100,
                      )}
                    </span>
                  </div>
                </div>

                {property.paymentOption === "INSTALLMENT" && (
                  <div className="p-3 bg-blue-50 rounded border border-blue-100">
                    <p className="text-xs text-blue-700">
                      You are paying the minimum installment of{" "}
                      <span className="font-bold">
                        {property.minimumInstallmentAmount?.toLocaleString()}
                      </span>
                      . Remaining balance will be spread over{" "}
                      {property.installmentDuration} months.
                    </p>
                  </div>
                )}
              </div>
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
                onClick={() => {
                  const amountToPay =
                    property.paymentOption === "INSTALLMENT"
                      ? property.minimumInvestmentAmount ||
                        property.minimumInvestment ||
                        totalPrice
                      : totalPrice + breakdown.additionalFeesTotal;

                  // methods.setValue("amountPaid", amountToPay);
                  // methods.setValue("quantity", 1);
                  showModal();
                }}
                disabled={mutate.isPending}
                className="w-full sm:w-auto"
              >
                Invest Now
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
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="w-4 h-4 md:w-5 md:h-5 shrink-0" />
                        <span className="text-sm md:text-lg">
                          {property.location}
                        </span>
                      </div>
                    </div>
                    <div className="sm:text-right">
                      <p className="text-2xl md:text-3xl font-bold text-(--color-orange)">
                        {formatCurrency(totalPrice)}
                      </p>
                      <p className="text-xs md:text-sm text-gray-500 mt-1">
                        SKU: {property.id}
                      </p>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
                    <div className="flex items-center gap-2 md:gap-3 p-3 md:p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="p-2 bg-white rounded-lg shrink-0">
                        <Calendar className="w-4 h-4 md:w-5 md:h-5 text-(--color-orange)" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-gray-500 whitespace-nowrap">
                          Completion
                        </p>
                        <p className="font-semibold text-sm md:text-base text-gray-900 truncate">
                          {new Date(
                            property.completionDate,
                          ).toLocaleDateString()}
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
                        <p className="text-gray-600 leading-relaxed">
                          {property.description}
                        </p>
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
                                Price Per Share
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
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                          System Charges
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-600">
                              Platform Charge
                            </p>
                            <p className="text-lg font-semibold text-gray-900">
                              {property.systemCharges.platformChargePercentage}%
                            </p>
                          </div>
                          {/*<div>
                            <p className="text-sm text-gray-600">
                              Partner Charge
                            </p>
                            <p className="text-lg font-semibold text-gray-900">
                              {property.systemCharges.partnerChargePercentage}%
                            </p>
                          </div>*/}
                        </div>
                      </div>

                      {/* Additional Fees */}
                      <AdditionalFees fees={property.additionalFees} />
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-4 md:space-y-6">
                      <div className="bg-gray-50 rounded-lg p-4 md:p-6 border border-gray-200">
                        <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-4">
                          Property Information
                        </h3>
                        <div className="space-y-3">
                          <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                            <span className="text-sm text-gray-600">
                              Property Type:
                            </span>
                            <span className="text-sm font-medium text-gray-900">
                              {property.propertyType}
                            </span>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                            <span className="text-sm text-gray-600">
                              Investment Model:
                            </span>
                            <span className="text-sm font-medium text-gray-900">
                              {property.investmentModel.replace(/_/g, " ")}
                            </span>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                            <span className="text-sm text-gray-600">
                              Development Stage:
                            </span>
                            <span className="text-sm font-medium text-gray-900">
                              {property.developmentStage}
                            </span>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                            <span className="text-sm text-gray-600">
                              Available Units:
                            </span>
                            <span className="text-sm font-medium text-gray-900">
                              {property.availableUnits}
                            </span>
                          </div>
                          {property.projectDuration && (
                            <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                              <span className="text-sm text-gray-600">
                                Project Duration:
                              </span>
                              <span className="text-sm font-medium text-gray-900">
                                {property.projectDuration}
                              </span>
                            </div>
                          )}
                          {property.exitRule && (
                            <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                              <span className="text-sm text-gray-600">
                                Exit Rule:
                              </span>
                              <span className="text-sm font-medium text-gray-900">
                                {property.exitRule}
                              </span>
                            </div>
                          )}
                          {property.paymentOption && (
                            <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                              <span className="text-sm text-gray-600">
                                Payment Option:
                              </span>
                              <span className="text-sm font-medium text-gray-900">
                                {property.paymentOption.replace(/_/g, " ")}
                              </span>
                            </div>
                          )}
                          {property.installmentDuration && (
                            <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                              <span className="text-sm text-gray-600">
                                Installment Duration:
                              </span>
                              <span className="text-sm font-medium text-gray-900">
                                {property.installmentDuration} months
                              </span>
                            </div>
                          )}
                          {property.minimumInvestment && (
                            <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                              <span className="text-sm text-gray-600">
                                Min. Investment:
                              </span>
                              <span className="text-sm font-medium text-gray-900">
                                {formatCurrency(property.minimumInvestment)}
                              </span>
                            </div>
                          )}
                          {property.plotSize && (
                            <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                              <span className="text-sm text-gray-600">
                                Plot Size:
                              </span>
                              <span className="text-sm font-medium text-gray-900">
                                {property.plotSize}
                              </span>
                            </div>
                          )}
                          {property.pricePerPlot && (
                            <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                              <span className="text-sm text-gray-600">
                                Price Per Plot:
                              </span>
                              <span className="text-sm font-medium text-gray-900">
                                {formatCurrency(property.pricePerPlot)}
                              </span>
                            </div>
                          )}
                          {property.holdingPeriod && (
                            <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                              <span className="text-sm text-gray-600">
                                Holding Period:
                              </span>
                              <span className="text-sm font-medium text-gray-900">
                                {property.holdingPeriod} months
                              </span>
                            </div>
                          )}
                          {property.buyBackOption !== null && (
                            <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                              <span className="text-sm text-gray-600">
                                Buy-Back Option:
                              </span>
                              <span className="text-sm font-medium text-gray-900">
                                {property.buyBackOption ? "Yes" : "No"}
                              </span>
                            </div>
                          )}
                          {property.savingsFrequency && (
                            <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                              <span className="text-sm text-gray-600">
                                Savings Frequency:
                              </span>
                              <span className="text-sm font-medium text-gray-900">
                                {property.savingsFrequency.replace(/_/g, " ")}
                              </span>
                            </div>
                          )}
                          {property.savingsDuration && (
                            <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                              <span className="text-sm text-gray-600">
                                Savings Duration:
                              </span>
                              <span className="text-sm font-medium text-gray-900">
                                {property.savingsDuration} months
                              </span>
                            </div>
                          )}
                          {property.targetPropertyPrice && (
                            <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                              <span className="text-sm text-gray-600">
                                Target Property Price:
                              </span>
                              <span className="text-sm font-medium text-gray-900">
                                {formatCurrency(property.targetPropertyPrice)}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
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
