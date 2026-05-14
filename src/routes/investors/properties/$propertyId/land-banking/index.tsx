import { createFileRoute } from "@tanstack/react-router";
import {
  MapPin,
  Percent,
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
import { Controller, useForm } from "react-hook-form";
import AdditionalFees from "@/routes/partners/-components/Additionalfees";
import { useEffect } from "react";
import InvestmentDetails from "@/routes/dashboard/properties/$propertyId/-components/InvSpecific";
import AdminROI from "@/routes/-components/ROI";
import Maps from "@/routes/investors/properties/-components/Maps";
import { LoadDocuments } from "@/routes/investors/-components/LoadDocuments";
import ShareLink from "@/routes/investors/properties/-components/ShareLink";
import { RenderCustomId } from "@/routes/-components/RenderCustomId";
import RenderDescription from "@/components/RenderDescription";

export const Route = createFileRoute(
  "/investors/properties/$propertyId/land-banking/",
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
    mutationFn: async (data: {
      amountPaid: number;
      quantity: number;
      paymentOption?: string;
      installmentFrequency?: string;
      installmentDuration?: number;
      referralCode?: string;
    }) => {
      const ref = localStorage.getItem(`ref_${propertyId}`);
      let resp = await apiClient.post("/investments", {
        propertyId: propertyId,
        amountPaid: parseFloat(data.amountPaid.toFixed()),
        quantity: data.quantity,
        ...(data.paymentOption ? { paymentOption: data.paymentOption } : {}),
        ...(data.installmentFrequency
          ? { installmentFrequency: data.installmentFrequency }
          : {}),
        ...(data.installmentDuration
          ? { installmentDuration: data.installmentDuration }
          : {}),
        ...(ref ? { referralCode: ref } : {}),
      });
      return resp.data;
    },
    onSuccess: (data: ApiResponse<{ id: string }>) => {
      localStorage.removeItem(`ref_${propertyId}`);
      closeModal();
      navigate({
        to: "/investors/my-investments/$investmentId",
        params: {
          investmentId: data.data.id,
        },
      });
    },
  });

  interface OUTRIGHTDATA {
    paymentOption: "FULL_PAYMENT" | "INSTALLMENT" | "BOTH";
    minimumInstallmentAmount?: number;
    installmentDuraion?: number;
    firstPaymentPercentage?: number;
  }
  const form = useForm({
    defaultValues: {
      installment: false,
      amount: 0,
      ration: 3,
      quantity: 1,
      installmentDuration: 3,
      installmentFrequency: "MONTHLY" as "WEEKLY" | "MONTHLY",
    },
  });
  // let payAmount = form.watch("amount");

  return (
    <PageLoader query={query}>
      {(data) => {
        const property = data.data as PROPERTY_TYPE & OUTRIGHTDATA;
        // Calculate total price including Management Fees if they exist
        const basePrice = property.basePrice / 100;
        const additionalFeesTotal = (property.additionalFees || []).reduce(
          (sum: number, fee: AdditionalFee) => sum + fee.amount / 100,
          0,
        );
        const price = form.watch("quantity") * (property.pricePerPlot / 100);
        const systemChargeAmount = (0 / 100) * price;
        const totalPrice = basePrice + additionalFeesTotal + systemChargeAmount;

        let breakdown: {
          totalPrice: number;
          additionalFees: AdditionalFee[];
          additionalFeesTotal: number;
          installmentAmount?: number;
          installmentDuration?: number;
          systemCharge: number;
          pricePerPlot: number;
          availablePlots: number;
        } = {
          totalPrice: totalPrice,
          additionalFees: property.additionalFees || [],
          additionalFeesTotal: additionalFeesTotal,
          systemCharge: systemChargeAmount,
          pricePerPlot: property.pricePerPlot as number,
          availablePlots: property.availablePlots as unknown as number,
        };

        if (property.paymentOption === "INSTALLMENT") {
          const charge = (0 / 100) * property.minimumInstallmentAmount;
          breakdown.installmentAmount =
            (property.minimumInstallmentAmount + charge) / 100;
          //@ts-ignore

          breakdown.installmentDuration = property.installmentDuration;
        }

        const payInstall = form.watch("installment");

        const canPayInstallment =
          property.paymentOption === "INSTALLMENT" ||
          property.paymentOption === "BOTH";
        const payAmount = form.watch("amount");
        const selectedDuration = form.watch("installmentDuration");
        const installmentFrequency = form.watch("installmentFrequency");
        const currentQuantity = form.watch("quantity");

        const install_amount = currentQuantity * property.pricePerPlot;
        const full_charge = (0 / 100) * install_amount;

        const totalForQuantityKobo = install_amount + additionalFeesTotal * 100;
        const minFirstPaymentKobo = property.firstPaymentPercentage
          ? Math.ceil(totalForQuantityKobo * (property.firstPaymentPercentage / 100))
          : null;

        useEffect(() => {
          if (payInstall) {
            if (
              property.firstPaymentPercentage &&
              minFirstPaymentKobo !== null
            ) {
              form.setValue("amount", minFirstPaymentKobo / 100);
            } else {
              const charge = (0 / 100) * install_amount;
              let amount_total =
                ((install_amount + charge) / 100 +
                  breakdown.additionalFeesTotal) /
                parseFloat(selectedDuration);
              amount_total = Math.ceil(amount_total * 100) / 100;
              form.setValue("amount", Number(amount_total.toFixed(2)));
            }
          }
        }, [install_amount, selectedDuration, payInstall, minFirstPaymentKobo]);
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
                        const quantity = form.getValues("quantity");
                        const installmentFrequency = form.getValues(
                          "installmentFrequency",
                        );
                        const installmentDuration = Number(
                          form.getValues("installmentDuration"),
                        );
                        return toast.promise(
                          mutate.mutateAsync({
                            amountPaid: amount * 100,
                            quantity,
                            paymentOption: "INSTALLMENT",
                            installmentFrequency,
                            installmentDuration,
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
                          amountPaid:
                            ((install_amount + full_charge) / 100 +
                              breakdown.additionalFeesTotal) *
                            100,
                          quantity: form.getValues("quantity"),
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
                      ? payAmount
                        ? formatCurrency(payAmount)
                        : formatCurrency(
                            (property.minimumInstallmentAmount || 0) / 100,
                          )
                      : formatCurrency(
                          (install_amount + full_charge) / 100 +
                            breakdown.additionalFeesTotal,
                        )}
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
                    {/*<div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Base Price</span>
                      <span className="text-sm font-medium">
                        {formatCurrency(property.basePrice / 100)}
                      </span>
                    </div>*/}

                    <RenderCustomId property={property} />
                    <div className="ring rounded-box fade">
                      <h2 className="p-3 border-b fade text-sm font-bold text-gray-900">
                        Shares
                      </h2>
                      <div className="p-2 space-y-2">
                        <div className="pt-2  border-gray-200 flex justify-between items-center">
                          <span className="text-sm  text-gray-900">
                            Price per plot
                          </span>
                          <span className="text-sm font-bold">
                            {formatCurrency(breakdown.pricePerPlot / 100)}
                          </span>
                        </div>
                        <div className="pt-2 border-t border-gray-200 flex justify-between items-center">
                          <span className="text-sm  text-gray-900">
                            Avaialble plots
                          </span>
                          <span className="text-sm  ">
                            {breakdown.availablePlots}
                          </span>
                        </div>
                      </div>
                    </div>

                    <Controller
                      control={form.control}
                      name="quantity"
                      render={({ field }) => {
                        const currentQuantity = field.value;
                        const pricePerPlot = breakdown.pricePerPlot / 100;
                        const totalCost = currentQuantity * pricePerPlot;
                        const minimumShares = property.minimumShares || 1; // Default to 1 if not set

                        const availablePlots = breakdown.availablePlots;

                        const incrementQuantity = () => {
                          if (currentQuantity < availablePlots) {
                            field.onChange(currentQuantity + 1);
                          }
                        };

                        const decrementQuantity = () => {
                          if (currentQuantity > minimumShares) {
                            field.onChange(currentQuantity - 1);
                          }
                        };

                        return (
                          <div className="ring rounded-box fade">
                            <h2 className="p-3 border-b fade text-sm font-bold text-gray-900">
                              Select Plot
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
                                    onClick={decrementQuantity}
                                    disabled={
                                      field.value <= breakdown.minimumShares
                                    }
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
                                    onClick={incrementQuantity}
                                    disabled={
                                      field.value >= breakdown.availablePlots
                                    }
                                    className="px-2 py-1"
                                  >
                                    +
                                  </Button>
                                </div>
                              </div>
                              <div className="pt-2 border-t border-gray-200 flex justify-between items-center">
                                <span className="text-sm text-gray-900">
                                  Cost for {currentQuantity} plots
                                </span>
                                <span className="text-sm font-bold">
                                  {formatCurrency(
                                    totalCost +
                                      breakdown.systemCharge +
                                      breakdown.additionalFeesTotal,
                                  )}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      }}
                    ></Controller>
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

                    {/*<div className="pt-2 border-t border-gray-200 flex justify-between items-center">
                      <span className="text-sm font-bold text-gray-900">
                        Total
                      </span>
                      <span className="text-lg font-bold text-(--color-orange)">
                        {formatCurrency(breakdown.totalPrice)}
                      </span>
                    </div>*/}
                  </div>

                  {canPayInstallment && (
                    <div className="p-3 bg-blue-50 rounded border border-blue-100 space-y-1">
                      {property.firstPaymentPercentage &&
                      minFirstPaymentKobo !== null ? (
                        <>
                          <p className="text-xs text-blue-700 font-semibold">
                            Installment Plan — {property.firstPaymentPercentage}
                            % First Payment Required
                          </p>
                          <p className="text-xs text-blue-600">
                            Minimum first payment:{" "}
                            <span className="font-bold">
                              {formatCurrency(minFirstPaymentKobo / 100)}
                            </span>
                            . Remaining{" "}
                            <span className="font-bold">
                              {formatCurrency(
                                (totalForQuantityKobo - minFirstPaymentKobo) / 100,
                              )}
                            </span>{" "}
                            spread over {property.installmentDuration} months.
                          </p>
                        </>
                      ) : (
                        <p className="text-xs text-blue-700">
                          You are paying in installment. Remaining balance will
                          be spread over {property.installmentDuration} months.
                        </p>
                      )}
                    </div>
                  )}
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
                    <div className="space-y-3 p-4 ring rounded-box fade">
                      {property.firstPaymentPercentage &&
                        minFirstPaymentKobo !== null && (
                          <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                            <p className="text-xs text-amber-800 font-medium">
                              Minimum First Deposit Required
                            </p>
                            <p className="text-xs text-amber-700 mt-1">
                              Pay at least{" "}
                              <span className="font-bold">
                                {property.firstPaymentPercentage}%
                              </span>{" "}
                              of the total (
                              {formatCurrency(minFirstPaymentKobo / 100)})
                              upfront. You may pay more.
                            </p>
                          </div>
                        )}
                      <SimpleInput
                        {...form.register("amount", {
                          valueAsNumber: true,
                          min: {
                            value:
                              minFirstPaymentKobo !== null
                                ? minFirstPaymentKobo / 100
                                : 0,
                            message: `Minimum deposit is ${formatCurrency(minFirstPaymentKobo !== null ? minFirstPaymentKobo / 100 : 0)}`,
                          },
                        })}
                        label={
                          property.firstPaymentPercentage
                            ? `First Payment (min. ${property.firstPaymentPercentage}%)`
                            : "Deposit Amount"
                        }
                        type="number"
                        className="w-full"
                      />
                      {form.formState.errors.amount && (
                        <p className="text-red-500 text-sm">
                          {form.formState.errors.amount.message as string}
                        </p>
                      )}
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
                              {installmentFrequency === "WEEKLY" ? "w" : "m"}
                            </label>
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-600/60 text-sm">
                        <span className="font-semibold text-gray-900/60">
                          The remaining balance will be spread over the selected
                          schedule
                        </span>
                      </p>
                    </div>
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
                          route={`/investors/properties/${propertyId}/land-banking`}
                        />
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="w-4 h-4 md:w-5 md:h-5 shrink-0" />
                        <span className="text-sm md:text-lg">
                          {property.location}
                        </span>
                      </div>

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
                        <RenderDescription description={property.description} />
                      </div>

                      {/* Amenities */}

                      {/* Features */}

                      <LoadDocuments property_data={property} />

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
                                {formatCurrency(property.pricePerPlot / 100)}
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
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-4 md:space-y-6">
                      {/*{property.investmentModel}*/}
                      <InvestmentDetails
                        type={property.investmentModel}
                        inv={property}
                      />
                      {property.firstPaymentPercentage &&
                        canPayInstallment &&
                        minFirstPaymentKobo !== null && (
                          <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
                            <h3 className="text-sm font-semibold text-gray-900 mb-3 border-b border-blue-200 pb-2">
                              Payment Plan Summary
                            </h3>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">
                                  Total Cost ({currentQuantity} plot
                                  {currentQuantity > 1 ? "s" : ""})
                                </span>
                                <span className="font-medium">
                                  {formatCurrency(install_amount / 100)}
                                </span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">
                                  Min. First Payment (
                                  {property.firstPaymentPercentage}%)
                                </span>
                                <span className="font-semibold text-blue-700">
                                  {formatCurrency(minFirstPaymentKobo / 100)}
                                </span>
                              </div>
                              <div className="flex justify-between text-sm border-t border-blue-200 pt-2">
                                <span className="text-gray-600">
                                  Remaining Balance
                                </span>
                                <span className="font-medium">
                                  {formatCurrency(
                                    (totalForQuantityKobo - minFirstPaymentKobo) /
                                      100,
                                  )}
                                </span>
                              </div>
                              {property.installmentDuration && (
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-600">
                                    Installments
                                  </span>
                                  <span className="font-medium">
                                    {property.installmentDuration}x{" "}
                                    {formatCurrency(
                                      Math.ceil(
                                        (totalForQuantityKobo - minFirstPaymentKobo) /
                                          property.installmentDuration,
                                      ) / 100,
                                    )}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
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
