export interface INVEST_INSTALLMENTAL_PAYLOAD {
  propertyId: string;
  amountPaid: number;
  paymentOption: "INSTALLMENT";
  installmentFrequency: "MONTHLY" | "WEEKLY";
  installmentDuration: number;
  referralCode: string;
}

export interface INVEST_SAVE_TO_OWN_PAYLOAD {
  propertyId: string;
  amountPaid: number;
  paymentOption: "INSTALLMENT";
  installmentFrequency: "MONTHLY" | "WEEKLY";
  installmentDuration: number;
  referralCode: string;
}
