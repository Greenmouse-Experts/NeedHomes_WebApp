import { createFileRoute } from "@tanstack/react-router";
import {
  Calendar,
  CheckCircle2,
  Home,
  MapPin,
  Package,
  Percent,
} from "lucide-react";
import { MediaSlider } from "@/components/property/MediaSlider";
import { useQuery } from "@tanstack/react-query";
import apiClient, { type ApiResponse } from "@/api/simpleApi";
import PageLoader from "@/components/layout/PageLoader";
import type { AdditionalFee, PROPERTY_TYPE } from "@/types/property";
import AdditionalFees from "../../-components/Additionalfees";

export const Route = createFileRoute("/partners/properties/$propertyId/")({
  component: PropertyDetailPage,
});

function PropertyDetailPage() {
  const { propertyId } = Route.useParams();
  const query = useQuery<ApiResponse<PROPERTY_TYPE>>({
    queryKey: ["property", propertyId],
    queryFn: async () => {
      let resp = await apiClient.get("properties/" + propertyId);
      return resp.data;
    },
  });
  const formatCurrency = (amount: number) => {
    return `₦${amount.toLocaleString()}`;
  };

  return (
    <PageLoader query={query}>
      {(data) => {
        const property = data.data;
        // Calculate total price including additional fees if they exist
        const totalPrice = property.additionalFees
          ? property.basePrice +
            property.additionalFees.reduce(
              (sum: number, fee: AdditionalFee) => sum + fee.amount,
              0,
            )
          : property.basePrice;

        return (
          <>
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
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">
                          Amenities
                        </h2>
                        {property.amenities && property.amenities.length > 0 ? (
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {property.amenities.map((amenity, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-2 text-gray-600"
                              >
                                <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                                <span className="text-sm">{amenity}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-400 italic text-sm">
                            No amenities listed
                          </p>
                        )}
                      </div>

                      {/* Features */}
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">
                          Features
                        </h2>
                        {property.features && property.features.length > 0 ? (
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {property.features.map((feature, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-2 text-gray-600"
                              >
                                <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />
                                <span className="text-sm">{feature}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-400 italic text-sm">
                            No features listed
                          </p>
                        )}
                      </div>

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
                      {property.additionalFees &&
                        property.additionalFees.length > 0 && (
                          <AdditionalFees fees={property.additionalFees} />
                        )}
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
