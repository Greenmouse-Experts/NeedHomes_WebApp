import type { ApiResponse } from "@/api/simpleApi";
import apiClient from "@/api/simpleApi";
import PageLoader from "@/components/layout/PageLoader";
import CustomTable from "@/components/tables/CustomTable";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Filter, Plus, Printer, Search } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/dashboard/properties/investments/")({
  component: RouteComponent,
});

type FilterTab = "all" | "published" | "unpublished";
function RouteComponent() {
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const query = useQuery<ApiResponse<[]>>({
    queryKey: ["listings-admin"],
    queryFn: async () => {
      let resp = await apiClient.get("investments/admin/all");
      return resp.data;
    },
  });

  return (
    <div className="bg-base-100">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Invesments </h2>
          {/*<Button
            // onClick={handleAddProperty}
            className="bg-[var(--color-orange)] hover:bg-[var(--color-orange-dark)] text-white flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add a New Properties
          </Button>*/}
        </div>

        {/* Filter Tabs */}
        {/*<div className="flex gap-2">
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
        </div>*/}

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
      </div>
      <PageLoader query={query}>
        {(data) => {
          //@ts-ignore
          const investments = data.data.data;
          return (
            <>
              <CustomTable data={investments} />
            </>
          );
        }}
      </PageLoader>
    </div>
  );
}
