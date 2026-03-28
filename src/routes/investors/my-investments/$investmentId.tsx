import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ChevronLeft,
  TrendingUp,
  Calendar,
  DollarSign,
  BarChart3,
  MapPin,
  ArrowUpRight,
  Copy,
  Check,
  Hash,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import apiClient, { type ApiResponse } from "@/api/simpleApi";
import PageLoader from "@/components/layout/PageLoader";
import InvPropDetails from "./-components/InvPropDetails";
import InvPaymentSchedule from "./-components/InvPaymentSchedule";
import ExitStrategy from "./-components/ExitStrategy";

export const Route = createFileRoute("/investors/my-investments/$investmentId")(
  {
    component: InvestmentDetailsPage,
  },
);

interface Investment {
  id: string;
  userId: string;
  propertyId: string;
  amountPaid: number;
  unitsBought: number;
  sharesBought: number | null;
  paymentOption: "OUTRIGHT" | "INSTALLMENT";
  status: "ACTIVE" | "PENDING" | "COMPLETED";
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  currentValue: number;
  lastValuationDate: string | null;
  returnPercentage: number;
  totalAmount: number;
  totalReturns: number;
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

function InvestmentDetailsPage() {
  const { investmentId } = Route.useParams();
  const navigate = useNavigate();
  const query = useQuery<ApiResponse>({
    queryKey: ["investment", investmentId],
    queryFn: async () => {
      let resp = await apiClient.get(`investments/${investmentId}`);
      return resp.data;
    },
    enabled: !!investmentId,
  });

  const formatCurrency = (amount: number) => {
    return `₦${amount.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString)?.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button
        onClick={() => navigate({ to: "/investors/my-investments" })}
        variant="outline"
        leftIcon={<ChevronLeft className="w-5 h-5" />}
      >
        Back to Investments
      </Button>

      <PageLoader query={query}>
        {(data) => {
          const investment = data.data as Investment;
          const investment_type = investment.paymentOption == "INSTALLMENT";
          return (
            <>
              {/* ── Hero Header ── */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Top accent bar */}
                <div className="h-1.5 bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500" />
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                    {/* Left: title + ID + badges */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2.5 bg-green-100 rounded-xl shrink-0">
                          <TrendingUp className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
                            Investment Details
                          </h1>
                          <div className="flex items-center gap-2 mt-1">
                            <span
                              className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                investment.status === "ACTIVE"
                                  ? "bg-green-100 text-green-700"
                                  : investment.status === "COMPLETED"
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-yellow-100 text-yellow-700"
                              }`}
                            >
                              {investment.status}
                            </span>
                            <span className="text-xs text-gray-400 font-medium bg-gray-100 px-2 py-0.5 rounded-full">
                              {investment.paymentOption}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Investment ID — prominent */}
                      <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 flex items-center gap-3 max-w-md">
                        <Hash className="w-4 h-4 text-gray-400 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-0.5">
                            Investment ID
                          </p>
                          <p className="font-mono text-sm text-gray-800 font-semibold truncate">
                            {investment.id}
                          </p>
                        </div>
                        <CopyButton text={investment.id} />
                      </div>

                      {/* Property ref */}
                      <div className="flex items-center gap-2 mt-3 text-gray-500">
                        <MapPin className="w-3.5 h-3.5 shrink-0" />
                        <span className="text-xs">Property: </span>
                        <span className="font-mono text-xs text-gray-700 truncate">
                          {investment.propertyId}
                        </span>
                        <CopyButton text={investment.propertyId} />
                      </div>
                    </div>

                    {/* Right: current value */}
                    <div className="shrink-0 bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-100 rounded-xl px-6 py-4 text-center md:text-right">
                      <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-1">
                        Current Value
                      </p>
                      <p className="text-3xl font-bold text-(--color-orange) leading-none">
                        {formatCurrency(investment.currentValue / 100)}
                      </p>
                      <div className="flex items-center gap-1 mt-2 justify-center md:justify-end">
                        <ArrowUpRight className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-semibold text-green-600">
                          +{investment.returnPercentage}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Stats Grid ── */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                  <div className="p-2 bg-blue-50 rounded-lg w-fit mb-3">
                    <DollarSign className="w-4 h-4 text-blue-600" />
                  </div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-1">
                    Amount Paid
                  </p>
                  <p className="text-xl font-bold text-gray-900">
                    {formatCurrency(investment.amountPaid / 100)}
                  </p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                  <div className="p-2 bg-green-50 rounded-lg w-fit mb-3">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  </div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-1">
                    Total Returns
                  </p>
                  <p className="text-xl font-bold text-green-600">
                    {formatCurrency(investment.totalReturns)}
                  </p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                  <div className="p-2 bg-purple-50 rounded-lg w-fit mb-3">
                    <BarChart3 className="w-4 h-4 text-purple-600" />
                  </div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-1">
                    Units Bought
                  </p>
                  <p className="text-xl font-bold text-gray-900">
                    {investment.unitsBought}
                  </p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                  <div className="p-2 bg-orange-50 rounded-lg w-fit mb-3">
                    <Calendar className="w-4 h-4 text-orange-500" />
                  </div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-1">
                    Date Invested
                  </p>
                  <p className="text-sm font-bold text-gray-900">
                    {formatDate(investment.createdAt)}
                  </p>
                </div>
              </div>

              {/* ── Investment Information ── */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="border-b border-gray-100 bg-gray-50 px-6 py-4 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
                    Investment Information
                  </h3>
                  <Link
                    to="/investors/properties/$propertyId"
                    params={{ propertyId: investment.propertyId }}
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-gray-900 text-white text-xs font-semibold rounded-lg hover:bg-gray-800 transition-all shadow-sm active:scale-95"
                  >
                    View Property
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
                <div className="divide-y divide-gray-50">
                  {[
                    {
                      label: "Payment Plan",
                      value: investment.paymentOption,
                    },
                    {
                      label: "Total Contract",
                      value: formatCurrency(investment.totalAmount / 100),
                      bold: true,
                    },
                    {
                      label: "Last Valuation",
                      value: investment.lastValuationDate
                        ? formatDate(investment.lastValuationDate)
                        : "N/A",
                    },
                    {
                      label: "Last Updated",
                      value: formatDate(investment.updatedAt),
                    },
                  ].map(({ label, value, bold }) => (
                    <div
                      key={label}
                      className="flex items-center justify-between px-6 py-3.5"
                    >
                      <span className="text-sm text-gray-500">{label}</span>
                      <span
                        className={`text-sm ${bold ? "font-bold text-gray-900" : "font-medium text-gray-700"}`}
                      >
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {investment_type ? (
                <InvPaymentSchedule
                  id={investmentId}
                  propertyId={investment.propertyId}
                />
              ) : null}
              <ExitStrategy
                investment={investment}
                propertyId={investment.propertyId}
              />
              <InvPropDetails propId={investment.propertyId} />
            </>
          );
        }}
      </PageLoader>
    </div>
  );
}
