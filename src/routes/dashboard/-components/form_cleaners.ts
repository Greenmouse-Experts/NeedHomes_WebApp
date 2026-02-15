export const strip_co_dev = (data: Record<string, any>) => {
  const cleaned = stripped_unneeded({ ...data });

  delete cleaned.investmentModel;
  delete cleaned.paymentOption;
  delete cleaned.installmentDuration;
  delete cleaned.totalShares;
  delete cleaned.pricePerShare;
  delete cleaned.minimumShares;
  delete cleaned.exitWindow;
  delete cleaned.plotSize;
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

  return cleaned;
};

export const strip_land_banking = (data: Record<string, any>) => {
  const cleaned = stripped_unneeded({ ...data });
  delete cleaned.minimumInvestment;
  delete cleaned.profitSharingRatio;
  delete cleaned.projectDuration;
  delete cleaned.exitRule;
  delete cleaned.investmentModel;
  delete cleaned.paymentOption;
  delete cleaned.installmentDuration;
  delete cleaned.totalShares;
  delete cleaned.pricePerShare;
  delete cleaned.minimumShares;
  delete cleaned.exitWindow;
  delete cleaned.targetPropertyPrice;
  delete cleaned.savingsFrequency;
  delete cleaned.savingsDuration;
  delete cleaned.published;
  delete cleaned.deletedAt;
  delete cleaned.systemCharges;
  return cleaned;
};
