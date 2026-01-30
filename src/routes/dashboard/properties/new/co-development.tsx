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
import { Plus, Trash2, Home, MapPin, DollarSign, Calendar } from "lucide-react";

export const Route = createFileRoute(
  "/dashboard/properties/new/co-development",
)({
  component: RouteComponent,
});

interface AdditionalFee {
  label: string;
  amount: number;
}

interface CoDevelopmentFormValues {
  propertyTitle: string;
  propertyType: "RESIDENTIAL" | "COMMERCIAL" | "LAND";
  location: string;
  description: string;
  developmentStage: "PLANNING" | "UNDER_CONSTRUCTION" | "COMPLETED";
  completionDate: string;
  basePrice: number;
  availableUnits: number;
  minimumInvestment: number;
  profitSharingRatio: number;
  projectDuration: number;
  exitRule: "AFTER_PROJECT_COMPLETION" | "ANYTIME";
  additionalFees: AdditionalFee[];
  coverImage: string;
}

function AdditionalFeesManager() {
  const { control, register } = useForm({
    /* This is just to satisfy the context if needed, but we use the parent context */
  });
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
  const methods = useForm<CoDevelopmentFormValues>({
    defaultValues: {
      propertyTitle: "",
      propertyType: "RESIDENTIAL",
      location: "",
      description: "",
      developmentStage: "PLANNING",
      completionDate: "",
      basePrice: 0,
      availableUnits: 1,
      minimumInvestment: 0,
      profitSharingRatio: 0,
      projectDuration: 0,
      exitRule: "AFTER_PROJECT_COMPLETION",
      additionalFees: [{ label: "Project Admin", amount: 20000000 }],
      coverImage: "",
    },
  });

  const { images, setPrev, newImages, setNew } = useImages([]);
  const selectProps = useSelectImage(null as any);

  const mutation = useMutation({
    mutationFn: async (data: CoDevelopmentFormValues) => {
      let coverImageUrl = "";

      // Handle Cover Image Upload
      if (selectProps.image) {
        const uploaded = await uploadImage(selectProps.image);
        coverImageUrl = uploaded.data.url;
      } else if (selectProps.prev) {
        coverImageUrl = selectProps.prev;
      }

      if (!coverImageUrl) throw new Error("A cover image is required.");

      // Handle Gallery Uploads
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

      const totalPrice =
        Number(data.basePrice) +
        data.additionalFees.reduce(
          (acc, fee) => acc + (Number(fee.amount) || 0),
          0,
        );

      const payload = {
        ...data,
        coverImage: coverImageUrl,
        galleryImages: allGallery,
        totalPrice,
        completionDate: new Date(data.completionDate).toISOString(),
      };

      const response = await apiClient.post(
        "/admin/properties/codevelopment",
        payload,
      );
      return response.data;
    },
  });

  const onSubmit = (data: CoDevelopmentFormValues) => {
    toast.promise(mutation.mutateAsync(data), {
      loading: "Creating property listing...",
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
              New Co-Development Property
            </h1>
            <p className="opacity-80 text-sm">
              Fill in the details to list a new investment opportunity.
            </p>
          </div>

          <div className="p-6 md:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column: Media */}
              <div className="lg:col-span-2  space-y-6">
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

              {/* Right Column: Form Fields */}
              <div className="lg:col-span-2">
                <FormProvider {...methods}>
                  <form
                    onSubmit={methods.handleSubmit(onSubmit)}
                    className="space-y-8"
                  >
                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                      <Controller
                        name="propertyTitle"
                        control={methods.control}
                        rules={{ required: "Title is required" }}
                        render={({ field }) => (
                          <SimpleInput
                            {...field}
                            label="Property Title"
                            placeholder="e.g. Azure Heights"
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
                            placeholder="Lekki Phase 1, Lagos"
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
                            <option value="UNDER_CONSTRUCTION">
                              Under Construction
                            </option>
                            <option value="COMPLETED">Completed</option>
                          </LocalSelect>
                        )}
                      />
                    </div>

                    <div className="divider opacity-50">
                      Financials & Investment
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Controller
                        name="basePrice"
                        control={methods.control}
                        render={({ field }) => (
                          <SimpleInput
                            {...field}
                            label="Base Price"
                            type="number"
                            icon={<DollarSign size={16} />}
                            onChange={(e) =>
                              field.onChange(e.target.valueAsNumber)
                            }
                          />
                        )}
                      />
                      <Controller
                        name="minimumInvestment"
                        control={methods.control}
                        render={({ field }) => (
                          <SimpleInput
                            {...field}
                            label="Min. Investment"
                            type="number"
                            onChange={(e) =>
                              field.onChange(e.target.valueAsNumber)
                            }
                          />
                        )}
                      />
                      <Controller
                        name="profitSharingRatio"
                        control={methods.control}
                        render={({ field }) => (
                          <SimpleInput
                            {...field}
                            label="Profit Ratio (0-1)"
                            type="number"
                            step="0.01"
                            onChange={(e) =>
                              field.onChange(e.target.valueAsNumber)
                            }
                          />
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                        name="projectDuration"
                        control={methods.control}
                        render={({ field }) => (
                          <SimpleInput
                            {...field}
                            label="Duration (Months)"
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
                            type="date"
                            icon={<Calendar size={16} />}
                          />
                        )}
                      />
                    </div>

                    <AdditionalFeesManager />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Controller
                        name="exitRule"
                        control={methods.control}
                        render={({ field }) => (
                          <LocalSelect {...field} label="Exit Strategy">
                            <option value="AFTER_PROJECT_COMPLETION">
                              After Project Completion
                            </option>
                            <option value="ANYTIME">Anytime (Liquid)</option>
                          </LocalSelect>
                        )}
                      />
                    </div>

                    <Controller
                      name="description"
                      control={methods.control}
                      render={({ field }) => (
                        <SimpleTextArea
                          {...field}
                          label="Project Description"
                          placeholder="Provide a detailed overview of the project, ROI projections, and infrastructure plans..."
                          rows={4}
                        />
                      )}
                    />

                    <div className="pt-4">
                      <button
                        type="submit"
                        className={`btn btn-primary btn-block h-14 text-lg shadow-lg ${mutation.isPending ? "loading" : ""}`}
                        disabled={mutation.isPending}
                      >
                        {!mutation.isPending && (
                          <Plus size={20} className="mr-2" />
                        )}
                        {mutation.isPending
                          ? "Processing..."
                          : "Publish Co-Development Property"}
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
