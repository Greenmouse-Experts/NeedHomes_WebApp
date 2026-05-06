import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
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
import { uploadFile } from "@/api/fileApi";
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
import edit_cleaner from "@/routes/dashboard/-components/edit_cleaner";
import calculate_fees from "../../-components/calculate_fees";

export const Route = createFileRoute(
  "/dashboard/properties/edit/$propertyId/fractional",
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
          const new_data = edit_cleaner(form_data as any, ["pricePerShare"]);
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

interface FractionalPropertyFormValues extends DocProps {
  totalShares: number;
  pricePerShare: number;
  minimumShares: number;
  maxInvestors?: number | null;
  fractionalHoldingPeriodDays: number;
  returnTiersArray: { days: string; rate: number }[];
}

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
  const returnTiersArray = Object.entries((defaultValue as any).returnTiers ?? {})
    .sort((a, b) => Number(a[0]) - Number(b[0]))
    .map(([days, rate]) => ({ days, rate }));

  const methods = useForm<any>({
    defaultValues: {
      ...defaultValue,
      returnTiersArray: returnTiersArray.length ? returnTiersArray : [{ days: "30", rate: 0 }],
    },
  });
  const mutation = useMutation({
    mutationFn: async (data: FractionalPropertyFormValues) => {
      let coverImageUrl = await get_cover_image(selectImageProps);
      if (!coverImageUrl) throw new Error("A cover image is required.");
      const allGallery = await gallery_helper(useImageProps);
      const uploadedDocUrls: Partial<DocProps> = await doc_helper(docUpload);
      let videoUrl = await video_helper(videoUpload);
      const returnTiers = Object.fromEntries(
        (data.returnTiersArray ?? [])
          .filter((t: any) => t.days && t.rate)
          .map((t: any) => [t.days, t.rate]),
      );
      const keys = ["pricePerShare"] as (typeof data)[string];
      data["basePrice"] = data["totalShares"] * data["pricePerShare"];
      const calc_payload = calculate_fees(data, keys);
      delete (calc_payload as any).returnTiersArray;

      const payload = {
        ...calc_payload,
        returnTiers,
        ...uploadedDocUrls,
        coverImage: coverImageUrl,
        galleryImages: allGallery,
        videos: videoUrl,
        productCost: calc_payload["basePrice"],
        projectStartDate: data.projectStartDate
          ? new Date(data.projectStartDate).toISOString()
          : null,
        projectEndDate: data.projectEndDate
          ? new Date(data.projectEndDate).toISOString()
          : null,
        maxInvestors: data.maxInvestors ?? null,
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
              Edit Fractional Ownership Property
            </h1>
            <p className="opacity-80 text-sm">
              Fill in details to list a fractional ownership offering.
            </p>
          </div>

          <DefaultForm
            update
            disable_base_price
            disableUnits
            docUpload={docUpload}
            videoUpload={videoUpload}
            useImagesProps={useImageProps}
            form={methods as any}
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
