import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import apiClient from "@/api/simpleApi";
import { ChevronLeft, HelpCircle } from "lucide-react";
import { toast } from "sonner";
import { extract_message } from "@/helpers/apihelpers";
import FAQForm, { type FAQFormValues } from "./-components/FAQForm";

export const Route = createFileRoute("/dashboard/faq/new")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const form = useForm<FAQFormValues>({
    defaultValues: { question: "", answer: "", order: 0, isActive: true },
  });

  const mutation = useMutation({
    mutationFn: async (data: FAQFormValues) => {
      const resp = await apiClient.post("faqs", data);
      return resp.data;
    },
    onSuccess: () => {
      toast.success("FAQ created");
      queryClient.invalidateQueries({ queryKey: ["faqs-admin"] });
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
        <h1 className="text-2xl font-bold text-gray-900">New FAQ</h1>
      </div>

      <FAQForm
        form={form}
        onSubmit={(data) => mutation.mutate(data)}
        isPending={mutation.isPending}
        submitLabel="Create FAQ"
      />
    </div>
  );
}
