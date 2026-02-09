import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Filter, Printer, Plus } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import CustomTable, { type columnType } from "@/components/tables/CustomTable";

export const Route = createFileRoute("/dashboard/properties/promotions/")({
  component: RouteComponent,
});

const DUMMY_DATA = [
  {
    id: 1,
    title: "Summer Special",
    property: "Oceanview Apartments",
    discount: "10%",
    startDate: "2023-06-01",
    endDate: "2023-08-31",
    status: "Active",
  },
  {
    id: 2,
    title: "Early Bird",
    property: "Skyline Tower",
    discount: "5%",
    startDate: "2023-11-01",
    endDate: "2023-12-31",
    status: "Expired",
  },
  {
    id: 3,
    title: "Holiday Deal",
    property: "Green Valley Estate",
    discount: "$2,000 Off",
    startDate: "2023-12-15",
    endDate: "2024-01-05",
    status: "Scheduled",
  },
];

const columns: columnType[] = [
  { key: "title", label: "Promotion Title" },
  { key: "property", label: "Property" },
  { key: "discount", label: "Discount" },
  { key: "startDate", label: "Start Date" },
  { key: "endDate", label: "End Date" },
  {
    key: "status",
    label: "Status",
    render: (value) => (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === "Active"
            ? "bg-success/20 text-success"
            : value === "Expired"
              ? "bg-error/20 text-error"
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

  return (
    <div className="bg-base-100">
      <div className="border-b ring fade rounded-t-box border-gray-200 shadow">
        <div className="flex items-center justify-between p-6 border-b fade">
          <h2 className="text-xl font-semibold">Property Promotions</h2>
          {/*<Button size="sm" className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Create Promotion
          </Button>*/}
        </div>

        <div className="p-4 border-b border-gray-200 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search promotions..."
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
      <CustomTable
        ring={false}
        columns={columns}
        data={DUMMY_DATA}
        actions={[]}
      />
    </div>
  );
}
