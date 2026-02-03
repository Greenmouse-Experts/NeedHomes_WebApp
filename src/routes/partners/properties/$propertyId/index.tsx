import { createFileRoute } from "@tanstack/react-router";
import { Calendar, Home, MapPin, Package } from "lucide-react";
import { MediaSlider } from "@/components/property/MediaSlider";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/api/simpleApi";

export const Route = createFileRoute("/partners/properties/$propertyId/")({
  component: PropertyDetailPage,
});

const propertyData: Record<string, any> = {
  "LAG-CAT-001": {
    id: "LAG-CAT-001",
    propertyTitle: "Semi Detached Duplex",
    propertyType: "RESIDENTIAL",
    location: "Lekki Phase 1, Lekki, Lagos",
    description:
      "A beautiful semi-detached duplex located in the heart of Lagos. This property features modern amenities, spacious rooms, and excellent finishing. Perfect for families looking for comfort and luxury.",
    developmentStage: "COMPLETED",
    completionDate: "2024-12-31",
    basePrice: 45000000,
    package: "OUTRIGHT",
    availableUnits: 5,
    bedrooms: 4,
    bathrooms: 3,
    area: "350 sqm",
    coverImage:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop",
    galleryImages: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop",
    ],
    videos: [],
    additionalFees: [
      { label: "Legal Fee", amount: 500000 },
      { label: "Development Levy", amount: 300000 },
      { label: "Survey Fee", amount: 200000 },
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
    paymentOption: "FULL_PAYMENT",
    premiumProperty: true,
    partnerCommission: 5, // 5% commission
  },
  "LAG-CAT-002": {
    id: "LAG-CAT-002",
    propertyTitle: "Co-Living Fractional Shares",
    propertyType: "RESIDENTIAL",
    location: "Yaba, Lagos",
    description:
      "Fractional ownership opportunity in premium co-living units. Great partnership opportunity with flexible exit windows.",
    developmentStage: "ONGOING",
    completionDate: "2027-09-01",
    basePrice: 200000000,
    package: "FRACTIONAL",
    availableUnits: 50,
    totalShares: 10000,
    pricePerShare: 20000,
    minimumShares: 10,
    exitWindow: "MONTHLY",
    bedrooms: 2,
    bathrooms: 2,
    area: "120 sqm",
    coverImage:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop",
    galleryImages: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop",
    ],
    videos: [],
    features: ["Modern Kitchen", "En-suite Bedrooms", "Parking Space"],
    amenities: ["24/7 Security", "Constant Water Supply", "Good Road Network"],
    premiumProperty: false,
    partnerCommission: 3, // 3% commission
  },
};

function PropertyDetailPage() {
  const { propertyId } = Route.useParams();
  const property = propertyData[propertyId] || propertyData["LAG-CAT-001"];
  const query = useQuery({
    queryKey: ["property", propertyId],
    queryFn: async () => {
      let resp = await apiClient.get("properties/" + propertyId);
      return resp.data;
    },
  });
  const formatCurrency = (amount: number) => {
    return `₦${amount.toLocaleString()}`;
  };

  const totalPrice = property.additionalFees
    ? property.basePrice +
      property.additionalFees.reduce(
        (sum: number, fee: any) => sum + fee.amount,
        0,
      )
    : property.basePrice;

  const potentialCommission = totalPrice * (property.partnerCommission / 100);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Media Slider */}
        <MediaSlider
          images={property.galleryImages || []}
          videos={property.videos || []}
          coverImage={property.coverImage}
        />

        <div className="p-4 md:p-6 lg:p-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  {property.propertyTitle}
                </h1>
                {/* {property.premiumProperty && (
                  <span className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white text-xs font-semibold rounded-full">
                    PREMIUM
                  </span>
                )} */}
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
                <span className="text-sm md:text-lg">{property.location}</span>
              </div>
            </div>
            <div className="sm:text-right">
              <p className="text-2xl md:text-3xl font-bold text-[var(--color-orange)]">
                {formatCurrency(totalPrice)}
              </p>
              <p className="text-xs md:text-sm text-gray-500 mt-1">
                SKU: {property.id}
              </p>
            </div>
          </div>

          {/* Partner Commission Banner */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Your Commission</p>
                <p className="text-2xl font-bold text-green-600">
                  {property.partnerCommission}%
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Potential Earnings</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(potentialCommission)}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
            {property.bedrooms && (
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
            )}
            {property.bathrooms && (
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
            )}
            {property.area && (
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
            )}
            <div className="flex items-center gap-2 md:gap-3 p-3 md:p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="p-2 bg-white rounded-lg flex-shrink-0">
                <Calendar className="w-4 h-4 md:w-5 md:h-5 text-[var(--color-orange)]" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-gray-500 whitespace-nowrap">
                  Completion
                </p>
                <p className="font-semibold text-sm md:text-base text-gray-900 truncate">
                  {new Date(property.completionDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
            <div className="lg:col-span-2 space-y-4 md:space-y-6">
              {/* Description */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  Description
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  {property.description}
                </p>
              </div>

              {/* Package-Specific Information */}
              {property.package === "FRACTIONAL" && (
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Fractional Ownership Details
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Total Shares</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {property.totalShares?.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Price Per Share</p>
                      <p className="text-lg font-semibold text-[var(--color-orange)]">
                        {formatCurrency(property.pricePerShare)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Minimum Shares</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {property.minimumShares}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Exit Window</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {property.exitWindow}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Additional Fees (Outright Purchase) */}
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
                              <span className="text-gray-600">{fee.label}</span>
                              <span className="font-semibold text-gray-900">
                                {formatCurrency(fee.amount)}
                              </span>
                            </div>
                          ),
                        )}
                        <div className="flex justify-between py-3 border-t-2 border-gray-300 mt-3">
                          <span className="font-semibold text-gray-900">
                            Total Additional Fees:
                          </span>
                          <span className="font-bold text-lg text-[var(--color-orange)]">
                            {formatCurrency(
                              property.additionalFees.reduce(
                                (sum: number, fee: any) => sum + fee.amount,
                                0,
                              ),
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

              {/* Features */}
              {property.features && property.features.length > 0 && (
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
              )}

              {/* Amenities */}
              {property.amenities && property.amenities.length > 0 && (
                <div>
                  <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-3">
                    Amenities
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
                    {property.amenities.map(
                      (amenity: string, index: number) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-[var(--color-orange)] rounded-full flex-shrink-0"></div>
                          <span className="text-sm md:text-base text-gray-700">
                            {amenity}
                          </span>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-4 md:space-y-6">
              <div className="bg-gray-50 rounded-lg p-4 md:p-6 border border-gray-200">
                <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-4">
                  Property Information
                </h3>
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                    <span className="text-sm text-gray-600">
                      Property Type:
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {property.propertyType}
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                    <span className="text-sm text-gray-600">Package:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {property.package}
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                    <span className="text-sm text-gray-600">
                      Development Stage:
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {property.developmentStage}
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                    <span className="text-sm text-gray-600">
                      Available Units:
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {property.availableUnits}
                    </span>
                  </div>
                  {property.paymentOption && (
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                      <span className="text-sm text-gray-600">
                        Payment Option:
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        {property.paymentOption.replace("_", " ")}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
