import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Search, Plus, Filter, Printer } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import apiClient, { type ApiResponseV2 } from "@/api/simpleApi";
import type { ADMIN_PROPERTY_LISTING } from "@/types";
import PageLoader from "@/components/layout/PageLoader";
import CustomTable, { type columnType } from "@/components/tables/CustomTable";
import type { Actions } from "@/components/tables/pop-up";
import { toast } from "sonner";
import { extract_message } from "@/helpers/apihelpers";
import { usePagination } from "@/helpers/pagination";

export const Route = createFileRoute("/dashboard/properties/listed")({
  component: ListedPropertiesPage,
});

type FilterTab = "all" | "published" | "unpublished";

function ListedPropertiesPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const props = usePagination();

  const handleAddProperty = () => {
    navigate({ to: "/dashboard/properties/new" });
  };

  const query = useQuery<ApiResponseV2<ADMIN_PROPERTY_LISTING[]>>({
    queryKey: ["listings-admin", props.page, activeTab],
    queryFn: async () => {
      let url = "admin/properties/all";
      const params: any = { page: props.page };
      if (activeTab === "published") {
        params.published = true;
      } else if (activeTab === "unpublished") {
        params.published = false;
      }
      let resp = await apiClient.get(url, { params });
      return resp.data;
    },
  });

  const publishMutation = useMutation({
    mutationFn: async ({
      id,
      published,
    }: {
      id: string;
      published: boolean;
    }) => {
      const resp = await apiClient.patch(`/admin/properties/${id}/published`, {
        published,
      });
      return resp.data;
    },
    onSuccess: (_, variables) => {
      query.refetch();
      toast.success(
        variables.published
          ? "Property published successfully"
          : "Property unpublished successfully",
      );
    },
    onError: (error) => {
      toast.error(
        extract_message(error as any) || "Failed to update property status",
      );
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
      render: (value) => <span>{new Date(value).toLocaleString()}</span>,
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
      action: (item: ADMIN_PROPERTY_LISTING, nav: any) => {
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
          case "FRACTIONAL_OWNERSHIP":
            nav({
              to: "/dashboard/properties/edit/$propertyId/fractional",
              params: { propertyId: item.id },
            });
            break;
        }
      },
    },
    {
      key: "toggle_publish",
      label: "Toggle Publish",
      action: (item: ADMIN_PROPERTY_LISTING) => {
        //@ts-ignore
        toast.promise(
          //@ts-ignore
          publishMutation.mutateAsync({
            id: item.id,
            published: !item.published,
          }),
          {
            loading: "Changing status...",
            success: extract_message,
            error: extract_message,
          },
        );
      },
    },
    {
      key: "delete",
      label: "Delete",
      action: (item: ADMIN_PROPERTY_LISTING) => {
        toast.promise(
          async () => {
            let resp = await apiClient.delete(`/properties/${item.id}`);
            return resp.data;
          },
          {
            loading: "Deleting...",
            success: () => {
              query.refetch();
              return "Property deleted successfully";
            },
            error: extract_message,
          },
        );
      },
    },
  ];

  return (
    <>
      <section className="bg-base-100 ring fade shadow rounded-t-box">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Listed Properties</h2>
            <Button
              onClick={handleAddProperty}
              className="bg-(--color-orange) hover:bg-(--color-orange-dark) text-white flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add a New Properties
            </Button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                activeTab === "all"
                  ? "bg-(--color-orange) text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              All Property
            </button>
            <button
              onClick={() => setActiveTab("published")}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                activeTab === "published"
                  ? "bg-(--color-orange) text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Publish Properties
            </button>
            <button
              onClick={() => setActiveTab("unpublished")}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                activeTab === "unpublished"
                  ? "bg-(--color-orange) text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Unpublished Properties
            </button>
          </div>
        </div>

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
          </div>
        </div>
      </section>
      <PageLoader query={query}>
        {(data) => (
          <div className="bg-white rounded-lg shadow-sm">
            <CustomTable
              //@ts-ignore
              data={data.data.data}
              columns={columns}
              actions={actions}
              ring={false}
              paginationProps={props}
            />
          </div>
        )}
      </PageLoader>
    </>
  );
}
