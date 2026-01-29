import { createFileRoute } from "@tanstack/react-router";
import { useForm, FormProvider } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import SimpleInput from "@/simpleComps/inputs/SimpleInput";
import UpdateImages from "@/components/images/UpdateImages";
import { useImages } from "@/helpers/images";
import ThemeProvider from "@/simpleComps/ThemeProvider";

export const Route = createFileRoute(
  "/dashboard/properties/new/co-development",
)({
  component: RouteComponent,
});

function RouteComponent() {
  const methods = useForm({
    defaultValues: {
      propertyTitle: "",
      propertyType: "RESIDENTIAL",
      location: "",
      description: "",
      developmentStage: "PLANNING",
      completionDate: "",
      basePrice: 0,
      availableUnits: 1,
      minimumInvestment: 0,
      profitSharingRatio: 0,
      projectDuration: 0,
      exitRule: "AFTER_PROJECT_COMPLETION",
      additionalFees: [{ label: "Project Admin", amount: 20000000 }],
    },
  });

  const { images, setPrev, setNew } = useImages([]);

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      console.log("Submitting Co-Development data:", {
        ...data,
        galleryImages: images,
      });
      return data;
    },
  });

  const onSubmit = (data: any) => {
    mutation.mutate(data);
  };

  return (
    <ThemeProvider>
      <div className="p-6 bg-base-100 rounded-xl ring fade mx-auto">
        <h1 className="text-xl font-bold mb-6">
          Create Co-Development Property
        </h1>

        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SimpleInput
                label="Property Title"
                name="propertyTitle"
                placeholder="Riverside Estate"
                required
              />
              <SimpleInput
                label="Location"
                name="location"
                placeholder="Banana Island, Lagos"
                required
              />
              <SimpleInput
                label="Base Price"
                name="basePrice"
                type="number"
                required
              />
              <SimpleInput
                label="Available Units"
                name="availableUnits"
                type="number"
                required
              />
              <SimpleInput
                label="Minimum Investment"
                name="minimumInvestment"
                type="number"
                required
              />
              <SimpleInput
                label="Profit Sharing Ratio (e.g. 0.25)"
                name="profitSharingRatio"
                type="number"
                step="0.01"
                required
              />
              <SimpleInput
                label="Project Duration (Months)"
                name="projectDuration"
                type="number"
                required
              />
              <SimpleInput
                label="Completion Date"
                name="completionDate"
                type="date"
                required
              />
              <div className="flex flex-col gap-2">
                <label className="fieldset-label font-semibold text-sm">
                  Property Type
                </label>
                <select
                  {...methods.register("propertyType")}
                  className="select select-bordered w-full"
                >
                  <option value="RESIDENTIAL">Residential</option>
                  <option value="COMMERCIAL">Commercial</option>
                  <option value="LAND">Land</option>
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="fieldset-label font-semibold text-sm">
                  Development Stage
                </label>
                <select
                  {...methods.register("developmentStage")}
                  className="select select-bordered w-full"
                >
                  <option value="PLANNING">Planning</option>
                  <option value="UNDER_CONSTRUCTION">Under Construction</option>
                  <option value="COMPLETED">Completed</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="fieldset-label font-semibold text-sm">
                Exit Rule
              </label>
              <select
                {...methods.register("exitRule")}
                className="select select-bordered w-full"
              >
                <option value="AFTER_PROJECT_COMPLETION">
                  After Project Completion
                </option>
                <option value="ANYTIME">Anytime</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="fieldset-label font-semibold text-sm">
                Description
              </label>
              <textarea
                {...methods.register("description")}
                className="textarea textarea-bordered w-full h-24"
                placeholder="Describe the co-development project..."
              />
            </div>

            <div className="space-y-2">
              <label className="fieldset-label font-semibold text-sm">
                Gallery Images
              </label>
              <UpdateImages
                images={images || []}
                setPrev={setPrev}
                setNew={setNew}
              />
            </div>

            <button
              type="submit"
              className={`btn btn-primary w-full ${mutation.isPending ? "loading" : ""}`}
              disabled={mutation.isPending}
            >
              {mutation.isPending
                ? "Creating..."
                : "Create Co-Development Property"}
            </button>
          </form>
        </FormProvider>
      </div>
    </ThemeProvider>
  );
}
