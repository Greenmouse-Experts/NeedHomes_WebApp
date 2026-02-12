import { createFileRoute } from "@tanstack/react-router";
import {
  useForm,
  FormProvider,
  useFieldArray,
  Controller,
} from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import SimpleInput from "@/simpleComps/inputs/SimpleInput";
import SimpleTextArea from "@/simpleComps/inputs/SimpleTextArea";
import UpdateImages from "@/components/images/UpdateImages";
import { useImages, useSelectImage } from "@/helpers/images";
import ThemeProvider from "@/simpleComps/ThemeProvider";
import { uploadImage } from "@/api/imageApi";
import { toast } from "sonner";
import { extract_message } from "@/helpers/apihelpers";
import apiClient from "@/api/simpleApi";
import LocalSelect from "@/simpleComps/inputs/LocalSelect";
import SelectImage from "@/components/images/SelectImage";
import {
  Plus,
  Trash2,
  Home,
  MapPin,
  DollarSign,
  Calendar,
  FileText,
  Video,
  Layers,
} from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import type { DocProps } from "@/types/form";
import {
  DocumentUpload,
  useDocumentUpload,
} from "../../-components/DocumentUpload";
import VideoUpload, { useVideoUpload } from "../../-components/VideoUpload";
import DefaultForm from "../-components/DefaultForm";

export const Route = createFileRoute("/dashboard/properties/new/outright")({
  component: RouteComponent,
});

interface AdditionalFee {
  label: string;
  amount: number;
}

interface OutrightPropertyFormValues extends DocProps {
  paymentOption: "FULL_PAYMENT" | "INSTALLMENT";
  installmentDuration: number | null;
}

function RouteComponent() {
  const methods = useForm<OutrightPropertyFormValues>({
    defaultValues: {
      propertyType: "RESIDENTIAL",
      developmentStage: "PLANNING",
      paymentOption: "FULL_PAYMENT",
      installmentDuration: null,
    },
  });

  const { images, setPrev, newImages, setNew } = useImages([]);
  const selectProps = useSelectImage(null as any);

  const nav = useNavigate();
  const docUpload = useDocumentUpload();
  const videoUpload = useVideoUpload();
  const useImageProps = useImages();
  //@ts-ignore
  const selectImageProps = useSelectImage(null);
  const mutation = useMutation({
    mutationFn: async (data: OutrightPropertyFormValues) => {
      // 1. Upload Cover Image
      let coverImageUrl = "";
      if (selectProps.image) {
        const uploaded = await uploadImage(selectProps.image);
        coverImageUrl = uploaded.data.url;
      } else if (selectProps.prev) {
        coverImageUrl = selectProps.prev;
      }

      if (!coverImageUrl) throw new Error("A cover image is required.");

      // 2. Upload Gallery Images
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

      // 3. Upload Documents
      const docUrls: Partial<DocProps> = {};
      const docEntries = Object.entries(docUpload.documents);
      for (const [key, file] of docEntries) {
        if (file) {
          const uploaded = await uploadImage(file);
          const map: Record<string, keyof DocProps> = {
            certificateOfOwnership: "certificate",
            surveyPlan: "surveyPlanDocument",
            transferOfOwnershipDocument: "transferDocument",
            brochureFactSheet: "brochure",
          };
          const apiKey = map[key];
          if (apiKey) docUrls[apiKey] = uploaded.data.url;
        }
      }

      // 4. Upload Video
      let videoUrl = "";
      if (videoUpload.videoFile) {
        const uploaded = await uploadImage(videoUpload.videoFile);
        videoUrl = uploaded.data.url;
      }

      const feesTotal = (data.additionalFees || []).reduce(
        (acc, fee) => acc + Number(fee.amount || 0),
        0,
      );
      const totalPrice = Number(data.basePrice || 0) + feesTotal;

      const payload = {
        ...data,
        ...docUrls,
        coverImage: coverImageUrl,
        galleryImages: allGallery,
        videos: videoUrl,
        totalPrice,
        completionDate: data.completionDate
          ? new Date(data.completionDate).toISOString()
          : null,
      };

      const response = await apiClient.post(
        "/admin/properties/outright",
        payload,
      );
      return response.data;
    },
    onSuccess: () => {
      nav({ to: "/partners/properties" });
    },
  });

  const onSubmit = (data: OutrightPropertyFormValues) => {
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
              New Outright Property
            </h1>
            <p className="opacity-80 text-sm">
              List a new property for outright purchase.
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
                      <SimpleInput
                        {...field}
                        label="Installment Duration (Months)"
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
