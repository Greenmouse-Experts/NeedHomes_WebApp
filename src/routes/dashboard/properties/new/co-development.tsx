import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm, Controller, useWatch } from "react-hook-form";
import { MutationCache, useMutation } from "@tanstack/react-query";
import SimpleInput from "@/simpleComps/inputs/SimpleInput";
import SimpleTextArea from "@/simpleComps/inputs/SimpleTextArea";
import UpdateImages from "@/components/images/UpdateImages";
import { useImages, useSelectImage } from "@/helpers/images";
import ThemeProvider from "@/simpleComps/ThemeProvider";
import { uploadImage } from "@/api/imageApi";
import { toast } from "sonner";
import { extract_message } from "@/helpers/apihelpers";
import apiClient, { type ApiResponse } from "@/api/simpleApi";
import { Home, TrendingUp } from "lucide-react";
import DefaultForm from "../-components/DefaultForm";
import LocalSelect from "@/simpleComps/inputs/LocalSelect";
import { useVideoUpload } from "../../-components/VideoUpload";
import { useDocumentUpload } from "../../-components/DocumentUpload";
import type { DocProps } from "@/types/form";
import { docPropsResolver } from "../-components/formresolver";
import { get_docs } from "./fractional";
import { uploadFile } from "@/api/fileApi";
import calculate_fees from "../-components/calculate_fees";

export const Route = createFileRoute(
  "/dashboard/properties/new/co-development",
)({
  component: RouteComponent,
});
type ExitRuleType =
  | "ANYTIME"
  | "AFTER_LOCK_IN_PERIOD"
  | "AFTER_PROJECT_COMPLETION"
  | "AT_EXIT_WINDOW_ONLY"
  | "NOT_ALLOWED";

interface CoDevelopmentFormValues extends DocProps {
  // minimumInvestment: number;
  // profitSharingRatio: number;
  // projectDuration: number;
  exitRule: ExitRuleType;
  propertyTitle: string;
}

