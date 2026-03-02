import apiClient, {
  type ApiResponse,
  type ApiResponseV2,
} from "@/api/simpleApi";
import PageLoader from "@/components/layout/PageLoader";
import ThemeProvider from "@/simpleComps/ThemeProvider";
import type { PROPERTY_DATA } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Building2, ChevronDown } from "lucide-react";
import { useState } from "react";
import PropertyCard from "./-components/PropertyCard";
import { usePagination } from "@/helpers/pagination";
import SimplePaginator from "@/simpleComps/SimplePaginator";
import SearchBar from "@/routes/-components/Searchbar";

// Investment Model filter options
const investmentModels = [
  { id: null, label: "All Models" },
  { id: "OUTRIGHT_PURCHASE", label: "Outright Purchase" },
  { id: "CO_DEVELOPMENT", label: "Co-Development" },
  { id: "FRACTIONAL_OWNERSHIP", label: "Fractional Ownership" },
  { id: "LAND_BANKING", label: "Land Banking" },
  { id: "SAVE_TO_OWN", label: "Save to Own" },
];

const propertyTypes = [
  { id: null, label: "All Properties" },
  { id: "RESIDENTIAL", label: "Residential" },
  { id: "COMMERCIAL", label: "Commercial" },
  { id: "LAND", label: "Land" },
];

export const Route = createFileRoute("/investors/properties/")({
  component: PartnerPropertiesList,
});

function PartnerPropertiesList() {
  const [selectedPropertyType, setSelectedPropertyType] = useState<
    string | null
  >(null);
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);

  const [selectedInvestmentModel, setSelectedInvestmentModel] = useState<
    string | null
  >(null);
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);

  const [search, setSearch] = useState("");

  const props = usePagination();

  const query = useQuery<ApiResponseV2<PROPERTY_DATA[]>>({
    queryKey: [
      "property-list",
      props.page,
      search,
      selectedPropertyType,
      selectedInvestmentModel,
    ],
    queryFn: async () => {
      let resp = await apiClient.get("/properties", {
        params: {
          page: props.page,
          propertyType: selectedPropertyType,
          investmentModel: selectedInvestmentModel,
          search,
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

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-2 flex-1 md:flex-none">
            {/* Property Type Dropdown */}
            <div className="relative flex-1 md:flex-none">
              <button
                onClick={() => setIsTypeDropdownOpen(!isTypeDropdownOpen)}
                className="flex items-center justify-between gap-2 bg-(--color-orange) text-white px-4 md:px-6 py-2.5 rounded-lg font-medium hover:bg-orange-600 transition-colors w-full md:w-auto"
              >
                <span className="text-sm md:text-base">
                  {propertyTypes.find((t) => t.id === selectedPropertyType)
                    ?.label || "All Properties"}
                </span>
                <ChevronDown className="w-4 h-4" />
              </button>
              {isTypeDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                  {propertyTypes.map((type) => (
                    <button
                      key={type.id ?? "all"}
                      onClick={() => {
                        setSelectedPropertyType(type.id);
                        setIsTypeDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                        selectedPropertyType === type.id
                          ? "bg-orange-50 text-(--color-orange) font-medium"
                          : "text-gray-700"
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {/* Investment Model Dropdown */}
            <div className="relative flex-1 md:flex-none">
              <button
                onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
                className="flex items-center justify-between gap-2 bg-(--color-orange) text-white px-4 md:px-6 py-2.5 rounded-lg font-medium hover:bg-orange-600 transition-colors w-full md:w-auto"
              >
                <span className="text-sm md:text-base">
                  {investmentModels.find(
                    (m) => m.id === selectedInvestmentModel,
                  )?.label || "All Models"}
                </span>
                <ChevronDown className="w-4 h-4" />
              </button>
              {isModelDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                  {investmentModels.map((model) => (
                    <button
                      key={model.id ?? "all"}
                      onClick={() => {
                        setSelectedInvestmentModel(model.id);
                        setIsModelDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                        selectedInvestmentModel === model.id
                          ? "bg-orange-50 text-(--color-orange) font-medium"
                          : "text-gray-700"
                      }`}
                    >
                      {model.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        <p className="text-gray-600 text-sm sm:text-base">
          Browse and manage your real estate partnership opportunities.
        </p>
      </div>
      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Search by title, location, or description"
      />
      <PageLoader query={query}>
        {(response) => {
          const properties = response.data.data || [];

          return (
            <div className="flex flex-col gap-6">
              {/* Header */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 md:gap-6">
                {properties.map((property) => (
                  <PropertyCard
                    item={property}
                    key={property.id || property.title}
                  />
                ))}
              </div>
              {properties.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  No properties found for this filter.
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
