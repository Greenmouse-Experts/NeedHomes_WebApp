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

export const Route = createFileRoute("/investors/my-investments/$investmentId")(
  {
    component: InvestmentDetailsPage,
  },
);

// Mock investment data
const investmentData: Record<string, any> = {
  "1": {
    id: 1,
    propertyId: "LAG-CAT-001",
    propertyName: "Semi Detached Duplex",
    location: "Lekki Phase 1, Lekki, Lagos",
    investmentAmount: 10000000,
    currentValue: 11250000,
    investmentType: "Outright Purchase",
    status: "Active",
    dateInvested: "2024-01-20",
    returns: 12.5,
    monthlyReturns: [
      { month: "Jan", value: 10000000 },
      { month: "Feb", value: 10200000 },
      { month: "Mar", value: 10500000 },
      { month: "Apr", value: 10800000 },
      { month: "May", value: 11000000 },
      { month: "Jun", value: 11250000 },
    ],
    propertyDetails: {
      bedrooms: 4,
      bathrooms: 3,
      area: "350 sqm",
      propertyType: "RESIDENTIAL",
      developmentStage: "COMPLETED",
      completionDate: "2024-12-31",
      coverImage:
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop",
      galleryImages: [
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop",
      ],
      videos: [],
      description:
        "A beautiful semi-detached duplex located in the heart of Lagos. This property features modern amenities, spacious rooms, and excellent finishing.",
    },
    analytics: {
      totalReturn: 1250000,
      returnPercentage: 12.5,
      monthlyGrowth: 2.1,
      projectedAnnualReturn: 15.2,
      daysHeld: 162,
    },
  },
  "2": {
    id: 2,
    propertyId: "LAG-CAT-002",
    propertyName: "3BR Terrace Duplex",
    location: "Ikeja GRA, Lagos",
    investmentAmount: 5500000,
    currentValue: 5956500,
    investmentType: "Fractional Ownership",
    status: "Active",
    dateInvested: "2024-02-15",
    returns: 8.3,
    monthlyReturns: [
      { month: "Feb", value: 5500000 },
      { month: "Mar", value: 5610000 },
      { month: "Apr", value: 5720000 },
      { month: "May", value: 5830000 },
      { month: "Jun", value: 5956500 },
    ],
    propertyDetails: {
      bedrooms: 3,
      bathrooms: 2,
      area: "180 sqm",
      propertyType: "RESIDENTIAL",
      developmentStage: "COMPLETED",
      completionDate: "2024-06-30",
      coverImage:
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop",
      galleryImages: [
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop",
      ],
      videos: [],
      description:
        "Modern terrace duplex with contemporary finishes in a prime location.",
    },
    analytics: {
      totalReturn: 456500,
      returnPercentage: 8.3,
      monthlyGrowth: 1.8,
      projectedAnnualReturn: 10.5,
      daysHeld: 135,
    },
  },
  "3": {
    id: 3,
    propertyId: "LAG-CAT-003",
    propertyName: "Luxury Apartment",
    location: "Victoria Island, Lagos",
    investmentAmount: 15000000,
    currentValue: 15000000,
    investmentType: "Co-Development",
    status: "Pending",
    dateInvested: "2024-03-10",
    returns: 0,
    monthlyReturns: [
      { month: "Mar", value: 15000000 },
      { month: "Apr", value: 15000000 },
      { month: "May", value: 15000000 },
      { month: "Jun", value: 15000000 },
    ],
    propertyDetails: {
      bedrooms: 3,
      bathrooms: 3,
      area: "200 sqm",
      propertyType: "RESIDENTIAL",
      developmentStage: "ONGOING",
      completionDate: "2025-12-31",
      coverImage:
        "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop",
      galleryImages: [
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop",
      ],
      videos: [],
      description:
        "Luxury apartment in premium location, currently under development.",
    },
    analytics: {
      totalReturn: 0,
      returnPercentage: 0,
      monthlyGrowth: 0,
      projectedAnnualReturn: 18.5,
      daysHeld: 112,
    },
  },
};

