import apiClient, { type ApiResponse } from "@/api/simpleApi";
import { extract_message } from "@/helpers/apihelpers";
import { RichTextEditor } from "@/components/terms/RichTextEditor";
import SimpleInput from "@/simpleComps/inputs/SimpleInput";
import ThemeProvider from "@/simpleComps/ThemeProvider";
import PageLoader from "@/components/layout/PageLoader";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useForm, Controller, FormProvider } from "react-hook-form";
import { toast } from "sonner";
import { ArrowLeft, Save } from "lucide-react";
import type { Terms } from "../index";

export const Route = createFileRoute("/dashboard/terms/edit/$termsId")({
  component: RouteComponent,
});

type FormValues = {
  title: string;
  version: string;
  content: string;
};

function RouteComponent() {
  const { termsId } = Route.useParams();
  const navigate = useNavigate();
  const termsType = termsId as Terms["type"];

  const query = useQuery<ApiResponse<Terms>>({
    queryKey: ["admin-terms-single", termsType],
    queryFn: async () => {
      const resp = await apiClient.get(`terms?type=${termsType}`);
      return resp.data;
    },
  });

  const methods = useForm<FormValues>({
    defaultValues: { title: "", version: "1.0", content: "" },
  });

  const {
    register,
    handleSubmit,
    control,
    getValues,
    reset,
    formState: { errors },
  } = methods;

  useEffect(() => {
    if (query.data?.data) {
      const t = query.data.data;
      reset({
        title: t.title,
        version: t.version ?? "1.0",
        content: t.content,
      });
    }
  }, [query.data, reset]);

  const updateMutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const resp = await apiClient.patch(`terms?type=${termsType}`, values);
      return resp.data;
    },
    onSuccess: () => {
      navigate({ to: "/dashboard/terms" });
    },
  });

  const onSubmit = (values: FormValues) => {
    toast.promise(updateMutation.mutateAsync(values), {
      loading: "Updating terms…",
      success: "Terms updated successfully",
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
          <h2 className="font-bold text-xl">Edit Terms</h2>
          <p className="text-sm text-base-content/60 mt-0.5">
            Update the terms and conditions document
          </p>
        </div>
      </div>

      <PageLoader query={query}>
        {() => (
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Document Type</label>
                  <div className="input input-md input-bordered flex items-center bg-base-200/50 text-base-content/60 text-sm">
                    {termsType.replace(/_/g, " ")}
                  </div>
                </div>

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
              {/*{getValues("content")}*/}

              <div className="flex items-center justify-end gap-3 pt-2 border-t border-base-200">
                <Link to="/dashboard/terms" className="btn btn-ghost">
                  Cancel
                </Link>
                <button
                  type="submit"
                  className="btn btn-primary gap-2"
                  disabled={updateMutation.isPending}
                >
                  <Save size={15} />
                  {updateMutation.isPending ? "Saving…" : "Update Terms"}
                </button>
              </div>
            </form>
          </FormProvider>
        )}
      </PageLoader>
    </ThemeProvider>
  );
}
