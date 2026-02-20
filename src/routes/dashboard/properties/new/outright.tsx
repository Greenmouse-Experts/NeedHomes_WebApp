import { createFileRoute } from "@tanstack/react-router";
import { useForm, Controller, useWatch } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import SimpleInput from "@/simpleComps/inputs/SimpleInput";
import { useImages, useSelectImage } from "@/helpers/images";
import ThemeProvider from "@/simpleComps/ThemeProvider";
import { uploadImage } from "@/api/imageApi";
import { toast } from "sonner";
import { extract_message } from "@/helpers/apihelpers";
import apiClient, { type ApiResponse } from "@/api/simpleApi";
import LocalSelect from "@/simpleComps/inputs/LocalSelect";
import { Trash2, Layers, Home } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import type { DocProps } from "@/types/form";
import { useDocumentUpload } from "../../-components/DocumentUpload";
import VideoUpload, { useVideoUpload } from "../../-components/VideoUpload";
import DefaultForm from "../-components/DefaultForm";
import { get_docs } from "./fractional";
import { uploadFile } from "@/api/fileApi";
import {
  doc_helper,
  gallery_helper,
  get_cover_image,
  video_helper,
} from "../../-components/upload_helpers";
import { strip_outright } from "../../-components/form_cleaners";

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
  minimumInstallmentAmount: number | null;
}

function RouteComponent() {
  const methods = useForm<OutrightPropertyFormValues>({
    defaultValues: {
      propertyType: "RESIDENTIAL",
      developmentStage: "PLANNING",
      paymentOption: "FULL_PAYMENT",
      installmentDuration: null,
      minimumInstallmentAmount: null,
    },
  });

  const paymentOption = useWatch({
    control: methods.control,
    name: "paymentOption",
  });

  const selectProps = useSelectImage(null as any);
  const nav = useNavigate();
  const docUpload = useDocumentUpload();
  const videoUpload = useVideoUpload();
  const useImageProps = useImages();
  //@ts-ignore
  const selectImageProps = useSelectImage(null);
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
        basePrice: data.basePrice * 100,
        totalPrice: totalPrice * 100,
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

  // const mutation = useMutation({
  //   mutationFn: async (data: OutrightPropertyFormValues) => {
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
  //       "/admin/properties/outright",
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

  const onSubmit = (data: OutrightPropertyFormValues) => {
    toast.promise(mutation.mutateAsync(data) as any, {
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
            </>
          </DefaultForm>
        </div>
      </div>
    </ThemeProvider>
  );
}
