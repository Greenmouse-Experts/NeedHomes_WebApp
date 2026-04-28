import apiClient, { type ApiResponse } from "@/api/simpleApi";
import PageLoader from "@/components/layout/PageLoader";
import CustomTable, { type columnType } from "@/components/tables/CustomTable";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

interface Investment {
  id: string;
  amountPaid: number;
  paymentOption: "OUTRIGHT" | "INSTALLMENT";
  status: "ACTIVE" | "PENDING" | "COMPLETED";
  createdAt: string;
  property: {
    id: string;
    propertyTitle: string;
    investmentModel: string;
    propertyType: string;
  };
}

const STATUS_COLORS: Record<string, string> = {
  ACTIVE: "bg-green-100 text-green-700",
  PENDING: "bg-yellow-100 text-yellow-700",
  COMPLETED: "bg-blue-100 text-blue-700",
};

const columns: columnType<Investment>[] = [
  {
    key: "createdAt",
    label: "Date",
    render: (value) =>
      new Date(value).toLocaleDateString("en-NG", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
  },
  {
    key: "property",
    label: "Property",
    render: (_, item) => (
      <div className="flex flex-col">
        <span className="font-medium text-sm">
          {item.property?.propertyTitle}
        </span>
        <span className="text-xs opacity-50">
          {item.property?.investmentModel?.replace(/_/g, " ")}
        </span>
      </div>
    ),
  },
  {
    key: "amountPaid",
    label: "Amount Paid",
    render: (value) => `₦${(value / 100).toLocaleString()}`,
  },
  {
    key: "paymentOption",
    label: "Method",
    render: (value) => (
      <span className="capitalize text-sm">{value?.toLowerCase()}</span>
    ),
  },
  {
    key: "status",
    label: "Status",
    render: (value: string) => (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[value] ?? "bg-gray-100 text-gray-700"}`}
      >
        {value}
      </span>
    ),
  },
];

export default function RecentProperties() {
  const navigate = useNavigate();

  const query = useQuery<ApiResponse<{ data: Investment[] }>>({
    queryKey: ["investments", "recent"],
    queryFn: async () => {
      const resp = await apiClient.get("investments/my-investments", {
        params: { page: 1, limit: 10 },
      });
      return resp.data;
    },
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4 md:p-6 border-b border-gray-200 flex items-center justify-between">
        <h3 className="text-base md:text-lg font-semibold text-gray-900">
          Recent Investments
        </h3>
        <Link
          to="/investors/my-investments"
          className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
        >
          View all <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
      <PageLoader query={query}>
        {(data) => {
          const investments: Investment[] =
            (data.data as any)?.data ?? data.data ?? [];
          return (
            <CustomTable
              ring={false}
              data={investments}
              columns={columns}
              onRowClick={(item) =>
                navigate({
                  to: "/investors/my-investments/$investmentId",
                  params: { investmentId: item.id },
                })
              }
            />
          );
        }}
      </PageLoader>
    </div>
  );
}
