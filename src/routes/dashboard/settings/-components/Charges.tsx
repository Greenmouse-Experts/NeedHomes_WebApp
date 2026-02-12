import apiClient, { type ApiResponse } from "@/api/simpleApi";
import QueryCompLayout from "@/components/layout/QueryCompLayout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, FormProvider, useFormContext } from "react-hook-form";
import SimpleInput from "@/simpleComps/inputs/SimpleInput";
import { Button } from "@/components/ui/Button";
import { useEffect } from "react";
import { toast } from "sonner";
import ThemeProvider from "@/simpleComps/ThemeProvider";
import { extract_message } from "@/helpers/apihelpers";

interface ChargeSettings {
  id: string;
  platformChargePercentage: number;
  partnerChargePercentage: number;
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
      <h2 className="p-4 border-b text-lg font-bold fade">Charges</h2>
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
      const resp = await apiClient.put(
        `admin/settings/charges/${data.id}`,
        data,
      );
      return resp.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["charges"] });
    },
    onError: () => {
      toast.error("Failed to update charges");
  });

  const onSubmit = (data: ChargeSettings) => {
    toast.promise(mutation.mutateAsync(data), {
      loading: "Updating charges...",
      success: "Charges updated successfully",
      error: extract_message
    });
  };
  const methods = useForm<ChargeSettings>({
    defaultValues: {
      platformChargePercentage: data?.platformChargePercentage || 0,
      partnerChargePercentage: data?.partnerChargePercentage || 0,
    },
  });
  const { register } = methods;

  return (
    <ThemeProvider>
      <FormProvider {...methods}>
        <form className="space-y-5" onSubmit={methods.handleSubmit(onSubmit)}>
          <SimpleInput
            label="Platform Charge Percentage (%)"
            type="number"
            step="0.01"
            {...register("platformChargePercentage", {
              valueAsNumber: true,
              required: "This field is required",
            })}
          />
          <SimpleInput
            label="Partner Charge Percentage (%)"
            type="number"
            step="0.01"
            {...register("partnerChargePercentage", {
              valueAsNumber: true,
              required: "This field is required",
            })}
          />
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
