import { type UseFormReturn, Controller } from "react-hook-form";
import { RichTextEditor } from "@/components/terms/RichTextEditor";

export interface FAQFormValues {
  question: string;
  answer: string;
  order: number;
  isActive: boolean;
}

export default function FAQForm({
  form,
  onSubmit,
  isPending,
  submitLabel,
}: {
  form: UseFormReturn<FAQFormValues>;
  onSubmit: (data: FAQFormValues) => void;
  isPending: boolean;
  submitLabel: string;
}) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = form;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white rounded-xl border border-gray-200 p-6 space-y-5"
    >
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-gray-700">
          Question <span className="text-red-500">*</span>
        </label>
        <input
          className="input input-bordered w-full"
          placeholder="e.g. How does co-development work?"
          {...register("question", { required: "Question is required" })}
        />
        {errors.question && (
          <p className="text-xs text-red-500">{errors.question.message}</p>
        )}
      </div>

      <Controller
        control={control}
        name="answer"
        rules={{ required: "Answer is required" }}
        render={({ field }) => (
          <RichTextEditor
            label="Answer"
            placeholder="Provide a clear and helpful answer..."
            value={field.value ?? ""}
            onChange={field.onChange}
            error={errors.answer?.message}
          />
        )}
      />

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">
            Display Order
          </label>
          <input
            type="number"
            min={0}
            className="input input-bordered w-full"
            {...register("order", { valueAsNumber: true, min: 0 })}
          />
          <p className="text-xs text-gray-400">Lower number appears first</p>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">
            Visibility
          </label>
          <Controller
            control={control}
            name="isActive"
            render={({ field }) => (
              <label className="flex items-center gap-3 cursor-pointer mt-2">
                <input
                  type="checkbox"
                  className="toggle toggle-primary"
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                />
                <span className="text-sm text-gray-700">
                  {field.value ? "Publicly visible" : "Hidden"}
                </span>
              </label>
            )}
          />
        </div>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={isPending}
          className={`btn btn-primary ${isPending ? "loading" : ""}`}
        >
          {isPending ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
