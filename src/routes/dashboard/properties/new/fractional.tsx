import { createFileRoute } from "@tanstack/react-router";
import {
  useForm,
  FormProvider,
  useFieldArray,
  Controller,
  useFormContext,
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
import VideoUpload, {
  useVideoUpload,
} from "@/routes/dashboard/-components/VideoUpload";
import {
  DocumentUpload,
  useDocumentUpload,
} from "@/routes/dashboard/-components/DocumentUpload";
import {
  Plus,
  Trash2,
  Home,
  MapPin,
  DollarSign,
  Calendar,
  Image as ImageIcon,
  Briefcase,
  Layers,
} from "lucide-react";
import type { DocProps } from "@/types/form";

export const Route = createFileRoute("/dashboard/properties/new/fractional")({
  component: RouteComponent,
});

interface AdditionalFee {
  label: string;
  amount: number;
}

interface FractionalPropertyFormValues extends DocProps {
  propertyTitle: string;
  propertyType: "RESIDENTIAL" | "COMMERCIAL" | "LAND";
  location: string;
  description: string;
  developmentStage: "PLANNING" | "UNDER_CONSTRUCTION" | "COMPLETED" | "ONGOING";
  completionDate: string;
  coverImage: string;
  galleryImages: string[];
  basePrice: number;
  additionalFees: AdditionalFee[];
  availableUnits: number;
  totalPrice: number;
  totalShares: number;
  pricePerShare: number;
  minimumShares: number;
  exitWindow: "MONTHLY" | "QUARTERLY" | "ANNUALLY" | "NONE";
}

function AdditionalFeesManager() {
  const { control, register } = useFormContext<FractionalPropertyFormValues>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "additionalFees",
  });
  return (
    <div className="space-y-4 bg-base-200/30 p-4 rounded-lg border border-base-300">
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
  const methods = useForm<FractionalPropertyFormValues>({
    defaultValues: {
      propertyTitle: "Urban Co-Living",
      propertyType: "RESIDENTIAL",
      location: "Yaba, Lagos",
      description: "Fractional shares in co-living units",
      developmentStage: "ONGOING",
      completionDate: "2027-09-01T00:00:00.000Z",
      coverImage: "https://example.com/images/cover3.jpg",
      galleryImages: [],
      basePrice: 200000000,
      additionalFees: [],
      availableUnits: 50,
      totalPrice: 200000000,
      totalShares: 10000,
      pricePerShare: 20000,
      minimumShares: 10,
      exitWindow: "MONTHLY",
      certificate: "",
      surveyPlanDocument: "",
      transferDocument: "",
      brochure: "",
      videos: "",
    },
  });
  const disable_completion = methods.watch("developmentStage") === "COMPLETED";

  const { images, setPrev, newImages, setNew } = useImages([]);
  const selectProps = useSelectImage(null as any);
  const videoProps = useVideoUpload();
  const docUploadProps = useDocumentUpload();

  const mutation = useMutation({
    mutationFn: async (data: FractionalPropertyFormValues) => {
      let coverImageUrl = "";

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

      const uploadFile = async (file: File) => {
        const fd = new FormData();
        fd.append("file", file);
        const resp = await apiClient.post("/admin/uploads", fd, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        return resp.data?.url || "";
      };

      const uploadedDocUrls: Partial<DocProps> = {};
      const docFiles = docUploadProps.documents;

      if (docFiles.certificateOfOwnership) {
        try {
          const url = await uploadFile(docFiles.certificateOfOwnership);
          if (url) uploadedDocUrls.certificate = url;
        } catch (e) {}
      }

      if (docFiles.surveyPlan) {
        try {
          const url = await uploadFile(docFiles.surveyPlan);
          if (url) uploadedDocUrls.surveyPlanDocument = url;
        } catch (e) {}
      }

      if (docFiles.transferOfOwnershipDocument) {
        try {
          const url = await uploadFile(docFiles.transferOfOwnershipDocument);
          if (url) uploadedDocUrls.transferDocument = url;
        } catch (e) {}
      }

      if (docFiles.brochureFactSheet) {
        try {
          const url = await uploadFile(docFiles.brochureFactSheet);
          if (url) uploadedDocUrls.brochure = url;
        } catch (e) {}
      }

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

      const payload: any = {
        ...data,
        coverImage: coverImageUrl,
        galleryImages: allGallery,
        completionDate: data.completionDate
          ? new Date(data.completionDate).toISOString()
          : null,
        certificate: uploadedDocUrls.certificate || data.certificate,
        surveyPlanDocument:
          uploadedDocUrls.surveyPlanDocument || data.surveyPlanDocument,
        transferDocument:
          uploadedDocUrls.transferDocument || data.transferDocument,
        brochure: uploadedDocUrls.brochure || data.brochure,
        videos: videoUrl || data.videos,
      };

      payload.basePrice = Number(payload.basePrice) || 0;
      payload.availableUnits = Number(payload.availableUnits) || 0;
      payload.totalShares = Number(payload.totalShares) || 0;
      payload.pricePerShare = Number(payload.pricePerShare) || 0;
      payload.minimumShares = Number(payload.minimumShares) || 0;
      payload.totalPrice = Number(payload.totalPrice) || 0;

      const response = await apiClient.post(
        "/admin/properties/fractional",
        payload,
      );
      return response.data;
    },
  });

  const onSubmit = (data: FractionalPropertyFormValues) => {
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
              New Fractional Property
            </h1>
            <p className="opacity-80 text-sm">
              Fill in details to list a fractional ownership offering.
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
                  <div className="flex items-center gap-2 pb-2 border-b border-base-200">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                      <Home size={20} />
                    </div>
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
                          placeholder="e.g. Riverside Estate"
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
                          placeholder="Banana Island, Lagos"
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
                          <option value="ONGOING">Ongoing</option>
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
                        placeholder="Provide details, ROI expectations and infrastructure notes..."
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
                </section>

                {/* 2. Media & Documents */}
                <section className="space-y-6">
                  <div className="flex items-center gap-2 pb-2 border-b border-base-200">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                      <ImageIcon size={20} />
                    </div>
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

                  <div className="mt-4 space-y-4">
                    <VideoUpload videoProps={videoProps} />
                    <DocumentUpload useDocUpload={docUploadProps} />
                  </div>
                </section>

                {/* 3. Pricing & Availability */}
                <section className="space-y-6">
                  <div className="flex items-center gap-2 pb-2 border-b border-base-200">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                      <DollarSign size={20} />
                    </div>
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
                          icon={<DollarSign size={16} />}
                          onChange={(e) =>
                            field.onChange(Number((e as any).target?.value))
                          }
                        />
                      )}
                    />
                    <Controller
                      name="totalPrice"
                      control={methods.control}
                      render={({ field }) => (
                        <SimpleInput
                          {...field}
                          label="Total Price"
                          type="number"
                          icon={<DollarSign size={16} />}
                          onChange={(e) =>
                            field.onChange(Number((e as any).target?.value))
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
                            field.onChange(Number((e as any).target?.value))
                          }
                        />
                      )}
                    />
                  </div>
                  <AdditionalFeesManager />
                </section>

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
                          label="Price Per Share"
                          type="number"
                          icon={<DollarSign size={16} />}
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
                          label="Minimum Shares"
                          type="number"
                          onChange={(e) =>
                            field.onChange(Number((e as any).target?.value))
                          }
                        />
                      )}
                    />
                  </div>
                </section>

                {/* 5. Investment-Specific Details */}
                <section className="space-y-6">
                  <div className="flex items-center gap-2 pb-2 border-b border-base-200">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                      <Briefcase size={20} />
                    </div>
                    <h2 className="text-lg font-bold">
                      5. Investment-Specific Details
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Controller
                      name="completionDate"
                      control={methods.control}
                      render={({ field }) => (
                        <SimpleInput
                          {...field}
                          disabled={disable_completion}
                          label="Completion Date"
                          type="date"
                          icon={<Calendar size={16} />}
                        />
                      )}
                    />
                    <Controller
                      name="exitWindow"
                      control={methods.control}
                      render={({ field }) => (
                        <LocalSelect {...field} label="Exit Window">
                          <option value="MONTHLY">Monthly</option>
                          <option value="QUARTERLY">Quarterly</option>
                          <option value="ANNUALLY">Annually</option>
                          <option value="NONE">None</option>
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
                      ? "Processing..."
                      : "Publish Fractional Property"}
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
