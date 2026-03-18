import type { ADMIN_PROPERTY_LISTING } from "@/types";

export default function edit_cleaner(
  data: ADMIN_PROPERTY_LISTING,
  extraClean?: string[],
) {
  const new_data = {
    ...data,
    basePrice: data.basePrice / 100,
    additionalFees: data.additionalFees.map((fee) => ({
      ...fee,
      amount: fee.amount / 100,
    })),
    totalPrice: data.totalPrice / 100,
  } as ADMIN_PROPERTY_LISTING;
  if (extraClean && extraClean.length > 0) {
    for (const key of extraClean) {
      if (key in new_data && typeof (new_data as any)[key] === "number") {
        (new_data as any)[key] = (new_data as any)[key] / 100;
      }
    }
  }
  return new_data;
}
