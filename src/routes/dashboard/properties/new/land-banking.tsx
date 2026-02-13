import { createFileRoute } from "@tanstack/react-router";
import {
  useForm,
  FormProvider,
  useFormContext,
  useFieldArray,
  Controller,
} from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import SimpleInput from "@/simpleComps/inputs/SimpleInput";
import SimpleTextArea from "@/simpleComps/inputs/SimpleTextArea";
import LocalSelect from "@/simpleComps/inputs/LocalSelect";
import UpdateImages from "@/components/images/UpdateImages";
import SelectImage from "@/components/images/SelectImage";
import { useImages, useSelectImage } from "@/helpers/images";
import ThemeProvider from "@/simpleComps/ThemeProvider";
import { useNavigate } from "@tanstack/react-router";
import { uploadImage } from "@/api/imageApi";
import apiClient, { type ApiResponse } from "@/api/simpleApi";
import { toast } from "sonner";
import { extract_message } from "@/helpers/apihelpers";
import {
  Plus,
  Trash2,
  MapPin,
  DollarSign,
  Calendar,
  Home,
  Image as ImageIcon,
  Briefcase,
  Info,
  FileText,
  Video,
} from "lucide-react";
import type { DocProps } from "@/types/form";
import {
  DocumentUpload,
  useDocumentUpload,
} from "@/routes/dashboard/-components/DocumentUpload";
import VideoUpload, {
  useVideoUpload,
} from "@/routes/dashboard/-components/VideoUpload";
import DefaultForm from "../-components/DefaultForm";
import { get_docs } from "./fractional";
import { uploadFile } from "@/api/fileApi";

export const Route = createFileRoute("/dashboard/properties/new/land-banking")({
  component: RouteComponent,
});

interface AdditionalFee {
  label: string;
  amount: number;
}

interface LandBankingProperty extends DocProps {
  plotSize: number;
  pricePerPlot: number;
  holdingPeriod: number;
  buyBackOption: boolean;
}

