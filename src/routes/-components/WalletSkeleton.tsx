import { Button } from "@/components/ui/Button";

export default function WalletSkeleton() {
  return (
    <div>
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
    </div>
  );
}
