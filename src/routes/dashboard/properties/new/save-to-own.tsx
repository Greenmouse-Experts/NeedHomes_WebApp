import { createFileRoute } from "@tanstack/react-router";
import { useForm, FormProvider } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import SimpleInput from "@/simpleComps/inputs/SimpleInput";
import LocalSelect from "@/simpleComps/inputs/LocalSelect";
import UpdateImages from "@/components/images/UpdateImages";
import { useImages } from "@/helpers/images";
import ThemeProvider from "@/simpleComps/ThemeProvider";
import { uploadImage } from "@/api/imageApi";
import { toast } from "sonner";
import { extract_message } from "@/helpers/apihelpers";
import apiClient from "@/api/simpleApi";

export const Route = createFileRoute("/dashboard/properties/new/save-to-own")({
  component: RouteComponent,
});

function RouteComponent() {
  const methods = useForm({
    defaultValues: {
      propertyTitle: "Starter Home Plan",
      propertyType: "RESIDENTIAL",
      location: "Ikeja, Lagos",
      description: "Save-to-own program for first-time buyers",
      developmentStage: "PLANNING",
      completionDate: "2029-06-01",
      basePrice: 150000000,
      availableUnits: 20,
      savingsFrequency: "MONTHLY",
      savingsDuration: 36,
      additionalFees: [],
      coverImage: "", // Initialize coverImage
    },
  });

  const { images, setPrev, newImages, setNew } = useImages([]);

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const uploadedImageUrls: string[] = [];
      let coverImageUrl: string | undefined;

      if (newImages && newImages.length > 0) {
        for (const [index, newImage] of newImages.entries()) {
          const uploaded = await uploadImage(newImage);
          if (uploaded.data && uploaded.data.url) {
            if (index === 0) {
              // Assuming the first new image is the cover image if none is explicitly set
              coverImageUrl = uploaded.data.url;
            }
            uploadedImageUrls.push(uploaded.data.url);
          }
        }
      }

      // If there are existing images and no new cover image, use the first existing one
      if (!coverImageUrl && images && images.length > 0) {
        coverImageUrl = images[0].url;
      }

      // If no cover image is found at this point, it's required
      if (!coverImageUrl) {
        throw new Error("Cover image is required.");
      }

      const allImages = [
        ...(images || []).map((img) => img.url),
        ...uploadedImageUrls,
      ];

      const totalPrice =
        Number(data.basePrice) +
        data.additionalFees.reduce(
          (acc: number, fee: any) => acc + fee.amount,
          0,
        );

      const payload = {
        ...data,
        coverImage: coverImageUrl, // Set the cover image
        galleryImages: allImages,
        totalPrice,
        targetPropertyPrice: totalPrice,
        completionDate: new Date(data.completionDate).toISOString(),
      };

      console.log("Submitting Save-to-Own data:", payload);
      const response = await apiClient.post(
        "/admin/properties/save-to-own",
        payload,
      );
      return response.data;
    },
  });

  const onSubmit = (data: any) => {
    toast.promise(mutation.mutateAsync(data), {
      loading: "Submitting...",
      success: extract_message,
      error: (err) => extract_message(err) || "An error occurred.",
    });
  };

  return (
    <ThemeProvider>
      <div className="p-6 bg-base-100 rounded-xl ring fade mx-auto">
        <h1 className="text-xl font-bold mb-6">Create Save-to-Own Property</h1>

        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SimpleInput
                label="Property Title"
                name="propertyTitle"
                placeholder="Starter Home Plan"
                required
              />
              <SimpleInput
                label="Location"
                name="location"
                placeholder="Ikeja, Lagos"
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
              <SimpleInput
                label="Savings Duration (Months)"
                name="savingsDuration"
                type="number"
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
                <option value="PLANNING">Planning</option>
                <option value="OFF_PLAN">Off Plan</option>
                <option value="UNDER_CONSTRUCTION">Under Construction</option>
                <option value="COMPLETED">Completed</option>
              </LocalSelect>
              <LocalSelect
                label="Savings Frequency"
                {...methods.register("savingsFrequency")}
              >
                <option value="DAILY">Daily</option>
                <option value="WEEKLY">Weekly</option>
                <option value="MONTHLY">Monthly</option>
              </LocalSelect>
            </div>

            <div className="space-y-2">
              <label className="fieldset-label font-semibold text-sm">
                Description
              </label>
              <textarea
                {...methods.register("description")}
                className="textarea textarea-bordered w-full h-24"
                placeholder="Describe the save-to-own program..."
              />
            </div>

            <div className="space-y-2">
              <label className="fieldset-label font-semibold text-sm">
                Gallery Images (First image will be used as cover image)
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
                : "Create Save-to-Own Property"}
            </button>
          </form>
        </FormProvider>
      </div>
    </ThemeProvider>
  );
}
