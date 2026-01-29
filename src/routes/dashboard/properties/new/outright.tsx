import { createFileRoute } from "@tanstack/react-router";
import { useForm, FormProvider } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import SimpleInput from "@/simpleComps/inputs/SimpleInput";
import LocalSelect from "@/simpleComps/inputs/LocalSelect";
import UpdateImages from "@/components/images/UpdateImages";
import { useImages } from "@/helpers/images";
import ThemeProvider from "@/simpleComps/ThemeProvider";
import { uploadImage } from "@/api/imageApi"; // Import uploadImage
import { useNavigate } from "@tanstack/react-router"; // Import useNavigate
import apiClient from "@/api/simpleApi"; // Import apiClient
import { toast } from "sonner";
import { extract_message } from "@/helpers/apihelpers";

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
      coverImage: "", // Initialize coverImage
    },
  });

  const { images, setPrev, newImages, setNew } = useImages([]); // Add newImages
  const nav = useNavigate(); // Initialize useNavigate

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
        galleryImages: allImages, // Use allImages
        totalPrice,
        installmentDuration: null,
      };

      console.log("Submitting Outright Sale data:", payload);
      // Make the actual API call
      const response = await apiClient.post(
        "/admin/properties/outright",
        payload,
      );
      return response.data;
    },
    onSuccess: () => {
      nav({
        to: "/partners/properties", // Navigate on success
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
        <h1 className="text-xl font-bold mb-6">Create Outright Property</h1>

        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SimpleInput
                label="Property Title"
                placeholder="Sunnyvale Villa"
                required
                {...methods.register("propertyTitle")}
              />
              <SimpleInput
                label="Location"
                placeholder="Lekki, Lagos"
                required
                {...methods.register("location")}
              />
              <SimpleInput
                label="Base Price"
                type="number"
                required
                {...methods.register("basePrice")}
              />
              <SimpleInput
                label="Available Units"
                type="number"
                required
                {...methods.register("availableUnits")}
              />
              <SimpleInput
                label="Completion Date"
                type="date"
                required
                {...methods.register("completionDate")}
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
              {mutation.isPending ? "Creating..." : "Create Outright Property"}
            </button>
          </form>
        </FormProvider>
      </div>
    </ThemeProvider>
  );
}
