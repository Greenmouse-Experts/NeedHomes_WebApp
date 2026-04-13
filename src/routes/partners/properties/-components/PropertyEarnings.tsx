import type { PROPERTY_DATA } from "@/types";
import { TrendingUp } from "lucide-react";
const formatCurrency = (amount: number | null | undefined) => {
  if (amount === null || amount === undefined) return "N/A";
  const fixed = parseFloat(amount.toFixed(2));
  return `₦ ${fixed.toLocaleString()}`;
};
export default function PropertyEarnings(props: { property: PROPERTY_DATA }) {
  const { property } = props;

  return (
    <div>
      {(property as any).systemCharges?.partnerChargePercentage > 0 &&
        (() => {
          const pct = (property as any).systemCharges.partnerChargePercentage;
          const base = property.basePrice / 100;
          const earning = (pct / 100) * base;
          return (
            <div className="rounded-xl border border-green-200 bg-green-50 overflow-hidden">
              <div className="px-5 py-3 border-b border-green-200 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <h3 className="text-sm font-semibold text-green-800">
                  Your Earnings from This Promotion
                </h3>
              </div>
              <div className="p-5 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Base Price</span>
                  <span className="font-medium">{formatCurrency(base)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Partner Commission Rate</span>
                  <span className="font-medium text-green-700">{pct}%</span>
                </div>
                <div className="pt-3 border-t border-green-200 flex items-center justify-between">
                  <span className="text-sm font-bold text-gray-900">
                    Estimated Earning
                  </span>
                  <span className="text-xl font-bold text-green-600">
                    {formatCurrency(earning)}
                  </span>
                </div>
                <p className="text-xs text-green-700/70">
                  Credited to your wallet when an investor completes purchase
                  via your promotion.
                </p>
              </div>
            </div>
          );
        })()}
    </div>
  );
}
