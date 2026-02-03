import apiClient, { type ApiResponse } from "@/api/simpleApi";
import PageLoader from "@/components/layout/PageLoader";
import ThemeProvider from "@/simpleComps/ThemeProvider";
import type { PROPERTY_DATA } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Building2, ChevronDown } from "lucide-react";
import { useState } from "react";
import PropertyCard from "./-components/PropertyCard";
import { usePagination } from "@/helpers/pagination";
import SimplePaginator from "@/simpleComps/SimplePaginator";

export const Route = createFileRoute("/investors/properties/")({
  component: PartnerPropertiesList,
});

function PartnerPropertiesList() {
  const [selectedPropertyType, setSelectedPropertyType] = useState("all");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const propertyTypes = [
    { id: "all", label: "All Properties" },
    { id: "OUTRIGHT", label: "Outright Purchase" },
    { id: "INVESTMENT", label: "Co-Development" },
    { id: "fractional-ownership", label: "Fractional Ownership" },
    { id: "LAND", label: "Land Banking" },
    { id: "SAVE_TO_OWN", label: "Save to Own" },
  ];
  const props = usePagination();
  const query = useQuery<ApiResponse<PROPERTY_DATA[]>>({
    queryKey: ["property-list", props.page],
    queryFn: async () => {
      let resp = await apiClient.get("/properties", {
        params: {
          page: props.page,
        },
      });
      return resp.data;
    },
  });

  return (
    <ThemeProvider>
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Building2 className="h-6 w-6 text-green-600" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Properties
            </h1>
          </div>
          {/* Property Type Dropdown */}
          <div className="relative flex-1 md:flex-none">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center justify-between gap-2 bg-[var(--color-orange)] text-white px-4 md:px-6 py-2.5 rounded-lg font-medium hover:bg-orange-600 transition-colors w-full md:w-auto"
            >
              <span className="text-sm md:text-base">
                {propertyTypes.find((t) => t.id === selectedPropertyType)
                  ?.label || "All Properties"}
              </span>
              <ChevronDown className="w-4 h-4" />
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                {propertyTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => {
                      setSelectedPropertyType(type.id);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                      selectedPropertyType === type.id
                        ? "bg-orange-50 text-[var(--color-orange)] font-medium"
                        : "text-gray-700"
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <p className="text-gray-600 text-sm sm:text-base">
          Browse and manage your real estate partnership opportunities.
        </p>
      </div>

      <PageLoader query={query}>
        {(response) => {
          const properties = response.data || [];
          const filteredProperties =
            selectedPropertyType === "all"
              ? properties
              : properties.filter(
                  (p) =>
                    p.investmentModel === selectedPropertyType ||
                    p.propertyType === selectedPropertyType,
                );

          return (
            <div className="flex flex-col gap-6">
              {/* Header */}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 md:gap-6">
                {filteredProperties.map((property) => (
                  <>
                    <PropertyCard item={property} key={"ss"} />
                  </>
                ))}
              </div>
              {filteredProperties.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  No properties found for this category.
                </div>
              )}
              <div>
                <SimplePaginator />
              </div>
            </div>
          );
        }}
      </PageLoader>
    </ThemeProvider>
  );
}
