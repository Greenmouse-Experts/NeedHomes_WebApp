import type { ADMIN_PROPERTY_LISTING } from "@/types";

export default function edit_cleaner(data: ADMIN_PROPERTY_LISTING) {
  const new_data = {
    ...data,
    basePrice: data.basePrice / 100,
    additionalFees: data.additionalFees.map((fee) => ({
      ...fee,
      amount: fee.amount / 100,
    })),
    totalPrice: data.totalPrice / 100,
  } as ADMIN_PROPERTY_LISTING;
  return new_data;
}
