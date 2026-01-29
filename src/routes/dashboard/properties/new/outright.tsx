import { createFileRoute } from "@tanstack/react-router";
import { useForm, FormProvider } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import SimpleInput from "@/simpleComps/inputs/SimpleInput";
import LocalSelect from "@/simpleComps/inputs/LocalSelect";
import UpdateImages from "@/components/images/UpdateImages";
import { useImages } from "@/helpers/images";
import ThemeProvider from "@/simpleComps/ThemeProvider";

export const Route = createFileRoute("/dashboard/properties/new/outright")({
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
      const totalPrice =
        Number(data.basePrice) +
        data.additionalFees.reduce(
          (acc: number, fee: any) => acc + fee.amount,
          0,
        );

      console.log("Submitting Outright Sale data:", {
        ...data,
        galleryImages: images,
        totalPrice,
        installmentDuration: null,
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
        <h1 className="text-xl font-bold mb-6">Create Outright Property</h1>

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
              <LocalSelect
                label="Property Type"
                {...methods.register("propertyType")}
              >
                <option value="RESIDENTIAL">Residential</option>
                <option value="COMMERCIAL">Commercial</option>
                <option value="LAND">Land</option>
              </LocalSelect>
              <LocalSelect
                label="Development Stage"
                {...methods.register("developmentStage")}
              >
                <option value="OFF_PLAN">Off Plan</option>
                <option value="UNDER_CONSTRUCTION">Under Construction</option>
                <option value="COMPLETED">Completed</option>
              </LocalSelect>
              <LocalSelect
                label="Payment Option"
                {...methods.register("paymentOption")}
              >
                <option value="FULL_PAYMENT">Full Payment</option>
              </LocalSelect>
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
              {mutation.isPending ? "Creating..." : "Create Outright Property"}
            </button>
          </form>
        </FormProvider>
      </div>
    </ThemeProvider>
  );
}
