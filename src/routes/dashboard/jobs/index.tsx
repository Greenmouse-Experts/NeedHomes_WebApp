import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { toast } from "sonner";
import apiClient, { type ApiResponseV2 } from "@/api/simpleApi";
import PageLoader from "@/components/layout/PageLoader";
import CustomTable, { type columnType } from "@/components/tables/CustomTable";
import { usePagination } from "@/helpers/pagination";
import type { Actions } from "@/components/tables/pop-up";
import Modal, { type ModalHandle } from "@/components/modals/DialogModal";
import ThemeProvider from "@/simpleComps/ThemeProvider";

export const Route = createFileRoute("/dashboard/jobs/")({
  component: RouteComponent,
});

interface Job {
  id: string;
  title: string;
  category: string;
  jobType: string;
  location: string;
  isPublished: boolean;
  createdAt: string;
  description?: string;
  requirements?: string;
}

const JOB_TYPE_LABELS: Record<string, string> = {
  FULL_TIME: "Full-time",
  PART_TIME: "Part-time",
  CONTRACT: "Contract",
  REMOTE: "Remote",
  HYBRID: "Hybrid",
};

function RouteComponent() {
  const navigate = useNavigate();
  const pagination = usePagination();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedJobType, setSelectedJobType] = useState("");
  const detailsModalRef = useRef<ModalHandle>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const query = useQuery<ApiResponseV2<Job[]>>({
    queryKey: [
      "jobs",
      pagination.page,
      pagination.pageSize,
      searchQuery,
      selectedCategory,
      selectedJobType,
    ],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponseV2<Job[]>>(
        "/careers/admin/all",
        {
          params: {
            page: pagination.page,
            limit: pagination.pageSize,
            search: searchQuery || undefined,
            categoryId: selectedCategory || undefined,
            jobType: selectedJobType || undefined,
          },
        },
      );
      return response.data;
    },
  });

  const { refetch } = query;

  const publishMutation = useMutation({
    mutationFn: async ({
      id,
      isPublished,
    }: {
      id: string;
      isPublished: boolean;
    }) => {
      const resp = await apiClient.patch(`/careers/${id}/publish`, {
        isPublished,
      });
      return resp.data;
    },
    onSuccess: (_, variables) => {
      refetch();
      toast.success(variables.isPublished ? "Job published" : "Job unpublished");
    },
    onError: () => {
      toast.error("Failed to update publish status");
    },
  });

  const columns: columnType<Job>[] = [
    { key: "title", label: "Job Title" },
    {
      key: "category",
      label: "Category",
      render: (value) => <>{value["name"]}</>,
    },
    {
      key: "jobType",
      label: "Job Type",
      render: (value) => <>{JOB_TYPE_LABELS[value] ?? value}</>,
    },
    { key: "location", label: "Location" },
    {
      key: "isPublished",
      label: "Status",
      render: (value) => (
        <span
          className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
            value ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"
          }`}
        >
          {value ? "Published" : "Draft"}
        </span>
      ),
    },
    {
      key: "createdAt",
      label: "Created At",
      render: (value) => new Date(value).toLocaleDateString(),
    },
  ];

  const actions: Actions<Job>[] = [
    {
      key: "view_details",
      label: "View Details",
      action: (job) => {
        setSelectedJob(job);
        detailsModalRef.current?.open();
      },
    },
    {
      key: "view_applications",
      label: "View Applications",
      action: (job) => {
        navigate({ to: `/dashboard/jobs/${job.id}/applications/` });
      },
    },
    {
      key: "edit",
      label: "Edit",
      action: (job) => {
        navigate({ to: `/dashboard/jobs/${job.id}/edit` });
      },
    },
    {
      key: "toggle_publish",
      label: "Toggle Publish",
      render: (job) => <>{job.isPublished ? "Unpublish" : "Publish"}</>,
      action: (job) => {
        publishMutation.mutate({ id: job.id, isPublished: !job.isPublished });
      },
    },
    {
      key: "delete",
      label: "Delete",
      action: async (job) => {
        if (confirm("Are you sure you want to delete this job?")) {
          try {
            await apiClient.delete(`/careers/admin/${job.id}`);
            refetch();
          } catch (err) {
            console.error("Failed to delete job:", err);
          }
        }
      },
    },
  ];

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900">
              Jobs Management
            </h1>
            <Link to="/dashboard/jobs/create" className="btn btn-primary">
              + Add New Job
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="text-sm font-semibold text-gray-700 mb-4">
              Filter & Search
            </div>
            <div className="flex gap-4 flex-wrap">
              <input
                type="text"
                placeholder="Search jobs..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  pagination.setPagination(1);
                }}
                className="input input-bordered flex-1 min-w-50 bg-gray-50"
              />
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  pagination.setPagination(1);
                }}
                className="select select-bordered bg-gray-50"
              >
                <option value="">All Categories</option>
              </select>
              <select
                value={selectedJobType}
                onChange={(e) => {
                  setSelectedJobType(e.target.value);
                  pagination.setPagination(1);
                }}
                className="select select-bordered bg-gray-50"
              >
                <option value="">All Types</option>
                <option value="FULL_TIME">Full Time</option>
                <option value="PART_TIME">Part Time</option>
                <option value="CONTRACT">Contract</option>
                <option value="REMOTE">Remote</option>
                <option value="HYBRID">Hybrid</option>
              </select>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm">
            <PageLoader query={query} loadingText="Loading jobs...">
              {(resp) => {
                const data = resp.data.data;
                return (
                  <CustomTable
                    data={data}
                    columns={columns}
                    actions={actions}
                    paginationProps={pagination}
                  />
                );
              }}
            </PageLoader>
          </div>
        </div>
      </div>

      {/* Job Details Modal */}
      <Modal ref={detailsModalRef} title="Job Details">
        {selectedJob && (
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Title</p>
                <p className="font-medium text-gray-800">{selectedJob.title}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Category</p>
                <p className="font-medium text-gray-800">
                  {(selectedJob.category as any)?.name ?? "—"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Job Type</p>
                <p className="font-medium text-gray-800">
                  {JOB_TYPE_LABELS[selectedJob.jobType] ?? selectedJob.jobType}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Location</p>
                <p className="font-medium text-gray-800">
                  {selectedJob.location || "—"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Status</p>
                <span
                  className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    selectedJob.isPublished
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {selectedJob.isPublished ? "Published" : "Draft"}
                </span>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Created</p>
                <p className="font-medium text-gray-800">
                  {new Date(selectedJob.createdAt).toLocaleDateString("en-NG", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
            {selectedJob.description && (
              <div>
                <p className="text-xs text-gray-400 mb-1">Description</p>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {selectedJob.description}
                </p>
              </div>
            )}
            {selectedJob.requirements && (
              <div>
                <p className="text-xs text-gray-400 mb-1">Requirements</p>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {selectedJob.requirements}
                </p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </ThemeProvider>
  );
}
