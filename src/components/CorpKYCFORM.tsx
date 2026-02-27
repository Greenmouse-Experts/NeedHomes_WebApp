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

interface KycFormData {
  companyName: string;
  // rcNumber: string;
  cacDocument: string | null;
  tinDocument: string | null;
  authorizedId: string | null;
}

export default function CorpKYCFORM() {
  const [auth] = useAuth();
  const accountType = auth?.user?.accountType || "CORPORATE";
  const [, setKyc] = useKyc();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<KycFormData>({
    defaultValues: {
      companyName: "",
      // rcNumber: "",
      cacDocument: null,
      tinDocument: null,
      authorizedId: null,
    },
  });

  // Image selection hooks for preview and state management
  const cacImage = useSelectImage("");
  const tinImage = useSelectImage("");
  const authorizedIdImage = useSelectImage("");

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
      reset({
        companyName: verification.companyName || "",
        // rcNumber: verification.rcNumber || "",
        cacDocument: verification.cacDocument || null,
        tinDocument: verification.tinDocument || null,
        authorizedId: verification.authorizedId || null,
      });
      if (verification.cacDocument) {
        cacImage.setPrev(verification.cacDocument);
      }
      if (verification.tinDocument) {
        tinImage.setPrev(verification.tinDocument);
      }
      if (verification.authorizedId) {
        authorizedIdImage.setPrev(verification.authorizedId);
      }
    } else if (isError && (error as AxiosError)?.response?.status === 404) {
      reset({
        companyName: "",
        // rcNumber: "",
        cacDocument: null,
        tinDocument: null,
        authorizedId: null,
      });
    }
  }, [kycData, reset, isError, error]);

  const kycMutation = useMutation<ApiResponse<any>, AxiosError, KycFormData>({
    mutationFn: (data) =>
      apiClient
        .post(`kyc/submit?accountType=${accountType}`, data)
        .then((res) => res.data),
    onSuccess: (data: ApiResponse) => {
      setKyc(data.data.verification);
      refetch();
    },
    onError: (error) => {
      toast.error(
        extract_message(error as any) ||
          "Failed to submit KYC. Please try again.",
      );
    },
  });

  const onSubmit = async (data: KycFormData) => {
    const submitData: KycFormData = {
      companyName: data.companyName,
      // rcNumber: data.rcNumber,
      cacDocument: null,
      tinDocument: null,
      authorizedId: null,
    };
    const upload_docs = async () => {
      try {
        // Upload images first
        if (cacImage.image && typeof cacImage.image !== "string") {
          const uploaded = await uploadImage(cacImage.image);
          submitData.cacDocument = uploaded.data.url;
        } else if (typeof cacImage.image === "string") {
          submitData.cacDocument = cacImage.image;
        }

        if (tinImage.image && typeof tinImage.image !== "string") {
          const uploaded = await uploadImage(tinImage.image);
          submitData.tinDocument = uploaded.data.url;
        } else if (typeof tinImage.image === "string") {
          submitData.tinDocument = tinImage.image;
        }

        if (
          authorizedIdImage.image &&
          typeof authorizedIdImage.image !== "string"
        ) {
          const uploaded = await uploadImage(authorizedIdImage.image);
          submitData.authorizedId = uploaded.data.url;
        } else if (typeof authorizedIdImage.image === "string") {
          submitData.authorizedId = authorizedIdImage.image;
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
    toast.promise(upload_docs, {
      loading: "Uploading documents...",
      success: "Documents uploaded successfully!",
      error: (err: any) =>
        extract_message(err) || "Failed to upload documents.",
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
            Corporate Verification
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Please provide your business registration details and documents.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Company Name */}
            <div className="space-y-2">
              <Label
                htmlFor="companyName"
                className="text-sm font-semibold text-gray-700"
              >
                Company Name
              </Label>
              <Input
                id="companyName"
                {...register("companyName", {
                  required: "Company name is required",
                })}
                placeholder="Enter registered company name"
                className="rounded-xl border-2 border-gray-200 bg-gray-50/50 py-3 focus:ring-brand-orange/20 focus:border-brand-orange transition-all"
              />
              {errors.companyName && (
                <p className="text-red-500 text-xs font-medium mt-1">
                  {errors.companyName.message}
                </p>
              )}
            </div>

            {/* RC Number */}
            {/*<div className="space-y-2">
              <Label
                htmlFor="rcNumber"
                className="text-sm font-semibold text-gray-700"
              >
                RC Number
              </Label>
              <Input
                id="rcNumber"
                {...register("rcNumber", { required: "RC Number is required" })}
                placeholder="Enter RC Number"
                className="rounded-xl border-2 border-gray-200 bg-gray-50/50 py-3 focus:ring-brand-orange/20 focus:border-brand-orange transition-all"
              />
              {errors.rcNumber && (
                <p className="text-red-500 text-xs font-medium mt-1">
                  {errors.rcNumber.message}
                </p>
              )}
            </div>*/}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* CAC Document */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700">
                CAC Document
              </Label>
              <SelectImage title="Upload CAC Certificate" {...cacImage} />
            </div>

            {/* TIN Document */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700">
                TIN Document
              </Label>
              <SelectImage title="Upload TIN Certificate" {...tinImage} />
            </div>
          </div>

          {/* Authorized ID */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-gray-700">
              Authorized Signatory ID
            </Label>
            <SelectImage
              title="Upload ID of Authorized Signatory"
              {...authorizedIdImage}
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
                "Submit Corporate Verification"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
