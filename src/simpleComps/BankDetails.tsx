import { Label } from "@/components/ui/Label";
import { useForm } from "react-hook-form";
import SimpleInput from "./inputs/SimpleInput";
import LocalSelect from "./inputs/LocalSelect";
import { Button } from "@/components/ui/Button";
import ThemeProvider from "./ThemeProvider";
import { useQuery, useMutation } from "@tanstack/react-query";
import apiClient, { type ApiResponse } from "@/api/simpleApi";
import { toast } from "sonner";

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
}

interface AccountResolveResponse {
  account_name: string;
  account_number: string;
  bank_id: number;
}

export default function BankDetails() {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BankDetailsForm>();
  const accountNumber = watch("accountNumber");
  const bankCode = watch("bankCode");

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
      // Optionally set the resolved account name to a disabled input
      // setValue("accountName", data.data.account_name);
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
            {/* Account Name - This can be uncommented and made disabled to show resolved name */}
            {/* <div className="space-y-2">
              <Label htmlFor="accountName" className="text-sm">
                Account Name
              </Label>
              <SimpleInput
                id="accountName"
                className="bg-gray-100 text-sm md:text-base"
                disabled
                {...register("accountName")} // Register it even if disabled to hold value
              />
            </div> */}

            {/* Account Type */}
            {/*<div className="space-y-2">
              <Label htmlFor="accountType" className="text-sm">
                Account Type
              </Label>
              <select
                id="accountType"
                value={bankData.accountType}
                onChange={(e) => handleBankChange("accountType", e.target.value)}
                className="w-full px-3 py-2 text-sm md:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent"
              >
                <option value="">Select</option>
                <option value="savings">Savings</option>
                <option value="current">Current</option>
              </select>
            </div>*/}
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
                : "Resolve Bank Details"}
            </Button>
          </div>
        </form>
      </ThemeProvider>
    </div>
  );
}
