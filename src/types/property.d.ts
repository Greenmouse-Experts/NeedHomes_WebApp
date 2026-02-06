export interface AdditionalFee {
  id: string;
  label: string;
  amount: number;
  propertyId: string;
  createdAt: string;
}

export interface SystemCharges {
  platformChargePercentage: number;
  partnerChargePercentage: number;
}

export interface PROPERTY_TYPE {
  id: string;
  propertyTitle: string;
  propertyType: "RESIDENTIAL" | "COMMERCIAL" | "INDUSTRIAL" | "LAND";
  investmentModel:
    | "FRACTIONAL_OWNERSHIP"
    | "OUTRIGHT_PURCHASE"
    | "RENT_TO_OWN"
    | "CO_INVESTMENT";
  location: string;
  description: string;
  developmentStage: "OFF_PLAN" | "UNDER_CONSTRUCTION" | "COMPLETED";
  completionDate: string;
  published: boolean;
  premiumProperty: boolean;
  coverImage: string;
  galleryImages: string[];
  videos: string;
  certificate: string;
  surveyPlanDocument: string;
  brochure: string;
  transferDocument: string;
  basePrice: number;
  availableUnits: number;
  totalPrice: number;
  paymentOption: string | null;
  installmentDuration: number | null;
  minimumInvestment: number | null;
  profitSharingRatio: string | null;
  projectDuration: string | null;
  exitRule: string | null;
  totalShares: number;
  pricePerShare: number;
  minimumShares: number;
  exitWindow: "MONTHLY" | "QUARTERLY" | "ANNUALLY" | "NONE";
  plotSize: string | null;
  pricePerPlot: number | null;
  holdingPeriod: string | null;
  buyBackOption: boolean | null;
  targetPropertyPrice: number | null;
  savingsFrequency: string | null;
  savingsDuration: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  additionalFees: AdditionalFee[];
  systemCharges: SystemCharges;
}
