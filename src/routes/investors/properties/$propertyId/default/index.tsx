import { createFileRoute } from "@tanstack/react-router";
import {
  Calendar,
  MapPin,
  Percent,
  CheckCircle2,
  TrendingUp,
  ChevronLeft,
  RefreshCw,
} from "lucide-react";
import { MediaSlider } from "@/components/property/MediaSlider";
import { useMutation, useQuery } from "@tanstack/react-query";
import apiClient, { type ApiResponse } from "@/api/simpleApi";
import PageLoader from "@/components/layout/PageLoader";
import type { PROPERTY_TYPE, AdditionalFee } from "@/types/property";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";
import { extract_message } from "@/helpers/apihelpers";
import { useNavigate } from "@tanstack/react-router";
import Modal from "@/components/modals/DialogModal";
import { useModal } from "@/store/modals";
import SimpleInput from "@/simpleComps/inputs/SimpleInput";
import { useForm, FormProvider, Controller } from "react-hook-form";
import AdditionalFees from "@/routes/partners/-components/Additionalfees";
import { useEffect } from "react";
import InvestmentDetails from "@/routes/dashboard/properties/$propertyId/-components/InvSpecific";
import AdminROI from "@/routes/-components/ROI";
import Maps from "@/routes/investors/properties/-components/Maps";
import { LoadDocuments } from "@/routes/investors/-components/LoadDocuments";
import ShareLink from "@/routes/investors/properties/-components/ShareLink";
import { RenderCustomId } from "@/routes/-components/RenderCustomId";

export const Route = createFileRoute(
  "/investors/properties/$propertyId/default/",
)({
  component: PropertyDetailPage,
});

