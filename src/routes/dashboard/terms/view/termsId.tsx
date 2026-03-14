import apiClient, { type ApiResponse } from "@/api/simpleApi";
import PageLoader from "@/components/layout/PageLoader";
import ThemeProvider from "@/simpleComps/ThemeProvider";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Pencil } from "lucide-react";
import type { Terms } from "../index";
import { TYPE_LABELS } from "../index";

export const Route = createFileRoute("/dashboard/terms/view/termsId")({
  validateSearch: (search: Record<string, unknown>) => ({
    type: search.type as Terms["type"],
  }),
  component: RouteComponent,
});

function RouteComponent() {
  const { type } = Route.useSearch();

  const query = useQuery<ApiResponse<Terms>>({
    queryKey: ["admin-terms-single", type],
    queryFn: async () => {
      const resp = await apiClient.get(`terms?type=${type}`);
      return resp.data;
    },
    enabled: !!type,
  });

  return (
    <ThemeProvider className="p-6 bg-white shadow rounded-xl space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-3">
        <Link to="/dashboard/terms" className="btn btn-ghost btn-sm btn-circle">
          <ArrowLeft size={16} />
        </Link>
        <div className="flex-1">
          <h2 className="font-bold text-xl">View Terms</h2>
          <p className="text-sm text-base-content/60 mt-0.5">
            {type ? TYPE_LABELS[type] : ""}
          </p>
        </div>
        {type && (
          <Link
            to="/dashboard/terms/edit/$termsId"
            params={{ termsId: type }}
            className="btn btn-primary btn-sm gap-2"
          >
            <Pencil size={14} />
            Edit
          </Link>
        )}
      </div>

      <PageLoader query={query}>
        {(data) => {
          const term = data.data;
          return (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-base-200/50 p-4 rounded-xl">
                  <span className="text-xs font-bold uppercase opacity-50 block mb-1">
                    Document Type
                  </span>
                  <p className="text-sm font-medium">
                    {TYPE_LABELS[term.type]}
                  </p>
                </div>
                <div className="bg-base-200/50 p-4 rounded-xl">
                  <span className="text-xs font-bold uppercase opacity-50 block mb-1">
                    Version
                  </span>
                  <p className="text-sm font-medium">
                    {term.version ? `v${term.version}` : "—"}
                  </p>
                </div>
              </div>

              <div className="bg-base-200/50 p-4 rounded-xl">
                <span className="text-xs font-bold uppercase opacity-50 block mb-1">
                  Title
                </span>
                <p className="text-sm font-medium">{term.title}</p>
              </div>

              <div>
                <span className="text-xs font-bold uppercase opacity-50 block mb-2">
                  Content
                </span>
                <div
                  className="prose prose-sm max-w-none p-5 border border-base-200 rounded-xl bg-white"
                  dangerouslySetInnerHTML={{ __html: term.content }}
                />
              </div>

              <div className="flex items-center gap-4 text-xs text-base-content/40 pt-2 border-t border-base-200">
                <span>
                  Created {new Date(term.createdAt).toLocaleDateString()}
                </span>
                <span>
                  Updated {new Date(term.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          );
        }}
      </PageLoader>
    </ThemeProvider>
  );
}
