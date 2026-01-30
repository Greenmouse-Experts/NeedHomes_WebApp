import { createFileRoute } from "@tanstack/react-router";
import { useForm, FormProvider } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import SimpleInput from "@/simpleComps/inputs/SimpleInput";
import SimpleTextArea from "@/simpleComps/inputs/SimpleTextArea"; // Import SimpleTextArea
import UpdateImages from "@/components/images/UpdateImages";
import { useImages } from "@/helpers/images";
import ThemeProvider from "@/simpleComps/ThemeProvider";
import { uploadImage } from "@/api/imageApi"; // Import uploadImage
import { toast } from "sonner"; // Import toast
import { extract_message } from "@/helpers/apihelpers"; // Import extract_message
import apiClient from "@/api/simpleApi"; // Import apiClient
import LocalSelect from "@/simpleComps/inputs/LocalSelect"; // Import LocalSelect

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
      coverImage: "", // Initialize coverImage
    },
  });

  const { images, setPrev, newImages, setNew } = useImages([]); // Add newImages to destructuring

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
        completionDate: new Date(data.completionDate).toISOString(),
      };

      // console.log("Submitting Co-Development data:", payload);
      const response = await apiClient.post(
        "/admin/properties/codevelopment",
        payload,
      );
      return response.data;
    },
  });

  const onSubmit = (data: any) => {
    // return console.log(data);
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
        <h1 className="text-xl font-bold mb-6">
          Create Co-Development Property
        </h1>

        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SimpleInput
                label="Property Title"
                {...methods.register("propertyTitle")}
                placeholder="Riverside Estate"
                required
              />
              <SimpleInput
                label="Location"
                {...methods.register("location")}
                placeholder="Banana Island, Lagos"
                required
              />
              <SimpleInput
                label="Base Price"
                {...methods.register("basePrice", { valueAsNumber: true })}
                type="number"
                required
              />
              <SimpleInput
                label="Available Units"
                {...methods.register("availableUnits", { valueAsNumber: true })}
                type="number"
                required
              />
              <SimpleInput
                label="Minimum Investment"
                {...methods.register("minimumInvestment", {
                  valueAsNumber: true,
                })}
                type="number"
                required
              />
              <SimpleInput
                label="Profit Sharing Ratio (e.g. 0.25)"
                {...methods.register("profitSharingRatio", {
                  valueAsNumber: true,
                })}
                type="number"
                step="0.01"
                required
              />
              <SimpleInput
                label="Project Duration (Months)"
                {...methods.register("projectDuration", {
                  valueAsNumber: true,
                })}
                type="number"
                required
              />
              <SimpleInput
                label="Completion Date"
                {...methods.register("completionDate")}
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
                <option value="PLANNING">Planning</option>
                <option value="UNDER_CONSTRUCTION">Under Construction</option>
                <option value="COMPLETED">Completed</option>
              </LocalSelect>
            </div>

            <LocalSelect label="Exit Rule" {...methods.register("exitRule")}>
              <option value="AFTER_PROJECT_COMPLETION">
                After Project Completion
              </option>
              <option value="ANYTIME">Anytime</option>
            </LocalSelect>

            <SimpleTextArea
              label="Description"
              {...methods.register("description")}
              placeholder="Describe the co-development project..."
            />

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
                : "Create Co-Development Property"}
            </button>
          </form>
        </FormProvider>
      </div>
    </ThemeProvider>
  );
}
