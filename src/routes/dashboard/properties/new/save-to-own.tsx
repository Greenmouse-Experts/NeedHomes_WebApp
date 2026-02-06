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
import SelectImage from "@/components/images/SelectImage";
import VideoUpload, { useVideoUpload } from "../../-components/VideoUpload";
import {
  DocumentUpload,
  useDocumentUpload,
} from "../../-components/DocumentUpload";
import {
  Plus,
  Home,
  MapPin,
  DollarSign,
  Calendar,
  Clock,
  Repeat,
  Trash2,
} from "lucide-react";

export const Route = createFileRoute("/dashboard/properties/new/save-to-own")({
  component: RouteComponent,
});

interface SaveToOwnFormValues {
  propertyTitle: string;
  propertyType: "RESIDENTIAL" | "COMMERCIAL" | "LAND";
  location: string;
  description: string;
  developmentStage:
    | "PLANNING"
    | "OFF_PLAN"
    | "UNDER_CONSTRUCTION"
    | "COMPLETED";
  completionDate: string;
  targetPropertyPrice: number;
  minimumSavingsAmount: number;
  availableUnits: number;
  savingsFrequency: "DAILY" | "WEEKLY" | "MONTHLY";
  savingsDuration: number;
  additionalFees: { label: string; amount: number }[];
  coverImage: string;
  galleryImages: string[];
  certificate: string;
  surveyPlanDocument: string;
  transferDocument: string;
  brochure: string;
  videos: string;
}

