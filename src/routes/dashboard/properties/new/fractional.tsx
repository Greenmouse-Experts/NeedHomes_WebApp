import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import SimpleInput from "@/simpleComps/inputs/SimpleInput";
import { uploadImage } from "@/api/imageApi";
import { toast } from "sonner";
import { extract_message } from "@/helpers/apihelpers";
import apiClient, { type ApiResponse } from "@/api/simpleApi";
import { Plus, Trash2 } from "lucide-react";
import { useVideoUpload } from "@/routes/dashboard/-components/VideoUpload";
import { useDocumentUpload } from "@/routes/dashboard/-components/DocumentUpload";
import { Home, Image as Layers } from "lucide-react";
import type { DocProps } from "@/types/form";
import DefaultForm from "../-components/DefaultForm";
import { uploadFile } from "@/api/fileApi";
import { useImages, useSelectImage } from "@/helpers/images";
import ThemeProvider from "@/simpleComps/ThemeProvider";
import calculate_fees from "../-components/calculate_fees";
import { doc_helper } from "../../-components/upload_helpers";

function ReturnTiersManager({ control, register }: { control: any; register: any }) {
  const { fields, append, remove } = useFieldArray({ control, name: "returnTiersArray" });
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between border-b border-base-200 pb-2">
        <h2 className="text-base font-semibold">Return Tiers</h2>
        <button
          type="button"
          onClick={() => append({ days: "", rate: 0 })}
          className="btn btn-ghost btn-xs text-primary gap-1"
        >
          <Plus size={14} /> Add Tier
        </button>
      </div>
      {fields.map((field, index) => (
        <div key={field.id} className="flex items-end gap-3">
          <SimpleInput
            label={index === 0 ? "Duration (days)" : ""}
            type="number"
            placeholder="e.g. 30"
            {...register(`returnTiersArray.${index}.days`)}
          />
          <SimpleInput
            label={index === 0 ? "Return %" : ""}
            type="number"
            icon={<span>%</span>}
            {...register(`returnTiersArray.${index}.rate`, { valueAsNumber: true })}
          />
          <button
            type="button"
            onClick={() => remove(index)}
            className="btn btn-ghost btn-square text-error mb-1"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ))}
      {fields.length === 0 && (
        <p className="text-xs italic opacity-50">No tiers added. Click Add Tier.</p>
      )}
    </div>
  );
}

export const Route = createFileRoute("/dashboard/properties/new/fractional")({
  component: RouteComponent,
});

