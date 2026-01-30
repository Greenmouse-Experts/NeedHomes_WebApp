import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { DropdownMenu, DropdownMenuItem } from "@/components/ui/DropdownMenu";
import {
  Search,
  Plus,
  Filter,
  Printer,
  MoreVertical,
  Eye,
  Edit,
  Upload,
  Download,
  Trash2,
} from "lucide-react";

export const Route = createFileRoute("/dashboard/properties/listed")({
  component: ListedPropertiesPage,
});

type FilterTab = "all" | "published" | "unpublished";

interface Property {
  sku: string;
  property: string;
  image: string;
  package: string;
  location: string;
  status: "Published" | "Unpublished";
}

// Mock data
const mockProperties: Property[] = [
  {
    sku: "LAG-CAT-001",
    property: "Semi Detached",
    image: "/property-placeholder.jpg",
    package: "Outright Purchase",
    location: "Lagos",
    status: "Published",
  },
  {
    sku: "LAG-CAT-001",
    property: "Semi Detached",
    image: "/property-placeholder.jpg",
    package: "Co-Develop",
    location: "Ogun",
    status: "Unpublished",
  },
  {
    sku: "LAG-CAT-001",
    property: "Semi Detached",
    image: "/property-placeholder.jpg",
    package: "Outright Purchase",
    location: "Lagos",
    status: "Published",
  },
  {
    sku: "LAG-CAT-001",
    property: "Semi Detached",
    image: "/property-placeholder.jpg",
    package: "Co-Develop",
    location: "Ogun",
    status: "Unpublished",
  },
];

function ListedPropertiesPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const handleAddProperty = () => {
    navigate({ to: "/dashboard/properties/new" });
  };

  const filteredProperties = mockProperties.filter((property) => {
    if (activeTab === "published") return property.status === "Published";
    if (activeTab === "unpublished") return property.status === "Unpublished";
    return true;
  });

  return (
    <DashboardLayout title="Manage Properties" subtitle="">
      <div className="bg-white rounded-lg shadow-sm">
        {/* Header Section */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Listed Properties</h2>
            <Button
              onClick={handleAddProperty}
              className="bg-[var(--color-orange)] hover:bg-[var(--color-orange-dark)] text-white flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add a New Properties
            </Button>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                activeTab === "all"
                  ? "bg-[var(--color-orange)] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              All Property
            </button>
            <button
              onClick={() => setActiveTab("published")}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                activeTab === "published"
                  ? "bg-[var(--color-orange)] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Publish Properties
            </button>
            <button
              onClick={() => setActiveTab("unpublished")}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                activeTab === "unpublished"
                  ? "bg-[var(--color-orange)] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Unpublished Properties
            </button>
          </div>
        </div>

        {/* Controls Bar */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Filter
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              Print
            </Button>
            <Button variant="outline" size="sm">
              Action
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  SKU
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Property
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Image
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Package
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Location
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredProperties.map((property, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {property.sku}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {property.property}
                  </td>
                  <td className="px-6 py-4">
                    <div className="w-12 h-12 bg-gray-200 rounded overflow-hidden">
                      <img
                        src={property.image}
                        alt={property.property}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src =
                            'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="48" height="48"%3E%3Crect fill="%23ddd" width="48" height="48"/%3E%3C/svg%3E';
                        }}
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {property.package}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {property.location}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                        property.status === "Published"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-orange-100 text-orange-800"
                      }`}
                    >
                      {property.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <DropdownMenu
                      trigger={
                        <button className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded transition-colors">
                          <MoreVertical className="w-5 h-5" />
                        </button>
                      }
                    >
                      <DropdownMenuItem
                        onClick={() =>
                          navigate({
                            to: "/dashboard/properties/$propertyId",
                            params: { propertyId: property.sku },
                          })
                        }
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          navigate({
                            to: "/dashboard/properties/$propertyId/edit",
                            params: { propertyId: property.sku },
                          })
                        }
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      {property.status === "Published" ? (
                        <DropdownMenuItem
                          onClick={() => {
                            if (
                              confirm(
                                `Are you sure you want to unpublish "${property.property}"?`,
                              )
                            ) {
                              console.log("Unpublish property:", property.sku);
                            }
                          }}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Unpublish
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem
                          onClick={() => {
                            if (
                              confirm(
                                `Are you sure you want to publish "${property.property}"?`,
                              )
                            ) {
                              console.log("Publish property:", property.sku);
                            }
                          }}
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Publish
                        </DropdownMenuItem>
                      )}
                      {/*<DropdownMenuItem
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete "${property.property}"? This action cannot be undone.`)) {
                            console.log('Delete property:', property.sku)
                          }
                        }}
                        className="text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>*/}
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredProperties.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No properties found.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
