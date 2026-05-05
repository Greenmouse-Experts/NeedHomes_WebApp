import apiClient, {
  type ApiResponse,
  type ApiResponseV2,
} from "@/api/simpleApi";
import CalendarWidget from "@/components/CalendarWidget";
import { useQuery } from "@tanstack/react-query";
import {
  Megaphone,
  TrendingUp,
  Wallet,
  ArrowDownLeft,
  Star,
} from "lucide-react";

interface Promotion {
  id: string;
  conversions: number;
  amountEarned: number;
}

interface WalletTransaction {
  type: "DEPOSIT" | "WITHDRAWAL" | "PROMOTION";
  status: "PENDING" | "SUCCESS" | "FAILED";
  amount: number;
}

interface WalletData {
  balance: number;
  walletTransactions: WalletTransaction[];
}

function fmt(kobo: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(kobo / 100);
}

export default function PartnerStatsCard() {
  const promotionsQuery = useQuery<ApiResponseV2<Promotion[]>>({
    queryKey: ["promotions-partner-stats"],
    queryFn: async () => {
      const resp = await apiClient.get("partners/promotions", {
        params: { limit: 1000 },
      });
      return resp.data;
    },
  });

  const walletQuery = useQuery<ApiResponse<WalletData>>({
    queryKey: ["wallet-partner-stats"],
    queryFn: async () => {
      const resp = await apiClient.get("/wallet");
      return resp.data;
    },
  });

  const promotions: Promotion[] =
    (promotionsQuery.data?.data as any)?.data ??
    promotionsQuery.data?.data ??
    [];
  const transactions = walletQuery.data?.data?.walletTransactions ?? [];

  const totalPromoted = promotions.length;
  const totalInvestments = promotions.reduce(
    (acc, p) => acc + (p.conversions ?? 0),
    0,
  );
  const totalEarned = promotions.reduce(
    (acc, p) => acc + (p.amountEarned ?? 0),
    0,
  );
  const totalWithdrawn = transactions
    .filter((t) => t.type === "WITHDRAWAL" && t.status === "SUCCESS")
    .reduce((acc, t) => acc + t.amount, 0);

  const stats = [
    {
      icon: <Megaphone className="w-6 h-6 text-white" />,
      value: promotionsQuery.isLoading ? "—" : totalPromoted.toLocaleString(),
      label: "Total Promoted Properties",
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-white" />,
      value: promotionsQuery.isLoading
        ? "—"
        : totalInvestments.toLocaleString(),
      label: "Investments on Promoted Properties",
    },
    {
      icon: <Wallet className="w-6 h-6 text-white" />,
      value: promotionsQuery.isLoading ? "—" : fmt(totalEarned),
      label: "Total Amount Earned on Promotion",
    },
    {
      icon: <ArrowDownLeft className="w-6 h-6 text-white" />,
      value: walletQuery.isLoading ? "—" : fmt(totalWithdrawn),
      label: "Total Amount Withdrawn",
    },
  ];

  return (
    <div className="flex-1">
      <div className="bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 rounded-xl md:rounded-2xl p-6 md:p-8 relative overflow-hidden shadow-lg h-full flex flex-col justify-between">
        <div className="absolute top-0 right-0 w-32 h-32 md:w-64 md:h-64 opacity-20">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <path
              fill="white"
              d="M40,-65C50,-55,55,-40,58,-25C61,-10,62,5,58,18C54,31,45,42,35,50C25,58,14,63,0,63C-14,63,-28,58,-40,50C-52,42,-62,31,-65,18C-68,5,-64,-10,-58,-25C-52,-40,-44,-55,-32,-65C-20,-75,-10,-80,0,-80C10,-80,30,-75,40,-65Z"
              transform="translate(100 100)"
            />
          </svg>
        </div>

        <div className="relative z-10 flex items-center gap-2 text-white/90 mb-6">
          <Star className="w-4 h-4" />
          <span className="text-xs md:text-sm font-medium">
            PROMOTION STATISTICS
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/30 rounded-xl flex items-center justify-center flex-shrink-0">
                  {stat.icon}
                </div>
                <div className="min-w-0">
                  <p className="text-xl md:text-2xl font-bold text-white truncate">
                    {stat.value}
                  </p>
                  <p className="text-xs md:text-sm text-white/90 font-medium leading-tight">
                    {stat.label}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
