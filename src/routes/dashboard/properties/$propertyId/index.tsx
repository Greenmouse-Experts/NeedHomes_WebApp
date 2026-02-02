import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  ChevronLeft,
  MapPin,
  Calendar,
  Package,
  Home,
  Users,
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/api/simpleApi";

export const Route = createFileRoute("/dashboard/properties/$propertyId/")({
  component: PropertyDetailsPage,
});

const propertyData: Record<string, any> = {
  "LAG-CAT-001": {
    id: "LAG-CAT-001",
    propertyTitle: "Semi Detached Duplex",
    propertyType: "Semi-Detached",
    state: "Lagos",
    lga: "Lekki",
    cityTown: "Lekki Phase 1",
    developmentStage: "Completed",
    description:
      "A beautiful semi-detached duplex located in the heart of Lagos. This property features modern amenities, spacious rooms, and excellent finishing. Perfect for families looking for comfort and luxury.",
    deliveryDate: "2024-12-31",
    basePrice: "₦45,000,000",
    totalSellingPrice: "₦45,000,000",
    package: "Outright Purchase",
    status: "Published",
    availableUnits: 5,
    unitTypes: "4 Bedroom",
    paymentOptions: "Full Payment, Installment",
    installmentPlan: "6 Months, 12 Months",
    bedrooms: 4,
    bathrooms: 3,
    area: "350 sqm",
    dateAdded: "Jan 15, 2024",
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop",
    ],
    coverImage:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop",
    galleryImages: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop",
    ],
    videos: [],
    documents: [
      { name: "Certificate of Ownership", uploaded: true },
      { name: "Brochures", uploaded: true },
    ],
    additionalFees: [
      { title: "Legal Fee", price: "₦500,000" },
      { title: "Development Levy", price: "₦300,000" },
      { title: "Survey Fee", price: "₦200,000" },
      { title: "Agent Fee", price: "₦1,000,000" },
    ],
    features: [
      "Spacious Living Room",
      "Modern Kitchen",
      "En-suite Bedrooms",
      "Parking Space for 2 Cars",
      "Generator House",
      "Security System",
      "Balcony",
      "Fitted Wardrobes",
    ],
    amenities: [
      "24/7 Security",
      "Constant Water Supply",
      "Good Road Network",
      "Close to Schools",
      "Shopping Malls Nearby",
      "Recreational Facilities",
    ],
    ownershipTransferRules: "Transfer upon full payment completion",
    certificateTemplate: "Standard",
    discountOptions: "Early Bird - 5%",
    investors: [
      {
        name: "Emeka Okafor",
        email: "emeka@gmail.com",
        investment: "₦10,000,000",
        date: "Jan 20, 2024",
      },
      {
        name: "Aisha Bello",
        email: "belloaisha@yahoo.com",
        investment: "₦8,500,000",
        date: "Jan 22, 2024",
      },
    ],
  },
};

