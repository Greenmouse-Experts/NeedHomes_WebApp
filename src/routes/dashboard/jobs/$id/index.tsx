import apiClient from "@/api/simpleApi";
import type { ApiResponse } from "@/api/simpleApi";
import BackButton from "@/components/BackButton";
import PageLoader from "@/components/layout/PageLoader";
import ThemeProvider from "@/simpleComps/ThemeProvider";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

interface JobCategory {
  id: string;
  name: string;
  type: string;
}

interface Job {
  id: string;
  title: string;
  slug: string;
  location: string;
  jobType: string;
  description: string;
  requirements: string;
  isPublished: boolean;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  category: JobCategory;
}

export const Route = createFileRoute("/dashboard/jobs/$id/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();
  const query = useQuery<ApiResponse<Job>>({
    queryKey: ["jobs-get", id],
    queryFn: async () => {
      const resp = await apiClient.get("/careers/admin/" + id);
      return resp.data;
    },
  });

  return (
    <>
      <BackButton />
      <PageLoader query={query}>
        {(resp) => {
          const job = resp.data;
          return (
            <ThemeProvider className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
              <div className="mx-auto">
                {/* Header Section */}
                <div className="bg-white rounded-lg shadow-sm p-8 mb-6 border-l-4  border-primary">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        {job.title}
                      </h1>
                      <p className="text-sm text-gray-500 font-mono bg-gray-50 inline-block px-3 py-1 rounded">
                        {job.slug}
                      </p>
                    </div>
                    <span
                      className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${
                        job.isPublished
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full mr-2 ${job.isPublished ? "bg-emerald-600" : "bg-amber-600"}`}
                      ></span>
                      {job.isPublished ? "Published" : "Draft"}
                    </span>
                  </div>
                </div>

                {/* Key Details Grid */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                      Location
                    </p>
                    <p className="text-lg font-medium text-gray-900">
                      {job.location}
                    </p>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                      Job Type
                    </p>
                    <p className="text-lg font-medium text-gray-900">
                      {job.jobType}
                    </p>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                      Category
                    </p>
                    <p className="text-lg font-medium text-gray-900">
                      {job.category.name}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {job.category.type}
                    </p>
                  </div>
                </div>

                {/* Description Section */}
                <div className="bg-white rounded-lg shadow-sm p-8 mb-6 border border-gray-200">
                  <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <span className="w-1 h-6 bg-blue-600 mr-3 rounded"></span>
                    Job Description
                  </h2>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {job.description}
                  </p>
                </div>

                {/* Requirements Section */}
                <div className="bg-white rounded-lg shadow-sm p-8 mb-6 border border-gray-200">
                  <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <span className="w-1 h-6 bg-blue-600 mr-3 rounded"></span>
                    Requirements
                  </h2>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {job.requirements}
                  </p>
                </div>

                {/* Metadata Footer */}
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <p className="text-xs text-gray-600">
                    <span className="font-semibold">Created:</span>{" "}
                    {new Date(job.createdAt).toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-600 mt-2">
                    <span className="font-semibold">Last Updated:</span>{" "}
                    {new Date(job.updatedAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </ThemeProvider>
          );
        }}
      </PageLoader>
    </>
  );
}
