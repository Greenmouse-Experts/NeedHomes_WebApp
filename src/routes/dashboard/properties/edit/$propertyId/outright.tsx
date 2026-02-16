import apiClient, { type ApiResponse } from "@/api/simpleApi";
import PageLoader from "@/components/layout/PageLoader";
import { extract_message } from "@/helpers/apihelpers";
import { useImages, useSelectImage } from "@/helpers/images";
import { useDocumentUpload } from "@/routes/dashboard/-components/DocumentUpload";
import {
  strip_fractional,
  strip_outright,
} from "@/routes/dashboard/-components/form_cleaners";
import {
  doc_helper,
  gallery_helper,
  get_cover_image,
  video_helper,
} from "@/routes/dashboard/-components/upload_helpers";
import VideoUpload, {
  useVideoUpload,
} from "@/routes/dashboard/-components/VideoUpload";
import LocalSelect from "@/simpleComps/inputs/LocalSelect";
import SimpleInput from "@/simpleComps/inputs/SimpleInput";
import ThemeProvider from "@/simpleComps/ThemeProvider";
import type { DocProps } from "@/types/form";
import type { PROPERTY_TYPE } from "@/types/property";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  Calendar,
  DollarSign,
  FileText,
  Home,
  Layers,
  MapPin,
  Plus,
  Video,
} from "lucide-react";
import {
  Controller,
  FormProvider,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { toast } from "sonner";
import DefaultForm from "../../-components/DefaultForm";

export const Route = createFileRoute(
  "/dashboard/properties/edit/$propertyId/outright",
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

interface OutrightPropertyFormValues extends DocProps {
  propertyTitle: string;
  propertyType: "RESIDENTIAL" | "COMMERCIAL" | "LAND";
  location: string;
  description: string;
  completionDate: string;
  premiumProperty: boolean;
  coverImage: string;
  galleryImages: string[];
  videos: string;
  availableUnits: number;
  totalPrice: number;
  paymentOption: "FULL_PAYMENT" | "INSTALLMENT";
  installmentDuration: number | null;
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
    mutationFn: async (data: OutrightPropertyFormValues) => {
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
      const new_payload = strip_outright(payload);
      const response = await apiClient.patch(
        `/admin/properties/${data.id}/outright`,
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

  const onSubmit = (data: OutrightPropertyFormValues) => {
    //@ts-ignore
    toast.promise(mutation.mutateAsync(data), {
      loading: "Submitting...",
      success: extract_message,
      error: (err) => extract_message(err) || "An error occurred.",
    });
  };
  return (
    <ThemeProvider>
      <div className="mx-auto">
        <div className="bg-base-100 rounded-2xl shadow-xl border border-base-200 overflow-hidden">
          <div className="bg-primary p-6 text-primary-content">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Home size={24} />
              Edit Outright Property
            </h1>
            <p className="opacity-80 text-sm">
              List a new property for outright purchase.
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
            <>
              <section className="space-y-6">
                <div className="flex items-center gap-2 pb-2 border-b border-base-200">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <Layers size={20} />
                  </div>
                  <h2 className="text-lg font-bold">
                    4. Outright Share Details
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    name="paymentOption"
                    control={methods.control}
                    render={({ field }) => (
                      <LocalSelect {...field} label="Payment Option">
                        <option value="FULL_PAYMENT">Full Payment</option>
                        <option value="INSTALLMENT">Installment</option>
                      </LocalSelect>
                    )}
                  />
                </div>
              </section>
            </>
          </DefaultForm>
        </div>
      </div>
    </ThemeProvider>
  );
}
