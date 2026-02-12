import SimpleInput from "@/simpleComps/inputs/SimpleInput";
import {
  Controller,
  FormProvider,
  useFieldArray,
  useForm,
  type UseFormProps,
} from "react-hook-form";
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
import { useImages, useSelectImage } from "@/helpers/images";
import SimpleTextArea from "@/simpleComps/inputs/SimpleTextArea";
import UpdateImages from "@/simpleComps/inputs/UpdateImages";
import type { useMutation } from "@tanstack/react-query";
import ThemeProvider from "@/simpleComps/ThemeProvider";
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
export default function DefaultForm<T = any>({
  form,
  onSubmit,
  useImagesProps,
  selectImageProps,
  mutation,
  children,
}: {
  //@ts-ignore
  form: ReturnType<typeof useForm<T>>;
  onSubmit: (data: T) => any;
  useImagesProps: ReturnType<typeof useImages>;
  selectImageProps: ReturnType<typeof useSelectImage>;
  mutation: ReturnType<typeof useMutation<any>>;
  children: React.ReactNode;
}) {
  const methods = form;

  const { images, setPrev, newImages, setNew } = useImagesProps;
  const selectProps = selectImageProps;
  const docUpload = useDocumentUpload();
  const videoUpload = useVideoUpload();
  const disable_completionn = methods.watch("developmentStage") === "COMPLETED";
  return (
    <ThemeProvider className="space-y-4 bg-white p-6">
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmit as any)}
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
              <span className="label-text font-bold">Premium Property</span>
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
            <section>
              <DocumentUpload useDocUpload={docUpload} />
            </section>
          </section>

          {/* 3. Pricing & Availability */}
          <section className="space-y-6">
            <div className="flex items-center gap-2 border-b border-base-200 pb-2">
              <Wallet className="text-primary" size={20} />
              <h2 className="text-lg font-bold">3. Pricing & Availability</h2>
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
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
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
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
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
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  />
                )}
              />
            </div>
            <AdditionalFeesManager />
          </section>
          <section className="space-y-6">{children}</section>
          <PublishButton mutation={mutation} title="Publish" />
          {/* 4. Investment-Specific Details */}
        </form>
      </FormProvider>
    </ThemeProvider>
  );
}

const PublishButton = ({
  mutation,
  title,
}: {
  mutation: any;
  title: string;
}) => {
  return (
    <div className="pt-8 border-t border-base-200">
      <button
        type="submit"
        className={`btn btn-primary  h-14 text-base shadow-lg ${mutation.isPending ? "loading" : ""}`}
        disabled={mutation.isPending}
      >
        {!mutation.isPending && <Plus size={20} className="mr-2" />}
        {mutation.isPending ? "Processing..." : (title ?? "Publish")}
      </button>
    </div>
  );
};
