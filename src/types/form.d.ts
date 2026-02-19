export interface DocProps {
  certificate: string;
  surveyPlanDocument: string;
  transferDocument: string;
  brochure: string;
  videos: string;
  // premiumProperty: boolean;
  ExpectedCompletionDate: string;
  location: string;
  description: string;
  basePrice: string;
  completionDate: any;
  propertyType: "RESIDENTIAL" | "COMMERCIAL" | "LAND";
  developmentStage: "PLANNING" | "ONGOING" | "COMPLETED";
  additionalFees: { label: string; amount: number }[];
  [key: string]: any;
}