function InvestmentDetailsPage() {
  const { investmentId } = Route.useParams();
  const navigate = useNavigate();
  const investment = investmentData[investmentId] || investmentData["1"];

  const formatCurrency = (amount: number) => {
    return `₦${amount.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
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

      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                {investment.propertyName}
              </h1>
            </div>
            <div className="flex items-center gap-2 text-gray-600 mb-4">
              <MapPin className="w-4 h-4" />
              <span className="text-sm md:text-base">
                {investment.location}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                  investment.status === "Active"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {investment.status}
              </span>
              <span className="text-sm text-gray-500">
                {investment.investmentType}
              </span>
            </div>
          </div>
          <div className="text-left md:text-right">
            <p className="text-sm text-gray-500 mb-1">Current Value</p>
            <p className="text-3xl font-bold text-[var(--color-orange)]">
              {formatCurrency(investment.currentValue)}
            </p>
            <div className="flex items-center gap-1 mt-2 md:justify-end">
              <ArrowUpRight className="w-4 h-4 text-green-600" />
              <span className="text-sm font-semibold text-green-600">
                +{investment.returns}%
              </span>
              <span className="text-xs text-gray-500">
                ({formatCurrency(investment.analytics.totalReturn)})
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Investment Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <DollarSign className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-1">Initial Investment</p>
          <p className="text-2xl font-bold text-gray-900">
            {formatCurrency(investment.investmentAmount)}
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
            {formatCurrency(investment.analytics.totalReturn)}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <BarChart3 className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-1">Monthly Growth</p>
          <p className="text-2xl font-bold text-gray-900">
            +{investment.analytics.monthlyGrowth}%
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Calendar className="w-5 h-5 text-orange-600" />
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-1">Days Held</p>
          <p className="text-2xl font-bold text-gray-900">
            {investment.analytics.daysHeld}
          </p>
        </div>
      </div>

      {/* Performance Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Performance Overview
        </h2>
        <div className="space-y-4">
          {investment.monthlyReturns.map((data: any, index: number) => {
            const isLast = index === investment.monthlyReturns.length - 1;
            const percentage = isLast
              ? ((data.value - investment.investmentAmount) /
                  investment.investmentAmount) *
                100
              : ((data.value - investment.monthlyReturns[0].value) /
                  investment.monthlyReturns[0].value) *
                100;
            const barWidth = (data.value / investment.currentValue) * 100;

            return (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    {data.month}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-900">
                      {formatCurrency(data.value)}
                    </span>
                    <span
                      className={`text-xs font-medium ${
                        percentage >= 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {percentage >= 0 ? "+" : ""}
                      {percentage.toFixed(1)}%
                    </span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-[var(--color-orange)] to-orange-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${barWidth}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Property Details */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Property Details
          </h2>
        </div>

        {/* Media Slider */}
        <div className="p-6">
          <MediaSlider
            images={investment.propertyDetails.galleryImages || []}
            videos={investment.propertyDetails.videos || []}
            coverImage={investment.propertyDetails.coverImage}
          />
        </div>

        <div className="p-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="p-2 bg-white rounded-lg">
                <Home className="w-5 h-5 text-[var(--color-orange)]" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Bedrooms</p>
                <p className="font-semibold text-gray-900">
                  {investment.propertyDetails.bedrooms}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="p-2 bg-white rounded-lg">
                <Home className="w-5 h-5 text-[var(--color-orange)]" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Bathrooms</p>
                <p className="font-semibold text-gray-900">
                  {investment.propertyDetails.bathrooms}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="p-2 bg-white rounded-lg">
                <Package className="w-5 h-5 text-[var(--color-orange)]" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Area</p>
                <p className="font-semibold text-gray-900">
                  {investment.propertyDetails.area}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="p-2 bg-white rounded-lg">
                <Calendar className="w-5 h-5 text-[var(--color-orange)]" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Stage</p>
                <p className="font-semibold text-gray-900">
                  {investment.propertyDetails.developmentStage}
                </p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Description
            </h3>
            <p className="text-gray-600 leading-relaxed">
              {investment.propertyDetails.description}
            </p>
          </div>

          {/* Investment Details */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Investment Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Date Invested:</span>
                <span className="font-medium text-gray-900">
                  {formatDate(investment.dateInvested)}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Investment Type:</span>
                <span className="font-medium text-gray-900">
                  {investment.investmentType}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Property ID:</span>
                <span className="font-medium text-gray-900">
                  {investment.propertyId}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Projected Annual Return:</span>
                <span className="font-medium text-green-600">
                  +{investment.analytics.projectedAnnualReturn}%
                </span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="mt-6">
            <Link
              to="/investors/properties/$propertyId"
              params={{ propertyId: investment.propertyId }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--color-orange)] text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              View Full Property Details
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
