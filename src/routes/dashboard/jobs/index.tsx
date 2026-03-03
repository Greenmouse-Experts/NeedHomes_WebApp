import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import apiClient, { type ApiResponseV2 } from "@/api/simpleApi";
import PageLoader from "@/components/layout/PageLoader";
import CustomTable, { type columnType } from "@/components/tables/CustomTable";
import { usePagination } from "@/helpers/pagination";
import type { Actions } from "@/components/tables/pop-up";
import { useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/jobs/")({
  component: RouteComponent,
});

interface Job {
  id: string;
  title: string;
  category: string;
  jobType: string;
  location: string;
  createdAt: string;
}

function RouteComponent() {
  const navigate = useNavigate();
  const pagination = usePagination();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedJobType, setSelectedJobType] = useState("");

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
  const columns: columnType<Job>[] = [
    {
      key: "title",
      label: "Job Title",
    },
    {
      key: "category",
      label: "Category",
      render: (value) => {
        <>{value.name}</>;
      },
    },
    {
      key: "jobType",
      label: "Job Type",
    },
    {
      key: "location",
      label: "Location",
    },
    {
      key: "createdAt",
      label: "Created At",
      render: (value) => new Date(value).toLocaleDateString(),
    },
  ];

  const actions: Actions<Job>[] = [
    {
      key: "view",
      label: "View",
      action: (job) => {
        navigate({ to: `/dashboard/jobs/${job.id}` });
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
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <div className="container mx-auto ">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Jobs Management</h1>
          <Link to="/dashboard/jobs/create" className="btn btn-primary ">
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
                <>
                  {/*{JSON.stringify(data)}*/}
                  <CustomTable
                    data={data}
                    columns={columns}
                    actions={actions}
                    // totalCount={data?.length || 0}
                    paginationProps={pagination}
                  />
                </>
              );
            }}
          </PageLoader>
        </div>
      </div>
    </div>
  );
}
