import { createFileRoute } from "@tanstack/react-router";
import { useForm, Controller } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useImages, useSelectImage } from "@/helpers/images";
import ThemeProvider from "@/simpleComps/ThemeProvider";
import { toast } from "sonner";
import { extract_message } from "@/helpers/apihelpers";
import apiClient, { type ApiResponse } from "@/api/simpleApi";
import { Layers, Home } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import type { DocProps } from "@/types/form";
import { useDocumentUpload } from "../../-components/DocumentUpload";
import { useVideoUpload } from "../../-components/VideoUpload";
import DefaultForm from "../-components/DefaultForm";
import {
  doc_helper,
  gallery_helper,
  get_cover_image,
  update_addtional_fees,
  video_helper,
} from "../../-components/upload_helpers";
import { strip_outright } from "../../-components/form_cleaners";
import calculate_fees from "../-components/calculate_fees";

export const Route = createFileRoute("/dashboard/properties/new/outright")({
  component: RouteComponent,
});

interface AdditionalFee {
  label: string;
  amount: number;
}

interface OutrightPropertyFormValues extends DocProps {}

function RouteComponent() {
  const methods = useForm<OutrightPropertyFormValues>({
    defaultValues: {
      propertyType: "RESIDENTIAL",
      developmentStage: "PLANNING",
    },
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
      console.log(uploadedDocUrls);
      // Handle Video Upload
      let videoUrl = await video_helper(videoUpload);
      const calc_payload = calculate_fees(data);
      console.log("data_b4_spread", JSON.parse(JSON.stringify(data)));

      let payload = {
        ...calc_payload,
        ...uploadedDocUrls,
        coverImage: coverImageUrl,
        galleryImages: allGallery,
        videos: videoUrl,
        completionDate: data.completionDate
          ? new Date(data.completionDate).toISOString()
          : null,
      };

      const new_payload = strip_outright(payload);
      const response = await apiClient.post(
        `/admin/properties/outright`,
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
            hideCompletion
            docUpload={docUpload}
            videoUpload={videoUpload}
            useImagesProps={useImageProps}
            form={methods as any}
            selectImageProps={selectImageProps as any}
            mutation={mutation as any}
            onSubmit={onSubmit}
            units_label="Unit Available"
          >
            <></>
          </DefaultForm>
        </div>
      </div>
    </ThemeProvider>
  );
}
