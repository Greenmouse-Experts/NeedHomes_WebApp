import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  Search,
  Plus,
  Filter,
  Printer,
  Eye,
  Edit,
  Upload,
  Download,
  Trash2,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import apiClient, {
  type ApiResponse,
  type ApiResponseV2,
} from "@/api/simpleApi";
import type { ADMIN_PROPERTY_LISTING } from "@/types";
import PageLoader from "@/components/layout/PageLoader";
import CustomTable, {
  type columnType,
  type Actions,
} from "@/components/tables/CustomTable";
import { toast } from "sonner";
import { extract_message } from "@/helpers/apihelpers";

export const Route = createFileRoute("/dashboard/properties/listed")({
  component: ListedPropertiesPage,
});

type FilterTab = "all" | "published" | "unpublished";

function ListedPropertiesPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const handleAddProperty = () => {
    navigate({ to: "/dashboard/properties/new" });
  };
  const query = useQuery<ApiResponseV2<ADMIN_PROPERTY_LISTING[]>>({
    queryKey: ["listings-admin"],
    queryFn: async () => {
      let url = "admin/properties";
      if (activeTab === "published") {
        url += "?published=true";
      } else if (activeTab === "unpublished") {
        url += "?published=false";
      }
      let resp = await apiClient.get(url);
      return resp.data;
    },
  });

  const columns: columnType<ADMIN_PROPERTY_LISTING>[] = [
    {
      key: "propertyTitle",
      label: "Property Title",
    },
    {
      key: "propertyType",
      label: "Type",
    },
    {
      key: "investmentModel",
      label: "Model",
    },
    {
      key: "location",
      label: "Location",
    },
    {
      key: "basePrice",
      label: "Base Price",
      render: (value) => `₦${value.toLocaleString()}`,
    },
    {
      key: "published",
      label: "Status",
      render: (value) => (
        <span
          className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
            value
              ? "bg-yellow-100 text-yellow-800"
              : "bg-orange-100 text-orange-800"
          }`}
        >
          {value ? "Published" : "Unpublished"}
        </span>
      ),
    },
    {
      key: "createdAt",
      label: "Date Created",
      render: (value) => <span>value</span>,
    },
  ];

  const actions: Actions[] = [
    {
      key: "view",
      label: "View Details",
      action: (item: ADMIN_PROPERTY_LISTING, nav) => {
        return nav({
          to: "/dashboard/properties/$propertyId",
          params: { propertyId: item.id },
        });
      },
    },
    {
      key: "edit",
      label: "Edit",
      action: (item: ADMIN_PROPERTY_LISTING, nav) => {
        console.log(item);
        switch (item.investmentModel) {
          case "CO_DEVELOPMENT":
            nav({
              to: "/dashboard/properties/edit/$propertyId/co-dev",
              params: { propertyId: item.id },
            });
            break;
          case "OUTRIGHT_PURCHASE":
            nav({
              to: "/dashboard/properties/edit/$propertyId/outright",
              params: { propertyId: item.id },
            });
            break;
          case "SAVE_TO_OWN":
            nav({
              to: "/dashboard/properties/edit/$propertyId/save-to-own",
              params: { propertyId: item.id },
            });
            break;
          case "LAND_BANKING":
            nav({
              to: "/dashboard/properties/edit/$propertyId/land-bank",
              params: { propertyId: item.id },
            });
            break;
          case "FRACTIONAL":
            nav({
              to: "/dashboard/properties/edit/$propertyId/fractional",
              params: { propertyId: item.id },
            });
            break;
        }
      },
    },
    {
      key: "delete",
      label: "Delete",
      action: (item: ADMIN_PROPERTY_LISTING, nav) => {
        toast.promise(
          async () => {
            let resp = await apiClient.delete(`/properties/${item.id}`);
            return resp.data;
          },
          {
            loading: "Deleting...",
            success: (data) => {
              query.refetch();
              return "Property deleted successfully";
            },
            error: extract_message,
          },
        );
      },
    },
    // {
    //   key: "toggle_publish",
    //   label: "Toggle Publish",
    //   action: (item: ADMIN_PROPERTY_LISTING, nav) => {
    //     const action = item.published ? "unpublish" : "publish";
    //     if (
    //       confirm(`Are you sure you want to ${action} "${item.propertyTitle}"?`)
    //     ) {
    //       console.log(`${action} property:`, item.id);
    //       // TODO: Implement actual publish/unpublish logic
    //     }
    //   },
    // },
  ];

  return (
    <PageLoader query={query}>
      {(data) => (
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
              {/* <Button variant="outline" size="sm">
                Action
              </Button> */}
            </div>
          </div>
          {/* Table */}

          <CustomTable
            //@ts-ignore
            data={data.data.data}
            columns={columns}
            actions={actions}
            ring={false}
          />
        </div>
      )}
    </PageLoader>
  );
}
