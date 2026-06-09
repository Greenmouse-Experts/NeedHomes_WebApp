import { Label } from "@/components/ui/Label";
import { useForm } from "react-hook-form";
import SimpleInput from "./inputs/SimpleInput";
import { Button } from "@/components/ui/Button";
import { Info } from "lucide-react";
import ThemeProvider from "./ThemeProvider";
import { useQuery, useMutation } from "@tanstack/react-query";
import apiClient, { type ApiResponse } from "@/api/simpleApi";
import { toast } from "sonner";
import { useEffect, useState } from "react";
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
  accountNumber: string;
  accountName: string;
  bankCode: string;
  bankName: string;
  country: string;
}

const maskAccount = (acc: string) =>
  acc && acc.length > 4 ? `••••${acc.slice(-4)}` : acc;

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

function BankSearch({
  banks,
  value,
  onChange,
  disabled,
  isLoading,
}: {
  banks: Bank[];
  value: string;
  onChange: (code: string) => void;
  disabled?: boolean;
  isLoading?: boolean;
}) {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const selectedBank = banks.find((b) => b.code === value);
  const filtered = banks
    .filter((b) => b.name.toLowerCase().includes(search.toLowerCase()))
    .slice(0, 30);

  return (
    <div className="relative">
      <div className="input input-md input-bordered flex items-center gap-2 w-full text-sm">
        <input
          type="text"
          className="grow"
          placeholder="Search bank..."
          disabled={disabled}
          value={selectedBank ? selectedBank.name : search}
          onChange={(e) => {
            setSearch(e.target.value);
            if (value) onChange("");
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
        />
        {isLoading && (
          <span className="loading loading-spinner loading-xs text-gray-400" />
        )}
      </div>
      {open && !disabled && filtered.length > 0 && (
        <ul className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-52 overflow-y-auto">
          {filtered.map((bank) => (
            <li
              key={bank.id}
              className="px-3 py-2 text-sm hover:bg-orange-50 cursor-pointer"
              onMouseDown={() => {
                onChange(bank.code);
                setSearch("");
                setOpen(false);
              }}
            >
              {bank.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function BankDetails() {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<BankDetailsForm>();

  const [resolved, setResolved] = useState(false);

  const selectedBankCode = watch("bankCode");
  const accountNumber = watch("accountNumber");

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

  useEffect(() => {
    if (currentBankInfo?.data) {
      setValue("accountNumber", currentBankInfo.data.account_number);
      setValue("bankCode", currentBankInfo.data.bank_code);
      setValue("accountName", currentBankInfo.data.account_name);
    }
  }, [currentBankInfo, setValue]);

  // Reset resolved state when the user changes account number or bank
  useEffect(() => {
    setResolved(false);
    setValue("accountName", "");
  }, [accountNumber, selectedBankCode]);

  const previewMutation = useMutation<
    ApiResponse<AccountResolveResponse>,
    Error,
    BankDetailsForm
  >({
    mutationFn: async (data) => {
      const resp = await apiClient.post("banks/resolve/preview", {
        accountNumber: data.accountNumber,
        bankCode: data.bankCode,
      });
      return resp.data;
    },
    onSuccess: (data) => {
      setValue("accountName", data.data.accountName);
      setResolved(true);
    },
  });

  const saveMutation = useMutation<
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
  });

  const handleResolve = (data: BankDetailsForm) => {
    toast.promise(previewMutation.mutateAsync(data), {
      loading: "Looking up account...",
      success: (res) => `Found: ${res.data.accountName}`,
      error: extract_message,
    });
  };

  const handleBankSubmit = (data: BankDetailsForm) => {
    toast.promise(saveMutation.mutateAsync(data), {
      loading: "Saving bank details...",
      success: (res) =>
        `Account ${maskAccount(res.data.accountNumber)} saved — ${res.data.accountName}`,
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
        <div className="max-w-2xl space-y-4 md:space-y-6">
          {/* Step 1 — Resolve */}
          <form onSubmit={handleSubmit(handleResolve)}>
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

              {/* Bank Name — searchable */}
              <div className="space-y-2">
                <Label htmlFor="bankCode" className="text-sm">
                  Bank Name
                </Label>
                <input
                  type="hidden"
                  {...register("bankCode", { required: "Bank name is required" })}
                />
                <BankSearch
                  banks={bankList?.data ?? []}
                  value={selectedBankCode ?? ""}
                  onChange={(code) =>
                    setValue("bankCode", code, { shouldValidate: true })
                  }
                  disabled={bankExists}
                  isLoading={isLoading}
                />
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

            {/* Account Name (read-only, populated after resolve) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-4 md:mt-6">
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
                  {previewMutation.isPending && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 loading loading-ring loading-sm text-brand-orange" />
                  )}
                </div>
              </div>
            </div>

            {!bankExists && (
              <div className="mt-5">
                <Button
                  type="submit"
                  variant="outline"
                  className="border-brand-orange text-brand-orange hover:bg-orange-50 px-6 md:px-10 text-sm md:text-base w-full sm:w-auto"
                  disabled={previewMutation.isPending || bankExists}
                >
                  {previewMutation.isPending ? (
                    <>
                      <span className="loading loading-spinner loading-xs mr-2" />
                      Looking up...
                    </>
                  ) : (
                    "Resolve Account"
                  )}
                </Button>
              </div>
            )}
          </form>

          {/* Step 2 — Save (only shown after successful resolve) */}
          {resolved && !bankExists && (
            <>
              <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs">
                <Info className="w-3.5 h-3.5 mt-0.5 shrink-0 text-amber-500" />
                <p>
                  Once saved, bank details <strong>cannot be changed</strong>{" "}
                  without contacting customer support.
                </p>
              </div>

              <form onSubmit={handleSubmit(handleBankSubmit)}>
                <Button
                  type="submit"
                  className="bg-brand-orange hover:bg-brand-orange-dark text-white px-6 md:px-12 text-sm md:text-base w-full sm:w-auto"
                  disabled={saveMutation.isPending}
                >
                  {saveMutation.isPending ? (
                    <>
                      <span className="loading loading-spinner loading-xs mr-2" />
                      Saving...
                    </>
                  ) : (
                    "Save Bank Details"
                  )}
                </Button>
              </form>
            </>
          )}
        </div>
      </ThemeProvider>
    </div>
  );
}
