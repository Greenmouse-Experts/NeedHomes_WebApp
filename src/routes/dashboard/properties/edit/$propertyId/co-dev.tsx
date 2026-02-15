import { createFileRoute } from "@tanstack/react-router";

import { useForm, Controller } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import SimpleInput from "@/simpleComps/inputs/SimpleInput";
import { useImages, useSelectImage } from "@/helpers/images";
import ThemeProvider from "@/simpleComps/ThemeProvider";
import { uploadImage } from "@/api/imageApi";
import { toast } from "sonner";
import { extract_message } from "@/helpers/apihelpers";
import apiClient, { type ApiResponse } from "@/api/simpleApi";
import { Home, TrendingUp } from "lucide-react";
import LocalSelect from "@/simpleComps/inputs/LocalSelect";
import type { DocProps } from "@/types/form";
import { useNavigate } from "@tanstack/react-router";
import { useDocumentUpload } from "@/routes/dashboard/-components/DocumentUpload";
import { useVideoUpload } from "@/routes/dashboard/-components/VideoUpload";
import DefaultForm from "../../-components/DefaultForm";
import type { PROPERTY_TYPE } from "@/types/property";
import PageLoader from "@/components/layout/PageLoader";
import {
  doc_helper,
  gallery_helper,
  get_cover_image,
  video_helper,
} from "@/routes/dashboard/-components/upload_helpers";
import { strip_co_dev } from "@/routes/dashboard/-components/form_cleaners";

export const Route = createFileRoute(
  "/dashboard/properties/edit/$propertyId/co-dev",
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
  minimumInvestment: number;
  profitSharingRatio: number;
  projectDuration: number;
  exitRule: ExitRuleType;
  propertyTitle: string;
}
function RouteComponent() {
  const { propertyId } = Route.useParams();
  const query = useQuery<ApiResponse<PROPERTY_TYPE>>({
    queryKey: ["admin-properties", propertyId],
    queryFn: async () => {
      let resp = await apiClient.get("/properties/" + propertyId);
      return resp.data;
    },
  });

  return (
    <>
      <PageLoader query={query}>
        {(data) => {
          const form_data = data.data;
          return (
            <>
              <FormField defaultValue={form_data} />
            </>
          );
        }}
      </PageLoader>
    </>
  );
}

function FormField({ defaultValue }: { defaultValue: PROPERTY_TYPE }) {
  const docUpload = useDocumentUpload(defaultValue as any);
  const videoUpload = useVideoUpload(defaultValue.videos);
  const nav = useNavigate();
  const useImageProps = useImages(
    defaultValue.galleryImages.map((url) => {
      return {
        url: url,
        path: url,
      };
    }),
  );
  //@ts-ignore

  const selectImageProps = useSelectImage(defaultValue.coverImage);
  const form = useForm<any>({
    defaultValues: {
      ...defaultValue,
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: CoDevelopmentFormValues) => {
      let coverImageUrl = await get_cover_image(selectImageProps);
      if (!coverImageUrl) throw new Error("A cover image is required.");
      const allGallery = await gallery_helper(useImageProps);
      // Handle Document Uploads
      const uploadedDocUrls: Partial<DocProps> = await doc_helper(docUpload);
      // Handle Video Upload
      let videoUrl = await video_helper(videoUpload);
      const totalPrice =
        Number(data.basePrice) +
        (data.additionalFees
          ? data.additionalFees.reduce(
              (acc, fee) => acc + (Number(fee.amount) || 0),
              0,
            )
          : 0);
      console.log("data_b4_spread", JSON.parse(JSON.stringify(data)));
      const payload = {
        ...data,
        ...uploadedDocUrls, // Add uploaded document URLs to the payload
        coverImage: coverImageUrl,
        galleryImages: allGallery,
        videos: videoUrl,
        totalPrice,
        completionDate: data.completionDate
          ? new Date(data.completionDate).toISOString()
          : null,
      };
      const new_payload = strip_co_dev(payload);
      const response = await apiClient.patch(
        `/admin/properties/${data.id}/codevelopment`,
        new_payload,
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
  const onSubmit = (data: CoDevelopmentFormValues) => {
    console.log(data);
    //@ts-ignore
    toast.promise(async () => await mutation.mutateAsync(data), {
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
          Edit Co-Development Property
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
            <Controller
              name="profitSharingRatio"
              control={form.control}
              render={({ field }) => (
                <SimpleInput
                  {...field}
                  value={field.value ?? ""}
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
                  value={field.value ?? ""}
                  label="Duration (Months)"
                  type="number"
                  onChange={(e) => field.onChange(e.target.valueAsNumber)}
                />
              )}
            />
            <Controller
              name="minimumInvestment"
              control={form.control}
              render={({ field }) => (
                <SimpleInput
                  {...field}
                  value={field.value ?? ""}
                  label="Min. Investment"
                  type="number"
                  onChange={(e) => field.onChange(e.target.valueAsNumber)}
                />
              )}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          </div>
        </>
      </DefaultForm>
    </ThemeProvider>
  );
}
