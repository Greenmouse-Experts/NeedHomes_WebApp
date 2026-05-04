import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import apiClient, { type ApiResponse } from "@/api/simpleApi";
import { ChevronLeft, HelpCircle } from "lucide-react";
import { toast } from "sonner";
import { extract_message } from "@/helpers/apihelpers";
import FAQForm, { type FAQFormValues } from "./-components/FAQForm";

export const Route = createFileRoute("/dashboard/faq/$faqId")({
  component: RouteComponent,
});

interface FAQ {
  id: string;
  question: string;
  answer: string;
  order: number;
  isActive: boolean;
}

function RouteComponent() {
  const { faqId } = Route.useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const query = useQuery<ApiResponse<FAQ>>({
    queryKey: ["faq", faqId],
    queryFn: async () => {
      const resp = await apiClient.get(`faqs/${faqId}`);
      return resp.data;
    },
  });

  const form = useForm<FAQFormValues>({
    defaultValues: { question: "", answer: "", order: 0, isActive: true },
  });

  useEffect(() => {
    const faq = query.data?.data;
    if (faq) {
      form.reset({
        question: faq.question,
        answer: faq.answer,
        order: faq.order,
        isActive: faq.isActive,
      });
    }
  }, [query.data]);

  const mutation = useMutation({
    mutationFn: async (data: FAQFormValues) => {
      const resp = await apiClient.patch(`faqs/${faqId}`, data);
      return resp.data;
    },
    onSuccess: () => {
      toast.success("FAQ updated");
      queryClient.invalidateQueries({ queryKey: ["faqs-admin"] });
      queryClient.invalidateQueries({ queryKey: ["faq", faqId] });
      navigate({ to: "/dashboard/faq" });
    },
    onError: (e) => toast.error(extract_message(e)),
  });

  return (
    <div className="space-y-6 ">
      <button
        onClick={() => navigate({ to: "/dashboard/faq" })}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ChevronLeft className="w-5 h-5" />
        <span className="font-medium">Back to FAQs</span>
      </button>

      <div className="flex items-center gap-3">
        <div className="p-2 bg-orange-100 rounded-lg">
          <HelpCircle className="h-6 w-6 text-orange-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Edit FAQ</h1>
      </div>

      {query.isLoading ? (
        <div className="flex justify-center py-16">
          <span className="loading loading-spinner loading-lg text-primary" />
        </div>
      ) : (
        <FAQForm
          form={form}
          onSubmit={(data) => mutation.mutate(data)}
          isPending={mutation.isPending}
          submitLabel="Save Changes"
        />
      )}
    </div>
  );
}
