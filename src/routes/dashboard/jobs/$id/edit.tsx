import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import apiClient from "@/api/simpleApi";
import type { ApiResponse } from "@/api/simpleApi";
import SimpleInput from "@/simpleComps/inputs/SimpleInput";
import LocalSelect from "@/simpleComps/inputs/LocalSelect";
import ThemeProvider from "@/simpleComps/ThemeProvider";
import SimpleSelect from "@/simpleComps/inputs/SimpleSelect";
import BackButton from "@/components/BackButton";
import PageLoader from "@/components/layout/PageLoader";
import { RichTextEditor } from "@/components/terms/RichTextEditor";

export const Route = createFileRoute("/dashboard/jobs/$id/edit")({
  component: RouteComponent,
});

interface EditJobFormData {
  title: string;
  location?: string;
  jobType?: "FULL_TIME" | "PART_TIME" | "CONTRACT" | "REMOTE" | "HYBRID";
  description: string;
  requirements: string;
  categoryId: string;
}

interface Job {
  id: string;
  title: string;
  location: string;
  jobType: "FULL_TIME" | "PART_TIME" | "CONTRACT" | "REMOTE" | "HYBRID";
  description: string;
  requirements: string;
  categoryId: string;
}

function RouteComponent() {
  const { id } = Route.useParams();
  const nav = useNavigate();

  const query = useQuery<ApiResponse<Job>>({
    queryKey: ["jobs-get", id],
    queryFn: async () => {
      const resp = await apiClient.get("/careers/admin/" + id);
      return resp.data;
    },
  });

  return (
    <>
      <BackButton />
      <PageLoader query={query}>
        {(resp) => <EditForm job={resp.data} id={id} nav={nav} />}
      </PageLoader>
    </>
  );
}

function EditForm({
  job,
  id,
  nav,
}: {
  job: Job;
  id: string;
  nav: ReturnType<typeof useNavigate>;
}) {
  const methods = useForm<EditJobFormData>({
    defaultValues: {
      title: job.title,
      location: job.location,
      jobType: job.jobType,
      description: job.description,
      requirements: job.requirements,
      categoryId: job.categoryId,
    },
  });

  const editJobMutation = useMutation({
    mutationFn: async (data: EditJobFormData) => {
      const response = await apiClient.patch("/careers/" + id, data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Job updated successfully!", { duration: 2000 });
      nav({ to: "/dashboard/jobs/$id", params: { id } });
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || "Failed to update job";
      toast.error(errorMessage, { duration: 2000 });
    },
  });

  const onSubmit = (data: EditJobFormData) => {
    editJobMutation.mutate(data);
  };

  return (
    <ThemeProvider className="w-full bg-white fade shadow rounded-box ring mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Job</h1>

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
          <SimpleInput
            label="Job Title"
            placeholder="Enter job title"
            {...methods.register("title", {
              required: "Job title is required",
              maxLength: {
                value: 300,
                message: "Job title must not exceed 300 characters",
              },
            })}
          />

          <SimpleInput
            label="Location"
            placeholder="e.g., Lagos, Nigeria"
            {...methods.register("location", {
              maxLength: {
                value: 500,
                message: "Location must not exceed 500 characters",
              },
            })}
          />

          <Controller
            control={methods.control}
            name="categoryId"
            render={({ field }) => (
              <SimpleSelect
                value={field.value}
                onChange={(val) => field.onChange(val)}
                label="Category"
                route="/careers/categories"
                render={(item: { name: string; id: string }) => (
                  <option value={item.id}>{item.name}</option>
                )}
              />
            )}
          />

          <LocalSelect label="Job Type" {...methods.register("jobType")}>
            <option value="FULL_TIME">Full Time</option>
            <option value="PART_TIME">Part Time</option>
            <option value="CONTRACT">Contract</option>
            <option value="REMOTE">Remote</option>
            <option value="HYBRID">Hybrid</option>
          </LocalSelect>

          <Controller
            control={methods.control}
            name="description"
            rules={{ required: "Description is required" }}
            render={({ field }) => (
              <RichTextEditor
                label="Description"
                placeholder="Enter job description"
                value={field.value}
                onChange={field.onChange}
                error={methods.formState.errors.description?.message}
              />
            )}
          />

          <Controller
            control={methods.control}
            name="requirements"
            rules={{ required: "Requirements are required" }}
            render={({ field }) => (
              <RichTextEditor
                label="Requirements"
                placeholder="Enter job requirements"
                value={field.value}
                onChange={field.onChange}
                error={methods.formState.errors.requirements?.message}
              />
            )}
          />

          <button
            type="submit"
            disabled={editJobMutation.isPending}
            className="btn btn-primary btn-block btn-lg"
          >
            {editJobMutation.isPending ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </FormProvider>
    </ThemeProvider>
  );
}
