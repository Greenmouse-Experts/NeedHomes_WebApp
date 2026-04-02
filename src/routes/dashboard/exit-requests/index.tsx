import apiClient, { type ApiResponseV2 } from "@/api/simpleApi";
import PageLoader from "@/components/layout/PageLoader";
import CustomTable, { type columnType } from "@/components/tables/CustomTable";
import type { Actions } from "@/components/tables/pop-up";
import { Input } from "@/components/ui/Input";
import { usePagination } from "@/helpers/pagination";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/dashboard/exit-requests/")({
  component: RouteComponent,
});

type ExitStatus = "PENDING" | "APPROVED" | "REJECTED";

interface ExitRequest {
  id: string;
  investmentId: string;
  userId: string;
  status: ExitStatus;
  reason: string | null;
  adminNote: string | null;
  exitAmount: number | null;
  requestedAt: string;
  processedAt: string | null;
  createdAt: string;
  updatedAt: string;
  investment: {
    id: string;
    amountPaid: number;
    currentValue: number;
    status: string;
    property: {
      id: string;
      propertyTitle: string;
      investmentModel: string;
    };
  };
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

const statusBadge = (status: ExitStatus) => (
  <span
    className={`badge badge-sm badge-soft font-bold ${
      status === "APPROVED"
        ? "badge-success"
        : status === "PENDING"
          ? "badge-warning"
          : "badge-error"
    }`}
  >
    {status}
  </span>
);

const columns: columnType<ExitRequest>[] = [
  {
    key: "user",
    label: "Investor",
    render: (_, item) => (
      <div className="flex flex-col">
        <span className="font-medium">
          {item.user.firstName} {item.user.lastName}
        </span>
        <span className="text-xs opacity-60">{item.user.email}</span>
      </div>
    ),
  },
  {
    key: "investment",
    label: "Property",
    render: (_, item) => (
      <div className="flex flex-col">
        <span className="font-medium">
          {item.investment?.property?.propertyTitle}
        </span>
        <span className="text-xs opacity-60">
          {item.investment?.property?.investmentModel?.replace(/_/g, " ")}
        </span>
      </div>
    ),
  },
  {
    key: "investment",
    label: "Amount Paid",
    render: (_, item) => (
      <span className="font-semibold">
        {new Intl.NumberFormat("en-NG", {
          style: "currency",
          currency: "NGN",
          maximumFractionDigits: 0,
        }).format((item.investment?.amountPaid ?? 0) / 100)}
      </span>
    ),
  },
  {
    key: "exitAmount",
    label: "Exit Amount",
    render: (value) =>
      value ? (
        <span className="font-semibold text-success">
          {new Intl.NumberFormat("en-NG", {
            style: "currency",
            currency: "NGN",
            maximumFractionDigits: 0,
          }).format(value / 100)}
        </span>
      ) : (
        <span className="text-base-content/40">—</span>
      ),
  },
  {
    key: "status",
    label: "Status",
    render: (value) => statusBadge(value),
  },
  {
    key: "requestedAt",
    label: "Requested",
    render: (value) => new Date(value).toLocaleDateString(),
  },
];

function RouteComponent() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const props = usePagination();

  const query = useQuery<ApiResponseV2<ExitRequest[]>>({
    queryKey: ["exit-requests-admin", props.page],
    queryFn: async () => {
      const resp = await apiClient.get("/investments/admin/exit-requests", {
        params: { page: props.page, limit: 20, search: search || undefined },
      });
      return resp.data;
    },
  });

  const actions: Actions[] = [
    {
      key: "view",
      label: "View Details",
      action: (item, nav) => {
        nav({ to: `/dashboard/exit-requests/${item.id}` });
      },
    },
  ];

  return (
    <div className="bg-base-100 rounded-xl ring fade overflow-hidden">
      <div className="flex items-center justify-between p-6 border-b border-base-200">
        <div>
          <h1 className="text-xl font-bold">Exit Requests</h1>
          <p className="text-base-content/60 text-sm mt-0.5">
            Review and process investor investment exit requests.
          </p>
        </div>
      </div>

      <div className="p-4 border-b border-base-200">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/40" />
          <Input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <PageLoader query={query}>
        {(data) => {
          const list = data.data.data ?? [];
          return (
            <CustomTable
              ring={false}
              columns={columns}
              data={list}
              actions={actions}
              paginationProps={props}
              onRowClick={(item) =>
                navigate({ to: `/dashboard/exit-requests/${item.id}` })
              }
            />
          );
        }}
      </PageLoader>
    </div>
  );
}
