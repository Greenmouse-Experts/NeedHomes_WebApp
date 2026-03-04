import type { ADMIN_PROPERTY_LISTING } from "@/types";
const keys = [
  "FRACTIONAL_OWNERSHIP",
  "OUTRIGHT_PURCHASE",
  "CO_DEVELOPMENT",
  "LAND_BANKING",
  "SAVE_TO_OWN",
] as const;

export default function InvestmentDetails({
  type,
  inv: property,
}: {
  type: (typeof keys)[number];
  inv: ADMIN_PROPERTY_LISTING;
}) {
  // return <>loso</>;
  switch (type) {
    case "LAND_BANKING":
      return (
        <div>
          <div className="bg-gray-50 rounded-lg p-4 md:p-6 border border-gray-200">
            <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-4">
              Investment Details
            </h3>
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                <span className="text-sm text-gray-600">Plot Size (sqm):</span>
                <span className="text-sm font-medium text-gray-900">
                  {property.plotSize || 0}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                <span className="text-sm text-gray-600">Price Per Plot:</span>
                <span className="text-sm font-medium text-gray-900">
                  ₦{property.pricePerPlot?.toLocaleString() || "0"}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                <span className="text-sm text-gray-600">
                  Holding Period (Months):
                </span>
                <span className="text-sm font-medium text-gray-900">
                  {property.holdingPeriod || 0}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                <span className="text-sm text-gray-600">
                  Include Buy-Back Option (Guaranteed Exit):
                </span>
                <span className="text-sm font-medium text-gray-900">
                  {property.buyBackOption ? "Yes" : "No"}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                <span className="text-sm text-gray-600">Payment Option:</span>
                <span className="text-sm font-medium text-gray-900">
                  {property.paymentOption || "N/A"}
                </span>
              </div>
            </div>
          </div>
        </div>
      );
    case "OUTRIGHT_PURCHASE":
      return (
        <>
          <div>
            <div className="bg-gray-50 rounded-lg p-4 md:p-6 border border-gray-200">
              <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-4">
                Investment Details
              </h3>
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                  <span className="text-sm text-gray-600">Payment Option:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {property.paymentOption || "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </>
      );
    case "SAVE_TO_OWN":
      return (
        <>
          <div>
            <div className="bg-gray-50 rounded-lg p-4 md:p-6 border border-gray-200">
              <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-4">
                Investment Details
              </h3>
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                  <span className="text-sm text-gray-600">Duration:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {property.duration || "N/A"} Months
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                  <span className="text-sm text-gray-600">
                    Min. Investment:
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                    ₦
                    {(property.minimumInvestment / 100)?.toLocaleString() ||
                      "0"}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                  <span className="text-sm text-gray-600">
                    Target Property Price:
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                    ₦
                    {(property.targetPropertyPrice / 100)?.toLocaleString() ||
                      "0"}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                  <span className="text-sm text-gray-600">Payment Option:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {property.paymentOption || "N/A"}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                  <span className="text-sm text-gray-600">
                    Installment Duration:
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                    {property.installmentDuration || "N/A"} Months
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                  <span className="text-sm text-gray-600">
                    Minimum Installment Amount:
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                    ₦
                    {(
                      property.minimumInstallmentAmount / 100
                    )?.toLocaleString() || "0"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </>
      );
    case "CO_DEVELOPMENT":
      return (
        <>
          <div>
            <div className="bg-gray-50 rounded-lg p-4 md:p-6 border border-gray-200">
              <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-4">
                Investment Details
              </h3>
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                  <span className="text-sm text-gray-600">Profit Ratio:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {property.profitRatio || 0}%
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                  <span className="text-sm text-gray-600">Duration:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {property.duration || "N/A"} Months
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                  <span className="text-sm text-gray-600">
                    Min. Investment:
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                    ₦
                    {(property.minimumInvestment / 100)?.toLocaleString() ||
                      "0"}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                  <span className="text-sm text-gray-600">Exit Strategy:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {property.exitStrategy || "N/A"}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                  <span className="text-sm text-gray-600">Payment Option:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {property.paymentOption || "N/A"}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                  <span className="text-sm text-gray-600">
                    Installment Duration:
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                    {property.installmentDuration || "N/A"} Months
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                  <span className="text-sm text-gray-600">
                    Minimum Installment Amount:
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                    ₦
                    {(
                      property.minimumInstallmentAmount / 100
                    )?.toLocaleString() || "0"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </>
      );
    case "FRACTIONAL_OWNERSHIP":
      return (
        <div>
          <div className="bg-gray-50 rounded-lg p-4 md:p-6 border border-gray-200">
            <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-4">
              Investment Details
            </h3>
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                <span className="text-sm text-gray-600">Total Shares:</span>
                <span className="text-sm font-medium text-gray-900">
                  {property.totalShares?.toLocaleString() || "N/A"}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                <span className="text-sm text-gray-600">Price Per Share:</span>
                <span className="text-sm font-medium text-gray-900">
                  ₦{(property?.pricePerShare / 100).toLocaleString() || "0"}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                <span className="text-sm text-gray-600">Payment Option:</span>
                <span className="text-sm font-medium text-gray-900">
                  {property.paymentOption || "N/A"}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                <span className="text-sm text-gray-600">Platform Charge:</span>
                <span className="text-sm font-medium text-gray-900">
                  {/*//@ts-ignore*/}
                  {property.systemCharges?.platformChargePercentage || 0}%
                </span>
              </div>
            </div>
          </div>
        </div>
      );
    default:
      return (
        <div>
          <div className="bg-gray-50 rounded-lg p-4 md:p-6 border border-gray-200">
            <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-4">
              Investment Details
            </h3>
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                <span className="text-sm text-gray-600">Min. Investment:</span>
                <span className="text-sm font-medium text-gray-900">
                  ₦{property.minimumInvestment?.toLocaleString() || "N/A"}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                <span className="text-sm text-gray-600">Exit Window:</span>
                <span className="text-sm font-medium text-gray-900">
                  {property.exitWindow}
                </span>
              </div>
              {property.profitSharingRatio && (
                <div className="pt-3 border-t border-gray-200">
                  <span className="text-sm text-gray-600">Profit Sharing:</span>
                  <p className="text-sm font-medium text-gray-900 mt-1">
                    {property.profitSharingRatio}
                  </p>
                </div>
              )}
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                <span className="text-sm text-gray-600">Platform Charge:</span>
                <span className="text-sm font-medium text-gray-900">
                  {/*//@ts-ignore*/}
                  {property.systemCharges?.platformChargePercentage || 0}%
                </span>
              </div>
            </div>
          </div>
        </div>
      );
  }
}
