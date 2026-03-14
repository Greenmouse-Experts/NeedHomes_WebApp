import apiClient, { type ApiResponse } from "@/api/simpleApi";
import PageLoader from "@/components/layout/PageLoader";
import { extract_message } from "@/helpers/apihelpers";
import ThemeProvider from "@/simpleComps/ThemeProvider";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { FileText, Plus, Pencil, Trash2, Eye } from "lucide-react";

export const Route = createFileRoute("/dashboard/terms/")({
  component: RouteComponent,
});

export interface Terms {
  id: string;
  type:
    | "INVESTOR_INDIVIDUAL"
    | "INVESTOR_CORPORATE"
    | "PARTNER_REAL_ESTATE_AGENT"
    | "PARTNER_PROPERTY_DEVELOPER";
  title: string;
  content: string;
  version: string;
  createdAt: string;
  updatedAt: string;
}

export const TYPE_LABELS: Record<Terms["type"], string> = {
  INVESTOR_INDIVIDUAL: "Individual Investor",
  INVESTOR_CORPORATE: "Corporate Investor",
  PARTNER_REAL_ESTATE_AGENT: "Real Estate Agent",
  PARTNER_PROPERTY_DEVELOPER: "Property Developer",
};

const TYPE_COLORS: Record<Terms["type"], string> = {
  INVESTOR_INDIVIDUAL: "badge-info",
  INVESTOR_CORPORATE: "badge-primary",
  PARTNER_REAL_ESTATE_AGENT: "badge-success",
  PARTNER_PROPERTY_DEVELOPER: "badge-warning",
};

function RouteComponent() {
  const query = useQuery<ApiResponse<Terms[]>>({
    queryKey: ["admin-terms"],
    queryFn: async () => {
      const resp = await apiClient.get("terms");
      return resp.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (type: Terms["type"]) => {
      const resp = await apiClient.delete(`terms?type=${type}`);
      return resp.data;
    },
    onSuccess: () => {
      query.refetch();
    },
  });

  const handleDelete = (item: Terms) => {
    if (!confirm(`Delete "${item.title}"? This cannot be undone.`)) return;
    toast.promise(deleteMutation.mutateAsync(item.type), {
      loading: "Deleting...",
      success: "Terms deleted successfully",
      error: extract_message,
    });
  };

  return (
    <ThemeProvider className="p-6 bg-white shadow rounded-xl space-y-6">
      <div className="flex items-center gap-3">
        <div>
          <h2 className="font-bold text-xl">Terms & Conditions</h2>
          <p className="text-sm text-base-content/60 mt-0.5">
            Manage terms and conditions for all user types
          </p>
        </div>
        <Link
          to="/dashboard/terms/create"
          className="btn btn-primary ml-auto gap-2"
        >
          <Plus size={16} />
          Add Terms
        </Link>
      </div>

      <PageLoader query={query}>
        {(data) => {
          const terms: Terms[] = data.data || [];
          if (terms.length === 0) {
            return (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <FileText
                  size={48}
                  className="text-base-content/20 mb-4"
                />
                <h3 className="font-semibold text-base-content/60">
                  No terms added yet
                </h3>
                <p className="text-sm text-base-content/40 mt-1">
                  Create terms for investors and partners to agree to.
                </p>
                <Link
                  to="/dashboard/terms/create"
                  className="btn btn-primary mt-4 gap-2"
                >
                  <Plus size={16} />
                  Create First Terms
                </Link>
              </div>
            );
          }

          return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {terms.map((term) => (
                <div
                  key={term.id}
                  className="card ring fade hover:shadow-md transition-shadow"
                >
                  <div className="card-body gap-3">
                    <div className="flex items-start gap-3">
                      <div className="bg-primary/10 p-2 rounded-lg shrink-0">
                        <FileText size={20} className="text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span
                            className={`badge badge-sm badge-soft ${TYPE_COLORS[term.type]}`}
                          >
                            {TYPE_LABELS[term.type]}
                          </span>
                          {term.version && (
                            <span className="badge badge-sm badge-ghost">
                              v{term.version}
                            </span>
                          )}
                        </div>
                        <h3 className="font-semibold text-sm leading-snug line-clamp-2">
                          {term.title}
                        </h3>
                      </div>
                    </div>

                    <p
                      className="text-xs text-base-content/50 line-clamp-2"
                      dangerouslySetInnerHTML={{
                        __html:
                          term.content.replace(/<[^>]+>/g, " ").slice(0, 120) +
                          "…",
                      }}
                    />

                    <div className="text-xs text-base-content/40">
                      Updated {new Date(term.updatedAt).toLocaleDateString()}
                    </div>

                    <div className="flex items-center gap-2 pt-1 border-t border-base-200">
                      <Link
                        to="/dashboard/terms/view/termsId"
                        search={{ type: term.type }}
                        className="btn btn-sm btn-ghost gap-1.5 flex-1"
                      >
                        <Eye size={13} />
                        View
                      </Link>
                      <Link
                        to="/dashboard/terms/edit/$termsId"
                        params={{ termsId: term.type }}
                        className="btn btn-sm btn-ghost gap-1.5 flex-1"
                      >
                        <Pencil size={13} />
                        Edit
                      </Link>
                      <button
                        className="btn btn-sm btn-ghost text-error gap-1.5 flex-1"
                        onClick={() => handleDelete(term)}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 size={13} />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          );
        }}
      </PageLoader>
    </ThemeProvider>
  );
}
