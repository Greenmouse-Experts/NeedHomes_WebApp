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
  FileText,
  Video,
} from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import type { DocProps } from "@/types/form";
import {
  DocumentUpload,
  useDocumentUpload,
} from "../../-components/DocumentUpload";
import VideoUpload, { useVideoUpload } from "../../-components/VideoUpload";

export const Route = createFileRoute("/dashboard/properties/new/outright")({
  component: RouteComponent,
});

interface AdditionalFee {
  label: string;
  amount: number;
}

interface OutrightPropertyFormValues extends DocProps {
  propertyTitle: string;
  propertyType: "RESIDENTIAL" | "COMMERCIAL" | "LAND";
  location: string;
  description: string;
  developmentStage: "OFF_PLAN" | "UNDER_CONSTRUCTION" | "COMPLETED";
  completionDate: string;
  premiumProperty: boolean;
  coverImage: string;
  galleryImages: string[];
  videos: string;
  basePrice: number;
  additionalFees: AdditionalFee[];
  availableUnits: number;
  totalPrice: number;
  paymentOption: "FULL_PAYMENT" | "INSTALLMENT";
  installmentDuration: number | null;
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
  const methods = useForm<OutrightPropertyFormValues>({
    defaultValues: {
      propertyTitle: "",
      propertyType: "RESIDENTIAL",
      location: "",
      description: "",
      developmentStage: "COMPLETED",
      completionDate: "",
      premiumProperty: false,
      coverImage: "",
      galleryImages: [],
      videos: "",
      basePrice: 0,
      additionalFees: [],
      availableUnits: 1,
      totalPrice: 0,
      paymentOption: "FULL_PAYMENT",
      installmentDuration: null,
    },
  });

  const { images, setPrev, newImages, setNew } = useImages([]);
  const selectProps = useSelectImage(null as any);
  const docUpload = useDocumentUpload();
  const videoUpload = useVideoUpload();
  const nav = useNavigate();

  const mutation = useMutation({
    mutationFn: async (data: OutrightPropertyFormValues) => {
      // 1. Upload Cover Image
      let coverImageUrl = "";
      if (selectProps.image) {
        const uploaded = await uploadImage(selectProps.image);
        coverImageUrl = uploaded.data.url;
      } else if (selectProps.prev) {
        coverImageUrl = selectProps.prev;
      }

      if (!coverImageUrl) throw new Error("A cover image is required.");

      // 2. Upload Gallery Images
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

      // 3. Upload Documents
      const docUrls: Partial<DocProps> = {};
      const docEntries = Object.entries(docUpload.documents);
      for (const [key, file] of docEntries) {
        if (file) {
          const uploaded = await uploadImage(file);
          const map: Record<string, keyof DocProps> = {
            certificateOfOwnership: "certificate",
            surveyPlan: "surveyPlanDocument",
            transferOfOwnershipDocument: "transferDocument",
            brochureFactSheet: "brochure",
          };
          const apiKey = map[key];
          if (apiKey) docUrls[apiKey] = uploaded.data.url;
        }
      }

      // 4. Upload Video
      let videoUrl = "";
      if (videoUpload.videoFile) {
        const uploaded = await uploadImage(videoUpload.videoFile);
        videoUrl = uploaded.data.url;
      }

      const feesTotal = (data.additionalFees || []).reduce(
        (acc, fee) => acc + Number(fee.amount || 0),
        0,
      );
      const totalPrice = Number(data.basePrice || 0) + feesTotal;

      const payload = {
        ...data,
        ...docUrls,
        coverImage: coverImageUrl,
        galleryImages: allGallery,
        videos: videoUrl,
        totalPrice,
        completionDate: data.completionDate
          ? new Date(data.completionDate).toISOString()
          : null,
      };

      const response = await apiClient.post(
        "/admin/properties/outright",
        payload,
      );
      return response.data;
    },
    onSuccess: () => {
      nav({ to: "/partners/properties" });
    },
  });

  const onSubmit = (data: OutrightPropertyFormValues) => {
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
              New Outright Property
            </h1>
            <p className="opacity-80 text-sm">
              List a new property for outright purchase.
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
                          placeholder="e.g. Sunnyvale Villa"
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
                            label="Property Description"
                            placeholder="Detailed description..."
                            rows={4}
                          />
                        )}
                      />
                    </div>
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
                  </div>
                </section>

                {/* 2. Media */}
                <section className="space-y-6">
                  <div className="flex items-center gap-2 border-b pb-2">
                    <Plus className="text-primary" size={20} />
                    <h2 className="text-lg font-bold">2. Media</h2>
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
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 border-b pb-2">
                      <Video className="text-primary" size={20} />
                      <h2 className="text-lg font-bold">Video Presentation</h2>
                    </div>
                    <VideoUpload videoProps={videoUpload} />
                  </div>
                </section>

                {/* 3. Documents */}
                <section className="space-y-6">
                  <div className="flex items-center gap-2 border-b pb-2">
                    <FileText className="text-primary" size={20} />
                    <h2 className="text-lg font-bold">3. Documents</h2>
                  </div>
                  <DocumentUpload useDocUpload={docUpload} />
                </section>

                {/* 4. Pricing & Payment */}
                <section className="space-y-6">
                  <div className="flex items-center gap-2 border-b pb-2">
                    <DollarSign className="text-primary" size={20} />
                    <h2 className="text-lg font-bold">4. Pricing & Payment</h2>
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
                    {methods.watch("paymentOption") === "INSTALLMENT" && (
                      <Controller
                        name="installmentDuration"
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
                    )}
                  </div>
                  <AdditionalFeesManager />
                </section>

                <div className="pt-8">
                  <button
                    type="submit"
                    className={`btn btn-primary btn-block h-14 text-lg shadow-lg ${mutation.isPending ? "loading" : ""}`}
                    disabled={mutation.isPending}
                  >
                    {!mutation.isPending && <Plus size={20} className="mr-2" />}
                    {mutation.isPending
                      ? "Creating Property..."
                      : "Create Outright Property"}
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
