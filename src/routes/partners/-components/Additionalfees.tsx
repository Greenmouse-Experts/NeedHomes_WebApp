interface AdditionalFee {
  id: string;
  label: string;
  amount: number;
  propertyId: string;
  createdAt: string;
}

interface AdditionalFeesProps {
  fees: AdditionalFee[];
}

export default function AdditionalFees({ fees }: AdditionalFeesProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Additional Fees</h3>
      <ul className="divide-y divide-gray-200">
        {fees.map((fee) => (
          <li key={fee.id} className="py-3 flex justify-between items-center">
            <span className="text-sm text-gray-600">{fee.label}</span>
            <span className="text-sm font-medium">
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(fee.amount)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
