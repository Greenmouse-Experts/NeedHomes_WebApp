import { createFileRoute } from "@tanstack/react-router";
import {
  useForm,
  FormProvider,
  Controller,
  useFieldArray,
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
import { useVideoUpload } from "../../-components/VideoUpload";
import { useDocumentUpload } from "../../-components/DocumentUpload";
import { Home, Clock, Layers } from "lucide-react";
import DefaultForm from "../-components/DefaultForm";
import { useNavigate } from "@tanstack/react-router";
import type { DocProps } from "@/types/form";
import { uploadFile } from "@/api/fileApi";
import { get_docs } from "./fractional";

export const Route = createFileRoute("/dashboard/properties/new/save-to-own")({
  component: RouteComponent,
});

interface SaveToOwnFormValues extends DocProps {
  targetPropertyPrice: number;
  minimumSavingsAmount: number;
  savingsFrequency: "DAILY" | "WEEKLY" | "MONTHLY";
  savingsDuration: number;
}

function RouteComponent() {
  const methods = useForm<SaveToOwnFormValues>({
    defaultValues: {
      propertyTitle: "",
      propertyType: "RESIDENTIAL",
      location: "",
      description: "",
      developmentStage: "PLANNING",
      completionDate: "",
      targetPropertyPrice: 0,
      minimumSavingsAmount: 0,
      availableUnits: 1,
      savingsFrequency: "MONTHLY",
      savingsDuration: 12,
      additionalFees: [],
      coverImage: "",
      galleryImages: [],
      certificate: "",
      surveyPlanDocument: "",
      transferDocument: "",
      brochure: "",
      videos: "",
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
        "/admin/properties/save-to-own",
        payload,
      );
      return response.data;
    },
    onSuccess: () => {
      nav({ to: "/partners/properties" });
    },
  });

  const onSubmit = (data: SaveToOwnFormValues) => {
    toast.promise(mutation.mutateAsync(data), {
      loading: "Creating save-to-own listing...",
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
              New Save-to-Own Property
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
                  name="minimumSavingsAmount"
                  control={methods.control}
                  render={({ field }) => (
                    <SimpleInput
                      {...field}
                      label="Minimum Savings Amount"
                      type="number"
                      icon={<span>₦</span>}
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    />
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
