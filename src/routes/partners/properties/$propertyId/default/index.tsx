import { createFileRoute } from "@tanstack/react-router";
import { MapPin, Percent, TrendingUp } from "lucide-react";
import { MediaSlider } from "@/components/property/MediaSlider";
import { useMutation, useQuery } from "@tanstack/react-query";
import apiClient, { type ApiResponse } from "@/api/simpleApi";
import PageLoader from "@/components/layout/PageLoader";
import type { PROPERTY_TYPE } from "@/types/property";
import { toast } from "sonner";
import { extract_message } from "@/helpers/apihelpers";
import { useNavigate } from "@tanstack/react-router";
import AdditionalFees from "@/routes/partners/-components/Additionalfees";
import InvestmentDetails from "@/routes/dashboard/properties/$propertyId/-components/InvSpecific";
import PropertyEarnings from "../../-components/PropertyEarnings";
import Modal, { type ModalHandle } from "@/components/modals/DialogModal";
import { useRef } from "react";
import { RenderCustomId } from "@/routes/-components/RenderCustomId";

export const Route = createFileRoute(
  "/partners/properties/$propertyId/default/",
)({
  component: PropertyDetailPage,
});

function PropertyDetailPage() {
  const { propertyId } = Route.useParams();
  const navigate = useNavigate();
  const earningsModalRef = useRef<ModalHandle>(null);

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

  return (
    <PageLoader query={query}>
      {(data) => {
        const property = data.data as PROPERTY_TYPE;

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
                      <RenderCustomId property={property} />
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="w-4 h-4 md:w-5 md:h-5 shrink-0" />
                        <span className="text-sm md:text-lg">
                          {property.location}
                        </span>
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
                    {(property as any).systemCharges?.partnerChargePercentage >
                      0 && (
                      <button
                        onClick={() => earningsModalRef.current?.open()}
                        className="flex items-center gap-2 md:gap-3 p-3 md:p-4 bg-green-50 rounded-lg border border-green-200 hover:bg-green-100 transition-colors text-left"
                      >
                        <div className="p-2 bg-white rounded-lg shrink-0">
                          <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-green-600" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs text-gray-500 whitespace-nowrap">
                            Your Earnings
                          </p>
                          <p className="font-semibold text-sm md:text-base text-green-700 truncate">
                            View Breakdown
                          </p>
                        </div>
                      </button>
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
                                {formatCurrency(property.pricePerShare / 100)}
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

                      {/* Management Fees */}
                      <AdditionalFees fees={property.additionalFees} />

                      {/* Partner Earnings */}
                      <PropertyEarnings property={property} />
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

            <Modal ref={earningsModalRef} title="Your Earnings Breakdown">
              <PropertyEarnings property={property} />
            </Modal>
          </>
        );
      }}
    </PageLoader>
  );
}
