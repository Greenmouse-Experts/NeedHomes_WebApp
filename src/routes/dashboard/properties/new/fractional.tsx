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

export const Route = createFileRoute("/dashboard/properties/new/fractional")({
  component: RouteComponent,
});

function RouteComponent() {
  const methods = useForm({
    defaultValues: {
      propertyTitle: "",
      propertyType: "RESIDENTIAL",
      location: "Yaba, Lagos",
      description: "Fractional shares in co-living units",
      developmentStage: "ONGOING",
      completionDate: "2027-09-01", // Changed to YYYY-MM-DD for date input
      coverImage: "https://example.com/images/cover3.jpg",
      galleryImages: [],
      basePrice: 200000000,
      additionalFees: [],
      availableUnits: 50,
      totalPrice: 200000000,
      totalShares: 10000,
      pricePerShare: 20000,
      minimumShares: 10,
      exitWindow: "MONTHLY",
      premiumProperty: false, // Added premiumProperty as it was missing from defaultValues
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

      const totalPrice = data.totalPrice;

      const payload = {
        ...data,
        coverImage: coverImageUrl, // Set the cover image
        galleryImages: allImages,
        totalPrice,
        completionDate: new Date(data.completionDate).toISOString(),
      };

      // Remove paymentOption as it should not exist for fractional properties
      delete payload.paymentOption;
      // availableUnits should be passed, not removed.
      // delete payload.availableUnits;

      // Ensure totalShares, pricePerShare, and minimumShares are integers
      payload.totalShares = parseInt(payload.totalShares, 10);
      payload.pricePerShare = parseInt(payload.pricePerShare, 10);
      payload.minimumShares = parseInt(payload.minimumShares, 10);
      payload.basePrice = parseInt(payload.basePrice, 10); // Ensure basePrice is an integer
      payload.availableUnits = parseInt(payload.availableUnits, 10); // Ensure availableUnits is an integer

      // console.log("Submitting Fractional data:", payload);
      const response = await apiClient.post(
        "/admin/properties/fractional",
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
        <h1 className="text-xl font-bold mb-6">Create Fractional Property</h1>

        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SimpleInput
                label="Property Title"
                {...methods.register("propertyTitle")}
                placeholder="Sunnyvale Villa"
                required
              />
              <SimpleInput
                label="Location"
                {...methods.register("location")}
                placeholder="Lekki, Lagos"
                required
              />
              <SimpleInput
                label="Available Units"
                {...methods.register("availableUnits", { valueAsNumber: true })}
                type="number"
                required
              />
              <SimpleInput
                label="Base Price"
                {...methods.register("basePrice", { valueAsNumber: true })}
                type="number"
                required
              />
              <SimpleInput
                label="Total Shares"
                {...methods.register("totalShares", { valueAsNumber: true })}
                type="number"
                required
              />
              <SimpleInput
                label="Price Per Share"
                {...methods.register("pricePerShare", { valueAsNumber: true })}
                type="number"
                required
              />
              <SimpleInput
                label="Minimum Shares"
                {...methods.register("minimumShares", { valueAsNumber: true })}
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
                <option value="ONGOING">Ongoing</option>
              </LocalSelect>
              <LocalSelect
                label="Exit Window"
                {...methods.register("exitWindow")}
              >
                <option value="MONTHLY">Monthly</option>
                <option value="QUARTERLY">Quarterly</option>
                <option value="ANNUALLY">Annually</option>
                <option value="FLEXIBLE">Flexible</option>
              </LocalSelect>
            </div>

            <SimpleTextArea
              label="Description"
              {...methods.register("description")}
              placeholder="Describe the property..."
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
