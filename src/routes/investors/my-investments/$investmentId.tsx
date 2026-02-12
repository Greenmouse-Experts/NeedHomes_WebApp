import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ChevronLeft,
  TrendingUp,
  Calendar,
  DollarSign,
  BarChart3,
  Home,
  MapPin,
  Package,
  ArrowUpRight,
} from "lucide-react";
import { MediaSlider } from "@/components/property/MediaSlider";
import { Button } from "@/components/ui/Button";
import { useQuery } from "@tanstack/react-query";
import apiClient, { type ApiResponse } from "@/api/simpleApi";
import PageLoader from "@/components/layout/PageLoader";

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

function InvestmentDetailsPage() {
  const { investmentId } = Route.useParams();
  const navigate = useNavigate();
  const query = useQuery<ApiResponse>({
    queryKey: ["investment", investmentId],
    queryFn: async () => {
      let resp = await apiClient.get("investments/" + investmentId);
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
          return (
            <>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <TrendingUp className="h-6 w-6 text-green-600" />
                      </div>
                      <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                        Investment Details
                      </h1>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 mb-4">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm md:text-base">
                        Property ID: {investment.propertyId}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                          investment.status === "ACTIVE"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {investment.status}
                      </span>
                      <span className="text-sm text-gray-500">
                        {investment.paymentOption}
                      </span>
                    </div>
                  </div>
                  <div className="text-left md:text-right">
                    <p className="text-sm text-gray-500 mb-1">Current Value</p>
                    <p className="text-3xl font-bold text-(--color-orange)">
                      {formatCurrency(investment.currentValue)}
                    </p>
                    <div className="flex items-center gap-1 mt-2 md:justify-end">
                      <ArrowUpRight className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-semibold text-green-600">
                        +{investment.returnPercentage}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Investment Stats */}
              <div className="grid py-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <DollarSign className="w-5 h-5 text-blue-600" />
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">Amount Paid</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(investment.amountPaid)}
                  </p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">Total Returns</p>
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(investment.totalReturns)}
                  </p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <BarChart3 className="w-5 h-5 text-purple-600" />
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">Units Bought</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {investment.unitsBought}
                  </p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <Calendar className="w-5 h-5 text-orange-600" />
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">Date Invested</p>
                  <p className="text-lg font-bold text-gray-900">
                    {formatDate(investment.createdAt)}
                  </p>
                </div>
              </div>

              {/* Investment Details */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Investment Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex justify-between py-2 border-b border-gray-50">
                    <span className="text-gray-600">Investment ID:</span>
                    <span className="font-medium text-gray-900">
                      {investment.id}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-50">
                    <span className="text-gray-600">Payment Option:</span>
                    <span className="font-medium text-gray-900">
                      {investment.paymentOption}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-50">
                    <span className="text-gray-600">
                      Total Contract Amount:
                    </span>
                    <span className="font-medium text-gray-900">
                      {formatCurrency(investment.totalAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-50">
                    <span className="text-gray-600">Last Valuation:</span>
                    <span className="font-medium text-gray-900">
                      {investment.lastValuationDate
                        ? formatDate(investment.lastValuationDate)
                        : "N/A"}
                    </span>
                  </div>
                </div>

                {/* Action Button */}
                <div className="mt-8">
                  <Link
                    to="/investors/properties/$propertyId"
                    params={{ propertyId: investment.propertyId }}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-(--color-orange) text-white rounded-lg hover:bg-orange-600 transition-colors"
                  >
                    View Property Details
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </>
          );
        }}
      </PageLoader>
    </div>
  );
}
