import apiClient, { type ApiResponse } from "@/api/simpleApi";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/store/authStore";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";

export default function UserWallet() {
  const [auth] = useAuth();
  const userID = auth?.user?.id;
  const query = useQuery<ApiResponse>({
    queryKey: ["wallet", userID],
    queryFn: async () => {
      let resp = await apiClient.get("/wallet");
      return resp.data;
    },
    retry: 1,
  });
  //@ts-ignore
  //
  const load = true;
  if (load) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 md:p-6 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-base md:text-lg font-semibold text-gray-900">
            Wallet
          </h3>
          {/*{JSON.stringify(error_status)}*/}
          <button className="text-xs md:text-sm text-gray-500 hover:text-gray-700 font-medium">
            Monthly ▼
          </button>
        </div>

        {/* Balance */}
        <div className=" skeleton p-4 md:p-6 bg-gradient-to-br from-gray-700 to-gray-900 text-white">
          <p className="text-xs text-gray-300 font-semibold mb-2 tracking-wide">
            TOTAL BALANCE
          </p>
          <div className="flex items-center justify-between">
            <p className="text-2xl md:text-3xl font-bold">Loading</p>
            <button className="w-8 h-8 md:w-10 md:h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
              <svg
                className="w-4 h-4 md:w-5 md:h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Income/Withdraw */}
        <div className="p-4 md:p-6 ">
          <div className="grid grid-cols-2 gap-2 md:gap-3 mb-4">
            <div className="bg-green-50 skeleton rounded-lg p-2 md:p-3 border border-green-200">
              <p className="text-xs text-gray-600 font-semibold mb-1">INCOME</p>
              <p className="text-base md:text-lg font-bold text-gray-900">
                Loading
              </p>
            </div>
            <div className="bg-red-50 rounded-lg skeleton p-2 md:p-3 border border-red-200">
              <p className="text-xs text-gray-600 font-semibold mb-1">
                WITHDRAW
              </p>
              <p className="text-base md:text-lg font-bold text-gray-900">
                Loading
              </p>
            </div>
          </div>

          <div className="space-y-2 md:space-y-3">
            <Button
              disabled
              variant="outline"
              className="w-full text-sm md:text-base"
            >
              Deposit
            </Button>
            <Button
              disabled
              className="w-full bg-[var(--color-orange)] hover:bg-[var(--color-orange-dark)] text-white text-sm md:text-base"
            >
              Withdraw
            </Button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="p-4 md:p-6 border-t border-gray-200">
          <h4 className="text-xs font-semibold text-gray-600 mb-3 uppercase tracking-wide">
            Recent
          </h4>
          <div className="p-4 ring fade rounded-box py-8 skeleton"></div>
        </div>
      </div>
    );
  }
  const error = query.error as AxiosError<ApiResponse>;
  const error_status = error?.status == 404;
  // console.log(error);
  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 md:p-6 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-base md:text-lg font-semibold text-gray-900">
            Wallet
          </h3>
          {/*{JSON.stringify(error_status)}*/}
          <button className="text-xs md:text-sm text-gray-500 hover:text-gray-700 font-medium">
            Monthly ▼
          </button>
        </div>

        {/* Balance */}
        <div className="p-4 md:p-6 bg-gradient-to-br from-gray-700 to-gray-900 text-white">
          <p className="text-xs text-gray-300 font-semibold mb-2 tracking-wide">
            TOTAL BALANCE
          </p>
          <div className="flex items-center justify-between">
            <p className="text-2xl md:text-3xl font-bold">N 120,000</p>
            <button className="w-8 h-8 md:w-10 md:h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
              <svg
                className="w-4 h-4 md:w-5 md:h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Income/Withdraw */}
        <div className="p-4 md:p-6">
          <div className="grid grid-cols-2 gap-2 md:gap-3 mb-4">
            <div className="bg-green-50 rounded-lg p-2 md:p-3 border border-green-200">
              <p className="text-xs text-gray-600 font-semibold mb-1">INCOME</p>
              <p className="text-base md:text-lg font-bold text-gray-900">
                N {error_status ? 0 : 200000}
              </p>
            </div>
            <div className="bg-red-50 rounded-lg p-2 md:p-3 border border-red-200">
              <p className="text-xs text-gray-600 font-semibold mb-1">
                WITHDRAW
              </p>
              <p className="text-base md:text-lg font-bold text-gray-900">
                N 20,000
              </p>
            </div>
          </div>

          <div className="space-y-2 md:space-y-3">
            <Button variant="outline" className="w-full text-sm md:text-base">
              Deposit
            </Button>
            <Button className="w-full bg-[var(--color-orange)] hover:bg-[var(--color-orange-dark)] text-white text-sm md:text-base">
              Withdraw
            </Button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="p-4 md:p-6 border-t border-gray-200">
          <h4 className="text-xs font-semibold text-gray-600 mb-3 uppercase tracking-wide">
            Recent
          </h4>
          <div className="flex items-start gap-2 md:gap-3 p-2 md:p-3 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-green-100 rounded-full flex items-center justify-center shrink-0">
              <svg
                className="w-6 h-6 md:w-7 md:h-7 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs md:text-sm font-medium text-gray-900">
                Payment for Vendor reg
              </p>
              <p className="text-xs text-gray-500 mt-1">01-02-25</p>
            </div>
            <div className="text-right">
              <p className="text-xs md:text-sm font-semibold text-gray-900">
                + N 200,000
              </p>
              <p className="text-xs text-green-600 font-medium mt-1">
                Successful
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
