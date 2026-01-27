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
  const frontImage = useSelectImage();
  const backImage = useSelectImage();
  const utilityImage = useSelectImage();

  // Fetch existing KYC data
  const { data: kycData, isLoading: isLoadingKyc } = useQuery({
    queryKey: ["kyc-status", accountType],
    queryFn: () => apiClient.get(`kyc`).then((res) => res.data),
    enabled: !!accountType,
  });

  // Populate form if data exists
  useEffect(() => {
    if (kycData?.data) {
      reset({
        idType: kycData.data.idType || "",
        address: kycData.data.address || "",
        frontPage: kycData.data.frontPage?.url || null,
        backPage: kycData.data.backPage?.url || null,
        utilityBill: kycData.data.utilityBill?.url || null,
      });
      if (kycData.data.frontPage?.url) {
        frontImage.setImage(kycData.data.frontPage.url);
      }
      if (kycData.data.backPage?.url) {
        backImage.setImage(kycData.data.backPage.url);
      }
      if (kycData.data.utilityBill?.url) {
        utilityImage.setImage(kycData.data.utilityBill.url);
      }
    }
  }, [kycData, reset]);

  const kycMutation = useMutation<ApiResponse<any>, Error, KycFormData>({
    mutationFn: (data) =>
      apiClient
        .post(`kyc/submit?accountType=${accountType}`, data)
        .then((res) => res.data),
    onSuccess: (data) => {
      // This success toast is now handled by toast.promise
    },
    onError: (error: any) => {
      // This error toast is now handled by toast.promise
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

    const uploadPromises: Promise<any>[] = [];

    if (frontImage.image && typeof frontImage.image !== "string") {
      uploadPromises.push(
        uploadImage(frontImage.image).then((uploaded) => {
          submitData.frontPage = uploaded.url;
        }),
      );
    } else if (typeof frontImage.image === "string") {
      submitData.frontPage = frontImage.image;
    }

    if (backImage.image && typeof backImage.image !== "string") {
      uploadPromises.push(
        uploadImage(backImage.image).then((uploaded) => {
          submitData.backPage = uploaded.url;
        }),
      );
    } else if (typeof backImage.image === "string") {
      submitData.backPage = backImage.image;
    }

    if (utilityImage.image && typeof utilityImage.image !== "string") {
      uploadPromises.push(
        uploadImage(utilityImage.image).then((uploaded) => {
          submitData.utilityBill = uploaded.url;
        }),
      );
    } else if (typeof utilityImage.image === "string") {
      submitData.utilityBill = utilityImage.image;
    }

    await toast.promise(Promise.all(uploadPromises), {
      loading: "Uploading images...",
      success: "Images uploaded successfully!",
      error: "Failed to upload images.",
    });

    toast.promise(kycMutation.mutateAsync(submitData), {
      loading: "Submitting KYC...",
      success: (res) => res.message || "KYC submitted successfully!",
      error: (err: any) =>
        err.response?.data?.message || "Failed to submit KYC.",
    });
  };

  if (isLoadingKyc) return <div>Loading KYC details...</div>;

  return (
    <>
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