interface FractionalPropertyFormValues extends DocProps {
  totalShares: number;
  pricePerShare: number;
  minimumShares: number;
  maxInvestors?: number | null;
  fractionalHoldingPeriodDays: number;
  returnTiersArray: { days: string; rate: number }[];
}
function RouteComponent() {
  const methods = useForm<FractionalPropertyFormValues>({
    defaultValues: {
      propertyType: "RESIDENTIAL",
      developmentStage: "PLANNING",
      premiumProperty: false,
      maxInvestors: null,
      fractionalHoldingPeriodDays: 30,
      returnTiersArray: [{ days: "30", rate: 0 }],
    },
  });
  const nav = useNavigate();
  const docUpload = useDocumentUpload();
  const videoUpload = useVideoUpload();
  const useImageProps = useImages();
  //@ts-ignore
  const selectImageProps = useSelectImage(null);
  const mutation = useMutation({
    mutationFn: async (data: FractionalPropertyFormValues) => {
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
      const uploadedDocUrls = await doc_helper(docUploadProps);
      console.log("Uploaded Doc URLs:", uploadedDocUrls);
      const returnTiers = Object.fromEntries(
        (data.returnTiersArray ?? [])
          .filter((t) => t.days && t.rate)
          .map((t) => [t.days, t.rate]),
      );
      const keys = ["pricePerShare"] as (typeof data)[string];
      data["basePrice"] = data["totalShares"] * data["pricePerShare"];
      const new_payload = calculate_fees(data, keys);
      delete (new_payload as any).returnTiersArray;

      const payload: any = {
        ...new_payload,
        returnTiers,
        productCost: new_payload["basePrice"],
        coverImage: coverImageUrl,
        galleryImages: allGallery,
        projectStartDate: data.projectStartDate
          ? new Date(data.projectStartDate).toISOString()
          : null,
        projectEndDate: data.projectEndDate
          ? new Date(data.projectEndDate).toISOString()
          : null,
        videos: videoUrl || data.videos,
        ...uploadedDocUrls,
        ...(data.maxInvestors != null && { maxInvestors: data.maxInvestors }),
      };

      // payload.basePrice = Number(payload.basePrice) || 0;
      // payload.availableUnits = Number(payload.availableUnits) || 0;
      // payload.totalShares = Number(payload.totalShares) || 0;
      // payload.pricePerShare = Number(payload.pricePerShare) || 0;
      // payload.minimumShares = Number(payload.minimumShares) || 0;
      // payload.totalPrice = Number(payload.totalPrice) || 0;

      const response = await apiClient.post(
        "/admin/properties/fractional",
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

  const onSubmit = (data: FractionalPropertyFormValues) => {
    //@ts-ignore
    toast.promise(mutation.mutateAsync(data), {
      loading: "Creating fractional property...",
      success: extract_message,
      error: (err) => extract_message(err) || "An error occurred.",
    });
  };

  return (
    <ThemeProvider>
      <div className="mx-auto ">
        <div className="bg-base-100 rounded-2xl shadow-xl border border-base-200 overflow-hidden">
          <div className="bg-primary p-6 text-primary-content">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Home size={24} />
              New Fractional Ownership Property
            </h1>
            <p className="opacity-80 text-sm">
              Fill in details to list a fractional ownership offering.
            </p>
          </div>

          <DefaultForm
            docUpload={docUpload}
            videoUpload={videoUpload}
            useImagesProps={useImageProps}
            form={methods as any}
            disable_base_price
            disableUnits
            showDateRange
            selectImageProps={selectImageProps as any}
            mutation={mutation as any}
            onSubmit={onSubmit}
          >
            <>
              {/* 4. Fractional Share Details */}
              <section className="space-y-6">
                <div className="flex items-center gap-2 pb-2 border-b border-base-200">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <Layers size={20} />
                  </div>
                  <h2 className="text-lg font-bold">
                    4. Fractional Share Details
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Controller
                    name="totalShares"
                    control={methods.control}
                    render={({ field }) => (
                      <SimpleInput
                        {...field}
                        label="Total Shares"
                        type="number"
                        onChange={(e) =>
                          field.onChange(Number((e as any).target?.value))
                        }
                      />
                    )}
                  />
                  <Controller
                    name="pricePerShare"
                    control={methods.control}
                    render={({ field }) => (
                      <SimpleInput
                        {...field}
                        label="Price Per Slot"
                        type="number"
                        icon={<span>₦</span>}
                        onChange={(e) =>
                          field.onChange(Number((e as any).target?.value))
                        }
                      />
                    )}
                  />
                  <Controller
                    name="minimumShares"
                    control={methods.control}
                    render={({ field }) => (
                      <SimpleInput
                        {...field}
                        label="Minimum Shares To Buy"
                        type="number"
                        onChange={(e) =>
                          field.onChange(Number((e as any).target?.value))
                        }
                      />
                    )}
                  />
                  {/*<Controller
                    name="exitWindow"
                    control={methods.control}
                    render={({ field }) => (
                      <LocalSelect {...field} label="Exit Window">
                        <option value="MONTHLY">Monthly</option>
                        <option value="QUATERLY">Quaterly</option>
                        <option value="ANNUALLY">Annually</option>
                        <option value="AT_MATURITY">At Maturity</option>
                      </LocalSelect>
                    )}
                  />*/}
                  <Controller
                    name="maxInvestors"
                    control={methods.control}
                    render={({ field }) => (
                      <SimpleInput
                        {...field}
                        value={field.value ?? ""}
                        label="Max Investors (optional)"
                        type="number"
                        placeholder="Leave empty for no cap"
                        onChange={(e) => {
                          const val = (e as any).target?.value;
                          field.onChange(val === "" ? null : Number(val));
                        }}
                      />
                    )}
                  />
                  <Controller
                    name="fractionalHoldingPeriodDays"
                    control={methods.control}
                    render={({ field }) => (
                      <SimpleInput
                        {...field}
                        label="Minimum Holding Period (days)"
                        type="number"
                        placeholder="e.g. 30"
                        onChange={(e) =>
                          field.onChange(Number((e as any).target?.value))
                        }
                      />
                    )}
                  />
                </div>

                <ReturnTiersManager control={methods.control} register={methods.register} />
              </section>
              {/* 5. Investment-Specific Details */}
            </>
          </DefaultForm>
        </div>
      </div>
    </ThemeProvider>
  );
}
