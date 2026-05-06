// @ts-nocheck

import type { DocProps } from "@/types/form";

export const stripped_unneeded = (data: Record<string, any>) => {
  const copy = { ...data } as DocProps;
  delete copy.id;
  delete copy.createdAt;
  delete copy.updatedAt;
  delete copy.uploadedByPartnerId;
  delete copy.uploadStatus;
  delete copy.maxInvestors;
  delete copy.isResell;
  delete copy.resellStatus;
  delete copy.resellerId;
  delete copy.originalInvestmentId;
  delete copy.reseller;

  const new_add_fees = copy.additionalFees.map((item) => {
    return {
      label: item.label,
      amount: item.amount,
    };
  });
  copy.additionalFees = new_add_fees;
  console.log(copy, "copy");
  return copy;
};

export const strip_co_dev = (data: Record<string, any>) => {
  const cleaned = stripped_unneeded({ ...data });
  delete cleaned.return30Days;
  delete cleaned.return60Days;
  delete cleaned.return90Days;
  delete cleaned.return120Days;
  delete cleaned.return120Days;
  delete cleaned.customId;
  delete cleaned.investmentModel;
  // delete cleaned.paymentOption;
  delete cleaned.installmentDuration;
  delete cleaned.completionDate;
  delete cleaned.basePrice;
  delete cleaned.totalShares;
  delete cleaned.minimumInvestment;
  delete cleaned.pricePerShare;
  delete cleaned.minimumShares;
  delete cleaned.exitWindow;
  delete cleaned.availablePlots;
  delete cleaned.pricePerPlot;
  delete cleaned.holdingPeriod;
  delete cleaned.buyBackOption;
  delete cleaned.targetPropertyPrice;
  delete cleaned.savingsFrequency;
  delete cleaned.savingsDuration;
  delete cleaned.published;
  delete cleaned.deletedAt;
  delete cleaned.systemCharges;
  delete cleaned.coDevelopmentProgress;
  delete cleaned.minimumInstallmentAmount;
  delete cleaned.paymentDuration;
  delete cleaned.fractionalHoldingPeriodDays;
  return cleaned;
};

export const strip_land_banking = (data: Record<string, any>) => {
  const cleaned = stripped_unneeded({ ...data });
  delete cleaned.minimumInvestment;
  delete cleaned.profitSharingRatio;
  delete cleaned.projectDuration;
  delete cleaned.exitRule;
  delete cleaned.investmentModel;
  // delete cleaned.paymentOption;
  // delete cleaned.installmentDuration;
  delete cleaned.totalShares;
  delete cleaned.pricePerShare;
  delete cleaned.completionDate;
  delete cleaned.minimumShares;
  delete cleaned.exitWindow;
  delete cleaned.targetPropertyPrice;
  delete cleaned.savingsFrequency;
  delete cleaned.savingsDuration;
  delete cleaned.published;
  delete cleaned.deletedAt;
  delete cleaned.systemCharges;
  delete cleaned.paymentDuration;
  delete cleaned.minimumFirstPaymentPercentage;
  delete cleaned.fractionalHoldingPeriodDays;
  delete cleaned.return30Days;
  delete cleaned.return60Days;
  delete cleaned.return90Days;
  delete cleaned.return120Days;
  delete cleaned.return120Days;
  delete cleaned.customId;
  delete cleaned.minimumInstallmentAmount;
  delete cleaned.paymentOption;
  delete cleaned.installmentDuration;
  return cleaned;
};

