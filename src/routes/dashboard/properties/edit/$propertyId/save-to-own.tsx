import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm, Controller } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import SimpleInput from "@/simpleComps/inputs/SimpleInput";
import { toast } from "sonner";
import { extract_message } from "@/helpers/apihelpers";
import apiClient, { type ApiResponse } from "@/api/simpleApi";
import LocalSelect from "@/simpleComps/inputs/LocalSelect";
import { useVideoUpload } from "@/routes/dashboard/-components/VideoUpload";
import { useDocumentUpload } from "@/routes/dashboard/-components/DocumentUpload";
import { Clock, Home, Image as Layers } from "lucide-react";
import type { DocProps } from "@/types/form";
import { useImages, useSelectImage } from "@/helpers/images";
import ThemeProvider from "@/simpleComps/ThemeProvider";
import type { PROPERTY_TYPE } from "@/types/property";
import PageLoader from "@/components/layout/PageLoader";
import {
  doc_helper,
  gallery_helper,
  get_cover_image,
  video_helper,
} from "@/routes/dashboard/-components/upload_helpers";
import DefaultForm from "../../-components/DefaultForm";
import {
  strip_fractional,
  strip_land_banking,
} from "@/routes/dashboard/-components/form_cleaners";
export const Route = createFileRoute(
  "/dashboard/properties/edit/$propertyId/save-to-own",
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { propertyId } = Route.useParams();
  const query = useQuery<ApiResponse<PROPERTY_TYPE>>({
    queryKey: ["edit", propertyId],
    queryFn: async () => {
      let resp = await apiClient.get("/properties/" + propertyId);
      return resp.data;
    },
  });
  return (
    <>
      <PageLoader query={query}>
        {(data) => {
          const formData = data.data;
          return (
            <>
              <FormField defaultValue={formData} />
            </>
          );
        }}
      </PageLoader>
    </>
  );
}

interface SaveToOwnFormValues extends DocProps {
  targetPropertyPrice: number;
  // minimumSavingsAmount: number;
  savingsFrequency: "DAILY" | "WEEKLY" | "MONTHLY";
  savingsDuration: number;
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
  const methods = useForm<any>({
    defaultValues: {
      ...defaultValue,
    },
  });
  const mutation = useMutation({
    mutationFn: async (data: SaveToOwnFormValues) => {
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
      const new_payload = strip_fractional(payload);
      const response = await apiClient.patch(
        `/admin/properties/${data.id}/fractional`,
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

  const onSubmit = (data: SaveToOwnFormValues) => {
    //@ts-ignore
    toast.promise(mutation.mutateAsync(data), {
      loading: "Creating fractional property...",
      success: extract_message,
      error: (err) => extract_message(err) || "An error occurred.",
    });
  };
  return (
    <ThemeProvider>
      <div className="mx-auto">
        <div className="bg-base-200 rounded-2xl shadow-xl border border-base-200 overflow-hidden">
          <div className="bg-primary p-6 text-secondary-content">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Home size={24} />
              Edit Save-to-Own Property
            </h1>
            <p className="opacity-80 text-sm">
              Create a structured savings plan for prospective homeowners.
            </p>
          </div>

          <DefaultForm
            docUpload={docUpload}
            videoUpload={videoUpload}
            useImagesProps={useImageProps}
            form={methods as any}
            selectImageProps={selectImageProps as any}
            mutation={mutation as any}
            onSubmit={onSubmit}
          >
            <section className="space-y-6">
              <div className="flex items-center gap-2 pb-2 border-b border-base-200">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  <Layers size={20} />
                </div>
                <h2 className="text-lg font-bold">4. Save To Own Details</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Controller
                  name="targetPropertyPrice"
                  control={methods.control}
                  render={({ field }) => (
                    <SimpleInput
                      {...field}
                      label="Target Property Price"
                      type="number"
                      icon={<span>₦</span>}
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    />
                  )}
                />
                <Controller
                  name="savingsFrequency"
                  control={methods.control}
                  render={({ field }) => (
                    <LocalSelect {...field} label="Savings Frequency">
                      <option value="DAILY">Daily</option>
                      <option value="WEEKLY">Weekly</option>
                      <option value="MONTHLY">Monthly</option>
                    </LocalSelect>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Controller
                  name="savingsDuration"
                  control={methods.control}
                  render={({ field }) => (
                    <SimpleInput
                      {...field}
                      label="Savings Duration (Months)"
                      type="number"
                      icon={<Clock size={16} />}
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    />
                  )}
                />
              </div>
            </section>
          </DefaultForm>
        </div>
      </div>
    </ThemeProvider>
  );
}
