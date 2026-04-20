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
import { useState, useRef, useEffect } from "react";
import PropertyCard from "./-components/PropertyCard";
import { usePagination } from "@/helpers/pagination";
import SimplePaginator from "@/simpleComps/SimplePaginator";
import SearchBar from "@/routes/-components/Searchbar";
import { useModal } from "@/store/modals";
import Modal from "@/components/modals/DialogModal";
import { FormProvider, useForm } from "react-hook-form";
import SimpleInput from "@/simpleComps/inputs/SimpleInput";
import { toast } from "sonner";

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

export const Route = createFileRoute("/properties/")({
  component: PublicPropertiesList,
});

function PublicPropertiesList() {
  const [filters, setFilters] = useState<{
    propertyType: string | null;
    investmentModel: string | null;
    minPrice: number | null;
    maxPrice: number | null;
    location: string | null;
  }>({
    propertyType: null,
    investmentModel: null,
    minPrice: null,
    maxPrice: null,
    location: null,
  });

  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const [search, setSearch] = useState("");

  const props = usePagination();
  const modal = useModal();
  const form = useForm({
    defaultValues: {
      minPrice: null as number | null,
      maxPrice: null as number | null,
      location: "",
    },
  });

  const typeDropdownRef = useRef<HTMLDivElement>(null);
  const modelDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        typeDropdownRef.current &&
        !typeDropdownRef.current.contains(event.target as Node)
      ) {
        setIsTypeDropdownOpen(false);
      }
      if (
        modelDropdownRef.current &&
        !modelDropdownRef.current.contains(event.target as Node)
      ) {
        setIsModelDropdownOpen(false);
      }
    }
    if (isTypeDropdownOpen || isModelDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isTypeDropdownOpen, isModelDropdownOpen]);

  const query = useQuery<ApiResponseV2<PROPERTY_DATA[]>>({
    queryKey: [
      "property-list-public",
      props.page,
      search,
      filters.propertyType,
      filters.investmentModel,
      filters.minPrice,
      filters.maxPrice,
      filters.location,
    ],
    queryFn: async () => {
      let resp = await apiClient.get("/properties", {
        params: {
          page: props.page,
          propertyType: filters.propertyType,
          investmentModel: filters.investmentModel,
          search,
          minPrice: filters.minPrice ? filters.minPrice * 100 : undefined,
          maxPrice: filters.maxPrice ? filters.maxPrice * 100 : undefined,
          location: filters.location || undefined,
        },
      });
      return resp.data;
    },
  });

  const handleFilterChange = (key: keyof typeof filters, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
    if (props.page !== 1) {
      props.setPagination(1);
    }
  };

  const onSubmit = (data: {
    minPrice?: number | null;
    maxPrice?: number | null;
    location?: string;
  }) => {
    if (!data.minPrice && !data.maxPrice && !data.location?.trim()) {
      toast.error("Please enter at least a price range or location");
      return;
    }
    handleFilterChange("minPrice", data.minPrice ?? null);
    handleFilterChange("maxPrice", data.maxPrice ?? null);
    handleFilterChange("location", data.location?.trim() || null);
    props.setPagination(1);
    modal.closeModal();
  };

  const handleResetFilters = () => {
    setFilters({
      propertyType: null,
      investmentModel: null,
      minPrice: null,
      maxPrice: null,
      location: null,
    });
    form.reset();
    setSearch("");
    props.setPagination(1);
  };

  const activeFilters = [
    filters.propertyType
      ? propertyTypes.find((t) => t.id === filters.propertyType)?.label
      : null,
    filters.investmentModel
      ? investmentModels.find((m) => m.id === filters.investmentModel)?.label
      : null,
    filters.minPrice ? `Min: ₦${filters.minPrice?.toLocaleString()}` : null,
    filters.maxPrice ? `Max: ₦${filters.maxPrice?.toLocaleString()}` : null,
    filters.location ? `Location: ${filters.location}` : null,
  ].filter(Boolean);
  return (
    <ThemeProvider className="container mx-auto pt-12 ">
      <Modal ref={modal.ref} title="Price & Location Filters">
        <FormProvider {...form}>
          <form
            className="space-y-4"
            onSubmit={form.handleSubmit(onSubmit as any)}
          >
            <SimpleInput
              {...form.register("location")}
              label="Location"
              placeholder="e.g. Lekki, Abuja, Victoria Island"
            />
            <div className="grid grid-cols-2 gap-3">
              <SimpleInput
                {...form.register("minPrice")}
                type="number"
                label="Min Price (₦)"
                min={0}
                placeholder="e.g. 5000000"
              />
              <SimpleInput
                {...form.register("maxPrice")}
                type="number"
                label="Max Price (₦)"
                min={0}
                placeholder="e.g. 100000000"
              />
            </div>
            <div className="flex items-center justify-between">
              <button
                type="button"
                className="btn btn-accent"
                onClick={() => form.reset()}
              >
                Clear
              </button>
              <button className="btn btn-primary">Apply</button>
            </div>
          </form>
        </FormProvider>
      </Modal>
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

          <div className="flex flex-col md:flex-row gap-2 flex-1 md:flex-none">
            <div
              className="relative flex-1 md:flex-none flex"
              ref={typeDropdownRef}
            >
              <button
                onClick={() => setIsTypeDropdownOpen((open) => !open)}
                className="btn btn-primary flex-1"
                aria-haspopup="listbox"
                aria-expanded={isTypeDropdownOpen}
              >
                <span className="text-sm md:text-base">
                  {propertyTypes.find((t) => t.id === filters.propertyType)
                    ?.label || "All Properties"}
                </span>
                <ChevronDown className="w-4 h-4" />
              </button>
              {isTypeDropdownOpen && (
                <div className="absolute right-0 mt-12 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                  {propertyTypes.map((type) => (
                    <button
                      key={type.id ?? "all"}
                      onClick={() => {
                        handleFilterChange("propertyType", type.id);
                        setIsTypeDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                        filters.propertyType === type.id
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
            <div
              className="relative flex-1 md:flex-none flex"
              ref={modelDropdownRef}
            >
              <button
                onClick={() => setIsModelDropdownOpen((open) => !open)}
                className="btn btn-primary flex-1"
                aria-haspopup="listbox"
                aria-expanded={isModelDropdownOpen}
              >
                <span className="text-sm md:text-base">
                  {investmentModels.find(
                    (m) => m.id === filters.investmentModel,
                  )?.label || "All Models"}
                </span>
                <ChevronDown className="w-4 h-4" />
              </button>
              {isModelDropdownOpen && (
                <div className="absolute right-0 mt-12 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                  {investmentModels.map((model) => (
                    <button
                      key={model.id ?? "all"}
                      onClick={() => {
                        handleFilterChange("investmentModel", model.id);
                        setIsModelDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                        filters.investmentModel === model.id
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
            <button
              onClick={() => modal.showModal()}
              className="btn btn-primary btn-outline"
            >
              Price & Location
            </button>
            <button
              onClick={handleResetFilters}
              className="btn btn-accent"
              type="button"
              disabled={
                !filters.propertyType &&
                !filters.investmentModel &&
                !filters.minPrice &&
                !filters.maxPrice &&
                !filters.location &&
                !search
              }
            >
              Reset
            </button>
          </div>
        </div>
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {activeFilters.map((filter, idx) => (
              <span
                key={filter + idx}
                className="inline-flex items-center px-3 py-1 rounded-full bg-orange-50 text-orange-700 text-xs font-medium border border-orange-200"
              >
                {filter}
              </span>
            ))}
          </div>
        )}
        <p className="text-gray-600 text-sm sm:text-base">
          Browse and explore our real estate investment opportunities.
        </p>
      </div>
      <SearchBar
        value={search}
        onChange={(val) => {
          setSearch(val);
          props.setPagination(1);
        }}
        placeholder="Search by title, location, or description"
      />
      <PageLoader query={query}>
        {(response) => {
          const properties = response.data.data || [];

          return (
            <div className="flex flex-col gap-6 mt-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 md:gap-6">
                {properties.map((property) => (
                  <PropertyCard item={property} key={property.id} />
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
