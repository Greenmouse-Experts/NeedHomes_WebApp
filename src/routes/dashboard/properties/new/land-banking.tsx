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
import apiClient from "@/api/simpleApi";
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
} from "lucide-react";

export const Route = createFileRoute("/dashboard/properties/new/land-banking")({
  component: RouteComponent,
});

interface AdditionalFee {
  label: string;
  amount: number;
}

interface LandBankingProperty {
  propertyTitle: string;
  propertyType: "LAND" | "RESIDENTIAL" | "COMMERCIAL";
  location: string;
  description: string;
  developmentStage:
    | "PLANNING"
    | "OFF_PLAN"
    | "UNDER_CONSTRUCTION"
    | "COMPLETED";
  completionDate: string;
  coverImage: string;
  galleryImages: string[];
  basePrice: number;
  additionalFees: AdditionalFee[];
  availableUnits: number;
  totalPrice: number;
  plotSize: number;
  pricePerPlot: number;
  holdingPeriod: number;
  buyBackOption: boolean;
}

function AdditionalFeesManager() {
  const { control, register } = useFormContext<LandBankingProperty>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "additionalFees",
  });

  return (
    <div className="space-y-4 bg-base-200/30 p-4 rounded-lg border border-base-300">
      <div className="flex justify-between items-center">
        <h3 className="text-xs font-bold uppercase tracking-wider opacity-70">
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
              placeholder="e.g. Survey Fee"
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
  const methods = useForm<LandBankingProperty>({
    defaultValues: {
      propertyTitle: "",
      propertyType: "LAND",
      location: "",
      description: "",
      developmentStage: "PLANNING",
      completionDate: "",
      basePrice: 0,
      availableUnits: 1,
      plotSize: 0,
      pricePerPlot: 0,
      holdingPeriod: 12,
      buyBackOption: false,
      additionalFees: [{ label: "Survey Fee", amount: 0 }],
      coverImage: "",
      galleryImages: [],
      totalPrice: 0,
    },
  });

  const { images, setPrev, newImages, setNew } = useImages([]);
  const selectProps = useSelectImage(null as any);
  const nav = useNavigate();

  const mutation = useMutation({
    mutationFn: async (data: LandBankingProperty) => {
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
        (acc: number, fee: AdditionalFee) => acc + Number(fee.amount || 0),
        0,
      );

      const totalPrice = Number(data.basePrice || 0) + feesTotal;

      const payload = {
        ...data,
        coverImage: coverImageUrl,
        galleryImages: allGallery,
        totalPrice,
      };

      const response = await apiClient.post(
        "/admin/properties/land-banking",
        payload,
      );
      return response.data;
    },
    onSuccess: () => {
      nav({
        to: "/partners/properties",
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

  const computeDisplayedTotal = () => {
    const vals = methods.getValues();
    const feesTotal = (vals.additionalFees || []).reduce(
      (acc, f) => acc + Number(f.amount || 0),
      0,
    );
    return Number(vals.basePrice || 0) + feesTotal;
  };

  return (
    <ThemeProvider>
      <div className="mx-auto max-w-5xl">
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

          <div className="p-6 md:p-8">
            <FormProvider {...methods}>
              <form
                onSubmit={methods.handleSubmit(onSubmit)}
                className="space-y-12"
              >
                {/* 1. Basic Property Information */}
                <section className="space-y-6">
                  <div className="flex items-center gap-2 border-b pb-2">
                    <Info className="text-primary" size={20} />
                    <h2 className="text-lg font-bold">
                      1. Basic Property Information
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    <Controller
                      name="propertyTitle"
                      control={methods.control}
                      rules={{ required: "Title is required" }}
                      render={({ field }) => (
                        <SimpleInput
                          {...field}
                          label="Property Title"
                          placeholder="e.g. Green Acres"
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
                          placeholder="Ibeju-Lekki, Lagos"
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
                          <option value="LAND">Land</option>
                          <option value="RESIDENTIAL">Residential</option>
                          <option value="COMMERCIAL">Commercial</option>
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
                    <div className="md:col-span-2">
                      <Controller
                        name="description"
                        control={methods.control}
                        render={({ field }) => (
                          <SimpleTextArea
                            {...field}
                            label="Description"
                            placeholder="Describe the land banking opportunity..."
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
                    <ImageIcon className="text-primary" size={20} />
                    <h2 className="text-lg font-bold">2. Media & Documents</h2>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="flex flex-col">
                      <label className="label font-bold text-xs uppercase tracking-widest opacity-60">
                        Primary Cover
                      </label>
                      <div className="h-64 flex w-full rounded-xl overflow-hidden ring-2 ring-base-200 ring-offset-2">
                        <SelectImage {...selectProps} title="Select Cover" />
                      </div>
                    </div>
                    <div className="space-y-3">
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
                      name="availableUnits"
                      control={methods.control}
                      render={({ field }) => (
                        <SimpleInput
                          {...field}
                          label="Available Units"
                          type="number"
                          onChange={(e) =>
                            field.onChange(e.target.valueAsNumber)
                          }
                        />
                      )}
                    />
                    <div>
                      <label className="label font-semibold text-sm">
                        Total Price (computed)
                      </label>
                      <div className="input input-bordered w-full flex items-center bg-base-200/50 font-bold">
                        ₦{computeDisplayedTotal().toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <AdditionalFeesManager />
                </section>

                {/* 4. Investment-Specific Details */}
                <section className="space-y-6">
                  <div className="flex items-center gap-2 border-b pb-2">
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
                          onChange={(e) =>
                            field.onChange(e.target.valueAsNumber)
                          }
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
                          onChange={(e) =>
                            field.onChange(e.target.valueAsNumber)
                          }
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
                          label="Maturity Date"
                          type="date"
                          icon={<Calendar size={16} />}
                        />
                      )}
                    />
                    <div className="md:col-span-2 flex items-end pb-1">
                      <div className="flex items-center gap-4 p-3 border rounded-lg w-full bg-base-200/20">
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

                <div className="pt-8">
                  <button
                    type="submit"
                    className={`btn btn-primary btn-block h-14 text-lg shadow-lg ${mutation.isPending ? "loading" : ""}`}
                    disabled={mutation.isPending}
                  >
                    {!mutation.isPending && <Plus size={20} className="mr-2" />}
                    {mutation.isPending
                      ? "Creating..."
                      : "Create Land Banking Property"}
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
