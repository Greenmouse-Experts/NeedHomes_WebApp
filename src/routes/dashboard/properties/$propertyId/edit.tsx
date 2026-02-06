import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { ChevronLeft, Upload, Calendar, Plus, X } from "lucide-react";

export const Route = createFileRoute("/dashboard/properties/$propertyId/edit")({
  component: EditPropertyPage,
});

type Tab = "basic" | "media" | "pricing" | "specific";

// Mock property data - in real app, this would come from API
const mockPropertyData: Record<string, any> = {
  "LAG-CAT-001": {
    propertyTitle: "Semi Detached Duplex",
    propertyType: "semi-detached",
    state: "lagos",
    lga: "lekki",
    cityTown: "ajah",
    developmentStage: "completed",
    description:
      "Beautiful semi-detached duplex in a prime location with modern amenities.",
    deliveryDate: "2024-12-31",
    basePrice: "45000000",
    packageType: "outright-purchase",
  },
};

function EditPropertyPage() {
  const { propertyId } = Route.useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("basic");

  // Load existing property data
  const existingData = mockPropertyData[propertyId] || {};
  const [packageType, setPackageType] = useState(
    existingData.packageType || "outright-purchase",
  );

  // Form state - initialized with existing data
  const [formData, setFormData] = useState({
    propertyTitle: existingData.propertyTitle || "",
    propertyType: existingData.propertyType || "",
    state: existingData.state || "",
    lga: existingData.lga || "",
    cityTown: existingData.cityTown || "",
    developmentStage: existingData.developmentStage || "",
    description: existingData.description || "",
    deliveryDate: existingData.deliveryDate || "",
    basePrice: existingData.basePrice || "",
  });

  const [additionalFees, setAdditionalFees] = useState([
    { title: "Legal Fee", price: "27,000,000" },
    { title: "Development levy", price: "27,000,000" },
    { title: "Survey fee", price: "27,000,000" },
    { title: "Agent Fee", price: "27,000,000" },
    { title: "Reservation Fee", price: "27,000,000" },
  ]);

  const [showAddFeeModal, setShowAddFeeModal] = useState(false);
  const [newFee, setNewFee] = useState({ title: "", price: "" });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddFee = () => {
    if (newFee.title && newFee.price) {
      setAdditionalFees((prev) => [...prev, newFee]);
      setNewFee({ title: "", price: "" });
      setShowAddFeeModal(false);
    }
  };

  const handleRemoveFee = (index: number) => {
    setAdditionalFees((prev) => prev.filter((_, i) => i !== index));
  };

  const tabs = [
    { id: "basic" as Tab, label: "Basic Property Information" },
    { id: "media" as Tab, label: "Media Uploads" },
    { id: "pricing" as Tab, label: "Pricing & Access" },
    { id: "specific" as Tab, label: "Specific Fields" },
  ];

  const handleNext = () => {
    const currentIndex = tabs.findIndex((t) => t.id === activeTab);
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1].id);
    }
  };

  const handleBack = () => {
    navigate({ to: "/dashboard/properties/listed" });
  };

  const handleSave = () => {
    console.log("Saving property:", {
      propertyId,
      formData,
      packageType,
      additionalFees,
    });
    // In real app, this would call an API to update the property
    alert("Property updated successfully!");
    navigate({ to: "/dashboard/properties/listed" });
  };

  return (
    <div>
      <div className="bg-white rounded-lg shadow-sm p-6">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="font-medium">Edit Property - {propertyId}</span>
          </button>

          <select
            value={packageType}
            onChange={(e) => setPackageType(e.target.value)}
            className="px-4 py-2 bg-[var(--color-orange)] text-white rounded-lg font-medium text-sm"
          >
            <option value="outright-purchase">Outright Purchase</option>
            <option value="co-development">Co-Development</option>
            <option value="fractional-ownership">Fractional Ownership</option>
            <option value="land-banking">Land Banking</option>
            <option value="save-to-own">Save to Own</option>
          </select>
        </div>

        {/* Package Title */}
        <h2 className="text-xl font-semibold mb-6">
          {packageType === "outright-purchase" && "Outright Purchase"}
          {packageType === "co-development" && "Co-Development"}
          {packageType === "fractional-ownership" && "Fractional Ownership"}
          {packageType === "land-banking" && "Land Banking"}
          {packageType === "save-to-own" && "Save to Own"}
        </h2>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <div className="flex gap-2 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-3 px-4 whitespace-nowrap font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? "border-b-2 border-[var(--color-orange)] text-[var(--color-orange)] bg-[var(--color-orange)]/10 rounded-t-lg"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Basic Property Information Tab */}
        {activeTab === "basic" && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Property Title */}
              <div className="space-y-2">
                <Label htmlFor="propertyTitle">Property Title</Label>
                <Input
                  id="propertyTitle"
                  type="text"
                  placeholder="Enter name of the property"
                  value={formData.propertyTitle}
                  onChange={(e) =>
                    handleInputChange("propertyTitle", e.target.value)
                  }
                />
              </div>

              {/* Property Type */}
              <div className="space-y-2">
                <Label htmlFor="propertyType">Property Type</Label>
                <select
                  id="propertyType"
                  value={formData.propertyType}
                  onChange={(e) =>
                    handleInputChange("propertyType", e.target.value)
                  }
                  className="flex w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[var(--color-orange)] focus:border-[var(--color-orange)] transition-all duration-300"
                >
                  <option value="">select</option>
                  <option value="detached">Detached</option>
                  <option value="semi-detached">Semi-Detached</option>
                  <option value="terrace">Terrace</option>
                  <option value="apartment">Apartment</option>
                </select>
              </div>

              {/* State */}
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <select
                  id="state"
                  value={formData.state}
                  onChange={(e) => handleInputChange("state", e.target.value)}
                  className="flex w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[var(--color-orange)] focus:border-[var(--color-orange)] transition-all duration-300"
                >
                  <option value="">Enter your State</option>
                  <option value="lagos">Lagos</option>
                  <option value="ogun">Ogun</option>
                  <option value="abuja">Abuja</option>
                </select>
              </div>

              {/* LGA */}
              {/* <div className="space-y-2">
                <Label htmlFor="lga">LGA</Label>
                <select
                  id="lga"
                  value={formData.lga}
                  onChange={(e) => handleInputChange('lga', e.target.value)}
                  className="flex w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[var(--color-orange)] focus:border-[var(--color-orange)] transition-all duration-300"
                >
                  <option value="">Enter your LGA</option>
                  <option value="ikeja">Ikeja</option>
                  <option value="lekki">Lekki</option>
                  <option value="ikorodu">Ikorodu</option>
                </select>
              </div> */}

              {/* City/Town */}
              <div className="space-y-2">
                <Label htmlFor="cityTown">City/Town</Label>
                <select
                  id="cityTown"
                  value={formData.cityTown}
                  onChange={(e) =>
                    handleInputChange("cityTown", e.target.value)
                  }
                  className="flex w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[var(--color-orange)] focus:border-[var(--color-orange)] transition-all duration-300"
                >
                  <option value="">Enter your City/Town</option>
                  <option value="lagos-island">Lagos Island</option>
                  <option value="victoria-island">Victoria Island</option>
                  <option value="ajah">Ajah</option>
                </select>
              </div>

              {/* Development Stage */}
              <div className="space-y-2">
                <Label htmlFor="developmentStage">Development Stage</Label>
                <select
                  id="developmentStage"
                  value={formData.developmentStage}
                  onChange={(e) =>
                    handleInputChange("developmentStage", e.target.value)
                  }
                  className="flex w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[var(--color-orange)] focus:border-[var(--color-orange)] transition-all duration-300"
                >
                  <option value="">Select</option>
                  <option value="planning">Planning</option>
                  <option value="construction">Under Construction</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>

            {/* Description - Full Width */}
            <div className="mt-6 space-y-2">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                rows={4}
                placeholder="Write"
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                className="flex w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[var(--color-orange)] focus:border-[var(--color-orange)] transition-all duration-300 resize-none"
              />
            </div>

            {/* Delivery/Completion Date */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="deliveryDate">Delivery/Completion Date</Label>
                <div className="relative">
                  <Input
                    id="deliveryDate"
                    type="date"
                    placeholder="06/01/2026"
                    value={formData.deliveryDate}
                    onChange={(e) =>
                      handleInputChange("deliveryDate", e.target.value)
                    }
                  />
                  <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Next Button */}
            <div className="mt-8 flex justify-end gap-3">
              <Button onClick={handleBack} variant="outline" className="px-8">
                Cancel
              </Button>
              <Button
                onClick={handleNext}
                className="bg-[var(--color-orange)] hover:bg-[var(--color-orange-dark)] text-white px-8"
              >
                Next →
              </Button>
            </div>
          </div>
        )}

        {/* Media Uploads Tab */}
        {activeTab === "media" && (
          <div>
            {/* Cover Image */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Cover Image</h3>
                <Button
                  size="sm"
                  className="bg-[var(--color-orange)] hover:bg-[var(--color-orange-dark)] text-white"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload
                </Button>
              </div>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 bg-gray-50">
                <p className="text-center text-gray-500">Upload cover image</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Gallery Images */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Gallery Images</h3>
                  <Button
                    size="sm"
                    className="bg-[var(--color-orange)] hover:bg-[var(--color-orange-dark)] text-white"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload
                  </Button>
                </div>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 bg-gray-50">
                  <p className="text-center text-gray-500">
                    Upload gallery images
                  </p>
                </div>
              </div>

              {/* Videos */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Videos</h3>
                  <Button
                    size="sm"
                    className="bg-[var(--color-orange)] hover:bg-[var(--color-orange-dark)] text-white"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload
                  </Button>
                </div>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 bg-gray-50">
                  <p className="text-center text-gray-500">Upload videos</p>
                </div>
              </div>
            </div>

            {/* Document Uploads */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Document Uploads</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-100 rounded flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-orange-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <span className="font-medium">
                      Certificate of Ownership
                    </span>
                  </div>
                  <Button
                    size="sm"
                    className="bg-[var(--color-orange)] hover:bg-[var(--color-orange-dark)] text-white"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-100 rounded flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-orange-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <span className="font-medium">Brochures</span>
                  </div>
                  <Button
                    size="sm"
                    className="bg-[var(--color-orange)] hover:bg-[var(--color-orange-dark)] text-white"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload
                  </Button>
                </div>
              </div>
            </div>

            {/* Next Button */}
            <div className="mt-8 flex justify-end gap-3">
              <Button onClick={handleBack} variant="outline" className="px-8">
                Cancel
              </Button>
              <Button
                onClick={handleNext}
                className="bg-[var(--color-orange)] hover:bg-[var(--color-orange-dark)] text-white px-8"
              >
                Next →
              </Button>
            </div>
          </div>
        )}

        {/* Pricing & Access Tab */}
        {activeTab === "pricing" && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-8">
                {/* Base Price */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Base Price</h3>
                  <Input
                    type="text"
                    placeholder="Enter base price"
                    value={formData.basePrice}
                    onChange={(e) =>
                      handleInputChange("basePrice", e.target.value)
                    }
                  />
                </div>

                {/* Access Rules */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Access Rules</h3>
                  <h4 className="font-medium mb-3">Document Board Threshold</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-600">
                        Certificate of Ownership
                      </span>
                      <Button
                        size="sm"
                        className="bg-[var(--color-orange)] hover:bg-[var(--color-orange-dark)] text-white text-xs"
                      >
                        <Upload className="w-3 h-3 mr-1" />
                        Upload
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-600">Survey Plan</span>
                      <Button
                        size="sm"
                        className="bg-[var(--color-orange)] hover:bg-[var(--color-orange-dark)] text-white text-xs"
                      >
                        <Upload className="w-3 h-3 mr-1" />
                        Upload
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-600">
                        Transfer of Ownership
                      </span>
                      <Button
                        size="sm"
                        className="bg-[var(--color-orange)] hover:bg-[var(--color-orange-dark)] text-white text-xs"
                      >
                        <Upload className="w-3 h-3 mr-1" />
                        Upload
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Additional Fees */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Additional Fees</h3>
                  <Button
                    size="sm"
                    onClick={() => setShowAddFeeModal(true)}
                    className="bg-[var(--color-orange)] hover:bg-[var(--color-orange-dark)] text-white"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Fee
                  </Button>
                </div>
                <div className="space-y-3">
                  {additionalFees.map((fee, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg group"
                    >
                      <div className="flex-1">
                        <span className="text-sm text-gray-600">
                          {fee.title}
                        </span>
                        <span className="font-semibold ml-4">₦{fee.price}</span>
                      </div>
                      <button
                        onClick={() => handleRemoveFee(index)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <div className="flex items-center justify-between p-4 bg-gray-100 rounded-lg border-t-2 border-gray-300 mt-4">
                    <span className="font-semibold">Total</span>
                    <span className="font-bold text-lg">
                      ₦
                      {additionalFees
                        .reduce(
                          (sum, fee) =>
                            sum + parseFloat(fee.price.replace(/,/g, "")),
                          0,
                        )
                        .toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Add Fee Modal */}
            {showAddFeeModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-full max-w-md">
                  <h3 className="text-lg font-semibold mb-4">
                    Add Additional Fee
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="feeTitle">Fee Title</Label>
                      <Input
                        id="feeTitle"
                        value={newFee.title}
                        onChange={(e) =>
                          setNewFee((prev) => ({
                            ...prev,
                            title: e.target.value,
                          }))
                        }
                        placeholder="e.g., Processing Fee"
                      />
                    </div>
                    <div>
                      <Label htmlFor="feePrice">Price</Label>
                      <Input
                        id="feePrice"
                        value={newFee.price}
                        onChange={(e) =>
                          setNewFee((prev) => ({
                            ...prev,
                            price: e.target.value,
                          }))
                        }
                        placeholder="e.g., 1,000,000"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 mt-6">
                    <Button
                      onClick={() => setShowAddFeeModal(false)}
                      variant="outline"
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleAddFee}
                      className="flex-1 bg-[var(--color-orange)] hover:bg-[var(--color-orange-dark)] text-white"
                    >
                      Add Fee
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Next Button */}
            <div className="mt-8 flex justify-end gap-3">
              <Button onClick={handleBack} variant="outline" className="px-8">
                Cancel
              </Button>
              <Button
                onClick={handleNext}
                className="bg-[var(--color-orange)] hover:bg-[var(--color-orange-dark)] text-white px-8"
              >
                Next →
              </Button>
            </div>
          </div>
        )}

        {/* Specific Fields Tab */}
        {activeTab === "specific" && (
          <div>
            <p className="text-sm text-gray-600 mb-6">
              Package-specific fields for {packageType.replace("-", " ")}.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Add package-specific fields here based on packageType */}
              <div className="col-span-2 text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-gray-500">
                  Package-specific fields will appear here
                </p>
              </div>
            </div>

            {/* Save Button */}
            <div className="mt-8 flex justify-end gap-3">
              <Button onClick={handleBack} variant="outline" className="px-8">
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                className="bg-[var(--color-orange)] hover:bg-[var(--color-orange-dark)] text-white px-8"
              >
                Save Changes
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
