import type { ApiResponse } from "@/api/simpleApi";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/api/simpleApi";
import QueryCompLayout from "./layout/QueryCompLayout";
import ThemeProvider from "@/simpleComps/ThemeProvider";
import { useModal } from "@/store/modals";
import Modal from "@/components/modals/DialogModal";
import { Pencil } from "lucide-react";
import { toast } from "sonner";
import { Controller, useForm } from "react-hook-form";
import SimpleInput from "@/simpleComps/inputs/SimpleInput";
import LocalSelect from "@/simpleComps/inputs/LocalSelect";
import { extract_message } from "@/helpers/apihelpers";

interface BankDetails {
  bank_name: string;
  bank_code: string;
  account_name: string;
  account_number: string;
  masked_account: string;
}

interface BankListItem {
  name: string;
  code: string;
}

export default function AdminBankDetails({ id }: { id: string }) {
  const queryClient = useQueryClient();
  const { ref, showModal, closeModal } = useModal();

  const query = useQuery<ApiResponse<BankDetails | null>>({
    queryKey: ["admin-bank-account", id],
    queryFn: async () => {
      try {
        const response = await apiClient.get(`/admin/users/${id}/bank-account`);
        return response.data;
      } catch (e: any) {
        if (e?.response?.status === 404) {
          return { statusCode: 404, message: "No bank account", data: null } as any;
        }
        throw e;
      }
    },
  });

  const bankListQuery = useQuery<ApiResponse<BankListItem[]>>({
    queryKey: ["bank-list"],
    queryFn: async () => {
      const response = await apiClient.get("banks");
      return response.data;
    },
  });

  const form = useForm({
    defaultValues: {
      accountNumber: "",
      bankCode: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: {
      accountNumber: string;
      bankCode: string;
      bankName: string;
    }) => {
      const response = await apiClient.patch(
        `/admin/users/${id}/bank-account`,
        data,
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-bank-account", id] });
      closeModal();
    },
  });

  const accountNumber = form.watch("accountNumber");
  const bankCode = form.watch("bankCode");
  const canSubmit = accountNumber.length === 10 && bankCode.length > 0;

  const handleOpen = (bankDetails: BankDetails | null) => {
    form.reset({
      accountNumber: bankDetails?.account_number ?? "",
      bankCode: bankDetails?.bank_code ?? "",
    });
    mutation.reset();
    showModal();
  };

  const onSubmit = form.handleSubmit((data) => {
    const bankList = bankListQuery.data?.data ?? [];
    const selectedBank = bankList.find((b) => b.code === data.bankCode);
    toast.promise(
      mutation.mutateAsync({
        accountNumber: data.accountNumber,
        bankCode: data.bankCode,
        bankName: selectedBank?.name ?? "",
      }),
      {
        loading: "Verifying & saving bank account...",
        success: "Bank account updated successfully.",
        error: extract_message,
      },
    );
  });

  const bankList = bankListQuery.data?.data ?? [];

  return (
    <>
      <Modal
        ref={ref}
        title="Update Bank Account"
        actions={
          <div className="flex gap-2">
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={closeModal}
            >
              Cancel
            </button>
            <button
              type="button"
              className={`btn btn-primary btn-sm ${mutation.isPending ? "loading" : ""}`}
              disabled={!canSubmit || mutation.isPending}
              onClick={onSubmit}
            >
              {mutation.isPending ? "Verifying..." : "Verify & Save"}
            </button>
          </div>
        }
      >
        <form className="space-y-4" onSubmit={onSubmit}>
          <Controller
            name="bankCode"
            control={form.control}
            rules={{ required: "Bank is required" }}
            render={({ field, fieldState }) => (
              <div className="space-y-1">
                <LocalSelect {...field} label="Bank">
                  <option value="">Select a bank</option>
                  {bankList.map((bank) => (
                    <option key={bank.code} value={bank.code}>
                      {bank.name}
                    </option>
                  ))}
                </LocalSelect>
                {fieldState.error && (
                  <p className="text-error text-xs">
                    {fieldState.error.message}
                  </p>
                )}
              </div>
            )}
          />
          <Controller
            name="accountNumber"
            control={form.control}
            rules={{
              required: "Account number is required",
              pattern: {
                value: /^\d{10}$/,
                message: "Account number must be exactly 10 digits",
              },
            }}
            render={({ field, fieldState }) => (
              <div className="space-y-1">
                <SimpleInput
                  {...field}
                  label="Account Number"
                  placeholder="0123456789"
                  maxLength={10}
                />
                {fieldState.error && (
                  <p className="text-error text-xs">
                    {fieldState.error.message}
                  </p>
                )}
              </div>
            )}
          />
          {mutation.isError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-xs text-red-700">
                {extract_message(mutation.error as any) || "An error occurred."}
              </p>
            </div>
          )}
        </form>
      </Modal>

      <QueryCompLayout query={query}>
        {(data) => {
          const bankDetails = data.data;

          if (!bankDetails) {
            return (
              <ThemeProvider>
                <div className="p-4 border rounded-md bg-gray-50 flex items-center justify-between">
                  <p className="text-gray-500 text-sm">
                    No bank details provided.
                  </p>
                  <button
                    type="button"
                    className="btn btn-ghost btn-xs gap-1 text-primary"
                    onClick={() => handleOpen(null)}
                  >
                    <Pencil size={14} />
                    Add
                  </button>
                </div>
              </ThemeProvider>
            );
          }

          return (
            <ThemeProvider>
              <div className="overflow-hidden border border-gray-200 rounded-xl bg-white shadow-sm">
                <div className="border-b border-gray-100 bg-gray-50/50 px-4 py-3 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                    Banking Information
                  </h3>
                  <button
                    type="button"
                    className="btn btn-ghost btn-xs gap-1 text-gray-500 hover:text-primary"
                    onClick={() => handleOpen(bankDetails)}
                  >
                    <Pencil size={14} />
                    Edit
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-4 p-5">
                  <div className="space-y-1">
                    <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                      Bank Name
                    </p>
                    <p className="text-sm font-semibold text-gray-800">
                      {bankDetails.bank_name}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                      Account Name
                    </p>
                    <p className="text-sm font-semibold text-gray-800">
                      {bankDetails.account_name}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                      Account Number
                    </p>
                    <p className="text-sm font-mono font-bold text-blue-600 tracking-tight">
                      {bankDetails.account_number}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                      Masked Account
                    </p>
                    <p className="text-sm font-mono font-semibold text-gray-600 tracking-tight">
                      {bankDetails.masked_account}
                    </p>
                  </div>
                </div>
              </div>
            </ThemeProvider>
          );
        }}
      </QueryCompLayout>
    </>
  );
}
