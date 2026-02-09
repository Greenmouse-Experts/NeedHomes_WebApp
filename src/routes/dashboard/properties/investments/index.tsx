import type { ApiResponse } from "@/api/simpleApi";
import apiClient from "@/api/simpleApi";
import PageLoader from "@/components/layout/PageLoader";
import CustomTable, { type columnType } from "@/components/tables/CustomTable";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Filter, Printer, Search } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/dashboard/properties/investments/")({
  component: RouteComponent,
});

const DUMMY_DATA = [
  {
    id: 1,
    property: "Oceanview Apartments",
    investor: "John Doe",
    amount: "$50,000",
    date: "2023-10-15",
    status: "Completed",
  },
  {
    id: 2,
    property: "Skyline Tower",
    investor: "Jane Smith",
    amount: "$120,000",
    date: "2023-11-02",
    status: "Pending",
  },
  {
    id: 3,
    property: "Green Valley Estate",
    investor: "Robert Brown",
    amount: "$75,000",
    date: "2023-11-20",
    status: "Completed",
  },
];

const columns: columnType[] = [
  { key: "property", label: "Property Name" },
  { key: "investor", label: "Investor" },
  { key: "amount", label: "Amount" },
  { key: "date", label: "Date" },
  {
    key: "status",
    label: "Status",
    render: (value) => (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === "Completed"
            ? "bg-success/20 text-success"
            : "bg-warning/20 text-warning"
        }`}
      >
        {value}
      </span>
    ),
  },
];

function RouteComponent() {
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
      <div className=" border-b ring fade rounded-t-box border-gray-200 shadow">
        <div className="flex items-center justify-between p-6 border-b fade">
          <h2 className="text-xl font-semibold">Investments</h2>
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
      </div>
      <PageLoader query={query}>
        {(data) => {
          //@ts-ignore
          const investments = data.data.data || DUMMY_DATA;
          return (
            <>
              <CustomTable
                ring={false}
                columns={columns}
                data={DUMMY_DATA}
                actions={[]}
              />
            </>
          );
        }}
      </PageLoader>
    </div>
  );
}