function PropertyDetailsPage() {
  const { propertyId } = Route.useParams();
  const navigate = useNavigate();

  const query = useQuery({
    queryKey: ["admnin-properties", propertyId],
    queryFn: async () => {
      let resp = await apiClient.get("/properties/" + propertyId);
      return resp.data;
    },
  });
  const property = propertyData[propertyId] || {
    id: propertyId,
    propertyTitle: "Semi Detached Duplex",
    propertyType: "Semi-Detached",
    state: "Lagos",
    lga: "Lekki",
    cityTown: "Lekki Phase 1",
    developmentStage: "Completed",
    description:
      "A beautiful property with modern amenities and excellent finishing.",
    deliveryDate: "2024-12-31",
    basePrice: "₦45,000,000",
    totalSellingPrice: "₦45,000,000",
    package: "Outright Purchase",
    status: "Published",
    availableUnits: 5,
    unitTypes: "4 Bedroom",
    paymentOptions: "Full Payment, Installment",
    installmentPlan: "6 Months, 12 Months",
    bedrooms: 4,
    bathrooms: 3,
    area: "350 sqm",
    dateAdded: "Jan 15, 2024",
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop",
    ],
    coverImage:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop",
    galleryImages: [],
    videos: [],
    documents: [],
    additionalFees: [],
    features: [
      "Spacious Living Room",
      "Modern Kitchen",
      "En-suite Bedrooms",
      "Parking Space",
    ],
    amenities: ["24/7 Security", "Constant Water Supply", "Good Road Network"],
    ownershipTransferRules: "Transfer upon full payment completion",
    certificateTemplate: "Standard",
    discountOptions: "",
    investors: [],
  };

  const location = `${property.cityTown}, ${property.lga}, ${property.state}`;

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate({ to: "/dashboard/properties/listed" })}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ChevronLeft className="w-5 h-5" />
        <span className="font-medium">Back to Listed Properties</span>
      </button>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="relative h-96 bg-gray-200">
          <img
            src={property.coverImage || property.images[0]}
            alt={property.propertyTitle}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src =
                'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="600"%3E%3Crect fill="%23ddd" width="800" height="600"/%3E%3C/svg%3E';
            }}
          />
          <div className="absolute top-4 right-4">
            <span
              className={`inline-flex px-4 py-2 rounded-full text-sm font-semibold ${
                property.status === "Published"
                  ? "bg-green-500 text-white"
                  : "bg-orange-500 text-white"
              }`}
            >
              {property.status}
            </span>
          </div>
        </div>

        <div className="p-4 md:p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                {property.propertyTitle}
              </h1>
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
                <span className="text-sm md:text-lg">{location}</span>
              </div>
            </div>
            <div className="sm:text-right">
              <p className="text-2xl md:text-3xl font-bold text-[var(--color-orange)]">
                {property.totalSellingPrice || property.basePrice}
              </p>
              <p className="text-xs md:text-sm text-gray-500 mt-1">
                SKU: {property.id}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
            <div className="flex items-center gap-2 md:gap-3 p-3 md:p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="p-2 bg-white rounded-lg flex-shrink-0">
                <Home className="w-4 h-4 md:w-5 md:h-5 text-[var(--color-orange)]" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-gray-500">Bedrooms</p>
                <p className="font-semibold text-sm md:text-base text-gray-900">
                  {property.bedrooms}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 md:gap-3 p-3 md:p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="p-2 bg-white rounded-lg flex-shrink-0">
                <Home className="w-4 h-4 md:w-5 md:h-5 text-[var(--color-orange)]" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-gray-500">Bathrooms</p>
                <p className="font-semibold text-sm md:text-base text-gray-900">
                  {property.bathrooms}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 md:gap-3 p-3 md:p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="p-2 bg-white rounded-lg flex-shrink-0">
                <Package className="w-4 h-4 md:w-5 md:h-5 text-[var(--color-orange)]" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-gray-500">Area</p>
                <p className="font-semibold text-sm md:text-base text-gray-900">
                  {property.area}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 md:gap-3 p-3 md:p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="p-2 bg-white rounded-lg flex-shrink-0">
                <Calendar className="w-4 h-4 md:w-5 md:h-5 text-[var(--color-orange)]" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-gray-500 whitespace-nowrap">
                  Delivery Date
                </p>
                <p className="font-semibold text-sm md:text-base text-gray-900 truncate">
                  {new Date(property.deliveryDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
            <div className="lg:col-span-2 space-y-4 md:space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  Description
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  {property.description}
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Basic Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2 py-2 border-b border-gray-200">
                      <span className="text-gray-600 text-sm">
                        Property Type:
                      </span>
                      <span className="font-medium text-gray-900 text-sm">
                        {property.propertyType}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2 py-2 border-b border-gray-200">
                      <span className="text-gray-600 text-sm">State:</span>
                      <span className="font-medium text-gray-900 text-sm">
                        {property.state}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2 py-2 border-b border-gray-200">
                      <span className="text-gray-600 text-sm">LGA:</span>
                      <span className="font-medium text-gray-900 text-sm">
                        {property.lga}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2 py-2 border-b border-gray-200">
                      <span className="text-gray-600 text-sm">City/Town:</span>
                      <span className="font-medium text-gray-900 text-sm">
                        {property.cityTown}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2 py-2">
                      <span className="text-gray-600 text-sm">
                        Development Stage:
                      </span>
                      <span className="font-medium text-gray-900 text-sm">
                        {property.developmentStage}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Pricing & Units
                  </h3>
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2 py-2 border-b border-gray-200">
                      <span className="text-gray-600 text-sm">Base Price:</span>
                      <span className="font-medium text-gray-900 text-sm">
                        {property.basePrice}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2 py-2 border-b border-gray-200">
                      <span className="text-gray-600 text-sm">Package:</span>
                      <span className="font-medium text-gray-900 text-sm">
                        {property.package}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2 py-2 border-b border-gray-200">
                      <span className="text-gray-600 text-sm">
                        Available Units:
                      </span>
                      <span className="font-medium text-gray-900 text-sm">
                        {property.availableUnits}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2 py-2 border-b border-gray-200">
                      <span className="text-gray-600 text-sm">Unit Types:</span>
                      <span className="font-medium text-gray-900 text-sm">
                        {property.unitTypes}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2 py-2">
                      <span className="text-gray-600 text-sm">
                        Payment Options:
                      </span>
                      <span className="font-medium text-gray-900 text-sm break-words">
                        {property.paymentOptions}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {property.additionalFees &&
                property.additionalFees.length > 0 && (
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">
                      Additional Fees
                    </h2>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="space-y-2">
                        {property.additionalFees.map(
                          (fee: any, index: number) => (
                            <div
                              key={index}
                              className="flex justify-between py-2"
                            >
                              <span className="text-gray-600">{fee.title}</span>
                              <span className="font-semibold text-gray-900">
                                {fee.price}
                              </span>
                            </div>
                          ),
                        )}
                        <div className="flex justify-between py-3 border-t-2 border-gray-300 mt-3">
                          <span className="font-semibold text-gray-900">
                            Total Fees:
                          </span>
                          <span className="font-bold text-lg text-[var(--color-orange)]">
                            ₦
                            {property.additionalFees
                              .reduce((sum: number, fee: any) => {
                                const price = fee.price.replace(/[₦,]/g, "");
                                return sum + parseFloat(price);
                              }, 0)
                              .toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

              <div>
                <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-3">
                  Features
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
                  {property.features.map((feature: string, index: number) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-[var(--color-orange)] rounded-full flex-shrink-0"></div>
                      <span className="text-sm md:text-base text-gray-700">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-3">
                  Amenities
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
                  {property.amenities.map((amenity: string, index: number) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-[var(--color-orange)] rounded-full flex-shrink-0"></div>
                      <span className="text-sm md:text-base text-gray-700">
                        {amenity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {property.galleryImages && property.galleryImages.length > 0 && (
                <div>
                  <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-3">
                    Gallery
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
                    {property.galleryImages.map(
                      (image: string, index: number) => (
                        <div
                          key={index}
                          className="aspect-video rounded-lg overflow-hidden bg-gray-200"
                        >
                          <img
                            src={image}
                            alt={`Gallery ${index + 1}`}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      ),
                    )}
                  </div>
                </div>
              )}

              {property.documents && property.documents.length > 0 && (
                <div>
                  <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-3">
                    Documents
                  </h2>
                  <div className="space-y-2">
                    {property.documents.map((doc: any, index: number) => (
                      <div
                        key={index}
                        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-3 bg-gray-50 rounded-lg"
                      >
                        <span className="text-sm md:text-base text-gray-700">
                          {doc.name}
                        </span>
                        <span
                          className={`text-xs md:text-sm font-medium ${
                            doc.uploaded ? "text-green-600" : "text-gray-400"
                          }`}
                        >
                          {doc.uploaded ? "Uploaded" : "Not Uploaded"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4 md:space-y-6">
              <div className="bg-gray-50 rounded-lg p-4 md:p-6 border border-gray-200">
                <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-4">
                  Property Information
                </h3>
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                    <span className="text-sm text-gray-600">Status:</span>
                    <span
                      className={`text-sm font-medium ${property.status === "Published" ? "text-green-600" : "text-orange-600"}`}
                    >
                      {property.status}
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                    <span className="text-sm text-gray-600">Date Added:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {property.dateAdded}
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                    <span className="text-sm text-gray-600">
                      Installment Plan:
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {property.installmentPlan}
                    </span>
                  </div>
                  {property.ownershipTransferRules && (
                    <div className="pt-3 border-t border-gray-200">
                      <span className="text-sm text-gray-600">
                        Transfer Rules:
                      </span>
                      <p className="text-sm font-medium text-gray-900 mt-1">
                        {property.ownershipTransferRules}
                      </p>
                    </div>
                  )}
                  {property.certificateTemplate && (
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                      <span className="text-sm text-gray-600">
                        Certificate:
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        {property.certificateTemplate}
                      </span>
                    </div>
                  )}
                  {property.discountOptions && (
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                      <span className="text-sm text-gray-600">Discount:</span>
                      <span className="text-sm font-medium text-green-600">
                        {property.discountOptions}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {property.investors && property.investors.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-4 md:p-6 border border-gray-200">
                  <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Users className="w-4 h-4 md:w-5 md:h-5" />
                    Investors ({property.investors.length})
                  </h3>
                  <div className="space-y-3">
                    {property.investors.map((investor: any, index: number) => (
                      <div
                        key={index}
                        className="pb-3 border-b border-gray-200 last:border-0 last:pb-0"
                      >
                        <p className="text-sm md:text-base font-medium text-gray-900">
                          {investor.name}
                        </p>
                        <p className="text-xs md:text-sm text-gray-600">
                          {investor.email}
                        </p>
                        <div className="flex justify-between mt-2">
                          <span className="text-xs md:text-sm text-gray-500">
                            Investment:
                          </span>
                          <span className="text-xs md:text-sm font-semibold text-[var(--color-orange)]">
                            {investor.investment}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {investor.date}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <Button
                  variant="primary"
                  className="w-full text-sm md:text-base"
                  onClick={() =>
                    navigate({ to: "/dashboard/properties/listed" })
                  }
                >
                  Edit Property
                </Button>
                <Button
                  variant="outline"
                  className="w-full text-sm md:text-base"
                  onClick={() => {
                    if (
                      confirm("Are you sure you want to suspend this property?")
                    ) {
                      console.log("Suspend property:", propertyId);
                    }
                  }}
                >
                  Suspend Property
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
