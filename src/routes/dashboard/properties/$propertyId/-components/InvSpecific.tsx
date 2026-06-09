import type { ADMIN_PROPERTY_LISTING } from "@/types";

const fmtDate = (value?: string | null) =>
  value
    ? new Date(value).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "N/A";

const keys = [
  "FRACTIONAL_OWNERSHIP",
  "OUTRIGHT_PURCHASE",
  "CO_DEVELOPMENT",
  "LAND_BANKING",
  "SAVE_TO_OWN",
] as const;

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
      <span className="text-sm text-gray-600">{label}</span>
      <span className="text-sm font-medium text-gray-900">{value}</span>
    </div>
  );
}

function DetailsCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-gray-50 rounded-lg p-4 md:p-6 border border-gray-200">
      <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-4">
        Investment Details
      </h3>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

export default function InvestmentDetails({
  type,
  inv: property,
}: {
  type: (typeof keys)[number];
  inv: ADMIN_PROPERTY_LISTING;
}) {
  switch (type) {
    case "LAND_BANKING":
      return (
        <DetailsCard>
          <DetailRow
            label="Available Plots"
            value={property.availablePlots || 0}
          />
          <DetailRow
            label="Price Per Plot"
            value={`₦${(property?.pricePerPlot ? property.pricePerPlot / 100 : 0)?.toLocaleString()}`}
          />
          <DetailRow
            label="Holding Period (Months)"
            value={property.holdingPeriod || "N/A"}
          />
          <DetailRow
            label="Buy-Back Option (Guaranteed Exit)"
            value={property.buyBackOption ? "Yes" : "No"}
          />
          <DetailRow
            label="Payment Option"
            value={property.paymentOption || "N/A"}
          />
        </DetailsCard>
      );

    case "OUTRIGHT_PURCHASE":
      return (
        <DetailsCard>
          <DetailRow
            label="Payment Option"
            value={property.paymentOption || "N/A"}
          />
          {/*<DetailRow
            label="Min. Installment"
            value={`₦${(property.minimumInstallmentAmount / 100)?.toLocaleString() || "0"}`}
          />
          <DetailRow
            label="Installment Duration"
            value={`${property.installmentDuration || "N/A"} Months`}
          />*/}
        </DetailsCard>
      );

    case "SAVE_TO_OWN":
      return (
        <DetailsCard>
          {/*<DetailRow
            label="Savings Frequency"
            value={property.savingsFrequency || "N/A"}
          />*/}
          <DetailRow
            label="Target Property Price"
            value={`₦${(property.totalPrice / 100)?.toLocaleString() || "0"}`}
          />
          <DetailRow
            label="Payment Option"
            value={property.paymentOption || "N/A"}
          />
          {/*<DetailRow
            label="Savings Duration"
            value={`${property.paymentDuration || "N/A"} `}
          />*/}
          {/*<DetailRow
            label="minimum installment deposit"
            value={`₦${(property.minimumInstallmentAmount / 100)?.toLocaleString() || "0"}`}
          />*/}
        </DetailsCard>
      );

    case "CO_DEVELOPMENT":
      return (
        <DetailsCard>
          <DetailRow label="Exit Strategy" value={property.exitRule || "N/A"} />
          {/*<DetailRow
            label="Payment Option"
            value={property.paymentOption || "N/A"}
          />*/}
          {/*<DetailRow
            label="Installment Duration"
            value={`${property.installmentDuration || "N/A"} Months`}
          />*/}
          <DetailRow
            label="minimum installment deposit"
            value={`${property.minimumFirstPaymentPercentage || "0"}%`}
          />
          <DetailRow
            label="Project Start Date"
            value={fmtDate((property as any).projectStartDate)}
          />
          <DetailRow
            label="Project End Date"
            value={fmtDate((property as any).projectEndDate)}
          />
        </DetailsCard>
      );

    case "FRACTIONAL_OWNERSHIP": {
      const tiers = property?.returnTiers
        ? Object.entries(property.returnTiers).sort(
            (a, b) => Number(a[0]) - Number(b[0]),
          )
        : [];
      return (
        <DetailsCard>
          <DetailRow
            label="Total Shares"
            value={property?.totalShares?.toLocaleString() || "N/A"}
          />
          <DetailRow
            label="Price Per Share"
            value={`₦${((property?.pricePerShare ?? 0) / 100).toLocaleString()}`}
          />
          <DetailRow
            label="Min. Shares"
            value={property?.minimumShares?.toLocaleString() || "N/A"}
          />
          <DetailRow
            label="Holding Period"
            value={
              property?.fractionalHoldingPeriodDays
                ? `${property.fractionalHoldingPeriodDays} days`
                : "N/A"
            }
          />
          {tiers.length > 0 ? (
            <div className="pt-2">
              <span className="text-sm text-gray-600 block mb-2">
                Return Tiers
              </span>
              <div className="grid grid-cols-2 gap-2">
                {tiers.map(([days, rate]) => (
                  <div
                    key={days}
                    className="bg-white border border-gray-200 rounded-lg p-2 text-center"
                  >
                    <p className="text-xs text-gray-500">{days} days</p>
                    <p className="text-sm font-bold text-green-600">{rate}%</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <DetailRow label="Return Tiers" value="N/A" />
          )}
          <DetailRow
            label="Payment Option"
            value={property?.paymentOption || "N/A"}
          />
        </DetailsCard>
      );
    }

    default:
      return (
        <DetailsCard>
          <DetailRow
            label="Min. Investment"
            value={`₦${property.minimumInvestment?.toLocaleString() || "N/A"}`}
          />
          <DetailRow label="Exit Window" value={property.exitWindow} />
          {property.profitSharingRatio && (
            <div className="pt-3 border-t border-gray-200">
              <span className="text-sm text-gray-600">Profit Sharing:</span>
              <p className="text-sm font-medium text-gray-900 mt-1">
                {property.profitSharingRatio}
              </p>
            </div>
          )}
          {/* @ts-ignore */}
          <DetailRow
            label="Platform Charge"
            value={`${property.systemCharges?.platformChargePercentage || 0}%`}
          />
        </DetailsCard>
      );
  }
}
