import apiClient from "@/api/simpleApi";
import { extract_message } from "@/helpers/apihelpers";
import { RichTextEditor } from "@/components/terms/RichTextEditor";
import SimpleInput from "@/simpleComps/inputs/SimpleInput";
import LocalSelect from "@/simpleComps/inputs/LocalSelect";
import ThemeProvider from "@/simpleComps/ThemeProvider";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useForm, Controller, FormProvider } from "react-hook-form";
import { toast } from "sonner";
import { ArrowLeft, Save } from "lucide-react";
import type { Terms } from "./index";

export const Route = createFileRoute("/dashboard/terms/create")({
  component: RouteComponent,
});

type FormValues = {
  type: Terms["type"];
  title: string;
  version: string;
  content: string;
};

function RouteComponent() {
  const navigate = useNavigate();

  const methods = useForm<FormValues>({
    defaultValues: {
      type: "INVESTOR_INDIVIDUAL",
      title: "",
      version: "1.0",
      content: "",
    },
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = methods;

  const createMutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const resp = await apiClient.post("terms", values);
      return resp.data;
    },
    onSuccess: () => {
      navigate({ to: "/dashboard/terms" });
    },
  });

  const onSubmit = (values: FormValues) => {
    toast.promise(createMutation.mutateAsync(values), {
      loading: "Creating terms…",
      success: "Terms created successfully",
      error: extract_message,
    });
  };

  return (
    <ThemeProvider className="p-6 bg-white shadow rounded-xl space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-3">
        <Link to="/dashboard/terms" className="btn btn-ghost btn-sm btn-circle">
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h2 className="font-bold text-xl">Create Terms</h2>
          <p className="text-sm text-base-content/60 mt-0.5">
            Add a new terms and conditions document
          </p>
        </div>
      </div>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <LocalSelect
              label="Document Type"
              {...register("type", { required: "Type is required" })}
            >
              <option value="INVESTOR_INDIVIDUAL">Individual Investor</option>
              <option value="INVESTOR_CORPORATE">Corporate Investor</option>
              <option value="PARTNER_REAL_ESTATE_AGENT">
                Real Estate Agent
              </option>
              <option value="PARTNER_PROPERTY_DEVELOPER">
                Property Developer
              </option>
            </LocalSelect>

            <SimpleInput
              label="Version"
              placeholder="e.g. 1.0"
              {...register("version")}
            />
          </div>

          <SimpleInput
            label="Title"
            placeholder="e.g. Terms and Conditions for Individual Investors"
            {...register("title", { required: "Title is required" })}
          />

          <Controller
            name="content"
            control={control}
            rules={{ required: "Content is required" }}
            render={({ field }) => (
              <RichTextEditor
                value={field.value}
                onChange={field.onChange}
                error={errors.content?.message}
              />
            )}
          />

          <div className="flex items-center justify-end gap-3 pt-2 border-t border-base-200">
            <Link to="/dashboard/terms" className="btn btn-ghost">
              Cancel
            </Link>
            <button
              type="submit"
              className="btn btn-primary gap-2"
              disabled={createMutation.isPending}
            >
              <Save size={15} />
              {createMutation.isPending ? "Saving…" : "Create Terms"}
            </button>
          </div>
        </form>
      </FormProvider>
    </ThemeProvider>
  );
}
