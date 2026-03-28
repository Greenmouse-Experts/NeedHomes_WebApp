import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import apiClient, { type ApiResponseV2 } from "@/api/simpleApi";
import PageLoader from "@/components/layout/PageLoader";
import CustomTable, { type columnType } from "@/components/tables/CustomTable";
import { usePagination } from "@/helpers/pagination";
import type { Actions } from "@/components/tables/pop-up";
import ThemeProvider from "@/simpleComps/ThemeProvider";

export const Route = createFileRoute("/dashboard/jobs/$id/applications/")({
  component: RouteComponent,
});

type AppStatus = "PENDING" | "REVIEWED" | "SHORTLISTED" | "REJECTED";

interface Application {
  id: string;
  jobId: string;
  coverLetter: string;
  resumeUrl: string;
  status: AppStatus;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

const STATUS_BADGE: Record<AppStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  REVIEWED: "bg-blue-100 text-blue-700",
  SHORTLISTED: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-700",
};

const columns: columnType<Application>[] = [
  {
    key: "user",
    label: "Applicant",
    render: (val) => (
      <div className="flex flex-col">
        <span className="font-medium text-gray-900">
          {val?.firstName} {val?.lastName}
        </span>
        <span className="text-xs text-gray-400">{val?.email}</span>
      </div>
    ),
  },
  {
    key: "status",
    label: "Status",
    render: (val: AppStatus) => (
      <span
        className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${STATUS_BADGE[val] ?? "bg-gray-100 text-gray-600"}`}
      >
        {val}
      </span>
    ),
  },
  {
    key: "createdAt",
    label: "Applied Date",
    render: (val: string) => (
      <span className="text-sm text-gray-500">
        {new Date(val).toLocaleDateString("en-NG", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })}
      </span>
    ),
  },
  {
    key: "resumeUrl",
    label: "Resume",
    render: (val: string) =>
      val ? (
        <a
          href={val}
          target="_blank"
          rel="noopener noreferrer"
          download
          className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:underline"
          onClick={(e) => e.stopPropagation()}
        >
          View Resume
        </a>
      ) : (
        <span className="text-xs text-gray-400">—</span>
      ),
  },
];

function RouteComponent() {
  const { id } = Route.useParams();
  const pagination = usePagination();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");

  const params = {
    page: pagination.page,
    limit: pagination.pageSize,
  };

  const query = useQuery<ApiResponseV2<Application[]>>({
    queryKey: ["admin-job-applications", id, params],
    queryFn: async () => {
      const resp = await apiClient.get(
        `careers/admin/jobs/${id}/applications`,
        { params },
      );
      return resp.data;
    },
  });

  const statusMutation = useMutation({
    mutationFn: async ({
      appId,
      status,
    }: {
      appId: string;
      status: AppStatus;
    }) => {
      const resp = await apiClient.patch(
        `careers/admin/applications/${appId}/status`,
        { status },
      );
      return resp.data;
    },
    onSuccess: (_, { status }) => {
      queryClient.invalidateQueries({
        queryKey: ["admin-job-applications", id],
      });
      toast.success(`Status updated to ${status}`);
    },
    onError: () => toast.error("Failed to update status"),
  });

  const actions: Actions<Application>[] = [
    {
      key: "mark_reviewed",
      label: "Mark Reviewed",
      disabled: (item) => item.status === "REVIEWED",
      action: (item) =>
        statusMutation.mutate({ appId: item.id, status: "REVIEWED" }),
    },
    {
      key: "shortlist",
      label: "Shortlist",
      disabled: (item) => item.status === "SHORTLISTED",
      action: (item) =>
        statusMutation.mutate({ appId: item.id, status: "SHORTLISTED" }),
    },
    {
      key: "reject",
      label: "Reject",
      disabled: (item) => item.status === "REJECTED",
      action: (item) =>
        statusMutation.mutate({ appId: item.id, status: "REJECTED" }),
    },
    {
      key: "reset",
      label: "Reset to Pending",
      disabled: (item) => item.status === "PENDING",
      action: (item) =>
        statusMutation.mutate({ appId: item.id, status: "PENDING" }),
    },
  ];

  const allData = query.data?.data?.data ?? [];
  const filtered = search
    ? allData.filter((a) => {
        const q = search.toLowerCase();
        return (
          a.user?.firstName?.toLowerCase().includes(q) ||
          a.user?.lastName?.toLowerCase().includes(q) ||
          a.user?.email?.toLowerCase().includes(q)
        );
      })
    : allData;

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">
            Job Applications
          </h1>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="text-sm font-semibold text-gray-700 mb-4">Search</div>
          <ThemeProvider className="flex-none">
            <input
              type="text"
              placeholder="Search by name or email…"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                pagination.setPagination(1);
              }}
              className="input input-bordered w-full max-w-md bg-gray-50"
            />
          </ThemeProvider>
        </div>

        <div className="bg-white rounded-lg shadow-sm">
          <PageLoader query={query} loadingText="Loading applications...">
            {(resp) => {
              const meta = resp.data?.meta;
              return (
                <CustomTable
                  data={filtered}
                  columns={columns}
                  actions={actions}
                  totalCount={meta?.total ?? filtered.length}
                  paginationProps={pagination}
                />
              );
            }}
          </PageLoader>
        </div>
      </div>
    </div>
  );
}