function RouteComponent() {
  const docUpload = useDocumentUpload();
  const videoUpload = useVideoUpload();
  const nav = useNavigate();
  const useImageProps = useImages();
  //@ts-ignore

  const selectImageProps = useSelectImage(null);
  const form = useForm<CoDevelopmentFormValues>({
    // resolver: docPropsResolver as any,
    defaultValues: {
      exitRule: "ANYTIME",
      propertyType: "RESIDENTIAL",
      developmentStage: "PLANNING",
      premiumProperty: false,
      additionalFees: [],
    },
  });
  const paymentOption = useWatch({
    control: form.control,
    name: "paymentOption",
  });
  const mutation = useMutation({
    mutationFn: async (data: CoDevelopmentFormValues) => {
      let coverImageUrl = "";
      // Handle Cover Image Upload
      if (selectImageProps.image) {
        const uploaded = await uploadImage(selectImageProps.image);
        coverImageUrl = uploaded.data.url;
      } else if (selectImageProps.prev) {
        coverImageUrl = selectImageProps.prev;
      }
      if (!coverImageUrl) throw new Error("A cover image is required.");
      // Handle Gallery Uploads
      const uploadedGalleryUrls: string[] = [];
      const { newImages, images } = useImageProps;
      if (newImages && newImages.length > 0) {
        for (const img of newImages) {
          const uploaded = await uploadImage(img);
          if (uploaded.data?.url) uploadedGalleryUrls.push(uploaded.data.url);
        }
      }
      const allGallery = [
        ...(images || []).map((img) => img.url),
        ...uploadedGalleryUrls,
      ];

      // Handle Document Uploads
      const uploadedDocUrls: Partial<DocProps> = {};
      for (const docType in docUpload.documents) {
        const file =
          docUpload.documents[docType as keyof typeof docUpload.documents];
        if (file) {
          const uploaded = await uploadImage(file as any); // Assuming uploadImage can handle any file type and returns a URL
          if (uploaded.data?.url) {
            // Map the document type from useDocumentUpload to DocProps keys
            switch (docType) {
              case "certificate":
                uploadedDocUrls.certificate = uploaded.data.url;
                break;
              case "surveyPlanDocument":
                uploadedDocUrls.surveyPlanDocument = uploaded.data.url;
                break;
              case "transferDocument":
                uploadedDocUrls.transferDocument = uploaded.data.url;
                break;
              case "brochure":
                uploadedDocUrls.brochure = uploaded.data.url;
                break;
            }
          }
        }
      }

      // Handle Video Upload
      let videoUrl = "";
      if (videoUpload.videoFile) {
        const uploaded = await uploadImage(videoUpload.videoFile); // Assuming uploadImage can handle video files
        if (uploaded.data?.url) {
          videoUrl = uploaded.data.url;
        }
      }
      const keys = [
        "minimumInvestment",
        "minimumInstallmentAmount",
      ] as (typeof data)[string];
      const new_payload = calculate_fees(data, keys);
      const payload = {
        ...new_payload,
        ...uploadedDocUrls, // Add uploaded document URLs to the payload
        coverImage: coverImageUrl,
        galleryImages: allGallery,
        videos: videoUrl, // Add uploaded video URL to the payload
        completionDate: data.completionDate
          ? new Date(data.completionDate).toISOString()
          : null,
      };

      const response = await apiClient.post(
        "/admin/properties/codevelopment",
        payload,
      );
      return response.data;
    },
    onSuccess: (data: ApiResponse<{ id: string }>) => {
      nav({
        to: "/dashboard/properties/$propertyId",
        params: {
          propertyId: data.data.id,
        },
      });
    },
  });
  //
  // const mutation = useMutation({
  //   mutationFn: async (data: CoDevelopmentFormValues) => {
  //     let coverImageUrl = "";
  //     const selectProps = selectImageProps;
  //     const { newImages, images } = useImageProps;
  //     const docUploadProps = docUpload;
  //     const videoProps = videoUpload;
  //     if (selectProps.image) {
  //       const uploaded = await uploadImage(selectProps.image);
  //       coverImageUrl = uploaded.data?.url || "";
  //     } else if (selectProps.prev) {
  //       coverImageUrl = selectProps.prev;
  //     }

  //     const uploadedGalleryUrls: string[] = [];
  //     if (newImages && newImages.length > 0) {
  //       for (const img of newImages) {
  //         const uploaded = await uploadImage(img);
  //         if (uploaded.data?.url) uploadedGalleryUrls.push(uploaded.data.url);
  //       }
  //     }

  //     if (!coverImageUrl && images && images.length > 0) {
  //       coverImageUrl = images[0].url;
  //     }

  //     if (!coverImageUrl && uploadedGalleryUrls.length > 0) {
  //       coverImageUrl = uploadedGalleryUrls[0];
  //     }

  //     if (!coverImageUrl && data.coverImage) {
  //       coverImageUrl = data.coverImage;
  //     }

  //     if (!coverImageUrl) throw new Error("A cover image is required.");

  //     let videoUrl = "";
  //     if (videoProps.videoFile) {
  //       try {
  //         const url = await uploadFile(videoProps.videoFile);
  //         videoUrl = url || "";
  //       } catch (e) {}
  //     }

  //     const allGallery = [
  //       ...(images || []).map((img) => img.url),
  //       ...uploadedGalleryUrls,
  //     ];
  //     const uploadedDocUrls = await get_docs(docUploadProps);

  //     const totalPrice =
  //       Number(data.basePrice) +
  //       (data.additionalFees
  //         ? data.additionalFees.reduce(
  //             (acc, fee) => acc + (Number(fee.amount) || 0),
  //             0,
  //           )
  //         : 0);

  //     const payload = {
  //       ...data,
  //       ...uploadedDocUrls,
  //       coverImage: coverImageUrl,
  //       galleryImages: allGallery,
  //       videos: videoUrl,
  //       totalPrice,
  //       completionDate: data.completionDate
  //         ? new Date(data.completionDate).toISOString()
  //         : null,
  //     };

  //     const response = await apiClient.post(
  //       "/admin/properties/land-banking",
  //       payload,
  //     );
  //     return response.data;
  //   },
  //   onSuccess: (data: ApiResponse<{ id: string }>) => {
  //     nav({
  //       to: "/dashboard/properties/$propertyId",
  //       params: {
  //         propertyId: data.data.id,
  //       },
  //     });
  //   },
  // });
  const onSubmit = (data: CoDevelopmentFormValues) => {
    console.log(data);
    //@ts-ignore
    toast.promise(mutation.mutateAsync(data), {
      loading: "Creating property listing...",
      success: extract_message,
      error: (err) => extract_message(err) || "An error occurred.",
    });
  };

  return (
    <ThemeProvider className="space-y-4 bg-white ">
      <div className="bg-primary p-6 text-primary-content">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Home size={24} />
          New Co-Development Property
        </h1>
        <p className="opacity-80 text-sm">
          Complete the sections below to list a new investment opportunity.
        </p>
      </div>
      <DefaultForm
        docUpload={docUpload}
        videoUpload={videoUpload}
        useImagesProps={useImageProps}
        form={form as any}
        selectImageProps={selectImageProps as any}
        disableCompletion={true}
        // hideCompletion
        mutation={mutation as any}
        onSubmit={onSubmit}
      >
        <>
          <div className="flex items-center gap-2 border-b border-base-200 pb-2">
            <TrendingUp className="text-primary" size={20} />
            <h2 className="text-lg font-bold">
              4. Investment-Specific Details
            </h2>
          </div>
          <div className="grid md:grid-cols-2  gap-4">
            <LocalSelect
              {...form.register("exitRule")}
              label="Exit Strategy"
              value={form.watch("exitRule") ?? ""}
            >
              <option value="ANYTIME">Anytime (Liquid)</option>
              <option value="AFTER_LOCK_IN_PERIOD">After Lock-in Period</option>
              <option value="AFTER_PROJECT_COMPLETION">
                After Project Completion
              </option>
              <option value="AT_EXIT_WINDOW_ONLY">At Exit Window Only</option>
              <option value="NOT_ALLOWED">Not Allowed</option>
            </LocalSelect>
            <Controller
              name="paymentOption"
              control={form.control}
              render={({ field }) => (
                <LocalSelect {...field} label="Payment Option">
                  <option value="FULL_PAYMENT">Full Payment</option>
                  <option value="INSTALLMENT">Installment</option>
                </LocalSelect>
              )}
            />
            {paymentOption === "INSTALLMENT" && (
              <>
                <Controller
                  name="installmentDuration"
                  control={form.control}
                  render={({ field }) => (
                    //@ts-ignore
                    <SimpleInput
                      {...field}
                      type="number"
                      label="Installment Duration (Months)"
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    />
                  )}
                />
                <Controller
                  name="minimumInstallmentAmount"
                  control={form.control}
                  render={({ field }) => (
                    //@ts-ignore
                    <SimpleInput
                      {...field}
                      type="number"
                      label="Minimum Installment Amount"
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    />
                  )}
                />
              </>
            )}
          </div>
        </>
      </DefaultForm>
    </ThemeProvider>
  );
}
