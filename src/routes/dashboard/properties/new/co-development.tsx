import { createFileRoute } from "@tanstack/react-router";
import { useForm, Controller } from "react-hook-form";
import { MutationCache, useMutation } from "@tanstack/react-query";
import SimpleInput from "@/simpleComps/inputs/SimpleInput";
import SimpleTextArea from "@/simpleComps/inputs/SimpleTextArea";
import UpdateImages from "@/components/images/UpdateImages";
import { useImages, useSelectImage } from "@/helpers/images";
import ThemeProvider from "@/simpleComps/ThemeProvider";
import { uploadImage } from "@/api/imageApi";
import { toast } from "sonner";
import { extract_message } from "@/helpers/apihelpers";
import apiClient from "@/api/simpleApi";
import { Home, TrendingUp } from "lucide-react";
import DefaultForm from "../-components/DefaultForm";
import LocalSelect from "@/simpleComps/inputs/LocalSelect";

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

//@ts-expect-error
interface CoDevelopmentFormValues extends DocProps {
  minimumInvestment: number;
  profitSharingRatio: number;
  projectDuration: number;
  exitRule: ExitRuleType;
  propertyTitle: string;
}

function RouteComponent() {
  const mutation = useMutation({
    mutationFn: async (data: CoDevelopmentFormValues) => {
      let coverImageUrl = "";

      // Handle Cover Image Upload
      if (selectProps.image) {
        const uploaded = await uploadImage(selectProps.image);
        coverImageUrl = uploaded.data.url;
      } else if (selectProps.prev) {
        coverImageUrl = selectProps.prev;
      }

      if (!coverImageUrl) throw new Error("A cover image is required.");

      // Handle Gallery Uploads
      const uploadedGalleryUrls: string[] = [];
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
          const uploaded = await uploadImage(file); // Assuming uploadImage can handle any file type and returns a URL
          if (uploaded.data?.url) {
            // Map the document type from useDocumentUpload to DocProps keys
            switch (docType) {
              case "certificateOfOwnership":
                uploadedDocUrls.certificate = uploaded.data.url;
                break;
              case "surveyPlan":
                uploadedDocUrls.surveyPlanDocument = uploaded.data.url;
                break;
              case "transferOfOwnershipDocument":
                uploadedDocUrls.transferDocument = uploaded.data.url;
                break;
              case "brochureFactSheet":
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

      const totalPrice =
        Number(data.basePrice) +
        data.additionalFees.reduce(
          (acc, fee) => acc + (Number(fee.amount) || 0),
          0,
        );

      const payload = {
        ...data,
        ...uploadedDocUrls, // Add uploaded document URLs to the payload
        coverImage: coverImageUrl,
        galleryImages: allGallery,
        videos: videoUrl, // Add uploaded video URL to the payload
        totalPrice,
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
  });
  const onSubmit = (data: CoDevelopmentFormValues) => {
    toast.promise(mutation.mutateAsync(data), {
      loading: "Creating property listing...",
      success: extract_message,
      error: (err) => extract_message(err) || "An error occurred.",
    });
  };
  const useImageProps = useImages();
  const form = useForm();
  //@ts-ignore
  const selectImageProps = useSelectImage(null);
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
        useImagesProps={useImageProps}
        form={form}
        selectImageProps={selectImageProps as any}
        mutation={mutation as any}
        onSubmit={onSubmit}
      >
        <section className="">
          <div className="flex items-center gap-2 border-b border-base-200 pb-2">
            <TrendingUp className="text-primary" size={20} />
            <h2 className="text-lg font-bold">
              4. Investment-Specific Details
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Controller
              name="profitSharingRatio"
              control={form.control}
              render={({ field }) => (
                <SimpleInput
                  {...field}
                  label="Profit Ratio (0-100)%"
                  type="number"
                  step="0.01"
                  onChange={(e) => field.onChange(e.target.valueAsNumber)}
                />
              )}
            />
            <Controller
              name="projectDuration"
              control={form.control}
              render={({ field }) => (
                <SimpleInput
                  {...field}
                  label="Duration (Months)"
                  type="number"
                  onChange={(e) => field.onChange(e.target.valueAsNumber)}
                />
              )}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Controller
              name="exitRule"
              control={form.control}
              render={({ field }) => (
                <LocalSelect {...field} label="Exit Strategy">
                  <option value="ANYTIME">Anytime (Liquid)</option>
                  <option value="AFTER_LOCK_IN_PERIOD">
                    After Lock-in Period
                  </option>
                  <option value="AFTER_PROJECT_COMPLETION">
                    After Project Completion
                  </option>
                  <option value="AT_EXIT_WINDOW_ONLY">
                    At Exit Window Only
                  </option>
                  <option value="NOT_ALLOWED">Not Allowed</option>
                </LocalSelect>
              )}
            />
          </div>
        </section>
      </DefaultForm>
    </ThemeProvider>
  );
}
