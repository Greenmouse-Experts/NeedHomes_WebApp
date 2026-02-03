import { createFileRoute } from "@tanstack/react-router";
import { useForm, FormProvider, Controller } from "react-hook-form";
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
  Home,
  MapPin,
  DollarSign,
  Calendar,
  Clock,
  Repeat,
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
  basePrice: number;
  availableUnits: number;
  savingsFrequency: "DAILY" | "WEEKLY" | "MONTHLY";
  savingsDuration: number;
  additionalFees: { label: string; amount: number }[];
  coverImage: string;
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
      basePrice: 0,
      availableUnits: 1,
      savingsFrequency: "MONTHLY",
      savingsDuration: 12,
      additionalFees: [],
      coverImage: "",
    },
  });

  const { images, setPrev, newImages, setNew } = useImages([]);
  const selectProps = useSelectImage(null as any);

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

      const totalPrice =
        Number(data.basePrice) +
        (data.additionalFees?.reduce(
          (acc, fee) => acc + (Number(fee.amount) || 0),
          0,
        ) || 0);

      const payload = {
        ...data,
        coverImage: coverImageUrl,
        galleryImages: allGallery,
        totalPrice,
        targetPropertyPrice: totalPrice,
        completionDate: new Date(data.completionDate).toISOString(),
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
                            label="Duration (Months)"
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
