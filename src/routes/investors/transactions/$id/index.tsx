import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Check,
  ChevronLeft,
  Copy,
  Hash,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import apiClient, { type ApiResponse } from "@/api/simpleApi";
import PageLoader from "@/components/layout/PageLoader";
import { Button } from "@/components/ui/Button";

export const Route = createFileRoute("/investors/transactions/$id/")({
  component: RouteComponent,
});

interface Transaction {
  id: string;
  walletId: string;
  amount: number;
  type: "INVESTMENT" | "DEPOSIT" | "WITHDRAWAL";
  status: "SUCCESS" | "PENDING" | "FAILED";
  reference: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      className="p-1.5 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
      title="Copy to clipboard"
    >
      {copied ? (
        <Check className="w-3.5 h-3.5 text-green-500" />
      ) : (
        <Copy className="w-3.5 h-3.5" />
      )}
    </button>
  );
}

const typeConfig = {
  DEPOSIT: {
    label: "Deposit",
    icon: <ArrowDownLeft className="h-6 w-6 text-green-600" />,
    gradient: "from-green-400 via-emerald-500 to-teal-500",
  },
  INVESTMENT: {
    label: "Investment",
    icon: <TrendingUp className="h-6 w-6 text-blue-600" />,
    gradient: "from-blue-400 via-indigo-500 to-violet-500",
  },
  WITHDRAWAL: {
    label: "Withdrawal",
    icon: <ArrowUpRight className="h-6 w-6 text-orange-600" />,
    gradient: "from-orange-400 via-amber-500 to-yellow-400",
  },
} as const;

const statusConfig = {
  SUCCESS: { badge: "bg-green-100 text-green-700", dot: "bg-green-500" },
  PENDING: { badge: "bg-yellow-100 text-yellow-700", dot: "bg-yellow-500" },
  FAILED: { badge: "bg-red-100 text-red-700", dot: "bg-red-500" },
} as const;

function RouteComponent() {
  const { id } = Route.useParams();
  const navigate = useNavigate();

  const query = useQuery<ApiResponse<Transaction>>({
    queryKey: ["transaction", id],
    queryFn: async () => {
      const resp = await apiClient.get(`wallet-trx/${id}`);
      return resp.data;
    },
  });

  const formatCurrency = (amount: number) =>
    `₦${(amount / 100).toLocaleString("en-NG", { minimumFractionDigits: 2 })}`;

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="space-y-8">
      <Button
        onClick={() => navigate({ to: "/investors/transactions/" })}
        variant="outline"
        leftIcon={<ChevronLeft className="w-5 h-5" />}
      >
        Back to Transactions
      </Button>

      <PageLoader query={query}>
        {(data) => {
          const trx = data.data as Transaction;
          const type = typeConfig[trx.type] ?? typeConfig.DEPOSIT;
          const statusStyle = statusConfig[trx.status] ?? statusConfig.PENDING;

          return (
            <div className="space-y-8">
              {/* ── Hero ── */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className={`h-1.5 bg-gradient-to-r ${type.gradient}`} />
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2.5 bg-gray-100 rounded-xl shrink-0">
                          {type.icon}
                        </div>
                        <div>
                          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
                            {type.label} Transaction
                          </h1>
                          <div className="flex items-center gap-2 mt-1">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusStyle.badge}`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                              {trx.status}
                            </span>
                            <span className="text-xs text-gray-400 font-medium bg-gray-100 px-2 py-0.5 rounded-full">
                              {trx.type}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Reference */}
                      <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 flex items-center gap-3 max-w-md">
                        <Hash className="w-4 h-4 text-gray-400 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-0.5">
                            Reference
                          </p>
                          <p className="font-mono text-sm text-gray-800 font-semibold truncate">
                            {trx.reference}
                          </p>
                        </div>
                        <CopyButton text={trx.reference} />
                      </div>
                    </div>

                    {/* Amount callout */}
                    <div className="shrink-0 bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-100 rounded-xl px-6 py-4 text-center md:text-right">
                      <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-1">
                        Amount
                      </p>
                      <p className="text-3xl font-bold text-(--color-orange) leading-none">
                        {formatCurrency(trx.amount)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Details ── */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="border-b border-gray-100 bg-gray-50 px-6 py-4 flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-gray-400" />
                  <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
                    Transaction Details
                  </h3>
                </div>
                <div className="divide-y divide-gray-50">
                  {(
                    [
                      { label: "Transaction ID", value: trx.id, mono: true, copy: true },
                      { label: "Wallet ID", value: trx.walletId, mono: true, copy: true },
                      { label: "Type", value: trx.type },
                      { label: "Status", value: trx.status },
                      { label: "Amount", value: formatCurrency(trx.amount), bold: true },
                      { label: "Created", value: formatDate(trx.createdAt) },
                      { label: "Last Updated", value: formatDate(trx.updatedAt) },
                    ] as { label: string; value: string; bold?: boolean; mono?: boolean; copy?: boolean }[]
                  ).map(({ label, value, bold, mono, copy }) => (
                    <div
                      key={label}
                      className="flex items-center justify-between px-6 py-3.5"
                    >
                      <span className="text-sm text-gray-500 shrink-0">{label}</span>
                      <div className="flex items-center gap-1 min-w-0 ml-4">
                        <span
                          className={`text-sm truncate ${bold ? "font-bold text-gray-900" : "font-medium text-gray-700"} ${mono ? "font-mono" : ""}`}
                        >
                          {value}
                        </span>
                        {copy && <CopyButton text={value} />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        }}
      </PageLoader>
    </div>
  );
}