export const strip_fractional = (data: Record<string, any>) => {
  const cleaned = stripped_unneeded({ ...data });
  delete cleaned.returnTiersArray;
  delete cleaned.return30Days;
  delete cleaned.return60Days;
  delete cleaned.return90Days;
  delete cleaned.return120Days;
  delete cleaned.basePrice;
  delete cleaned.availablePlots;
  delete cleaned.exitWindow;
  delete cleaned.pricePerPlot;
  delete cleaned.holdingPeriod;
  delete cleaned.buyBackOption;
  delete cleaned.investmentModel;
  delete cleaned.paymentOption;
  delete cleaned.installmentDuration;
  delete cleaned.minimumInstallmentAmount;
  delete cleaned.minimumInvestment;
  delete cleaned.profitSharingRatio;
  delete cleaned.projectDuration;
  delete cleaned.exitRule;
  delete cleaned.targetPropertyPrice;
  delete cleaned.savingsFrequency;
  delete cleaned.savingsDuration;
  delete cleaned.published;
  delete cleaned.deletedAt;
  delete cleaned.paymentDuration;
  delete cleaned.minimumFirstPaymentPercentage;
  delete cleaned.systemCharges;
  delete cleaned.customId;

  return cleaned;
};

export const strip_outright = (data: Record<string, any>) => {
  const cleaned = stripped_unneeded({ ...data });
  delete cleaned.totalShares;
  delete cleaned.pricePerShare;
  delete cleaned.minimumShares;
  delete cleaned.exitWindow;
  delete cleaned.investmentModel;
  delete cleaned.paymentOption;
  delete cleaned.installmentDuration;
  delete cleaned.minimumInstallmentAmount;
  delete cleaned.return30Days;
  delete cleaned.return60Days;
  delete cleaned.return90Days;
  delete cleaned.return120Days;
  delete cleaned.return120Days;
  delete cleaned.customId;
  delete cleaned.minimumInvestment;
  delete cleaned.profitSharingRatio;
  delete cleaned.projectDuration;
  delete cleaned.exitRule;
  delete cleaned.availablePlots;
  delete cleaned.pricePerPlot;
  delete cleaned.holdingPeriod;
  delete cleaned.buyBackOption;
  delete cleaned.targetPropertyPrice;
  delete cleaned.savingsFrequency;
  delete cleaned.savingsDuration;
  delete cleaned.published;
  delete cleaned.deletedAt;
  delete cleaned.systemCharges;
  //@ts-ignore
  delete cleaned.paymentDuration;
  delete cleaned.minimumFirstPaymentPercentage;
  delete cleaned.projectStartDate;
  //@ts-ignore
  delete cleaned.fractionalHoldingPeriodDays;
  delete cleaned.developmentStage;
  delete cleaned.projectEndDate;
  return cleaned;
};
// property paymentOption should not exist, property installmentDuration should not exist, property minimumInstallmentAmount should not exist
export const strip_save_to_own = (data: Record<string, any>) => {
  const cleaned = stripped_unneeded({ ...data });
  delete cleaned.totalShares;
  delete cleaned.pricePerShare;
  delete cleaned.minimumShares;
  delete cleaned.exitWindow;
  delete cleaned.investmentModel;
  delete cleaned.return30Days;
  delete cleaned.return60Days;
  delete cleaned.return90Days;
  delete cleaned.return120Days;
  delete cleaned.return120Days;
  delete cleaned.customId;
  delete cleaned.paymentOption;
  delete cleaned.installmentDuration;
  delete cleaned.minimumInvestment;
  delete cleaned.minimumInstallmentAmount;
  delete cleaned.profitSharingRatio;
  delete cleaned.projectDuration;
  delete cleaned.exitRule;
  delete cleaned.availablePlots;
  delete cleaned.pricePerPlot;
  delete cleaned.holdingPeriod;
  delete cleaned.buyBackOption;
  delete cleaned.published;
  delete cleaned.deletedAt;
  delete cleaned.systemCharges;
  delete cleaned.savingsFrequency;
  delete cleaned.savingsDuration;
  delete cleaned.paymentDuration;
  delete cleaned.minimumFirstPaymentPercentage;
  delete cleaned.projectStartDate;
  delete cleaned.fractionalHoldingPeriodDays;
  delete cleaned.projectEndDate;

  return cleaned;
};
