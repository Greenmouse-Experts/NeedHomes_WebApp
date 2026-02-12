import type { ApiResponse } from "@/api/simpleApi";
import apiClient from "@/api/simpleApi";
import PageLoader from "@/components/layout/PageLoader";
import CustomTable, { type columnType } from "@/components/tables/CustomTable";
import { type Actions } from "@/components/tables/pop-up";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Filter, Printer, Search } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/dashboard/properties/investments/")({
  component: RouteComponent,
});

interface Investment {
  id: string;
  userId: string;
  propertyId: string;
  amountPaid: number;
  unitsBought: number;
  sharesBought: number | null;
  paymentOption: "INSTALLMENT" | "OUTRIGHT";
  status: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  currentValue: number;
  lastValuationDate: string | null;
  returnPercentage: number;
  totalAmount: number;
  totalReturns: number;
  property: {
    id: string;
    propertyTitle: string;
    propertyType: string;
    investmentModel: string;
    location: string;
    basePrice: number;
    coverImage: string;
  };
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    accountType: string;
  };
}

const columns: columnType<Investment>[] = [
  {
    key: "property",
    label: "Property Name",
    render: (_, item) => (
      <div className="flex flex-col">
        <span className="font-medium">{item.property?.propertyTitle}</span>
        <span className="text-xs opacity-60">{item.property?.location}</span>
      </div>
    ),
  },
  {
    key: "user",
    label: "Investor",
    render: (_, item) => (
      <div className="flex flex-col">
        <span className="font-medium">
          {item.user?.firstName} {item.user?.lastName}
        </span>
        <span className="text-xs opacity-60">{item.user?.email}</span>
      </div>
    ),
  },
  {
    key: "amountPaid",
    label: "Amount Paid",
    render: (value) => `₦${value?.toLocaleString()}`,
  },
  {
    key: "createdAt",
    label: "Date",
    render: (value) => new Date(value).toLocaleDateString(),
  },
  {
    key: "status",
    label: "Status",
    render: (value) => (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === "COMPLETED" || value === "ACTIVE"
            ? "bg-success/20 text-success"
            : "bg-warning/20 text-warning"
        }`}
      >
        {value}
      </span>
    ),
  },
];

const actions: Actions[] = [
  {
    key: "view",
    label: "View Details",
    action: (item, nav) => {
      nav({
        to: "/dashboard/properties/investments/$investmentId",
        params: { investmentId: item.id },
      });
    },
  },
];

function RouteComponent() {
  const [searchQuery, setSearchQuery] = useState("");
  const query = useQuery<ApiResponse<Investment[]>>({
    queryKey: ["investments-admin"],
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
              placeholder="Search investments..."
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
          const investments = data.data.data || [];
          const filteredData = investments.filter(
            (inv: Investment) =>
              inv.property?.propertyTitle
                ?.toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
              inv.user?.email
                ?.toLowerCase()
                .includes(searchQuery.toLowerCase()),
          );

          return (
            <CustomTable
              ring={false}
              columns={columns}
              data={filteredData}
              actions={actions}
            />
          );
        }}
      </PageLoader>
    </div>
  );
}
