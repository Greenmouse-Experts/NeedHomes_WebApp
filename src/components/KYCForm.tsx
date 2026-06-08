import { Label } from "./ui/Label";
import { Input } from "./ui/Input"; // Assuming Input component exists
import { Button } from "./ui/Button"; // Assuming Button component exists
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import apiClient, { type ApiResponse } from "@/api/simpleApi"; // Adjust path as needed
import { toast } from "sonner";
import { useAuth, useKyc } from "@/store/authStore";
import { useEffect } from "react";
import SelectImage from "@/components/images/SelectImage";
import { useSelectImage } from "@/helpers/images";
import { uploadImage } from "@/api/imageApi";
import { extract_message } from "@/helpers/apihelpers";
import type { VERIFICATION_REQUEST } from "@/types";
import type { AxiosError } from "axios";
import ThemeProvider from "@/simpleComps/ThemeProvider";
import CorpKYCFORM from "./CorpKYCFORM";
import GooglePlacesInput from "@/components/inputs/GooglePlacesInput";

interface KycFormData {
  idType:
    | "NIN"
    | "national-id"
    | "drivers-license"
    | "passport"
    | "voters-card"
    | "";
  frontPage: string | null;
  backPage: string | null;
  utilityBill: string | null;
  address: string;
}

export default function KYCForm() {
  const [auth] = useAuth();
  const accountType = auth?.user?.accountType || "INDIVIDUAL";
  const [kyc, setKyc] = useKyc();
  if (auth?.user.accountType == "CORPORATE") {
    return <CorpKYCFORM />;
  }
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<KycFormData>({
    defaultValues: {
      idType: "",
      frontPage: null,
      backPage: null,
      utilityBill: null,
      address: "",
    },
  });

  // Image selection hooks for preview and state management
  const frontImage = useSelectImage(null);
  const backImage = useSelectImage(null);
  const utilityImage = useSelectImage(null);

  // Fetch existing KYC data
  const {
    data: kycData,
    isLoading: isLoadingKyc,
    isError,
    error,
    refetch,
  } = useQuery<ApiResponse<{ bank: any; verification: VERIFICATION_REQUEST }>>({
    queryKey: ["kyc-status", accountType],
    queryFn: () => apiClient.get(`kyc`).then((res) => res.data),
    enabled: !!accountType,
  });

  // Populate form if data exists
  useEffect(() => {
    if (kycData?.data.verification) {
      const verification = kycData.data.verification;
      console.log(verification);
      // setkyc(kyc.);
      reset({
        idType: (verification.idType as KycFormData["idType"]) || "",
        address: verification.address || "",
        frontPage: verification.frontPage || null,
        backPage: verification.backPage || null,
        utilityBill: verification.utilityBill || null,
      });
      if (verification.frontPage) {
        frontImage.setPrev(verification.frontPage);
      }
      if (verification.backPage) {
        backImage.setPrev(verification.backPage);
      }
      if (verification.utilityBill) {
        utilityImage.setPrev(verification.utilityBill);
      }
    } else if (isError && (error as AxiosError)?.response?.status === 404) {
      reset({
        idType: "",
        address: "",
        frontPage: null,
        backPage: null,
        utilityBill: null,
      });
    }
  }, [kycData, reset, isError, error]);

  // Resolve a document URL: upload a newly selected file, otherwise keep the
  // existing URL stored in `prev` (so text-only edits don't wipe images).
  const resolveDoc = async (
    hook: ReturnType<typeof useSelectImage>,
  ): Promise<string | null> => {
    if (hook.image) {
      const uploaded = await uploadImage(hook.image);
      return uploaded.data.url;
    }
    return hook.prev || null;
  };

  const kycMutation = useMutation<ApiResponse<any>, AxiosError, KycFormData>({
    // Uploads + submit run as a single transaction.
    mutationFn: async (data) => {
      const submitData: KycFormData = {
        idType: data.idType,
        address: data.address,
        frontPage: await resolveDoc(frontImage),
        backPage: await resolveDoc(backImage),
        utilityBill: await resolveDoc(utilityImage),
      };
      const res = await apiClient.post(
        `kyc/submit?accountType=${accountType}`,
        submitData,
      );
      return res.data;
    },
    onSuccess: (data: ApiResponse) => {
      setKyc(data.data.verification);
      refetch();
    },
  });

  const onSubmit = (data: KycFormData) => {
    toast.promise(kycMutation.mutateAsync(data), {
      loading: "Uploading documents and submitting KYC...",
      success: (res) => res.message || "KYC submitted successfully!",
      error: (err: any) => extract_message(err) || "Failed to submit KYC.",
    });
  };

  if (isLoadingKyc) {
    return (
      <div className="flex flex-col h-96 items-center justify-center space-y-4">
        <div className="relative flex items-center justify-center">
          <div className="h-12 w-12 animate-spin border-4 border-gray-300 border-t-brand-orange rounded-full"></div>
        </div>
        <p className="text-gray-500 animate-pulse font-medium">
          Loading KYC details...
        </p>
      </div>
    );
  }

  return (
    <div className=" mx-auto">
      {kycData?.data.verification.status === "REJECTED" && (
        <ThemeProvider className="mb-8">
          <div className="bg-red-50 border border-red-200 rounded-xl overflow-hidden">
            <div className="bg-red-100 px-4 py-2 border-b border-red-200">
              <h2 className="text-sm font-bold text-red-700 uppercase tracking-wider">
                Rejection Reason
              </h2>
            </div>
            <div className="p-4">
              <p className="text-red-600 font-medium leading-relaxed">
                {kycData?.data.verification.RejectionReason}
              </p>
            </div>
          </div>
        </ThemeProvider>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 md:p-8">
        <div className="mb-8 border-b border-gray-100 pb-4">
          <h3 className="text-lg font-bold text-gray-900">
            Identity Verification
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Please provide valid government-issued identification and proof of
            address.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* ID Type */}
          <div className="space-y-2">
            <Label
              htmlFor="idType"
              className="text-sm font-semibold text-gray-700"
            >
              Document Type
            </Label>
            <select
              id="idType"
              {...register("idType", { required: "Please select an ID type" })}
              className="flex w-full rounded-xl border-2 border-gray-200 bg-gray-50/50 px-4 py-3 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange transition-all duration-200 appearance-none cursor-pointer"
            >
              <option value="">Select ID Type</option>
              <option value="NIN">NIN (National Identification Number)</option>
              {/*<option value="national-id">National ID Card</option>*/}
              <option value="drivers-license">Driver's License</option>
              <option value="passport">International Passport</option>
              <option value="voters-card">Voter's Card</option>
            </select>
            {errors.idType && (
              <p className="text-red-500 text-xs font-medium mt-1">
                {errors.idType.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Upload Front */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700">
                Front View
              </Label>
              <SelectImage title="Click to upload front" {...frontImage} />
              {errors.frontPage && (
                <p className="text-red-500 text-xs font-medium mt-1">
                  {errors.frontPage.message}
                </p>
              )}
            </div>

            {/* Upload Back */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700">
                Back View
              </Label>
              <SelectImage title="Click to upload back" {...backImage} />
              {errors.backPage && (
                <p className="text-red-500 text-xs font-medium mt-1">
                  {errors.backPage.message}
                </p>
              )}
            </div>
          </div>

          {/* Utility Bill */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-gray-700">
              Proof of Address
            </Label>
            <SelectImage
              title="Upload Utility Bill (Electricity, Water, etc.)"
              {...utilityImage}
            />
            {errors.utilityBill && (
              <p className="text-red-500 text-xs font-medium mt-1">
                {errors.utilityBill.message}
              </p>
            )}
          </div>

          {/* Address */}
          <div className="space-y-2">
            <input
              type="hidden"
              {...register("address", {
                required: "Full residential address is required",
              })}
            />
            <GooglePlacesInput
              label="Residential Address"
              required
              value={watch("address")}
              placeholder="House Number, Street Name, City, State"
              error={errors.address?.message}
              onLocationChange={(data) =>
                setValue("address", data.location, { shouldValidate: true })
              }
            />
          </div>

          {/* Submit Button */}
          <div className="pt-6">
            <Button
              type="submit"
              className="bg-brand-orange hover:bg-brand-orange-dark text-white h-12 px-12 text-base font-bold w-full md:w-auto rounded-xl shadow-lg shadow-brand-orange/20 transition-all active:scale-[0.98]"
              disabled={kycMutation.isPending}
            >
              {kycMutation.isPending ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin border-2 border-white/30 border-t-white rounded-full" />
                  Processing...
                </span>
              ) : (
                "Submit Verification"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
