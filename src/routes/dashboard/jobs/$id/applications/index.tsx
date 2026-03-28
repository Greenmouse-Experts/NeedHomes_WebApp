import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { FileText, ExternalLink } from "lucide-react";
import apiClient, { type ApiResponseV2 } from "@/api/simpleApi";
import PageLoader from "@/components/layout/PageLoader";
import CustomTable, { type columnType } from "@/components/tables/CustomTable";
import { usePagination } from "@/helpers/pagination";
import type { Actions } from "@/components/tables/pop-up";
import Modal, { type ModalHandle } from "@/components/modals/DialogModal";
import StatusUpdateModal, {
  type AppStatus,
} from "@/components/careers/StatusUpdateModal";
import ThemeProvider from "@/simpleComps/ThemeProvider";

export const Route = createFileRoute("/dashboard/jobs/$id/applications/")({
  component: RouteComponent,
});

interface Application {
  id: string;
  jobId: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
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
  const { id } = Route.useParams();
  const pagination = usePagination();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const detailsModalRef = useRef<ModalHandle>(null);
  const statusModalRef = useRef<ModalHandle>(null);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

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
      setSelectedApp((prev) => (prev ? { ...prev, status } : prev));
      statusModalRef.current?.close();
      toast.success(`Status updated to ${STATUS_LABEL[status]}`);
    },
    onError: () => toast.error("Failed to update status"),
  });

  const actions: Actions<Application>[] = [
    {
      key: "view_details",
      label: "View Details",
      action: (item) => {
        setSelectedApp(item);
        detailsModalRef.current?.open();
      },
    },
    {
      key: "update_status",
      label: "Update Status",
      action: (item) => {
        setSelectedApp(item);
        statusModalRef.current?.open();
      },
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
    <ThemeProvider>
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900">
              Job Applications
            </h1>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="text-sm font-semibold text-gray-700 mb-4">
              Search
            </div>
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

      {/* Application Details Modal */}
      <Modal ref={detailsModalRef} title="Application Details">
        {selectedApp && (
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Name</p>
                <p className="font-medium text-gray-800">
                  {selectedApp.user?.firstName ?? selectedApp.firstName}{" "}
                  {selectedApp.user?.lastName ?? selectedApp.lastName}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Email</p>
                <p className="font-medium text-gray-800">
                  {selectedApp.user?.email ?? selectedApp.email ?? "—"}
                </p>
              </div>
              {selectedApp.phone && (
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Phone</p>
                  <p className="font-medium text-gray-800">
                    {selectedApp.phone}
                  </p>
                </div>
              )}
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Status</p>
                <span
                  className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${STATUS_BADGE[selectedApp.status] ?? "bg-gray-100 text-gray-600"}`}
                >
                  {STATUS_LABEL[selectedApp.status] ?? selectedApp.status}
                </span>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Applied</p>
                <p className="font-medium text-gray-800">
                  {new Date(selectedApp.createdAt).toLocaleDateString("en-NG", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
              {selectedApp.resumeUrl && (
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Resume</p>
                  <a
                    href={selectedApp.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:underline"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    Download Resume
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
            {selectedApp.coverLetter && (
              <div>
                <p className="text-xs text-gray-400 mb-1">Cover Letter</p>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line bg-gray-50 rounded-lg p-3">
                  {selectedApp.coverLetter}
                </p>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Status Update Modal */}
      {selectedApp && (
        <StatusUpdateModal
          ref={statusModalRef}
          applicantName={`${selectedApp.user?.firstName ?? selectedApp.firstName ?? ""} ${selectedApp.user?.lastName ?? selectedApp.lastName ?? ""}`.trim()}
          currentStatus={selectedApp.status}
          isPending={statusMutation.isPending}
          onConfirm={(status) =>
            statusMutation.mutate({ appId: selectedApp.id, status })
          }
        />
      )}
    </ThemeProvider>
  );
}
