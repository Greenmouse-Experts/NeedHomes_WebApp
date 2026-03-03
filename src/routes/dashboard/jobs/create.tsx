import { createFileRoute } from "@tanstack/react-router";
import { useForm, FormProvider } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import apiClient from "@/api/simpleApi";
import SimpleInput from "@/simpleComps/inputs/SimpleInput";
import LocalSelect from "@/simpleComps/inputs/LocalSelect";
import ThemeProvider from "@/simpleComps/ThemeProvider";
import SimpleSelect from "@/simpleComps/inputs/SimpleSelect";

export const Route = createFileRoute("/dashboard/jobs/create")({
  component: RouteComponent,
});

interface CreateJobFormData {
  title: string;
  location?: string;
  jobType?: "FULL_TIME" | "PART_TIME" | "CONTRACT" | "REMOTE" | "HYBRID";
  description: string;
  requirements: string;
  categoryId: string;
}

function RouteComponent() {
  const methods = useForm<CreateJobFormData>({
    defaultValues: {
      title: "",
      location: "",
      jobType: "FULL_TIME",
      description: "",
      requirements: "",
      categoryId: "",
    },
  });

  const createJobMutation = useMutation({
    mutationFn: async (data: CreateJobFormData) => {
      const response = await apiClient.post("/careers", data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Job created successfully!", { duration: 2000 });
      methods.reset();
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || "Failed to create job";
      toast.error(errorMessage, { duration: 2000 });
    },
  });

  const onSubmit = (data: CreateJobFormData) => {
    createJobMutation.mutate(data);
  };

  return (
    <ThemeProvider className="w-full container bg-white fade shadow rounded-box  ring mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Create Job</h1>

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
          <SimpleSelect
            label="Category"
            {...methods.register("categoryId")}
            route="/careers/categories"
            render={(item: { name: string; id: string }) => {
              return (
                <>
                  <option className="" value={item.id}>
                    {item.name}
                  </option>
                </>
              );
            }}
          ></SimpleSelect>
          <LocalSelect label="Job Type" {...methods.register("jobType")}>
            <option value="FULL_TIME">Full Time</option>
            <option value="PART_TIME">Part Time</option>
            <option value="CONTRACT">Contract</option>
            <option value="REMOTE">Remote</option>
            <option value="HYBRID">Hybrid</option>
          </LocalSelect>

          {/*<SimpleInput
            label="Category ID"
            placeholder="Enter category ID"
            {...methods.register("categoryId", {
              required: "Category ID is required",
            })}
          />*/}

          <div className="w-full space-y-2">
            <label className="fieldset-label font-semibold">
              <span className="text-sm">Description</span>
            </label>
            <textarea
              placeholder="Enter job description"
              className="textarea textarea-bordered w-full"
              rows={4}
              {...methods.register("description", {
                required: "Description is required",
              })}
            />
            {methods.formState.errors.description && (
              <p className="text-error text-sm mt-1">
                {methods.formState.errors.description.message}
              </p>
            )}
          </div>

          <div className="w-full space-y-2">
            <label className="fieldset-label font-semibold">
              <span className="text-sm">Requirements</span>
            </label>
            <textarea
              placeholder="Enter job requirements (one per line)"
              className="textarea textarea-bordered w-full"
              rows={4}
              {...methods.register("requirements", {
                required: "Requirements are required",
              })}
            />
            {methods.formState.errors.requirements && (
              <p className="text-error text-sm mt-1">
                {methods.formState.errors.requirements.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={createJobMutation.isPending}
            className="btn btn-primary btn-block btn-lg"
          >
            {createJobMutation.isPending ? "Creating..." : "Create Job"}
          </button>
        </form>
      </FormProvider>
    </ThemeProvider>
  );
}
