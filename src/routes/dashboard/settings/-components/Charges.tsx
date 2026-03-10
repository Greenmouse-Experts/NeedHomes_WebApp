import apiClient, { type ApiResponse } from "@/api/simpleApi";
import QueryCompLayout from "@/components/layout/QueryCompLayout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, FormProvider } from "react-hook-form";
import SimpleInput from "@/simpleComps/inputs/SimpleInput";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";
import ThemeProvider from "@/simpleComps/ThemeProvider";
import { extract_message } from "@/helpers/apihelpers";

interface ChargeSettings {
  id: string;
  agentCommissionType: "percentage" | "fixed";
  agentCommissionValue: number;
  createdAt: string;
  updatedAt: string;
}

export default function Charges() {
  const query = useQuery<ApiResponse<ChargeSettings>>({
    queryKey: ["charges"],
    queryFn: async () => {
      let resp = await apiClient.get("admin/settings/charges");
      return resp.data;
    },
  });

  return (
    <ThemeProvider className="ring fade rounded-box">
      <h2 className="p-4 border-b text-lg font-bold fade">Charges & Commission</h2>
      <div className="p-4">
        <QueryCompLayout query={query}>
          {(data) => <FormData data={data.data} />}
        </QueryCompLayout>
      </div>
    </ThemeProvider>
  );
}

const FormData = ({ data }: { data?: ChargeSettings }) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (data: ChargeSettings) => {
      const resp = await apiClient.put(`admin/settings/charges/`, data);
      return resp.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["charges"] });
    },
    onError: () => {
      toast.error("Failed to update charges");
    },
  });
  const onSubmit = (data: ChargeSettings) => {
    toast.promise(mutation.mutateAsync(data), {
      loading: "Updating charges...",
      success: "Charges updated successfully",
      error: extract_message,
    });
  };
  const methods = useForm<ChargeSettings>({
    defaultValues: {
      agentCommissionType: data?.agentCommissionType || "percentage",
      agentCommissionValue: data?.agentCommissionValue || 0,
    },
  });
  const { register, watch } = methods;
  const commissionType = watch("agentCommissionType");

  return (
    <ThemeProvider>
      <FormProvider {...methods}>
        <form className="space-y-5" onSubmit={methods.handleSubmit(onSubmit)}>
          <div className="space-y-3">
            <h3 className="font-semibold text-sm">Agent Commission Fee</h3>
            <p className="text-xs text-base-content/60">
              Applied when a Partner Agent promotes and facilitates the sale of a property.
              Automatically calculated upon transaction completion.
            </p>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  className="radio radio-sm"
                  value="percentage"
                  {...register("agentCommissionType")}
                />
                <span className="text-sm">Percentage (%)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  className="radio radio-sm"
                  value="fixed"
                  {...register("agentCommissionType")}
                />
                <span className="text-sm">Fixed Amount</span>
              </label>
            </div>
            <SimpleInput
              label={commissionType === "percentage" ? "Commission Rate (%)" : "Commission Amount"}
              type="number"
              step="0.01"
              min="0"
              {...register("agentCommissionValue", {
                valueAsNumber: true,
                required: "This field is required",
                min: { value: 0, message: "Value must be non-negative" },
              })}
            />
          </div>
          <div className="flex justify-end">
            <Button
              type="submit"
              variant="primary"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "Saving..." : "Update Charges"}
            </Button>
          </div>
        </form>
      </FormProvider>
    </ThemeProvider>
  );
};