function PropertyDetailPage() {
  const { propertyId } = Route.useParams();
  const navigate = useNavigate();
  const { ref, showModal, closeModal } = useModal();

  const query = useQuery<ApiResponse<PROPERTY_TYPE>>({
    queryKey: ["property", propertyId],
    queryFn: async () => {
      let resp = await apiClient.get("properties/" + propertyId);
      return resp.data;
    },
  });
  const formatCurrency = (amount: number | null | undefined) => {
    if (amount === null || amount === undefined) return "N/A";
    const fixed = parseFloat(amount.toFixed(2));
    return `₦ ${fixed.toLocaleString()}`;
  };
  const mutate = useMutation({
    mutationFn: async (data: { amountPaid: number; quantity: number }) => {
      let resp = await apiClient.post("/investments", {
        propertyId: propertyId,
        amountPaid: parseFloat(data.amountPaid.toFixed()),
        quantity: data.quantity,
      });
      return resp.data;
    },
    onSuccess: (data: ApiResponse<{ id: string }>) => {
      closeModal();
      navigate({
        to: "/investors/my-investments/$investmentId",
        params: {
          investmentId: data.data.id,
        },
      });
    },
  });

  const mutateIns = useMutation({
    mutationFn: async (data: { amountPaid: number; quantity: number }) => {
      let resp = await apiClient.post(
        "/investments/installments/:paymentId/pay",
        {
          propertyId: propertyId,
          amountPaid: data.amountPaid,
          quantity: data.quantity,
        },
      );
      return resp.data;
    },
    onSuccess: (data: ApiResponse<{ id: string }>) => {
      closeModal();
      navigate({
        to: "/investors/my-investments/$investmentId",
        params: {
          investmentId: data.data.id,
        },
      });
    },
  });

  const onSubmit = (data: { amountPaid: number; quantity: number }) => {
    toast.promise(mutate.mutateAsync(data), {
      loading: "Investing...",
      success: "Investment successful!",
      error: extract_message,
    });
  };
  interface OUTRIGHTDATA {
    paymentOption: "FULL_PAYMENT" | "INSTALLMENT";
    minimumInstallmentAmount?: number;
    installmentDuraion?: number;
    minimumFirstPaymentPercentage?: number;
    investmentModel?: string;
  }
  const form = useForm({
    defaultValues: {
      installment: false,
      amount: 0,
      quantity: 1,
      installmentDuration: 3,
      installmentFrequency: "MONTHLY" as "WEEKLY" | "MONTHLY",
    },
  });

  return (
    <PageLoader query={query}>
      {(data) => {
        const property = data.data as PROPERTY_TYPE & OUTRIGHTDATA;
        // Calculate total price including Management Fees if they exist
        const totalPrice =
          property.totalPrice / 100 || property.basePrice / 100;
        const percentage_totalPrice = (0 / 100) * totalPrice;
        const system_charge_per = (0 / 100) * (property.basePrice / 100);

        let breakdown: {
          totalPrice: number;
          additionalFees: AdditionalFee[];
          additionalFeesTotal: number;
          installmentAmount?: number;
          installmentDuration?: number;
          systemCharge: number;
        } = {
          totalPrice: totalPrice + system_charge_per,
          additionalFees: property.additionalFees || [],
          additionalFeesTotal: (property.additionalFees || []).reduce(
            (sum: number, fee: AdditionalFee) => sum + fee.amount / 100,
            0,
          ),
          systemCharge: system_charge_per,
        };

        if (property.paymentOption === "INSTALLMENT") {
          breakdown.installmentAmount = property.minimumInstallmentAmount;
          //@ts-ignore
          breakdown.installmentDuration = property.installmentDuration;
        }
        const payInstall = form.watch("installment");
        const payAmount = form.watch("amount");
        const quantity = form.watch("quantity");
        const installmentDuration = form.watch("installmentDuration");
        const installmentFrequency = form.watch("installmentFrequency");

        const pricePerUnit = property.basePrice / 100;
        const unit_total = quantity * pricePerUnit;
        const full_total = unit_total + breakdown.additionalFeesTotal;

        const isCoDev = property.investmentModel === "CO_DEVELOPMENT";
        const minFirstDeposit =
          isCoDev && property.minimumFirstPaymentPercentage && payInstall
            ? full_total * (property.minimumFirstPaymentPercentage / 100)
            : null;

        useEffect(() => {
          if (isCoDev && payInstall && minFirstDeposit !== null) {
            form.setValue("amount", Math.ceil(minFirstDeposit * 100) / 100);
          }
        }, [full_total, isCoDev, payInstall]);

        useEffect(() => {
          if (!isCoDev && payInstall) {
            const per_installment = full_total / installmentDuration;
            form.setValue("amount", Math.ceil(per_installment * 100) / 100);
          }
        }, [unit_total, installmentDuration, payInstall, isCoDev]);
        return (
          <>
            <Modal
              ref={ref}
              title="Confirm Investment"
              actions={
                <div className="flex gap-2">
                  <Button variant="outline" onClick={closeModal}>
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => {
                      if (payInstall) {
                        const amount = form.getValues("amount");
                        return toast.promise(
                          mutate.mutateAsync({
                            amountPaid: amount * 100,
                            quantity,
                          }),
                          {
                            loading: "Processing payment...",
                            success: "Payment successful!",
                            error: extract_message,
                          },
                        );
                      }
                      toast.promise(
                        mutate.mutateAsync({
                          amountPaid: full_total * 100,
                          quantity,
                        }),
                        {
                          loading: "Processing payment...",
                          success: "Payment successful!",
                          error: extract_message,
                        },
                      );
                    }}
                    disabled={mutate.isPending}
                  >
                    Confirm & Pay{" "}
                    {payInstall
                      ? formatCurrency(payAmount)
                      : formatCurrency(full_total)}
                  </Button>
                </div>
              }
            >
              <section>
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Property</span>
                      <span className="text-sm font-semibold">
                        {property.propertyTitle}
                      </span>
                    </div>
                    <RenderCustomId property={property} />
                    <div className="ring rounded-box fade">
                      <h2 className="p-3 border-b fade text-sm font-bold text-gray-900">
                        Units
                      </h2>
                      <div className="p-2 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-900">
                            Price per unit
                          </span>
                          <span className="text-sm font-bold">
                            {formatCurrency(pricePerUnit)}
                          </span>
                        </div>
                        <div className="pt-2 border-t border-gray-200 flex justify-between items-center">
                          <span className="text-sm text-gray-900">
                            Available units
                          </span>
                          <span className="text-sm">
                            {property.availableUnits ?? "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <Controller
                      control={form.control}
                      name="quantity"
                      render={({ field }) => {
                        const currentQuantity = field.value;
                        const availableUnits = property.availableUnits || 1;
                        return (
                          <div className="ring rounded-box fade">
                            <h2 className="p-3 border-b fade text-sm font-bold text-gray-900">
                              Units to Buy
                            </h2>
                            <div className="p-2 space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-900">
                                  Quantity
                                </span>
                                <div className="flex items-center gap-2">
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      field.onChange(
                                        Math.max(1, currentQuantity - 1),
                                      )
                                    }
                                    disabled={currentQuantity <= 1}
                                    className="px-2 py-1"
                                  >
                                    -
                                  </Button>
                                  <span className="text-sm font-bold w-8 text-center">
                                    {currentQuantity}
                                  </span>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      field.onChange(
                                        Math.min(
                                          availableUnits,
                                          currentQuantity + 1,
                                        ),
                                      )
                                    }
                                    disabled={currentQuantity >= availableUnits}
                                    className="px-2 py-1"
                                  >
                                    +
                                  </Button>
                                </div>
                              </div>
                              <div className="pt-2 border-t border-gray-200 flex justify-between items-center">
                                <span className="text-sm text-gray-900">
                                  Cost for {currentQuantity} unit
                                  {currentQuantity > 1 ? "s" : ""}
                                </span>
                                <span className="text-sm font-bold">
                                  {formatCurrency(
                                    currentQuantity * pricePerUnit +
                                      breakdown.additionalFeesTotal,
                                  )}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      }}
                    />

                    {breakdown.additionalFees.length > 0 && (
                      <section className="rounded-lg border border-gray-200 overflow-hidden">
                        <h2 className="p-3 text-sm font-semibold border-b border-gray-200 bg-gray-100">
                          Management Fees
                        </h2>
                        <ul className="p-3 space-y-2">
                          {breakdown.additionalFees.map((fee, idx) => (
                            <li
                              key={idx}
                              className="flex justify-between items-center"
                            >
                              <span className="text-sm text-gray-600">
                                {fee.label}
                              </span>
                              <span className="text-sm font-medium">
                                {formatCurrency(fee.amount / 100)}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </section>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 items-center mt-4">
                  <input
                    {...form.register("installment")}
                    type="checkbox"
                    className="checkbox checkbox-sm"
                  />
                  <h2 className="text-sm">Pay Installmentally</h2>
                </div>
                {payInstall && (
                  <div className="mt-4">
                    {isCoDev ? (
                      <div className="space-y-3 p-4 ring rounded-box fade">
                        <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                          <p className="text-xs text-amber-800 font-medium">
                            Minimum First Deposit Required
                          </p>
                          <p className="text-xs text-amber-700 mt-1">
                            Pay at least{" "}
                            <span className="font-bold">
                              {property.minimumFirstPaymentPercentage}%
                            </span>{" "}
                            of the total ({formatCurrency(minFirstDeposit!)})
                            upfront. You may pay more.
                          </p>
                        </div>
                        <SimpleInput
                          {...form.register("amount", {
                            valueAsNumber: true,
                            min: {
                              value: minFirstDeposit ?? 0,
                              message: `Minimum deposit is ${formatCurrency(minFirstDeposit)}`,
                            },
                          })}
                          label="Deposit Amount"
                          type="number"
                          className="w-full"
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-2">
                            Payment Frequency
                          </p>
                          <div className="flex gap-3">
                            {(["WEEKLY", "MONTHLY"] as const).map((freq) => (
                              <label
                                key={freq}
                                className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border cursor-pointer text-sm font-medium transition-colors ${
                                  installmentFrequency === freq
                                    ? "border-(--color-orange) bg-orange-50 text-(--color-orange)"
                                    : "border-gray-200 text-gray-600 hover:border-gray-300"
                                }`}
                              >
                                <input
                                  type="radio"
                                  className="hidden"
                                  value={freq}
                                  {...form.register("installmentFrequency")}
                                />
                                {freq.charAt(0) + freq.slice(1).toLowerCase()}
                              </label>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-2">
                            Installment Duration
                          </p>
                          <div className="flex gap-3">
                            {([3, 6, 12] as const).map((dur) => (
                              <label
                                key={dur}
                                className={`flex-1 flex items-center justify-center p-3 rounded-lg border cursor-pointer text-sm font-medium transition-colors ${
                                  Number(installmentDuration) === dur
                                    ? "border-(--color-orange) bg-orange-50 text-(--color-orange)"
                                    : "border-gray-200 text-gray-600 hover:border-gray-300"
                                }`}
                              >
                                <input
                                  type="radio"
                                  className="hidden"
                                  value={dur}
                                  {...form.register("installmentDuration", {
                                    valueAsNumber: true,
                                  })}
                                />
                                {dur}
                                {installmentFrequency === "WEEKLY" ? "w" : "m"}
                              </label>
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-600/60 text-sm">
                          <span className="font-semibold text-gray-900/60">
                            The remaining balance will be spread over the
                            selected schedule
                          </span>
                        </p>
                      </div>
                    ) : (
                      <InstallMentForm
                        form={form}
                        minimumInvestmentAmount={payAmount}
                      />
                    )}
                  </div>
                )}
              </section>
            </Modal>
            <div className="flex mb-4 flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <Button
                variant="outline"
                leftIcon={<ChevronLeft className="w-5 h-5" />}
                onClick={() => navigate({ to: "/investors/properties" })}
                className="w-full sm:w-auto"
              >
                Back to Properties
              </Button>

              <Button
                variant="primary"
                rightIcon={<TrendingUp className="w-5 h-5" />}
                onClick={() => {
                  const amountToPay =
                    property.paymentOption === "INSTALLMENT"
                      ? property.minimumInvestmentAmount ||
                        property.minimumInvestment ||
                        totalPrice
                      : totalPrice + breakdown.additionalFeesTotal;

                  // methods.setValue("amountPaid", amountToPay);
                  // methods.setValue("quantity", 1);
                  showModal();
                }}
                disabled={mutate.isPending}
                className="w-full sm:w-auto"
              >
                Invest Now
              </Button>
            </div>
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {/* Media Slider */}
                <MediaSlider
                  images={property.galleryImages || []}
                  videos={property.videos ? [property.videos] : []}
                  coverImage={property.coverImage}
                />

                <div className="p-4 md:p-6 lg:p-8">
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                          {property.propertyTitle}
                        </h1>
                        <ShareLink
                          route={`/investors/properties/${propertyId}/default`}
                        />
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="w-4 h-4 md:w-5 md:h-5 shrink-0" />
                        <span className="text-sm md:text-lg">
                          {property.location}
                        </span>
                      </div>
                      {property.isResell && property.reseller && (
                        <div className="flex items-center gap-2 mt-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
                          <RefreshCw className="w-4 h-4 shrink-0" />
                          <span>
                            Resell Listing — Listed by{" "}
                            <strong>
                              {property.reseller.firstName}{" "}
                              {property.reseller.lastName}
                            </strong>
                          </span>
                        </div>
                      )}
                      <div className="mt-3">
                        <Maps
                          location={property.location}
                          latitude={property.latitude}
                          longitude={property.longitude}
                        />
                      </div>
                    </div>
                    <div className="sm:text-right">
                      <p className="text-2xl md:text-3xl font-bold text-(--color-orange)">
                        {formatCurrency(property.basePrice / 100)}
                      </p>
                      <p className="text-xs md:text-sm text-gray-500 mt-1">
                        SKU: {property.id}
                      </p>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
                    {property.profitSharingRatio && (
                      <div className="flex items-center gap-2 md:gap-3 p-3 md:p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="p-2 bg-white rounded-lg shrink-0">
                          <Percent className="w-4 h-4 md:w-5 md:h-5 text-(--color-orange)" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs text-gray-500 whitespace-nowrap">
                            Profit Sharing
                          </p>
                          <p className="font-semibold text-sm md:text-base text-gray-900 truncate">
                            {property.profitSharingRatio}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Main Content */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
                    <div className="lg:col-span-2 space-y-4 md:space-y-6">
                      {/* Description */}
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">
                          Description
                        </h2>
                        <p className="text-gray-600 leading-relaxed">
                          {property.description}
                        </p>
                      </div>

                      {/* Amenities */}

                      {/* Features */}

                      {/* Investment Model Specific Information */}
                      {property.investmentModel === "FRACTIONAL_OWNERSHIP" && (
                        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Investment Details
                          </h3>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-600">
                                Total Shares
                              </p>
                              <p className="text-lg font-semibold text-gray-900">
                                {property.totalShares?.toLocaleString() ||
                                  "N/A"}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">
                                Price Per Slot
                              </p>
                              <p className="text-lg font-semibold text-(--color-orange)">
                                {formatCurrency(property.pricePerShare / 100)}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">
                                Minimum Shares To Buy
                              </p>
                              <p className="text-lg font-semibold text-gray-900">
                                {property.minimumShares || "N/A"}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">
                                Exit Window
                              </p>
                              <p className="text-lg font-semibold text-gray-900">
                                {property.exitWindow || "N/A"}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* System Charges */}

                      {/* Management Fees */}
                      <AdditionalFees fees={property.additionalFees} />
                      <LoadDocuments property_data={property} />
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-4 md:space-y-6">
                      {/*{property.investmentModel}*/}
                      <InvestmentDetails
                        type={property.investmentModel}
                        inv={property}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        );
      }}
    </PageLoader>
  );
}
const InstallMentForm = ({
  form,
  minimumInvestmentAmount,
}: {
  form: any;
  minimumInvestmentAmount: number;
}) => {
  const formatCurrency = (amount: number | null | undefined) => {
    if (amount === null || amount === undefined) return "N/A";
    const fixed = parseFloat(amount.toFixed(2));
    return `₦ ${fixed.toLocaleString()}`;
  };
  const selectedDuration = form.watch("installmentDuration");
  const selectedFrequency = form.watch("installmentFrequency");

  return (
    <div className="space-y-4 p-4 ring rounded-box fade">
      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">
          Payment Frequency
        </p>
        <div className="flex gap-3">
          {(["WEEKLY", "MONTHLY"] as const).map((freq) => (
            <label
              key={freq}
              className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border cursor-pointer text-sm font-medium transition-colors ${
                selectedFrequency === freq
                  ? "border-(--color-orange) bg-orange-50 text-(--color-orange)"
                  : "border-gray-200 text-gray-600 hover:border-gray-300"
              }`}
            >
              <input
                type="radio"
                className="hidden"
                value={freq}
                {...form.register("installmentFrequency")}
              />
              {freq.charAt(0) + freq.slice(1).toLowerCase()}
            </label>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">
          Installment Duration
        </p>
        <div className="flex gap-3">
          {([3, 6, 12] as const).map((dur) => (
            <label
              key={dur}
              className={`flex-1 flex items-center justify-center p-3 rounded-lg border cursor-pointer text-sm font-medium transition-colors ${
                Number(selectedDuration) === dur
                  ? "border-(--color-orange) bg-orange-50 text-(--color-orange)"
                  : "border-gray-200 text-gray-600 hover:border-gray-300"
              }`}
            >
              <input
                type="radio"
                className="hidden"
                value={dur}
                {...form.register("installmentDuration", {
                  valueAsNumber: true,
                })}
              />
              {dur}
              {selectedFrequency === "WEEKLY" ? "w" : "m"}
            </label>
          ))}
        </div>
      </div>

      <div className="flex-1 space-y-1">
        <SimpleInput
          {...form.register("amount", { valueAsNumber: true })}
          label="Installment Amount"
          type="number"
          placeholder={formatCurrency(minimumInvestmentAmount)}
          className="w-full"
        />
      </div>

      <p className="text-gray-600/60 text-sm">
        <span className="font-semibold text-gray-900/60">
          The balance payment can be made anytime without waiting for
          installment date
        </span>
      </p>
    </div>
  );
};
