import type { DocProps } from "@/types/form";

export default function calculate_fees(data: DocProps, keys?: string[]) {
  const new_base_price = data.basePrice * 100;
  const system_charge = (2 / 100) * new_base_price;
  console.log("system_charge", system_charge);
  const new_base = new_base_price + system_charge;
  const total_price =
    new_base +
    data.additionalFees.reduce((acc, fee) => acc + fee.amount * 100, 0);
  const new_data = {
    ...data,
    basePrice: new_base_price + system_charge,
    totalPrice: total_price,
    additionalFees: data.additionalFees.map((fee) => ({
      ...fee,
      amount: fee.amount * 100,
    })),
  } as DocProps;
  if (keys && keys.length > 0) {
    for (const key of keys) {
      console.log(key, data[key]);
      new_data[key] = data[key] * 100;
      console.log(key, new_data[key]);
    }
  }
  return new_data;
}
