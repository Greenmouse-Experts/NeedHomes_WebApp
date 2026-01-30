import { createFileRoute } from "@tanstack/react-router";
import { useForm, FormProvider } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import SimpleInput from "@/simpleComps/inputs/SimpleInput";
import LocalSelect from "@/simpleComps/inputs/LocalSelect";
import UpdateImages from "@/components/images/UpdateImages";
import { useImages } from "@/helpers/images";
import ThemeProvider from "@/simpleComps/ThemeProvider";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { extract_message } from "@/helpers/apihelpers";

export const Route = createFileRoute("/dashboard/properties/new/land-banking")({
  component: RouteComponent,
});

function RouteComponent() {
  const methods = useForm({
    defaultValues: {
      propertyTitle: "Green Acres",
      propertyType: "LAND",
      location: "Ibeju-Lekki, Lagos",
      description: "Land plots for long-term appreciation",
      developmentStage: "PLANNING",
      completionDate: "2030-01-01",
      basePrice: 300000000,
      availableUnits: 100,
      plotSize: 500.5,
      pricePerPlot: 3000000,
      holdingPeriod: 60,
      buyBackOption: true,
      additionalFees: [{ label: "Survey Fee", amount: 1000000 }],
    },
  });

  const { images, setPrev, setNew } = useImages([]);
  const nav = useNavigate();
  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const totalPrice =
        Number(data.basePrice) +
        data.additionalFees.reduce(
          (acc: number, fee: any) => acc + fee.amount,
          0,
        );

      console.log("Submitting Land Banking data:", {
        ...data,
        galleryImages: images,
        totalPrice,
      });
      return data;
    },
    onSuccess: () => {
      nav({
        to: "/partners/properties",
      });
    },
  });

  const onSubmit = (data: any) => {
    toast.promise(mutation.mutateAsync(data), {
      loading: "Submitting...",
      success: extract_message,
      error: (err) => {
        console.log(err);
        return extract_message(err) || "An error occurred.";
      },
    });
  };

  return (
    <ThemeProvider>
      <div className="p-6 bg-base-100 rounded-xl ring fade mx-auto">
        <h1 className="text-xl font-bold mb-6">Create Land Banking Property</h1>

        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SimpleInput
                label="Property Title"
                name="propertyTitle"
                placeholder="Green Acres"
                required
              />
              <SimpleInput
                label="Location"
                name="location"
                placeholder="Ibeju-Lekki, Lagos"
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
                label="Plot Size (sqm)"
                name="plotSize"
                type="number"
                step="0.01"
                required
              />
              <SimpleInput
                label="Price Per Plot"
                name="pricePerPlot"
                type="number"
                required
              />
              <SimpleInput
                label="Holding Period (Months)"
                name="holdingPeriod"
                type="number"
                required
              />
              <SimpleInput
                label="Maturity/Completion Date"
                name="completionDate"
                type="date"
                required
              />
              <LocalSelect
                label="Property Type"
                {...methods.register("propertyType")}
              >
                <option value="LAND">Land</option>
                <option value="RESIDENTIAL">Residential</option>
                <option value="COMMERCIAL">Commercial</option>
              </LocalSelect>
              <LocalSelect
                label="Development Stage"
                {...methods.register("developmentStage")}
              >
                <option value="PLANNING">Planning</option>
                <option value="OFF_PLAN">Off Plan</option>
                <option value="UNDER_CONSTRUCTION">Under Construction</option>
                <option value="COMPLETED">Completed</option>
              </LocalSelect>
            </div>

            <div className="space-y-2">
              <label className="fieldset-label font-semibold text-sm">
                Description
              </label>
              <textarea
                {...methods.register("description")}
                className="textarea textarea-bordered w-full h-24"
                placeholder="Describe the land banking opportunity..."
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
                {...methods.register("buyBackOption")}
                className="checkbox checkbox-primary"
              />
              <span className="text-sm font-medium">
                Include Buy-Back Option
              </span>
            </div>

            <button
              type="submit"
              className={`btn btn-primary w-full ${mutation.isPending ? "loading" : ""}`}
              disabled={mutation.isPending}
            >
              {mutation.isPending
                ? "Creating..."
                : "Create Land Banking Property"}
            </button>
          </form>
        </FormProvider>
      </div>
    </ThemeProvider>
  );
}
