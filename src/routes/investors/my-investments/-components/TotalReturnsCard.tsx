import { TrendingUp } from "lucide-react";
import { formatCurrency } from "../../../../helpers/currency";

interface Investment {
  id: string;
  userId: string;
  propertyId: string;
  amountPaid: number;
  unitsBought: number;
  sharesBought: number | null;
  selectedReturnDays: number | null;
  investmentStartDate: string | null;
  investmentEndDate: string | null;
  paymentOption: string;
  status: "ACTIVE" | "PENDING" | "COMPLETED";
  createdAt: string;
  property: {
    basePrice: number;
    id: string;
    investmentModel: string;
    propertyType: string;
    propertyTitle: string;
    returnTiers: Record<string, number> | null;
    fractionalHoldingPeriodDays: number | null;
    pricePerShare: number | null;
  };
  updatedAt: string;
  deletedAt: string | null;
  currentValue: number;
  lastValuationDate: string | null;
  returnPercentage: number;
  totalAmount: number;
  totalReturns: number;
}

export default function TotalReturnCard(props: { investment: Investment }) {
  const { investment } = props;
  const isFractional =
    investment.property.investmentModel === "FRACTIONAL_OWNERSHIP";

  if (!isFractional) return null;

  const { selectedReturnDays, amountPaid, totalReturns, property } = investment;
  const returnTiers = property.returnTiers;

  const tierPct =
    selectedReturnDays && returnTiers
      ? (returnTiers[selectedReturnDays.toString()] ?? null)
      : null;

  const expectedReturn =
    tierPct != null ? Math.round(amountPaid * (tierPct / 100)) : null;

  const displayReturn =
    totalReturns > 0 ? totalReturns : (expectedReturn ?? 0);

  const isExpected = totalReturns === 0 && expectedReturn != null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
      <div className="p-2 bg-green-50 rounded-lg w-fit mb-3">
        <TrendingUp className="w-4 h-4 text-green-600" />
      </div>

      <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-1">
        {isExpected ? "Expected Returns" : "Total Returns"}
      </p>

      <p className="text-xl font-bold text-green-600">
        {formatCurrency(displayReturn)}
      </p>

      {tierPct != null && (
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="badge badge-success badge-sm gap-1">
            <TrendingUp className="w-3 h-3" />
            {tierPct}% return rate
          </span>
          {selectedReturnDays && (
            <span className="badge badge-ghost badge-sm">
              {selectedReturnDays}-day hold
            </span>
          )}
        </div>
      )}

      {isExpected && (
        <p className="text-xs text-gray-400 mt-2">
          Projected at maturity — not yet paid out
        </p>
      )}
    </div>
  );
}
