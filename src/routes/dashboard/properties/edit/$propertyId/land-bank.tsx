import { createFileRoute } from "@tanstack/react-router";
import { useForm, Controller, useWatch } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import SimpleInput from "@/simpleComps/inputs/SimpleInput";
import { useImages, useSelectImage } from "@/helpers/images";
import ThemeProvider from "@/simpleComps/ThemeProvider";
import { useNavigate } from "@tanstack/react-router";
import apiClient, { type ApiResponse } from "@/api/simpleApi";
import { toast } from "sonner";
import { extract_message } from "@/helpers/apihelpers";
import { Home, Image as ImageIcon, Briefcase } from "lucide-react";
import type { DocProps } from "@/types/form";
import { useDocumentUpload } from "@/routes/dashboard/-components/DocumentUpload";
import { useVideoUpload } from "@/routes/dashboard/-components/VideoUpload";
import type { PROPERTY_TYPE } from "@/types/property";
import PageLoader from "@/components/layout/PageLoader";
import DefaultForm from "../../-components/DefaultForm";
import {
  doc_helper,
  gallery_helper,
  get_cover_image,
  video_helper,
} from "@/routes/dashboard/-components/upload_helpers";
import { strip_land_banking } from "@/routes/dashboard/-components/form_cleaners";
import calculate_fees from "../../-components/calculate_fees";
import LocalSelect from "@/simpleComps/inputs/LocalSelect";
import edit_cleaner from "@/routes/dashboard/-components/edit_cleaner";

export const Route = createFileRoute(
  "/dashboard/properties/edit/$propertyId/land-bank",
)({
  component: RouteComponent,
});

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
          const exists = form_data?.minimumInstallmentAmount;
          let new_data = edit_cleaner(form_data as any, ["pricePerPlot"]);
          if (exists) {
            new_data = {
              ...new_data,
              //@ts-ignore
              minimumInstallmentAmount: new_data.minimumInstallmentAmount / 100,
            };
          }
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

interface LandBankingProperty extends DocProps {
  plotSize: number;
  pricePerPlot: number;
  holdingPeriod: number;
  buyBackOption: boolean;
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

  const paymentOption = useWatch({
    control: methods.control,
    name: "paymentOption",
  });

  const mutation = useMutation({
    mutationFn: async (data: LandBankingProperty) => {
      let coverImageUrl = await get_cover_image(selectImageProps);
      if (!coverImageUrl) throw new Error("A cover image is required.");
      const allGallery = await gallery_helper(useImageProps);
      // Handle Document Uploads
      const uploadedDocUrls: Partial<DocProps> = await doc_helper(docUpload);
      // Handle Video Upload
      let videoUrl = await video_helper(videoUpload);
      const edited_payload = calculate_fees(data, [
        "pricePerPlot",
        "minimumInstallmentAmount",
      ]);
      const payload = {
        ...edited_payload,
        ...uploadedDocUrls, // Add uploaded document URLs to the payload
        coverImage: coverImageUrl,
        galleryImages: allGallery,
        videos: videoUrl,
        completionDate: data.completionDate
          ? new Date(data.completionDate).toISOString()
          : null,
      };
      const new_payload = strip_land_banking(payload);
      const response = await apiClient.patch(
        `/admin/properties/${data.id}/land-Banking`,
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
  const onSubmit = (data: LandBankingProperty) => {
    //@ts-ignore
    toast.promise(mutation.mutateAsync(data), {
      loading: "Submitting...",
      success: extract_message,
      error: (err) => {
        console.log(err);
        return extract_message(err) || "An error occurred.";
      },
    });
  };

  return (
    <ThemeProvider>
      <div className="mx-auto ">
        <div className="bg-base-100 rounded-2xl shadow-xl border border-base-200 overflow-hidden">
          <div className="bg-primary p-6 text-primary-content">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Home size={24} />
              Edit Land Banking Property
            </h1>
            <p className="opacity-80 text-sm">
              Fill in the details to list a new land banking investment.
            </p>
          </div>
        </div>
        <DefaultForm
          update
          disable_base_price
          docUpload={docUpload}
          videoUpload={videoUpload}
          useImagesProps={useImageProps}
          form={methods as any}
          selectImageProps={selectImageProps as any}
          mutation={mutation as any}
          onSubmit={onSubmit}
        >
          <section className="space-y-6">
            <div className="flex items-center gap-2  fade border-b pb-2">
              <Briefcase className="text-primary" size={20} />
              <h2 className="text-lg font-bold">
                4. Investment-Specific Details
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Controller
                name="plotSize"
                control={methods.control}
                render={({ field }) => (
                  <SimpleInput
                    {...field}
                    label="Plot Size (sqm)"
                    type="number"
                    step="0.01"
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  />
                )}
              />
              <Controller
                name="pricePerPlot"
                control={methods.control}
                render={({ field }) => (
                  <SimpleInput
                    {...field}
                    label="Price Per Plot"
                    type="number"
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  />
                )}
              />
              <Controller
                name="holdingPeriod"
                control={methods.control}
                render={({ field }) => (
                  <SimpleInput
                    {...field}
                    label="Holding Period (Months)"
                    type="number"
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  />
                )}
              />

              <div className="flex items-end pb-1">
                <div className="flex items-center gap-4 p-3 border  fade rounded-lg w-full bg-base-200/20">
                  <Controller
                    name="buyBackOption"
                    control={methods.control}
                    render={({ field }) => (
                      <>
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={field.onChange}
                          className="checkbox checkbox-primary"
                        />
                        <span className="text-sm font-medium">
                          Include Buy-Back Option (Guaranteed Exit)
                        </span>
                      </>
                    )}
                  />
                </div>
              </div>
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
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
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
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                      />
                    )}
                  />
                </>
              )}
            </div>
          </section>
        </DefaultForm>
      </div>
    </ThemeProvider>
  );
}
