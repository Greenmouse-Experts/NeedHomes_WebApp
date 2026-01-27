import { Label } from "@/components/ui/Label";
import { useForm } from "react-hook-form";
import SimpleInput from "./inputs/SimpleInput";
import LocalSelect from "./inputs/LocalSelect";
import { Button } from "@/components/ui/Button";
import ThemeProvider from "./ThemeProvider";
import { useQuery, useMutation } from "@tanstack/react-query";
import apiClient, { type ApiResponse } from "@/api/simpleApi";
import { toast } from "sonner";
import { useEffect } from "react";

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
        description:
          error.message || "Please check the account number and bank.",
      });
    },
  });

  const handleBankSubmit = async (data: BankDetailsForm) => {
    toast.promise(resolveBankMutation.mutateAsync(data), {
      loading: "Resolving bank details...",
      success: "Bank details resolved!",
      error: (err) => `Failed to resolve: ${err.message}`,
    });
  };

  if (isLoadingCurrentBankInfo) {
    return (
      <div className="p-4 text-sm text-gray-500">
        Loading bank information...
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 md:mb-6">
        <h3 className="text-xs md:text-sm font-semibold text-gray-500 uppercase mb-3 md:mb-4">
          Bank Details
        </h3>
      </div>

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
              <LocalSelect
                id="bankCode"
                {...register("bankCode", { required: "Bank name is required" })}
              >
                <option value="">Select</option>
                {isLoading && <option>Loading banks...</option>}
                {isError && <option>Error loading banks</option>}
                {bankList?.data &&
                  bankList.data.map((bank) => (
                    <option key={bank.id} value={bank.code}>
                      {bank.name}
                    </option>
                  ))}
              </LocalSelect>
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
              <SimpleInput
                id="accountName"
                className="bg-gray-100 text-sm md:text-base"
                disabled
                {...register("accountName")}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4 md:pt-6">
            <Button
              type="submit"
              className="bg-brand-orange hover:bg-brand-orange-dark text-white px-6 md:px-12 text-sm md:text-base w-full sm:w-auto"
              disabled={resolveBankMutation.isPending}
            >
              {resolveBankMutation.isPending
                ? "Resolving..."
                : "Update Bank Details"}
            </Button>
          </div>
        </form>
      </ThemeProvider>
    </div>
  );
}