function RouteComponent() {
  const methods = useForm<LandBankingProperty>({
    defaultValues: {
      propertyTitle: "",
      location: "",
      propertyType: "RESIDENTIAL",
      developmentStage: "PLANNING",
      premiumProperty: false,
      completionDate: "",
      availableUnits: 1,
      plotSize: 0,
      pricePerPlot: 0,
      holdingPeriod: 12,
      buyBackOption: false,
      additionalFees: [{ label: "Survey Fee", amount: 0 }],
      coverImage: "",
      galleryImages: [],
      totalPrice: 0,
      certificate: "",
      surveyPlanDocument: "",
      transferDocument: "",
      brochure: "",
      videos: "",
    },
  });
  const docUpload = useDocumentUpload();
  const videoUpload = useVideoUpload();
  const useImageProps = useImages();
  //@ts-ignore
  const selectImageProps = useSelectImage(null);
  const nav = useNavigate();

  // const mutation = useMutation({
  //   mutationFn: async (data: LandBankingProperty) => {
  //     let coverImageUrl = "";

  //     if (selectProps.image) {
  //       const uploaded = await uploadImage(selectProps.image);
  //       coverImageUrl = uploaded.data.url;
  //     } else if (selectProps.prev) {
  //       coverImageUrl = selectProps.prev;
  //     }

  //     if (!coverImageUrl) throw new Error("A cover image is required.");

  //     const uploadedGalleryUrls: string[] = [];
  //     if (newImages && newImages.length > 0) {
  //       for (const img of newImages) {
  //         const uploaded = await uploadImage(img);
  //         if (uploaded.data?.url) uploadedGalleryUrls.push(uploaded.data.url);
  //       }
  //     }

  //     const allGallery = [
  //       ...(images || []).map((img) => img.url),
  //       ...uploadedGalleryUrls,
  //     ];

  //     const feesTotal = (data.additionalFees || []).reduce(
  //       (acc: number, fee: AdditionalFee) => acc + Number(fee.amount || 0),
  //       0,
  //     );

  //     const totalPrice = Number(data.basePrice || 0) + feesTotal;

  //     // Upload documents
  //     const uploadedDocUrls: DocProps = {
  //       certificate: "",
  //       surveyPlanDocument: "",
  //       transferDocument: "",
  //       brochure: "",
  //       videos: "",
  //     };

  //     if (useDocUpload.documents.certificateOfOwnership) {
  //       const uploaded = await apiClient.post(
  //         "/admin/upload-file",
  //         { file: useDocUpload.documents.certificateOfOwnership },
  //         { headers: { "Content-Type": "multipart/form-data" } },
  //       );
  //       uploadedDocUrls.certificate = uploaded.data.url;
  //     }
  //     if (useDocUpload.documents.surveyPlan) {
  //       const uploaded = await apiClient.post(
  //         "/admin/upload-file",
  //         { file: useDocUpload.documents.surveyPlan },
  //         { headers: { "Content-Type": "multipart/form-data" } },
  //       );
  //       uploadedDocUrls.surveyPlanDocument = uploaded.data.url;
  //     }
  //     if (useDocUpload.documents.transferOfOwnershipDocument) {
  //       const uploaded = await apiClient.post(
  //         "/admin/upload-file",
  //         { file: useDocUpload.documents.transferOfOwnershipDocument },
  //         { headers: { "Content-Type": "multipart/form-data" } },
  //       );
  //       uploadedDocUrls.transferDocument = uploaded.data.url;
  //     }
  //     if (useDocUpload.documents.brochureFactSheet) {
  //       const uploaded = await apiClient.post(
  //         "/admin/upload-file",
  //         { file: useDocUpload.documents.brochureFactSheet },
  //         { headers: { "Content-Type": "multipart/form-data" } },
  //       );
  //       uploadedDocUrls.brochure = uploaded.data.url;
  //     }

  //     // Upload video
  //     if (useVideoUploadProps.videoFile) {
  //       const uploaded = await apiClient.post(
  //         "/admin/upload-file",
  //         { file: useVideoUploadProps.videoFile },
  //         { headers: { "Content-Type": "multipart/form-data" } },
  //       );
  //       uploadedDocUrls.videos = uploaded.data.url;
  //     }

  //     const payload = {
  //       ...data,
  //       coverImage: coverImageUrl,
  //       galleryImages: allGallery,
  //       totalPrice,
  //       ...uploadedDocUrls,
  //     };

  //     const response = await apiClient.post(
  //       "/admin/properties/land-banking",
  //       payload,
  //     );
  //     return response.data;
  //   },
  //   onSuccess: () => {
  //     nav({
  //       to: "/partners/properties",
  //     });
  //   },
  // });

  const mutation = useMutation({
    mutationFn: async (data: LandBankingProperty) => {
      let coverImageUrl = "";
      const selectProps = selectImageProps;
      const { newImages, images } = useImageProps;
      const docUploadProps = docUpload;
      const videoProps = videoUpload;
      if (selectProps.image) {
        const uploaded = await uploadImage(selectProps.image);
        coverImageUrl = uploaded.data?.url || "";
      } else if (selectProps.prev) {
        coverImageUrl = selectProps.prev;
      }

      const uploadedGalleryUrls: string[] = [];
      if (newImages && newImages.length > 0) {
        for (const img of newImages) {
          const uploaded = await uploadImage(img);
          if (uploaded.data?.url) uploadedGalleryUrls.push(uploaded.data.url);
        }
      }

      if (!coverImageUrl && images && images.length > 0) {
        coverImageUrl = images[0].url;
      }

      if (!coverImageUrl && uploadedGalleryUrls.length > 0) {
        coverImageUrl = uploadedGalleryUrls[0];
      }

      if (!coverImageUrl && data.coverImage) {
        coverImageUrl = data.coverImage;
      }

      if (!coverImageUrl) throw new Error("A cover image is required.");

      let videoUrl = "";
      if (videoProps.videoFile) {
        try {
          const url = await uploadFile(videoProps.videoFile);
          videoUrl = url || "";
        } catch (e) {}
      }

      const allGallery = [
        ...(images || []).map((img) => img.url),
        ...uploadedGalleryUrls,
      ];
      const uploadedDocUrls = await get_docs(docUploadProps);

      const totalPrice =
        Number(data.basePrice) +
        (data.additionalFees
          ? data.additionalFees.reduce(
              (acc, fee) => acc + (Number(fee.amount) || 0),
              0,
            )
          : 0);

      const payload = {
        ...data,
        ...uploadedDocUrls,
        coverImage: coverImageUrl,
        galleryImages: allGallery,
        videos: videoUrl,
        totalPrice,
        completionDate: data.completionDate
          ? new Date(data.completionDate).toISOString()
          : null,
      };

      const response = await apiClient.post(
        "/admin/properties/land-banking",
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
  const onSubmit = (data: LandBankingProperty) => {
    toast.promise(mutation.mutateAsync(data), {
      loading: "Submitting...",
      success: extract_message,
      error: (err) => {
        console.log(err);
        return extract_message(err) || "An error occurred.";
      },
    });
  };

  const disable_completion = methods.watch("developmentStage") === "COMPLETED";
  return (
    <ThemeProvider>
      <div className="mx-auto ">
        <div className="bg-base-100 rounded-2xl shadow-xl border border-base-200 overflow-hidden">
          <div className="bg-primary p-6 text-primary-content">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Home size={24} />
              New Land Banking Property
            </h1>
            <p className="opacity-80 text-sm">
              Fill in the details to list a new land banking investment.
            </p>
          </div>
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

              <div className="md:col-span-2 flex items-end pb-1">
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
            </div>
          </section>
        </DefaultForm>
      </div>
    </ThemeProvider>
  );
}