function AdditionalFeesManager() {
  const { control, register } = useForm<SaveToOwnFormValues>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "additionalFees",
  });

  return (
    <div className="space-y-4 bg-base-200/50 p-4 rounded-lg border border-base-300">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-bold uppercase tracking-wider opacity-70">
          Additional Fees
        </h3>
        <button
          type="button"
          onClick={() => append({ label: "", amount: 0 })}
          className="btn btn-ghost btn-xs text-primary gap-1"
        >
          <Plus size={14} /> Add Fee
        </button>
      </div>

      {fields.map((field, index) => (
        <div
          key={field.id}
          className="flex gap-2 items-end animate-in fade-in slide-in-from-top-1"
        >
          <div className="flex-1">
            <SimpleInput
              label={index === 0 ? "Fee Label" : ""}
              {...register(`additionalFees.${index}.label` as const)}
              placeholder="e.g. Legal Fee"
            />
          </div>
          <div className="flex-1">
            <SimpleInput
              label={index === 0 ? "Amount" : ""}
              type="number"
              {...register(`additionalFees.${index}.amount` as const, {
                valueAsNumber: true,
              })}
              placeholder="0.00"
            />
          </div>
          <button
            type="button"
            onClick={() => remove(index)}
            className="btn btn-square btn-ghost text-error mb-1"
          >
            <Trash2 size={18} />
          </button>
        </div>
      ))}
      {fields.length === 0 && (
        <p className="text-xs italic opacity-50 text-center py-2">
          No additional fees added.
        </p>
      )}
    </div>
  );
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
  const docUpload = useDocumentUpload();
  const videoUpload = useVideoUpload();

  const mutation = useMutation({
    mutationFn: async (data: SaveToOwnFormValues) => {
      let coverImageUrl = "";

      if (selectProps.image) {
        const uploaded = await uploadImage(selectProps.image);
        coverImageUrl = uploaded.data.url;
      } else if (selectProps.prev) {
        coverImageUrl = selectProps.prev;
      }

      if (!coverImageUrl) throw new Error("A cover image is required.");

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

      const uploadedDocUrls: Record<string, string> = {};
      for (const [key, file] of Object.entries(docUpload.documents)) {
        if (file) {
          const uploaded = await uploadImage(file);
          uploadedDocUrls[key] = uploaded.data.url;
        }
      }

      let videoUrl = "";
      if (videoUpload.videoFile) {
        const uploaded = await uploadImage(videoUpload.videoFile);
        videoUrl = uploaded.data.url;
      }

      const totalPrice =
        Number(data.targetPropertyPrice) +
        (data.additionalFees?.reduce(
          (acc, fee) => acc + (Number(fee.amount) || 0),
          0,
        ) || 0);

      const payload = {
        ...data,
        coverImage: coverImageUrl,
        galleryImages: allGallery,
        videos: videoUrl,
        certificate: uploadedDocUrls.certificateOfOwnership || "",
        surveyPlanDocument: uploadedDocUrls.surveyPlan || "",
        transferDocument: uploadedDocUrls.transferOfOwnershipDocument || "",
        brochure: uploadedDocUrls.brochureFactSheet || "",
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
  });

  const onSubmit = (data: SaveToOwnFormValues) => {
    toast.promise(mutation.mutateAsync(data), {
      loading: "Creating save-to-own listing...",
      success: extract_message,
      error: (err) => extract_message(err) || "An error occurred.",
    });
  };
  const disable_completion = methods.watch("developmentStage") === "COMPLETED";

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

          <div className="p-6 md:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <section className="flex-1 flex flex-col">
                  <label className="label font-bold text-xs uppercase tracking-widest opacity-60">
                    Primary Cover
                  </label>
                  <div className="h-64 flex w-full rounded-xl overflow-hidden ring-2 ring-base-200 ring-offset-2">
                    <SelectImage {...selectProps} title="Select Cover" />
                  </div>
                </section>

                <section className="space-y-3">
                  <label className="label font-bold text-xs uppercase tracking-widest opacity-60">
                    Gallery Images
                  </label>
                  <UpdateImages
                    images={images || []}
                    setPrev={setPrev}
                    setNew={setNew}
                  />
                </section>
              </div>

              <div className="lg:col-span-2">
                <FormProvider {...methods}>
                  <form
                    onSubmit={methods.handleSubmit(onSubmit)}
                    className="space-y-8"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                      <Controller
                        name="propertyTitle"
                        control={methods.control}
                        rules={{ required: "Title is required" }}
                        render={({ field }) => (
                          <SimpleInput
                            {...field}
                            label="Property Title"
                            placeholder="e.g. Starter Home Plan"
                            required
                          />
                        )}
                      />
                      <Controller
                        name="location"
                        control={methods.control}
                        rules={{ required: "Location is required" }}
                        render={({ field }) => (
                          <SimpleInput
                            {...field}
                            label="Location"
                            placeholder="Ikeja, Lagos"
                            required
                            icon={<MapPin size={16} />}
                          />
                        )}
                      />
                      <Controller
                        name="propertyType"
                        control={methods.control}
                        render={({ field }) => (
                          <LocalSelect {...field} label="Property Type">
                            <option value="RESIDENTIAL">Residential</option>
                            <option value="COMMERCIAL">Commercial</option>
                            <option value="LAND">Land</option>
                          </LocalSelect>
                        )}
                      />
                      <Controller
                        name="developmentStage"
                        control={methods.control}
                        render={({ field }) => (
                          <LocalSelect {...field} label="Development Stage">
                            <option value="PLANNING">Planning</option>
                            <option value="OFF_PLAN">Off Plan</option>
                            <option value="UNDER_CONSTRUCTION">
                              Under Construction
                            </option>
                            <option value="COMPLETED">Completed</option>
                          </LocalSelect>
                        )}
                      />
                    </div>

                    <div className="divider opacity-50">
                      Financials & Savings Plan
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
                            onChange={(e) =>
                              field.onChange(e.target.valueAsNumber)
                            }
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
                            onChange={(e) =>
                              field.onChange(e.target.valueAsNumber)
                            }
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
                            onChange={(e) =>
                              field.onChange(e.target.valueAsNumber)
                            }
                          />
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Controller
                        name="availableUnits"
                        control={methods.control}
                        render={({ field }) => (
                          <SimpleInput
                            {...field}
                            label="Units Available"
                            type="number"
                            onChange={(e) =>
                              field.onChange(e.target.valueAsNumber)
                            }
                          />
                        )}
                      />
                      <Controller
                        name="completionDate"
                        control={methods.control}
                        render={({ field }) => (
                          <SimpleInput
                            {...field}
                            label="Completion Date"
                            disabled={disable_completion}
                            type="date"
                            icon={<Calendar size={16} />}
                          />
                        )}
                      />
                    </div>

                    <Controller
                      name="description"
                      control={methods.control}
                      render={({ field }) => (
                        <SimpleTextArea
                          {...field}
                          label="Program Description"
                          placeholder="Describe the save-to-own program, benefits, and eligibility..."
                          rows={4}
                        />
                      )}
                    />
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="checkbox checkbox-primary"
                        {...methods.register("premiumProperty")}
                      />
                      <span className="label-text font-bold">
                        Premium Property
                      </span>
                    </div>

                    <AdditionalFeesManager />

                    <div className="divider opacity-50">Media & Documents</div>
                    <div className="grid grid-cols-1 gap-6">
                      <VideoUpload videoProps={videoUpload} />
                      <DocumentUpload useDocUpload={docUpload} />
                    </div>

                    <div className="pt-4">
                      <button
                        type="submit"
                        className={`btn btn-secondary btn-block h-14 text-lg shadow-lg ${mutation.isPending ? "loading" : ""}`}
                        disabled={mutation.isPending}
                      >
                        {!mutation.isPending && (
                          <Plus size={20} className="mr-2" />
                        )}
                        {mutation.isPending
                          ? "Processing..."
                          : "Create Save-to-Own Property"}
                      </button>
                    </div>
                  </form>
                </FormProvider>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}
