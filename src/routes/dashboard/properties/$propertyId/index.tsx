import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ChevronLeft, MapPin, Calendar, Package, Home } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient, { type ApiResponse } from "@/api/simpleApi";
import type { PROPERTY_TYPE } from "@/types/property";
import PageLoader from "@/components/layout/PageLoader";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/properties/$propertyId/")({
  component: PropertyDetailsPage,
});

function PropertyDetailsPage() {
  const { propertyId } = Route.useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const query = useQuery<ApiResponse<PROPERTY_TYPE>>({
    queryKey: ["admin-properties", propertyId],
    queryFn: async () => {
      let resp = await apiClient.get("/properties/" + propertyId);
      return resp.data;
    },
  });

  const publishMutation = useMutation({
    mutationFn: async (published: boolean) => {
      const resp = await apiClient.patch(
        `/admin/properties/${propertyId}/published`,
        {
          published,
        },
      );
      return resp.data;
    },
    onSuccess: (_, published) => {
      queryClient.invalidateQueries({
        queryKey: ["admin-properties", propertyId],
      });
      toast.success(
        published
          ? "Property published successfully"
          : "Property unpublished successfully",
      );
    },
    onError: () => {
      toast.error("Failed to update property status");
    },
  });

  return (
    <PageLoader query={query}>
      {(data) => {
        const property = data.data;
        const location = property.location;

        return (
          <>
            <div className="space-y-6">
              <button
                onClick={() => navigate({ to: "/dashboard/properties/listed" })}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
                <span className="font-medium">Back to Listed Properties</span>
              </button>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="relative h-96 bg-gray-200">
                  <img
                    src={property.coverImage}
                    alt={property.propertyTitle}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src =
                        'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="600"%3E%3Crect fill="%23ddd" width="800" height="600"/%3E%3C/svg%3E';
                    }}
                  />
                  <div className="absolute top-4 right-4">
                    <span
                      className={`inline-flex px-4 py-2 rounded-full text-sm font-semibold ${
                        property.published
                          ? "bg-green-500 text-white"
                          : "bg-orange-500 text-white"
                      }`}
                    >
                      {property.published ? "Published" : "Draft"}
                    </span>
                  </div>
                </div>

                <div className="p-4 md:p-6 lg:p-8">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                    <div className="flex-1">
                      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                        {property.propertyTitle}
                      </h1>
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="w-4 h-4 md:w-5 md:h-5 shrink-0" />
                        <span className="text-sm md:text-lg">{location}</span>
                      </div>
                    </div>
                    <div className="sm:text-right">
                      <p className="text-2xl md:text-3xl font-bold text-(--color-orange)">
                        ₦{property.totalPrice.toLocaleString()}
                      </p>
                      <p className="text-xs md:text-sm text-gray-500 mt-1">
                        ID: {property.id}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
                    <div className="flex items-center gap-2 md:gap-3 p-3 md:p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="p-2 bg-white rounded-lg shrink-0">
                        <Package className="w-4 h-4 md:w-5 md:h-5 text-(--color-orange)" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-gray-500">Units</p>
                        <p className="font-semibold text-sm md:text-base text-gray-900">
                          {property.availableUnits} Available
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 md:gap-3 p-3 md:p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="p-2 bg-white rounded-lg shrink-0">
                        <Home className="w-4 h-4 md:w-5 md:h-5 text-(--color-orange)" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-gray-500">Model</p>
                        <p className="font-semibold text-sm md:text-base text-gray-900">
                          {property.investmentModel.replace(/_/g, " ")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 md:gap-3 p-3 md:p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="p-2 bg-white rounded-lg shrink-0">
                        <Package className="w-4 h-4 md:w-5 md:h-5 text-(--color-orange)" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-gray-500">Size</p>
                        <p className="font-semibold text-sm md:text-base text-gray-900">
                          {property.plotSize || "N/A"}
                        </p>
                      </div>
                    </div>
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
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
                    <div className="lg:col-span-2 space-y-4 md:space-y-6">
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">
                          Description
                        </h2>
                        <p className="text-gray-600 leading-relaxed">
                          {property.description}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Basic Information
                          </h3>
                          <div className="space-y-3">
                            <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2 py-2 border-b border-gray-200">
                              <span className="text-gray-600 text-sm">
                                Property Type:
                              </span>
                              <span className="font-medium text-gray-900 text-sm">
                                {property.propertyType}
                              </span>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2 py-2 border-b border-gray-200">
                              <span className="text-gray-600 text-sm">
                                Investment Model:
                              </span>
                              <span className="font-medium text-gray-900 text-sm">
                                {property.investmentModel}
                              </span>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2 py-2">
                              <span className="text-gray-600 text-sm">
                                Development Stage:
                              </span>
                              <span className="font-medium text-gray-900 text-sm">
                                {property.developmentStage}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Pricing Details
                          </h3>
                          <div className="space-y-3">
                            <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2 py-2 border-b border-gray-200">
                              <span className="text-gray-600 text-sm">
                                Base Price:
                              </span>
                              <span className="font-medium text-gray-900 text-sm">
                                ₦{property.basePrice.toLocaleString()}
                              </span>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2 py-2 border-b border-gray-200">
                              <span className="text-gray-600 text-sm">
                                Total Price:
                              </span>
                              <span className="font-medium text-gray-900 text-sm">
                                ₦{property.totalPrice.toLocaleString()}
                              </span>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2 py-2">
                              <span className="text-gray-600 text-sm">
                                Payment Option:
                              </span>
                              <span className="font-medium text-gray-900 text-sm wrap-break-word">
                                {property.paymentOption || "N/A"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {property.additionalFees &&
                        property.additionalFees.length > 0 && (
                          <div>
                            <h2 className="text-xl font-semibold text-gray-900 mb-3">
                              Additional Fees
                            </h2>
                            <div className="bg-gray-50 rounded-lg p-4">
                              <div className="space-y-2">
                                {property.additionalFees.map((fee) => (
                                  <div
                                    key={fee.id}
                                    className="flex justify-between py-2"
                                  >
                                    <span className="text-gray-600">
                                      {fee.label}
                                    </span>
                                    <span className="font-semibold text-gray-900">
                                      ₦{fee.amount.toLocaleString()}
                                    </span>
                                  </div>
                                ))}
                                <div className="flex justify-between py-3 border-t-2 border-gray-300 mt-3">
                                  <span className="font-semibold text-gray-900">
                                    Total Fees:
                                  </span>
                                  <span className="font-bold text-lg text-(--color-orange)">
                                    ₦
                                    {property.additionalFees
                                      .reduce((sum, fee) => sum + fee.amount, 0)
                                      .toLocaleString()}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                      {property.galleryImages &&
                        property.galleryImages.length > 0 && (
                          <div>
                            <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-3">
                              Gallery
                            </h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
                              {property.galleryImages.map(
                                (image: string, index: number) => (
                                  <div
                                    key={index}
                                    className="aspect-video rounded-lg overflow-hidden bg-gray-200"
                                  >
                                    <img
                                      src={image}
                                      alt={`Gallery ${index + 1}`}
                                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                    />
                                  </div>
                                ),
                              )}
                            </div>
                          </div>
                        )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {property.certificate && (
                          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <h3 className="font-semibold mb-2">Certificate</h3>
                            <a
                              href={property.certificate}
                              target="_blank"
                              className="text-sm text-blue-600 hover:underline"
                            >
                              View Document
                            </a>
                          </div>
                        )}
                        {property.surveyPlanDocument && (
                          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <h3 className="font-semibold mb-2">Survey Plan</h3>
                            <a
                              href={property.surveyPlanDocument}
                              target="_blank"
                              className="text-sm text-blue-600 hover:underline"
                            >
                              View Document
                            </a>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4 md:space-y-6">
                      <div className="bg-gray-50 rounded-lg p-4 md:p-6 border border-gray-200">
                        <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-4">
                          Investment Details
                        </h3>
                        <div className="space-y-3">
                          <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                            <span className="text-sm text-gray-600">
                              Min. Investment:
                            </span>
                            <span className="text-sm font-medium text-gray-900">
                              ₦
                              {property.minimumInvestment?.toLocaleString() ||
                                "N/A"}
                            </span>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                            <span className="text-sm text-gray-600">
                              Exit Window:
                            </span>
                            <span className="text-sm font-medium text-gray-900">
                              {property.exitWindow}
                            </span>
                          </div>
                          {property.profitSharingRatio && (
                            <div className="pt-3 border-t border-gray-200">
                              <span className="text-sm text-gray-600">
                                Profit Sharing:
                              </span>
                              <p className="text-sm font-medium text-gray-900 mt-1">
                                {property.profitSharingRatio}
                              </p>
                            </div>
                          )}
                          <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                            <span className="text-sm text-gray-600">
                              Platform Charge:
                            </span>
                            <span className="text-sm font-medium text-gray-900">
                              {property.systemCharges.platformChargePercentage}%
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Button
                          variant="primary"
                          className="w-full text-sm md:text-base"
                          onClick={() =>
                            navigate({ to: "/dashboard/properties/listed" })
                          }
                        >
                          Edit Property
                        </Button>
                        <Button
                          variant={property.published ? "outline" : "primary"}
                          className="w-full text-sm md:text-base"
                          disabled={publishMutation.isPending}
                          onClick={() => {
                            const action = property.published
                              ? "unpublish"
                              : "publish";

                            publishMutation.mutate(!property.published);
                          }}
                        >
                          {publishMutation.isPending
                            ? "Updating..."
                            : property.published
                              ? "Unpublish Property"
                              : "Publish Property"}
                        </Button>
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
