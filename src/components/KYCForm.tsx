import { Label } from "./ui/Label";
import { Input } from "./ui/Input"; // Assuming Input component exists
import { Button } from "./ui/Button"; // Assuming Button component exists
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import apiClient, { type ApiResponse } from "@/api/simpleApi"; // Adjust path as needed
import { toast } from "sonner";
import { useAuth } from "@/store/authStore";
import { useEffect } from "react";
import SelectImage from "@/components/images/SelectImage";
import { useSelectImage } from "@/helpers/images";
import { uploadImage } from "@/api/imageApi";
import { extract_message } from "@/helpers/apihelpers";
import type { VERIFICATION_REQUEST } from "@/types";
import type { AxiosError } from "axios";

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

  const {
    register,
    handleSubmit,
    reset,
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

  const kycMutation = useMutation<ApiResponse<any>, AxiosError, KycFormData>({
    mutationFn: (data) =>
      apiClient
        .post(`kyc/submit?accountType=${accountType}`, data)
        .then((res) => res.data),
    onSuccess: (data) => {
      toast.success(data.message || "KYC submitted successfully!");
    },
    onError: (error) => {
      toast.error(
        extract_message(error) || "Failed to submit KYC. Please try again.",
      );
    },
  });

  const onSubmit = async (data: KycFormData) => {
    const submitData: KycFormData = {
      idType: data.idType,
      address: data.address,
      frontPage: null,
      backPage: null,
      utilityBill: null,
    };

    try {
      // Upload images first
      if (frontImage.image && typeof frontImage.image !== "string") {
        const uploaded = await uploadImage(frontImage.image);
        submitData.frontPage = uploaded.data.url;
      } else if (typeof frontImage.image === "string") {
        submitData.frontPage = frontImage.image;
      }

      if (backImage.image && typeof backImage.image !== "string") {
        const uploaded = await uploadImage(backImage.image);
        submitData.backPage = uploaded.data.url;
      } else if (typeof backImage.image === "string") {
        submitData.backPage = backImage.image;
      }

      if (utilityImage.image && typeof utilityImage.image !== "string") {
        const uploaded = await uploadImage(utilityImage.image);
        submitData.utilityBill = uploaded.data.url;
      } else if (typeof utilityImage.image === "string") {
        submitData.utilityBill = utilityImage.image;
      }

      // Submit KYC data
      toast.promise(kycMutation.mutateAsync(submitData), {
        loading: "Submitting KYC...",
        success: (res) => res.message || "KYC submitted successfully!",
        error: (err: any) => extract_message(err) || "Failed to submit KYC.",
      });
    } catch (err) {
      console.error("Error during KYC submission:", err);
      toast.error("An error occurred while processing your request.");
    }
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
    <>
      {/*{isError && error.status == 404 && (
        <>
          <div className="" data-theme="nh-light info info-error">
            D
          </div>
        </>
      )}*/}
      {/*{kycData?.data.verification}*/}
      <div>
        <div className="mb-4s md:mb-6">
          <h3 className="text-xs md:text-sm font-semibold text-gray-500 uppercase mb-3 md:mb-4">
            KYC
          </h3>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl">
          {/* ID Type */}
          <div className="space-y-2 mb-4 md:mb-6">
            <Label htmlFor="idType" className="text-sm">
              ID Type
            </Label>
            <select
              id="idType"
              {...register("idType", { required: "ID Type is required" })}
              className="flex w-full rounded-xl border-2 border-gray-200 bg-white px-3 md:px-4 py-2 md:py-3 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all duration-300"
            >
              <option value="">Select ID Type</option>
              <option value="NIN">NIN</option>
              <option value="national-id">National ID</option>
              <option value="drivers-license">Driver's License</option>
              <option value="passport">International Passport</option>
              <option value="voters-card">Voter's Card</option>
            </select>
            {errors.idType && (
              <p className="text-red-500 text-xs">{errors.idType.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6">
            {/* Upload Front */}
            <div className="space-y-2">
              <SelectImage title="Upload Front" {...frontImage} />
              {errors.frontPage && (
                <p className="text-red-500 text-xs">
                  {errors.frontPage.message}
                </p>
              )}
            </div>

            {/* Upload Back */}
            <div className="space-y-2">
              <SelectImage title="Upload Back" {...backImage} />
              {errors.backPage && (
                <p className="text-red-500 text-xs">
                  {errors.backPage.message}
                </p>
              )}
            </div>
          </div>

          {/* Utility Bill */}
          <div className="space-y-2 mb-4 md:mb-6">
            <SelectImage
              title="Utility Bill (Proof of Address)"
              {...utilityImage}
            />
            {errors.utilityBill && (
              <p className="text-red-500 text-xs">
                {errors.utilityBill.message}
              </p>
            )}
          </div>

          {/* Address */}
          <div className="space-y-2 mb-4 md:mb-6">
            <Label htmlFor="address" className="text-sm">
              Address
            </Label>
            <Input
              id="address"
              {...register("address", { required: "Address is required" })}
              placeholder="Zone A 1 Egbi Ewaji St, Wuse, Abuja 900001, Federal Capital Territory, Nigeria"
              className="text-sm md:text-base"
            />
            {errors.address && (
              <p className="text-red-500 text-xs">{errors.address.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-4 md:pt-6">
            <Button
              type="submit"
              className="bg-brand-orange hover:bg-brand-orange-dark text-white px-6 md:px-12 text-sm md:text-base w-full sm:w-auto"
              disabled={kycMutation.isPending}
            >
              {kycMutation.isPending ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
