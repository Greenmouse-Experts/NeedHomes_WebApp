import type { ADMIN_PROPERTY_LISTING } from "@/types";

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
            value={`₦${property.pricePerPlot?.toLocaleString() || "0"}`}
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
          <DetailRow
            label="Min. Installment"
            value={`₦${(property.minimumInstallmentAmount / 100)?.toLocaleString() || "0"}`}
          />
          {/*<DetailRow
            label="Installment Duration"
            value={`${property.installmentDuration || "N/A"} Months`}
          />*/}
        </DetailsCard>
      );

    case "SAVE_TO_OWN":
      return (
        <DetailsCard>
          <DetailRow
            label="Savings Frequency"
            value={property.savingsFrequency || "N/A"}
          />
          <DetailRow
            label="Target Property Price"
            value={`₦${(property.targetPropertyPrice / 100)?.toLocaleString() || "0"}`}
          />
          <DetailRow
            label="Payment Option"
            value={property.paymentOption || "N/A"}
          />
          <DetailRow
            label="Installment Duration"
            value={`${property.installmentDuration || "N/A"} ${property.savingsFrequency || ""}`}
          />
          <DetailRow
            label="minimum installment deposit"
            value={`₦${(property.minimumInstallmentAmount / 100)?.toLocaleString() || "0"}`}
          />
        </DetailsCard>
      );

    case "CO_DEVELOPMENT":
      return (
        <DetailsCard>
          <DetailRow label="Exit Strategy" value={property.exitRule || "N/A"} />
          <DetailRow
            label="Payment Option"
            value={property.paymentOption || "N/A"}
          />
          <DetailRow
            label="Installment Duration"
            value={`${property.installmentDuration || "N/A"} Months`}
          />
          <DetailRow
            label="minimum installment deposit"
            value={`₦${(property.minimumInstallmentAmount / 100)?.toLocaleString() || "0"}`}
          />
        </DetailsCard>
      );

    case "FRACTIONAL_OWNERSHIP":
      return (
        <DetailsCard>
          <DetailRow
            label="Total Shares"
            value={property?.totalShares?.toLocaleString() || "N/A"}
          />
          <DetailRow
            label="Price Per Slot"
            value={`₦${(property?.pricePerShare / 100).toLocaleString() || "0"}`}
          />
          <DetailRow
            label="Payment Option"
            value={property?.paymentOption || "N/A"}
          />
          {/* @ts-ignore */}
          <DetailRow
            label="Platform Charge"
            value={`${property?.systemCharges?.platformChargePercentage || 0}%`}
          />
        </DetailsCard>
      );

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
