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
  Image as ImageIcon,
  Wallet,
  TrendingUp,
} from "lucide-react";
import {
  DocumentUpload,
  useDocumentUpload,
} from "../../-components/DocumentUpload";
import type { DocProps } from "@/types/form";
import VideoUpload, { useVideoUpload } from "../../-components/VideoUpload";

export const Route = createFileRoute(
  "/dashboard/properties/new/co-development",
)({
  component: RouteComponent,
});

type ExitRuleType =
  | "ANYTIME"
  | "AFTER_LOCK_IN_PERIOD"
  | "AFTER_PROJECT_COMPLETION"
  | "AT_EXIT_WINDOW_ONLY"
  | "NOT_ALLOWED";

interface CoDevelopmentFormValues extends DocProps {
  minimumInvestment: number;
  profitSharingRatio: number;
  projectDuration: number;
  exitRule: ExitRuleType;
  propertyTitle: string;
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
      //@ts-ignore
      propertyTitle: "",
      propertyType: "RESIDENTIAL",
      location: "",
      description: "",
      developmentStage: undefined,
      completionDate: "",
      basePrice: 0,
      availableUnits: 0,
      minimumInvestment: 0,
      profitSharingRatio: 0,
      projectDuration: 0,
      exitRule: "AFTER_PROJECT_COMPLETION",
      additionalFees: [{ label: "Project Admin", amount: 20000000 }],
      coverImage: "https://example.com/images/cover2.jpg",
      galleryImages: [],
      premiumProperty: false,
      totalPrice: 1020000000,
      certificate: "", // Default for DocProps
      surveyPlanDocument: "", // Default for DocProps
      transferDocument: "", // Default for DocProps
      brochure: "", // Default for DocProps
      videos: "",
    },
  });

  const { images, setPrev, newImages, setNew } = useImages([]);
  const selectProps = useSelectImage(null as any);
  const docUpload = useDocumentUpload();
  const videoUpload = useVideoUpload();
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

      // Handle Document Uploads
      const uploadedDocUrls: Partial<DocProps> = {};
      for (const docType in docUpload.documents) {
        const file =
          docUpload.documents[docType as keyof typeof docUpload.documents];
        if (file) {
          const uploaded = await uploadImage(file); // Assuming uploadImage can handle any file type and returns a URL
          if (uploaded.data?.url) {
            // Map the document type from useDocumentUpload to DocProps keys
            switch (docType) {
              case "certificateOfOwnership":
                uploadedDocUrls.certificate = uploaded.data.url;
                break;
              case "surveyPlan":
                uploadedDocUrls.surveyPlanDocument = uploaded.data.url;
                break;
              case "transferOfOwnershipDocument":
                uploadedDocUrls.transferDocument = uploaded.data.url;
                break;
              case "brochureFactSheet":
                uploadedDocUrls.brochure = uploaded.data.url;
                break;
            }
          }
        }
      }

      // Handle Video Upload
      let videoUrl = "";
      if (videoUpload.videoFile) {
        const uploaded = await uploadImage(videoUpload.videoFile); // Assuming uploadImage can handle video files
        if (uploaded.data?.url) {
          videoUrl = uploaded.data.url;
        }
      }

      const totalPrice =
        Number(data.basePrice) +
        data.additionalFees.reduce(
          (acc, fee) => acc + (Number(fee.amount) || 0),
          0,
        );

      const payload = {
        ...data,
        ...uploadedDocUrls, // Add uploaded document URLs to the payload
        coverImage: coverImageUrl,
        galleryImages: allGallery,
        videos: videoUrl, // Add uploaded video URL to the payload
        totalPrice,
        completionDate: data.completionDate
          ? new Date(data.completionDate).toISOString()
          : null,
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
  //@ts-ignore
  const disable_completionn = methods.watch("developmentStage") === "COMPLETED";

  return (
    <ThemeProvider>
      <div className="mx-auto">
        <div className="bg-base-100 rounded-2xl shadow-xl border border-base-200 overflow-hidden">
          <div className="bg-primary p-6 text-primary-content">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Home size={24} />
              New Co-Development Property
            </h1>
            <p className="opacity-80 text-sm">
              Complete the sections below to list a new investment opportunity.
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
                  <div className="flex items-center gap-2 border-b border-base-200 pb-2">
                    <FileText className="text-primary" size={20} />
                    <h2 className="text-lg font-bold">
                      1. Basic Property Information (Required)
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
                    <div className="md:col-span-2">
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
                    </div>
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
                </section>

                {/* 2. Media & Documents */}
                <section className="space-y-6">
                  <div className="flex items-center gap-2 border-b border-base-200 pb-2">
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
                  <VideoUpload videoProps={videoUpload} />
                </section>

                {/* 3. Pricing & Availability */}
                <section className="space-y-6">
                  <div className="flex items-center gap-2 border-b border-base-200 pb-2">
                    <Wallet className="text-primary" size={20} />
                    <h2 className="text-lg font-bold">
                      3. Pricing & Availability
                    </h2>
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
                          icon={<span>₦</span>}
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
                          label="Units Available"
                          type="number"
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
                  </div>
                  <AdditionalFeesManager />
                </section>

                {/* 4. Investment-Specific Details */}
                <section className="space-y-6">
                  <div className="flex items-center gap-2 border-b border-base-200 pb-2">
                    <TrendingUp className="text-primary" size={20} />
                    <h2 className="text-lg font-bold">
                      4. Investment-Specific Details
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Controller
                      name="profitSharingRatio"
                      control={methods.control}
                      render={({ field }) => (
                        <SimpleInput
                          {...field}
                          label="Profit Ratio (0-100)%"
                          type="number"
                          step="0.01"
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
                          disabled={disable_completionn}
                          label="Completion Date"
                          type="date"
                          icon={<Calendar size={16} />}
                        />
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Controller
                      name="exitRule"
                      control={methods.control}
                      render={({ field }) => (
                        <LocalSelect {...field} label="Exit Strategy">
                          <option value="ANYTIME">Anytime (Liquid)</option>
                          <option value="AFTER_LOCK_IN_PERIOD">
                            After Lock-in Period
                          </option>
                          <option value="AFTER_PROJECT_COMPLETION">
                            After Project Completion
                          </option>
                          <option value="AT_EXIT_WINDOW_ONLY">
                            At Exit Window Only
                          </option>
                          <option value="NOT_ALLOWED">Not Allowed</option>
                        </LocalSelect>
                      )}
                    />
                  </div>
                </section>
                <section>
                  <DocumentUpload useDocUpload={docUpload} />
                </section>

                <div className="pt-8 border-t border-base-200">
                  <button
                    type="submit"
                    className={`btn btn-primary  h-14 text-base shadow-lg ${mutation.isPending ? "loading" : ""}`}
                    disabled={mutation.isPending}
                  >
                    {!mutation.isPending && <Plus size={20} className="mr-2" />}
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
    </ThemeProvider>
  );
}
