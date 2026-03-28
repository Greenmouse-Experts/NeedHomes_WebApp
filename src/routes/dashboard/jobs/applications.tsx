import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import apiClient, { type ApiResponseV2 } from "@/api/simpleApi";
import PageLoader from "@/components/layout/PageLoader";
import CustomTable, { type columnType } from "@/components/tables/CustomTable";
import { usePagination } from "@/helpers/pagination";
import type { Actions } from "@/components/tables/pop-up";
import StatusUpdateModal, {
  type AppStatus,
} from "@/components/careers/StatusUpdateModal";
import type { ModalHandle } from "@/components/modals/DialogModal";
import ThemeProvider from "@/simpleComps/ThemeProvider";

export const Route = createFileRoute("/dashboard/jobs/applications")({
  component: RouteComponent,
});

interface Application {
  id: string;
  jobId: string;
  coverLetter: string;
  resumeUrl: string;
  status: AppStatus;
  createdAt: string;
  updatedAt: string;
  job: {
    id: string;
    title: string;
    slug: string;
    location: string;
    jobType: string;
  };
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

const STATUS_LABEL: Record<AppStatus, string> = {
  PENDING: "Pending",
  REVIEWED: "Reviewed",
  SHORTLISTED: "Shortlisted",
  REJECTED: "Rejected",
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
    key: "job",
    label: "Job Title",
    render: (val) => (
      <div className="flex flex-col">
        <span className="font-medium text-gray-900">{val?.title}</span>
        <span className="text-xs text-gray-400">{val?.location}</span>
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
        {STATUS_LABEL[val] ?? val}
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
  const pagination = usePagination();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const statusModalRef = useRef<ModalHandle>(null);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  const params = {
    page: pagination.page,
    limit: pagination.pageSize,
    ...(search && { search }),
  };

  const query = useQuery<ApiResponseV2<Application[]>>({
    queryKey: ["admin-applications", params],
    queryFn: async () => {
      const resp = await apiClient.get("careers/admin/applications", { params });
      return resp.data;
    },
  });

  const statusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: AppStatus }) => {
      const resp = await apiClient.patch(
        `careers/admin/applications/${id}/status`,
        { status },
      );
      return resp.data;
    },
    onSuccess: (_, { status }) => {
      queryClient.invalidateQueries({ queryKey: ["admin-applications"] });
      setSelectedApp((prev) => (prev ? { ...prev, status } : prev));
      statusModalRef.current?.close();
      toast.success(`Status updated to ${STATUS_LABEL[status]}`);
    },
    onError: () => toast.error("Failed to update status"),
  });

  const actions: Actions<Application>[] = [
    {
      key: "update_status",
      label: "Update Status",
      action: (item) => {
        setSelectedApp(item);
        statusModalRef.current?.open();
      },
    },
  ];

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900">Job Applications</h1>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="text-sm font-semibold text-gray-700 mb-4">Search</div>
            <input
              type="text"
              placeholder="Search by name, email, or job title…"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                pagination.setPagination(1);
              }}
              className="input input-bordered w-full max-w-md bg-gray-50"
            />
          </div>

          <div className="bg-white rounded-lg shadow-sm">
            <PageLoader query={query} loadingText="Loading applications...">
              {(resp) => {
                const data: Application[] = resp.data?.data ?? [];
                const meta = resp.data?.meta;
                return (
                  <CustomTable
                    data={data}
                    columns={columns}
                    actions={actions}
                    totalCount={meta?.total ?? data.length}
                    paginationProps={pagination}
                  />
                );
              }}
            </PageLoader>
          </div>
        </div>
      </div>

      {selectedApp && (
        <StatusUpdateModal
          ref={statusModalRef}
          applicantName={`${selectedApp.user?.firstName ?? ""} ${selectedApp.user?.lastName ?? ""}`.trim()}
          currentStatus={selectedApp.status}
          isPending={statusMutation.isPending}
          onConfirm={(status) =>
            statusMutation.mutate({ id: selectedApp.id, status })
          }
        />
      )}
    </ThemeProvider>
  );
}
