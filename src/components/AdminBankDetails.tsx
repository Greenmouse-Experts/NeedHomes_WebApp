import type { ApiResponse } from "@/api/simpleApi";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/api/simpleApi";
import QueryCompLayout from "./layout/QueryCompLayout";
import type { ADMIN_KYC_RESPONSE } from "@/types";
import ThemeProvider from "@/simpleComps/ThemeProvider";

interface BankDetails {
  id: string;
  user_id: string;
  bank_code: string;
  bank_name: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  account_name: string;
  account_number: string;
  country: string;
  currency: string;
}
export default function AdminBankDetails({ id }: { id: string }) {
  const query = useQuery<
    ApiResponse<{
      verification: ADMIN_KYC_RESPONSE;
      kycStatus: string;
      bank: BankDetails | null;
    }>
  >({
    queryKey: ["kyc-verification", id],
    queryFn: async () => {
      const response = await apiClient.get(`/admin/verifications/${id}`);
      return response.data;
    },
  });
  return (
    <>
      <QueryCompLayout query={query}>
        {(data) => {
          const bankDetails = data.data.bank;

          if (!bankDetails) {
            return (
              <div className="p-4 text-center border rounded-md bg-gray-50">
                <p className="text-gray-500">No bank details provided.</p>
              </div>
            );
          }

          return (
            <ThemeProvider>
              <div className="overflow-hidden border border-gray-200 rounded-xl bg-white shadow-sm">
                <div className="border-b border-gray-100 bg-gray-50/50 px-4 py-3">
                  <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                    Banking Information
                  </h3>
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
                      Currency & Region
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                        {bankDetails.currency}
                      </span>
                      <span className="text-sm text-gray-600 font-medium">
                        {bankDetails.country}
                      </span>
                    </div>
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
