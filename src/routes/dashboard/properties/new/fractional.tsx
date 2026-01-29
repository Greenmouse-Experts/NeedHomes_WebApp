import { createFileRoute } from "@tanstack/react-router";
import { useForm, FormProvider } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import SimpleInput from "@/simpleComps/inputs/SimpleInput";
import UpdateImages from "@/components/images/UpdateImages";
import { useImages } from "@/helpers/images";
import ThemeProvider from "@/simpleComps/ThemeProvider";

export const Route = createFileRoute("/dashboard/properties/new/fractional")({
  component: RouteComponent,
});

function RouteComponent() {
  const methods = useForm({
    defaultValues: {
      propertyTitle: "",
      propertyType: "RESIDENTIAL",
      location: "",
      description: "",
      developmentStage: "COMPLETED",
      completionDate: "",
      premiumProperty: false,
      basePrice: 0,
      availableUnits: 1,
      paymentOption: "FULL_PAYMENT",
      additionalFees: [{ label: "Legal Fee", amount: 5000000 }],
    },
  });

  const { images, setPrev, setNew } = useImages([]);

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      // Logic to handle image uploads and API call would go here
      console.log("Submitting data:", { ...data, galleryImages: images });
      return data;
    },
  });

  const onSubmit = (data: any) => {
    mutation.mutate(data);
  };

  return (
    <ThemeProvider>
      <div className="p-6 bg-base-100 rounded-xl ring  fade  mx-auto">
        <h1 className="text-2xl font-bold mb-6">Create Fractional Property</h1>

        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SimpleInput
                label="Property Title"
                name="propertyTitle"
                placeholder="Sunnyvale Villa"
                required
              />
              <SimpleInput
                label="Location"
                name="location"
                placeholder="Lekki, Lagos"
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
            </div>

            <div className="space-y-2">
              <label className="fieldset-label font-semibold text-sm">
                Description
              </label>
              <textarea
                {...methods.register("description")}
                className="textarea textarea-bordered w-full h-24"
                placeholder="Describe the property..."
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

            <div className="flex items-center gap-4 p-4 border rounded-lg">
              <input
                type="checkbox"
                {...methods.register("premiumProperty")}
                className="checkbox checkbox-primary"
              />
              <span className="text-sm font-medium">
                Mark as Premium Property
              </span>
            </div>

            <button
              type="submit"
              className={`btn btn-primary w-full ${mutation.isPending ? "loading" : ""}`}
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "Creating..." : "Create Property"}
            </button>
          </form>
        </FormProvider>
      </div>
    </ThemeProvider>
  );
}
