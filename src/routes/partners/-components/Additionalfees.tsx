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
  const totalAmount = fees.reduce((sum, fee) => sum + fee.amount, 0);

  return (
    <div className="space-y-4 ring fade p-6 rounded-box bg-base-200">
      <h3 className="text-lg font-semibold">Additional Fees</h3>
      <ul className="divide-y divide-gray-200 ring fade  p-4 rounded-box">
        {fees.map((fee) => (
          <li key={fee.id} className="py-3 flex justify-between items-center">
            <span className="text-sm text-gray-600">{fee.label}</span>
            <span className="text-sm font-medium">
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "NGN",
              }).format(fee.amount / 100)}
            </span>
          </li>
        ))}
        <li className="py-3 flex justify-between items-center font-bold">
          <span>Total Additional Fees</span>
          <span>
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "NGN",
            }).format(totalAmount / 100)}
          </span>
        </li>
      </ul>
    </div>
  );
}
