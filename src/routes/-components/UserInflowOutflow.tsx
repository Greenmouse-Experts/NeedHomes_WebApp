import apiClient, { type ApiResponse } from "@/api/simpleApi";
import { useQuery } from "@tanstack/react-query";
import { NairaIcon } from "@/components/NairaIcon";

interface CashflowMonth {
  month: string;
  year: number;
  monthIndex: number;
  inflow: number;
  outflow: number;
}

function InflowOutflowCards({
  inflow,
  outflow,
  loading,
}: {
  inflow: number;
  outflow: number;
  loading: boolean;
}) {
  return (
    <div className="grid grid-cols-2 gap-2 md:gap-3 mb-4">
      <div className="bg-green-50 rounded-lg p-2 md:p-3 border border-green-200">
        <p className="text-xs text-gray-600 font-semibold mb-1">INCOME</p>
        <p className="text-base md:text-lg font-bold text-gray-900 flex items-center">
          {loading ? (
            <span className="loading loading-spinner loading-xs" />
          ) : (
            <>
              <NairaIcon className="w-5" /> {inflow.toLocaleString()}
            </>
          )}
        </p>
      </div>
      <div className="bg-red-50 rounded-lg p-2 md:p-3 border border-red-200">
        <p className="text-xs text-gray-600 font-semibold mb-1">WITHDRAW</p>
        <p className="text-base md:text-lg font-bold text-gray-900 flex items-center">
          {loading ? (
            <span className="loading loading-spinner loading-xs" />
          ) : (
            <>
              <NairaIcon className="w-5" /> {outflow.toLocaleString()}
            </>
          )}
        </p>
      </div>
    </div>
  );
}

export function InvestorInflowOutflow() {
  const query = useQuery<ApiResponse<CashflowMonth[]>>({
    queryKey: ["investor-cashflow"],
    queryFn: async () => {
      const resp = await apiClient.get("/analytics/investor/cashflow");
      return resp.data;
    },
  });

  const months = query.data?.data ?? [];
  const totalInflow = months.reduce((acc, m) => acc + m.inflow, 0) / 100;
  const totalOutflow = months.reduce((acc, m) => acc + m.outflow, 0) / 100;

  return (
    <InflowOutflowCards
      inflow={totalInflow}
      outflow={totalOutflow}
      loading={query.isLoading}
    />
  );
}

export function PartnerInflowOutflow() {
  const query = useQuery<ApiResponse<CashflowMonth[]>>({
    queryKey: ["partner-cashflow"],
    queryFn: async () => {
      const resp = await apiClient.get("/analytics/partner/cashflow");
      return resp.data;
    },
  });

  const months = query.data?.data ?? [];
  const totalInflow = months.reduce((acc, m) => acc + m.inflow, 0) / 100;
  const totalOutflow = months.reduce((acc, m) => acc + m.outflow, 0) / 100;

  return (
    <InflowOutflowCards
      inflow={totalInflow}
      outflow={totalOutflow}
      loading={query.isLoading}
    />
  );
}
