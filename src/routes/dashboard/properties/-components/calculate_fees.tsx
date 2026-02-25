import type { DocProps } from "@/types/form";

export default function calculate_fees(data: DocProps, keys?: string[]) {
  const total_price =
    data.basePrice * 100 +
    data.additionalFees.reduce((acc, fee) => acc + fee.amount * 100, 0);
  const new_data = {
    ...data,
    basePrice: data.basePrice * 100,
    totalPrice: total_price,
    additionalFees: data.additionalFees.map((fee) => ({
      ...fee,
      amount: fee.amount * 100,
    })),
  } as DocProps;
  if (keys && keys.length > 0) {
    for (const key of keys) {
      new_data[key] = data[key] * 100;
    }
  }
  return new_data;
}
