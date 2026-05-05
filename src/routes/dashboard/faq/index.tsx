import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient, { type ApiResponse } from "@/api/simpleApi";
import { Plus, Pencil, Trash2, Eye, EyeOff, HelpCircle } from "lucide-react";
import { toast } from "sonner";
import { extract_message } from "@/helpers/apihelpers";
import RenderFormattedText from "@/components/RenderFormattedText";

export const Route = createFileRoute("/dashboard/faq/")({
  component: RouteComponent,
});

interface FAQ {
  id: string;
  question: string;
  answer: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

function RouteComponent() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const query = useQuery<ApiResponse<FAQ[]>>({
    queryKey: ["faqs-admin"],
    queryFn: async () => {
      const resp = await apiClient.get("faqs?all=true");
      return resp.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const resp = await apiClient.delete(`faqs/${id}`);
      return resp.data;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["faqs-admin"] }),
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const resp = await apiClient.patch(`faqs/${id}`, { isActive });
      return resp.data;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["faqs-admin"] }),
  });

  const faqs: FAQ[] = (query.data?.data as any) ?? [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-100 rounded-lg">
            <HelpCircle className="h-6 w-6 text-orange-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">FAQ Management</h1>
            <p className="text-sm text-gray-500">
              Manage frequently asked questions
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate({ to: "/dashboard/faq/new" })}
          className="btn btn-primary gap-2"
        >
          <Plus size={18} /> New FAQ
        </button>
      </div>

      {/* List */}
      {query.isLoading ? (
        <div className="flex justify-center py-16">
          <span className="loading loading-spinner loading-lg text-primary" />
        </div>
      ) : faqs.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 flex flex-col items-center justify-center py-16 gap-3 text-gray-400">
          <HelpCircle size={40} />
          <p className="text-sm">No FAQs yet. Create your first one.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {faqs
            .slice()
            .sort((a, b) => a.order - b.order)
            .map((faq) => (
              <div
                key={faq.id}
                className={`bg-white rounded-xl border p-5 transition-all ${
                  faq.isActive
                    ? "border-gray-200"
                    : "border-gray-100 opacity-60"
                }`}
              >
                <div className="flex items-start gap-4">
                  <span className="min-w-[28px] h-7 flex items-center justify-center rounded-full bg-orange-100 text-orange-700 text-xs font-bold mt-0.5">
                    {faq.order + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 mb-1">
                      {faq.question}
                    </p>
                    <RenderFormattedText
                      text={faq.answer}
                    ></RenderFormattedText>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        faq.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {faq.isActive ? "Active" : "Hidden"}
                    </span>
                    <button
                      className="btn btn-ghost btn-sm btn-square"
                      title={faq.isActive ? "Hide" : "Show"}
                      onClick={() =>
                        toast.promise(
                          toggleMutation.mutateAsync({
                            id: faq.id,
                            isActive: !faq.isActive,
                          }),
                          {
                            loading: faq.isActive ? "Hiding..." : "Showing...",
                            success: faq.isActive
                              ? "FAQ hidden"
                              : "FAQ visible",
                            error: extract_message,
                          },
                        )
                      }
                    >
                      {faq.isActive ? (
                        <EyeOff size={15} className="text-gray-500" />
                      ) : (
                        <Eye size={15} className="text-gray-500" />
                      )}
                    </button>
                    <button
                      className="btn btn-ghost btn-sm btn-square"
                      onClick={() =>
                        navigate({
                          to: "/dashboard/faq/$faqId",
                          params: { faqId: faq.id },
                        })
                      }
                    >
                      <Pencil size={15} className="text-blue-500" />
                    </button>
                    <button
                      className="btn btn-ghost btn-sm btn-square"
                      onClick={() => {
                        if (confirm("Delete this FAQ?"))
                          toast.promise(deleteMutation.mutateAsync(faq.id), {
                            loading: "Deleting...",
                            success: "FAQ deleted",
                            error: extract_message,
                          });
                      }}
                    >
                      <Trash2 size={15} className="text-red-500" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
