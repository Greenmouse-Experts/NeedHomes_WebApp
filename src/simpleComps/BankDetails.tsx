import { Label } from "@/components/ui/Label";
import { useForm } from "react-hook-form";
import SimpleInput from "./inputs/SimpleInput";
import LocalSelect from "./inputs/LocalSelect";
import { Button } from "@/components/ui/Button";
import { Info } from "lucide-react";
import ThemeProvider from "./ThemeProvider";
import { useQuery, useMutation } from "@tanstack/react-query";
import apiClient, { type ApiResponse } from "@/api/simpleApi";
import { toast } from "sonner";
import { useEffect } from "react";
import { extract_message } from "@/helpers/apihelpers";

interface Bank {
  id: number;
  name: string;
  slug: string;
  code: string;
  longcode: string | null;
  gateway: string | null;
  pay_with_bank: boolean;
  supports_transfer: boolean;
  available_for_direct_debit: boolean;
  active: boolean;
  country: string;
  currency: string;
  type: string;
  is_deleted: boolean;
  createdAt: string;
  updatedAt: string;
}

interface BankDetailsForm {
  accountNumber: string;
  bankCode: string;
  accountName?: string; // Added for the resolved account name
}

interface AccountResolveResponse {
  account_name: string;
  account_number: string;
  bank_id: number;
}

interface CurrentBankInfo {
  id: string;
  user_id: string;
  account_number: string;
  bank_code: string;
  bank_name: string;
  account_name: string;
  country: string;
  currency: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export default function BankDetails() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<BankDetailsForm>();

  const {
    data: bankList,
    isLoading,
    isError,
  } = useQuery<ApiResponse<Bank[]>>({
    queryKey: ["bank-list"],
    queryFn: async () => {
      const resp = await apiClient.get("banks");
      return resp.data;
    },
  });

  const { data: currentBankInfo, isLoading: isLoadingCurrentBankInfo } =
    useQuery<ApiResponse<CurrentBankInfo>>({
      queryKey: ["current-bank-info"],
      queryFn: async () => {
        const resp = await apiClient.get("banks/me");
        return resp.data;
      },
    });

  // Populate form when current bank info is loaded
  useEffect(() => {
    if (currentBankInfo?.data) {
      setValue("accountNumber", currentBankInfo.data.account_number);
      setValue("bankCode", currentBankInfo.data.bank_code);
      setValue("accountName", currentBankInfo.data.account_name);
    }
  }, [currentBankInfo, setValue]);

  const resolveBankMutation = useMutation<
    ApiResponse<AccountResolveResponse>,
    Error,
    BankDetailsForm
  >({
    mutationFn: async (data) => {
      const resp = await apiClient.post("banks/resolve", {
        accountNumber: data.accountNumber,
        bankCode: data.bankCode,
      });
      return resp.data;
    },
    onSuccess: (data) => {
      toast.success("Account resolved successfully!", {
        description: `Account Name: ${data.data.account_name}`,
      });
      setValue("accountName", data.data.account_name);
    },
    onError: (error) => {
      toast.error("Failed to resolve account", {
        description: extract_message(error as any),
      });
    },
  });

  const handleBankSubmit = async (data: BankDetailsForm) => {
    toast.promise(resolveBankMutation.mutateAsync(data), {
      loading: "Resolving bank details...",
      success: "Bank details resolved!",
      error: extract_message,
    });
  };

  if (isLoadingCurrentBankInfo) {
    return (
      <div className="flex flex-col items-center justify-center p-12 space-y-4">
        <span className="loading loading-spinner loading-lg text-brand-orange"></span>
        <p className="text-sm font-medium text-gray-500 animate-pulse">
          Loading bank information...
        </p>
      </div>
    );
  }

  const bankExists = !!currentBankInfo?.data;

  return (
    <div>
      <div className="mb-4 md:mb-6">
        <h3 className="text-xs md:text-sm font-semibold text-gray-500 uppercase mb-3 md:mb-4">
          Bank Details
        </h3>
      </div>

      {bankExists && (
        <div className="flex items-start gap-3 p-4 mb-6 rounded-lg bg-blue-50 border border-blue-200 text-blue-800 text-sm max-w-2xl">
          <Info className="w-4 h-4 mt-0.5 shrink-0 text-blue-500" />
          <p>
            Your bank details are already on file. To update them, please
            contact <strong>customer support</strong>.
          </p>
        </div>
      )}

      <ThemeProvider>
        <form onSubmit={handleSubmit(handleBankSubmit)} className="max-w-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {/* Account Number */}
            <div className="space-y-2">
              <Label htmlFor="accountNumber" className="text-sm">
                Account Number
              </Label>
              <SimpleInput
                id="accountNumber"
                placeholder="Enter Acct Number"
                className="text-sm md:text-base"
                disabled={bankExists}
                {...register("accountNumber", {
                  required: "Account number is required",
                })}
              />
              {errors.accountNumber && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.accountNumber.message}
                </p>
              )}
            </div>

            {/* Bank Name */}
            <div className="space-y-2">
              <Label htmlFor="bankCode" className="text-sm">
                Bank Name
              </Label>
              <div className="relative">
                <LocalSelect
                  id="bankCode"
                  disabled={bankExists}
                  {...register("bankCode", {
                    required: "Bank name is required",
                  })}
                >
                  <option value="">Select</option>
                  {bankList?.data &&
                    bankList.data.map((bank) => (
                      <option key={bank.id} value={bank.code}>
                        {bank.name}
                      </option>
                    ))}
                </LocalSelect>
                {isLoading && (
                  <span className="absolute right-8 top-1/2 -translate-y-1/2 loading loading-spinner loading-xs text-gray-400"></span>
                )}
              </div>
              {isError && (
                <p className="text-red-500 text-xs">Error loading banks</p>
              )}
              {errors.bankCode && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.bankCode.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-4 md:mt-6">
            {/* Account Name */}
            <div className="space-y-2">
              <Label htmlFor="accountName" className="text-sm">
                Account Name
              </Label>
              <div className="relative">
                <SimpleInput
                  id="accountName"
                  className="bg-gray-100 text-sm md:text-base"
                  disabled
                  {...register("accountName")}
                />
                {resolveBankMutation.isPending && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 loading loading-ring loading-sm text-brand-orange"></span>
                )}
              </div>
            </div>
          </div>

          {!bankExists && (
            <div className="flex items-start gap-2 mt-5 p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs max-w-2xl">
              <Info className="w-3.5 h-3.5 mt-0.5 shrink-0 text-amber-500" />
              <p>
                Once saved, bank details <strong>cannot be changed</strong>{" "}
                without contacting customer support.
              </p>
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-4 md:pt-6">
            <Button
              type="submit"
              className="bg-brand-orange hover:bg-brand-orange-dark text-white px-6 md:px-12 text-sm md:text-base w-full sm:w-auto"
              disabled={resolveBankMutation.isPending || bankExists}
            >
              {resolveBankMutation.isPending ? (
                <>
                  <span className="loading loading-spinner loading-xs mr-2"></span>
                  Resolving...
                </>
              ) : (
                "Update Bank Details"
              )}
            </Button>
          </div>
        </form>
      </ThemeProvider>
    </div>
  );
}
