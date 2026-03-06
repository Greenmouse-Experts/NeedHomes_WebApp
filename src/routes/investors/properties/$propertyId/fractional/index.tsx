import { createFileRoute } from "@tanstack/react-router";
import { MapPin, Percent, TrendingUp, ChevronLeft } from "lucide-react";
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

export const Route = createFileRoute(
  "/investors/properties/$propertyId/fractional/",
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
    const fixed = parseInt(amount.toPrecision());
    return `₦ ${fixed.toLocaleString()}`;
  };
  const mutate = useMutation({
    mutationFn: async (data: { amountPaid: number; quantity: number }) => {
      let resp = await apiClient.post("/investments", {
        propertyId: propertyId,
        amountPaid: parseInt(data.amountPaid.toFixed()),
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

  interface OUTRIGHTDATA {
    paymentOption: "FULL_PAYMENT" | "INSTALLMENT";
    minimumInstallmentAmount?: number;
    installmentDuraion?: number;
  }
  const form = useForm({
    defaultValues: {
      installment: false,
      amount: 0,
      quantity: 1,
    },
  });
  // let payAmount = form.watch("amount");

  return (
    <PageLoader query={query}>
      {(data) => {
        const property = data.data as PROPERTY_TYPE & OUTRIGHTDATA;
        // Calculate total price including additional fees if they exist
        const basePrice = property.basePrice / 100;
        const additionalFeesTotal = (property.additionalFees || []).reduce(
          (sum: number, fee: AdditionalFee) => sum + fee.amount / 100,
          0,
        );
        const systemChargeAmount =
          (property.systemCharges.platformChargePercentage / 100) * basePrice;
        const totalPrice = basePrice + additionalFeesTotal + systemChargeAmount;

        let breakdown: {
          totalPrice: number;
          additionalFees: AdditionalFee[];
          additionalFeesTotal: number;
          installmentAmount?: number;
          installmentDuration?: number;
          systemCharge: number;
          pricePerShare: number;
          availableShares: number;
        } = {
          totalPrice: totalPrice,
          additionalFees: property.additionalFees || [],
          additionalFeesTotal: additionalFeesTotal,
          systemCharge: systemChargeAmount,
          pricePerShare: property.pricePerShare,
          availableShares: property.availableShares,
        };

        if (property.paymentOption === "INSTALLMENT") {
          breakdown.installmentAmount = property.minimumInstallmentAmount;
          //@ts-ignore
          breakdown.installmentDuration = property.installmentDuration;
        }

        const payInstall = form.watch("installment");

        const installOptions = property.paymentOption == "INSTALLMENT";
        const payAmount = form.watch("amount");
        useEffect(() => {
          if (installOptions) {
            form.setValue("installment", true);
            form.setValue("quantity", property.minimumShares);
          }
        }, [installOptions]);
        useEffect(() => {
          if (breakdown.installmentAmount) {
            const charge = (2 / 100) * breakdown.installmentAmount;
            form.setValue(
              "amount",
              (breakdown.installmentAmount + charge) / 100,
            );
          }
        }, []);
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
                        return toast.promise(
                          mutate.mutateAsync({
                            amountPaid: amount * 100,
                            quantity: quantity,
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
                          amountPaid: breakdown.totalPrice * 100,
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
                      : breakdown.totalPrice.toLocaleString()}
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
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Base Price</span>
                      <span className="text-sm font-medium">
                        {formatCurrency(property.basePrice / 100)}
                      </span>
                    </div>
                    <div className="ring rounded-box fade">
                      <h2 className="p-3 border-b fade text-sm font-bold text-gray-900">
                        Shares
                      </h2>
                      <div className="p-2 space-y-2">
                        <div className="pt-2  border-gray-200 flex justify-between items-center">
                          <span className="text-sm  text-gray-900">
                            Price per share
                          </span>
                          <span className="text-sm font-bold">
                            {formatCurrency(breakdown.pricePerShare / 100)}
                          </span>
                        </div>
                        <div className="pt-2 border-t border-gray-200 flex justify-between items-center">
                          <span className="text-sm  text-gray-900">
                            Avaialble shares
                          </span>
                          <span className="text-sm  ">
                            {breakdown.availableShares}
                          </span>
                        </div>
                      </div>
                    </div>

                    <Controller
                      control={form.control}
                      name="quantity"
                      render={({ field }) => {
                        const currentQuantity = field.value;
                        const pricePerShare = breakdown.pricePerShare / 100;
                        const totalCost = currentQuantity * pricePerShare;
                        const minimumShares = property.minimumShares || 1; // Default to 1 if not set

                        const incrementQuantity = () => {
                          field.onChange(currentQuantity + 1);
                          form.setValue(
                            "amount",
                            (currentQuantity + 1) * pricePerShare,
                          );
                        };

                        const decrementQuantity = () => {
                          if (currentQuantity > minimumShares) {
                            field.onChange(currentQuantity - 1);
                            form.setValue(
                              "amount",
                              (currentQuantity - 1) * pricePerShare,
                            );
                          }
                        };

                        // useEffect(() => {
                        //   if (!payInstall) {
                        //     form.setValue("quantity", minimumShares);
                        //     form.setValue(
                        //       "amount",
                        //       minimumShares * pricePerShare,
                        //     );
                        //   }
                        // }, [payInstall, minimumShares, pricePerShare]);

                        return (
                          <div className="ring rounded-box fade">
                            <h2 className="p-3 border-b fade text-sm font-bold text-gray-900">
                              Select Shares
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
                                      field.value > breakdown.availableShares
                                    }
                                    className="px-2 py-1"
                                  >
                                    +
                                  </Button>
                                </div>
                              </div>
                              <div className="pt-2 border-t border-gray-200 flex justify-between items-center">
                                <span className="text-sm text-gray-900">
                                  Cost for {currentQuantity} shares
                                </span>
                                <span className="text-sm font-bold">
                                  {formatCurrency(totalCost)}
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
                          Additional Fees
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

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        System Charge:{" "}
                        {property.systemCharges.platformChargePercentage}%
                      </span>
                      <span className="text-sm font-medium">
                        {formatCurrency(breakdown.systemCharge)}
                      </span>
                    </div>

                    {/*<div className="pt-2 border-t border-gray-200 flex justify-between items-center">
                      <span className="text-sm font-bold text-gray-900">
                        Total
                      </span>
                      <span className="text-lg font-bold text-(--color-orange)">
                        {formatCurrency(breakdown.totalPrice)}
                      </span>
                    </div>*/}
                  </div>

                  {property.paymentOption === "INSTALLMENT" && (
                    <div className="p-3 bg-blue-50 rounded border border-blue-100">
                      <p className="text-xs text-blue-700">
                        You are paying the minimum installment of{" "}
                        <span className="font-bold">
                          {formatCurrency(
                            (property.minimumInstallmentAmount || 0) / 100,
                          )}
                        </span>
                        . Remaining balance will be spread over{" "}
                        {property.installmentDuration} months.
                      </p>
                    </div>
                  )}
                </div>
                {installOptions && (
                  <div className="flex gap-2 items-center mt-2">
                    <input
                      disabled={installOptions}
                      {...form.register("installment")}
                      type="checkbox"
                      className="checkbox checkbox-sm"
                    />
                    <h2 className="text-sm">Pay Installmentally</h2>
                  </div>
                )}
                {payInstall && (
                  <div className="mt-4">
                    {/*{JSON.stringify(property["installmentDuration"])}*/}
                    <InstallMentForm
                      form={form}
                      duration={property.installmentDuration || 0}
                      minimumInvestmentAmount={breakdown.installmentAmount || 0}
                    />
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
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="w-4 h-4 md:w-5 md:h-5 shrink-0" />
                        <span className="text-sm md:text-lg">
                          {property.location}
                        </span>
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
                                Price Per Share
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
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                          System Charges
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-600">
                              Platform Charge
                            </p>
                            <p className="text-lg font-semibold text-gray-900">
                              {property.systemCharges.platformChargePercentage}%
                            </p>
                          </div>
                          {/*<div>
                            <p className="text-sm text-gray-600">
                              Partner Charge
                            </p>
                            <p className="text-lg font-semibold text-gray-900">
                              {property.systemCharges.partnerChargePercentage}%
                            </p>
                          </div>*/}
                        </div>
                      </div>

                      {/* Additional Fees */}
                      <AdditionalFees fees={property.additionalFees} />
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
  duration,
  minimumShares,
}: {
  form: any;
  duration: string | number;
  minimumInvestmentAmount: number;
  minimumShares?: number;
}) => {
  const formatCurrency = (amount: number | null | undefined) => {
    if (amount === null || amount === undefined) return "N/A";
    const fixed = parseInt(amount.toPrecision());
    return `₦ ${fixed.toLocaleString()}`;
  };

  return (
    <div className="space-y-4 p-4 ring rounded-box fade">
      <div className="flex items-end gap-2">
        <div className="flex-1 space-y-4">
          <SimpleInput
            // disabled
            {...form.register("amount", {
              valueAsNumber: true,
              min: {
                value: minimumInvestmentAmount,
                message: `Amount must be at least ${formatCurrency(minimumInvestmentAmount)}`,
              },
            })}
            label="Installment Amount"
            type="number"
            placeholder={formatCurrency(minimumInvestmentAmount)}
            className="w-full"
          />

          {form.formState.errors.amount && (
            <p className="text-red-500 text-sm mt-1">
              {form.formState.errors.amount.message as string}
            </p>
          )}
        </div>
      </div>

      <p className=" text-gray-600/60 text-sm ">
        <span className="font-semibold text-gray-900/60 ">
          The balance payment can be made anytime without waiting for
          installment date
        </span>
      </p>
    </div>
  );
};
