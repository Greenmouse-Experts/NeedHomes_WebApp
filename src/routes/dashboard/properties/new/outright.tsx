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
  Percent,
  Clock,
  FileText,
} from "lucide-react";
import { useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/dashboard/properties/new/outright",
)({
  component: RouteComponent,
});

interface AdditionalFee {
  label: string;
  amount: number;
}

type ExitRuleType = "FIXED_PERIOD" | "UPON_SALE" | "ANYTIME";

interface CoDevelopmentFormValues {
  propertyTitle: string;
  propertyType: "RESIDENTIAL" | "COMMERCIAL" | "LAND";
  location: string;
  description: string;
  developmentStage: "OFF_PLAN" | "UNDER_CONSTRUCTION";
  completionDate: string;
  basePrice: number;
  availableUnits: number;
  minimumInvestment: number;
  profitSharingRatio: number;
  projectDuration: number;
  exitRule: ExitRuleType;
  additionalFees: AdditionalFee[];
  coverImage: string;
  galleryImages: string[];
  totalPrice: number;
}

function AdditionalFeesManager() {
  const { control, register } = useForm();
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
      developmentStage: "OFF_PLAN",
      completionDate: "",
      basePrice: 0,
      availableUnits: 1,
      minimumInvestment: 0,
      profitSharingRatio: 0,
      projectDuration: 12,
      exitRule: "FIXED_PERIOD",
      additionalFees: [],
      coverImage: "",
      galleryImages: [],
      totalPrice: 0,
    },
  });

  const { images, setPrev, newImages, setNew } = useImages([]);
  const selectProps = useSelectImage(null as any);
  const nav = useNavigate();

  const mutation = useMutation({
    mutationFn: async (data: CoDevelopmentFormValues) => {
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

      const feesTotal = (data.additionalFees || []).reduce(
        (acc, fee) => acc + Number(fee.amount || 0),
        0,
      );
      const totalPrice = Number(data.basePrice || 0) + feesTotal;

      const payload = {
        ...data,
        coverImage: coverImageUrl,
        galleryImages: allGallery,
        completionDate: new Date(data.completionDate).toISOString(),
      };

      const response = await apiClient.post(
        "/admin/properties/co-development",
        payload,
      );
      return response.data;
    },
    onSuccess: () => {
      nav({ to: "/partners/properties" });
    },
  });

  const onSubmit = (data: CoDevelopmentFormValues) => {
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
              New Co-Development Project
            </h1>
            <p className="opacity-80 text-sm">
              List a new project for co-development investment.
            </p>
          </div>

          <div className="p-6 md:p-8">
            <FormProvider {...methods}>
              <form
                onSubmit={methods.handleSubmit(onSubmit)}
                className="space-y-10"
              >
                {/* 1. Basic Property Information */}
                <section className="space-y-6">
                  <div className="flex items-center gap-2 border-b pb-2">
                    <FileText className="text-primary" size={20} />
                    <h2 className="text-lg font-bold">
                      1. Basic Property Information
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Controller
                      name="propertyTitle"
                      control={methods.control}
                      rules={{ required: "Title is required" }}
                      render={({ field }) => (
                        <SimpleInput
                          {...field}
                          label="Property Title"
                          placeholder="e.g. Grand View Estate"
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
                          placeholder="Lekki, Lagos"
                          icon={<MapPin size={16} />}
                          required
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
                          <option value="OFF_PLAN">Off Plan</option>
                          <option value="UNDER_CONSTRUCTION">
                            Under Construction
                          </option>
                        </LocalSelect>
                      )}
                    />
                    <div className="md:col-span-2">
                      <Controller
                        name="description"
                        control={methods.control}
                        render={({ field }) => (
                          <SimpleTextArea
                            {...field}
                            label="Project Description"
                            placeholder="Detailed project overview..."
                            rows={4}
                          />
                        )}
                      />
                    </div>
                  </div>
                </section>

                {/* 2. Media & Documents */}
                <section className="space-y-6">
                  <div className="flex items-center gap-2 border-b pb-2">
                    <Plus className="text-primary" size={20} />
                    <h2 className="text-lg font-bold">2. Media & Documents</h2>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="label font-bold text-xs uppercase tracking-widest opacity-60">
                        Primary Cover
                      </label>
                      <div className="h-64 flex w-full rounded-xl overflow-hidden ring-2 ring-base-200 ring-offset-2">
                        <SelectImage {...selectProps} title="Select Cover" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="label font-bold text-xs uppercase tracking-widest opacity-60">
                        Gallery Images
                      </label>
                      <UpdateImages
                        images={images || []}
                        setPrev={setPrev}
                        setNew={setNew}
                      />
                    </div>
                  </div>
                </section>

                {/* 3. Pricing & Availability */}
                <section className="space-y-6">
                  <div className="flex items-center gap-2 border-b pb-2">
                    <DollarSign className="text-primary" size={20} />
                    <h2 className="text-lg font-bold">
                      3. Pricing & Availability
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Controller
                      name="basePrice"
                      control={methods.control}
                      render={({ field }) => (
                        <SimpleInput
                          {...field}
                          label="Base Price (Total Value)"
                          type="number"
                          icon={<DollarSign size={16} />}
                          onChange={(e) =>
                            field.onChange(e.target.valueAsNumber)
                          }
                        />
                      )}
                    />
                    <Controller
                      name="availableUnits"
                      control={methods.control}
                      render={({ field }) => (
                        <SimpleInput
                          {...field}
                          label="Total Investment Units"
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
                          label="Expected Completion"
                          type="date"
                          icon={<Calendar size={16} />}
                        />
                      )}
                    />
                  </div>
                  <AdditionalFeesManager />
                </section>

                {/* 4. Investment-Specific Details */}
                <section className="space-y-6">
                  <div className="flex items-center gap-2 border-b pb-2">
                    <Percent className="text-primary" size={20} />
                    <h2 className="text-lg font-bold">
                      4. Investment-Specific Details
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Controller
                      name="minimumInvestment"
                      control={methods.control}
                      render={({ field }) => (
                        <SimpleInput
                          {...field}
                          label="Min Investment"
                          type="number"
                          icon={<DollarSign size={16} />}
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
                          label="Profit Share (%)"
                          type="number"
                          icon={<Percent size={16} />}
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
                          icon={<Clock size={16} />}
                          onChange={(e) =>
                            field.onChange(e.target.valueAsNumber)
                          }
                        />
                      )}
                    />
                    <Controller
                      name="exitRule"
                      control={methods.control}
                      render={({ field }) => (
                        <LocalSelect {...field} label="Exit Strategy">
                          <option value="FIXED_PERIOD">Fixed Period</option>
                          <option value="UPON_SALE">Upon Sale</option>
                          <option value="ANYTIME">Flexible Exit</option>
                        </LocalSelect>
                      )}
                    />
                  </div>
                </section>

                <div className="pt-8">
                  <button
                    type="submit"
                    className={`btn btn-primary btn-block h-14 text-lg shadow-lg ${mutation.isPending ? "loading" : ""}`}
                    disabled={mutation.isPending}
                  >
                    {!mutation.isPending && <Plus size={20} className="mr-2" />}
                    {mutation.isPending
                      ? "Creating Project..."
                      : "Create Co-Development Project"}
                  </button>
                </div>
              </form>
            </FormProvider>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}
