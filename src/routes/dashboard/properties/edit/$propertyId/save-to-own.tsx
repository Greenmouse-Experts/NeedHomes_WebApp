import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm, Controller, useWatch } from "react-hook-form";
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
  strip_save_to_own,
} from "@/routes/dashboard/-components/form_cleaners";
import edit_cleaner from "@/routes/dashboard/-components/edit_cleaner";
import calculate_fees from "../../-components/calculate_fees";
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
          const form_data = data.data;
          //@ts-ignore
          const exists = form_data?.minimumInstallmentAmount;
          let new_data = edit_cleaner(form_data as any, [
            "targetPropertyPrice",
          ]);
          if (exists) {
            new_data = {
              ...new_data,
              //@ts-ignore
              minimumInstallmentAmount: new_data.minimumInstallmentAmount / 100,
            };
          }
          return (
            <>
              <FormField defaultValue={new_data} />
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

      console.log("data_b4_spread", JSON.parse(JSON.stringify(data)));
      const new_p = calculate_fees(data, [
        "targetPropertyPrice",
        "minimumInstallmentAmount",
      ]);
      const payload = {
        ...new_p,
        ...uploadedDocUrls, // Add uploaded document URLs to the payload
        coverImage: coverImageUrl,
        galleryImages: allGallery,
        videos: videoUrl,
        completionDate: data.completionDate
          ? new Date(data.completionDate).toISOString()
          : null,
      };
      const new_payload = strip_save_to_own(payload);
      const response = await apiClient.patch(
        `/admin/properties/${data.id}/save-to-own`,
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

  const paymentOption = useWatch({
    control: methods.control,
    name: "paymentOption",
  });
  const onSubmit = (data: SaveToOwnFormValues) => {
    //@ts-ignore
    toast.promise(mutation.mutateAsync(data), {
      loading: "editing save-to-own property...",
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
            update
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
                <h2 className="text-lg font-bold">
                  4. Save To Own Purchase Details
                </h2>
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
                <Controller
                  name="paymentOption"
                  control={methods.control}
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
                      control={methods.control}
                      render={({ field }) => (
                        //@ts-ignore
                        <SimpleInput
                          {...field}
                          type="number"
                          label="Installment Duration (Months)"
                          onChange={(e) =>
                            field.onChange(e.target.valueAsNumber)
                          }
                        />
                      )}
                    />
                    <Controller
                      name="minimumInstallmentAmount"
                      control={methods.control}
                      render={({ field }) => (
                        //@ts-ignore
                        <SimpleInput
                          {...field}
                          type="number"
                          label="Minimum Installment Amount"
                          onChange={(e) =>
                            field.onChange(e.target.valueAsNumber)
                          }
                        />
                      )}
                    />
                  </>
                )}
              </div>
            </section>
          </DefaultForm>
        </div>
      </div>
    </ThemeProvider>
  );
}
