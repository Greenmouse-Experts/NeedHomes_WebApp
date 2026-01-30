import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  ChevronLeft,
  MoreVertical,
  Phone,
  Mail,
  MapPin,
  Calendar,
  TrendingUp,
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { DropdownMenu, DropdownMenuItem } from "@/components/ui/DropdownMenu";

export const Route = createFileRoute("/dashboard/investors/$investorId/")({
  component: InvestorDetailsPage,
});

const investorsData: Record<string, any> = {
  "CUS-83927XJ": {
    id: "CUS-83927XJ",
    name: "Emeka Okafor",
    phone: "+234 803 456 7890",
    email: "emeka@gmail.com",
    location: "Lagos, Nigeria",
    dateJoined: "22/05/2009",
    status: "Active",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emeka",
    totalInvestments: "₦45,000,000",
    activeProperties: 12,
    completedDeals: 8,
    bio: "Active real estate investor with a diverse portfolio across Lagos and Abuja. Specializes in residential properties and commercial developments.",
    properties: [
      {
        sku: "LAG-CAT-001",
        property: "Semi Detached Duplex",
        location: "Lekki Phase 1, Lagos",
        package: "Outright Purchase",
        amount: "₦25,000,000",
        status: "Completed",
        date: "12/01/2024",
      },
      {
        sku: "ABJ-RES-002",
        property: "4 Bedroom Terrace",
        location: "Gwarinpa, Abuja",
        package: "Installment",
        amount: "₦15,000,000",
        status: "On-going",
        date: "20/02/2024",
      },
      {
        sku: "LAG-COM-003",
        property: "3 Bedroom Apartment",
        location: "Victoria Island, Lagos",
        package: "Fractional Ownership",
        amount: "₦5,000,000",
        status: "On-going",
        date: "05/03/2024",
      },
    ],
  },
  "ACC-10294QW": {
    id: "ACC-10294QW",
    name: "Aisha Bello",
    phone: "+234 706 123 4567",
    email: "belloaisha@yahoo.com",
    location: "Abuja, Nigeria",
    dateJoined: "22/05/2011",
    status: "Active",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aisha",
    totalInvestments: "₦32,000,000",
    activeProperties: 8,
    completedDeals: 5,
    bio: "Strategic investor focused on high-value commercial properties in Abuja and surrounding areas.",
    properties: [
      {
        sku: "ABJ-DUP-001",
        property: "5BR Duplex",
        location: "Garki, Abuja",
        package: "Outright Purchase",
        amount: "₦32,000,000",
        status: "Completed",
        date: "15/01/2024",
      },
    ],
  },
};

function InvestorDetailsPage() {
  const { investorId } = Route.useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"overview" | "properties">(
    "overview",
  );

  const investor = investorsData[investorId] || {
    id: investorId,
    name: "Investor Name",
    phone: "+234 123 456 7890",
    email: "investor@example.com",
    location: "Lagos, Nigeria",
    dateJoined: "01/01/2024",
    status: "Active",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Investor",
    totalInvestments: "₦0",
    activeProperties: 0,
    completedDeals: 0,
    bio: "Investor profile information.",
    properties: [],
  };

  return (
    <DashboardLayout title="Super Admin Dashboard" subtitle="Investor Details">
      <div className="space-y-6">
        {/* Back Button */}
        <button
          onClick={() => navigate({ to: "/dashboard/investors" })}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="font-medium">Back to Investors</span>
        </button>

        {/* Investor Profile Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              {/* Avatar */}
              <Avatar className="w-24 h-24 md:w-32 md:h-32 ring-4 ring-white shadow-lg">
                <AvatarImage
                  src={investor.avatar}
                  alt={investor.name}
                  className="object-cover"
                />
                <AvatarFallback className="text-2xl font-bold">
                  {investor.name
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>

              {/* Investor Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                      {investor.name}
                    </h1>
                    <p className="text-sm text-gray-600 mb-4">
                      Investor ID: {investor.id}
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                          investor.status === "Active"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {investor.status}
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                        <Calendar className="w-3.5 h-3.5" />
                        Joined {investor.dateJoined}
                      </span>
                    </div>
                  </div>
                  <DropdownMenu
                    trigger={
                      <button className="p-2 hover:bg-white/50 rounded-lg transition-colors">
                        <MoreVertical className="w-5 h-5 text-gray-600" />
                      </button>
                    }
                  >
                    <DropdownMenuItem>Edit Investor</DropdownMenuItem>
                    <DropdownMenuItem>Suspend Investor</DropdownMenuItem>
                    {/*<DropdownMenuItem className="text-red-600">Delete Investor</DropdownMenuItem>*/}
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-6 md:p-8 border-b border-gray-200">
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-500 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-medium">
                    Total Investments
                  </p>
                  <p className="text-xl font-bold text-gray-900">
                    {investor.totalInvestments}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-500 rounded-lg">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-medium">
                    Active Properties
                  </p>
                  <p className="text-xl font-bold text-gray-900">
                    {investor.activeProperties}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-500 rounded-lg">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-medium">
                    Completed Deals
                  </p>
                  <p className="text-xl font-bold text-gray-900">
                    {investor.completedDeals}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex gap-8 px-6 md:px-8">
              <button
                onClick={() => setActiveTab("overview")}
                className={`pb-4 px-1 font-medium text-sm transition-colors relative ${
                  activeTab === "overview"
                    ? "text-[var(--color-orange)] border-b-2 border-[var(--color-orange)]"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab("properties")}
                className={`pb-4 px-1 font-medium text-sm transition-colors relative ${
                  activeTab === "properties"
                    ? "text-[var(--color-orange)] border-b-2 border-[var(--color-orange)]"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Properties ({investor.properties.length})
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6 md:p-8">
            {activeTab === "overview" && (
              <div className="grid md:grid-cols-2 gap-6">
                {/* Contact Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Contact Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Phone className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Phone Number</p>
                        <p className="text-sm font-medium text-gray-900">
                          {investor.phone}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Mail className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Email Address</p>
                        <p className="text-sm font-medium text-gray-900">
                          {investor.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <MapPin className="w-4 h-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Location</p>
                        <p className="text-sm font-medium text-gray-900">
                          {investor.location}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bio and Actions */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    About
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {investor.bio}
                  </p>
                  <div className="pt-4 space-y-3">
                    <Button
                      variant="primary"
                      className="w-full"
                      onClick={() =>
                        navigate({
                          to: "/dashboard/investors/$investorId/kyc",
                          params: { investorId },
                        })
                      }
                    >
                      See KYC
                    </Button>
                    <Button variant="outline" className="w-full">
                      Send Message
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "properties" && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Promoted Properties
                </h3>
                {investor.properties.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50">
                          <TableHead className="font-semibold">SKU</TableHead>
                          <TableHead className="font-semibold">
                            Property
                          </TableHead>
                          <TableHead className="font-semibold hidden md:table-cell">
                            Location
                          </TableHead>
                          <TableHead className="font-semibold hidden lg:table-cell">
                            Package
                          </TableHead>
                          <TableHead className="font-semibold">
                            Amount
                          </TableHead>
                          <TableHead className="font-semibold hidden md:table-cell">
                            Status
                          </TableHead>
                          <TableHead className="font-semibold hidden lg:table-cell">
                            Date
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {investor.properties.map(
                          (property: any, index: number) => (
                            <TableRow key={index}>
                              <TableCell className="font-medium text-sm">
                                {property.sku}
                              </TableCell>
                              <TableCell className="text-sm">
                                {property.property}
                              </TableCell>
                              <TableCell className="text-sm text-gray-600 hidden md:table-cell">
                                {property.location}
                              </TableCell>
                              <TableCell className="text-sm text-gray-600 hidden lg:table-cell">
                                {property.package}
                              </TableCell>
                              <TableCell className="text-sm font-semibold text-[var(--color-orange)]">
                                {property.amount}
                              </TableCell>
                              <TableCell className="hidden md:table-cell">
                                <span
                                  className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${
                                    property.status === "Completed"
                                      ? "bg-green-100 text-green-700"
                                      : "bg-orange-100 text-orange-700"
                                  }`}
                                >
                                  {property.status}
                                </span>
                              </TableCell>
                              <TableCell className="text-sm text-gray-600 hidden lg:table-cell">
                                {property.date}
                              </TableCell>
                            </TableRow>
                          ),
                        )}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">
                      No properties found for this investor.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Investors Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Investors
            </h3>

            {/* Tabs */}
            <div className="flex gap-2 mb-6">
              <button className="px-4 py-2 bg-[var(--color-orange)] text-white rounded-lg text-sm font-medium">
                All Properties
              </button>
              <button className="px-4 py-2 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-lg text-sm font-medium">
                Completed Properties
              </button>
              <button className="px-4 py-2 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-lg text-sm font-medium">
                Uncompleted Properties
              </button>
            </div>

            {/* Search and Export */}
            <div className="flex items-center justify-between mb-4">
              <div className="relative flex-1 max-w-md">
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Search"
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-[var(--color-orange)] focus:border-[var(--color-orange)]"
                />
              </div>
              <Button variant="outline" size="sm" className="ml-4">
                Export As
              </Button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold text-xs">SKU</TableHead>
                    <TableHead className="font-semibold text-xs">
                      Property Description
                    </TableHead>
                    <TableHead className="font-semibold text-xs">
                      Package
                    </TableHead>
                    <TableHead className="font-semibold text-xs">
                      Image
                    </TableHead>
                    <TableHead className="font-semibold text-xs">
                      Price
                    </TableHead>
                    <TableHead className="font-semibold text-xs">
                      Quantity
                    </TableHead>
                    <TableHead className="font-semibold text-xs">
                      Status
                    </TableHead>
                    <TableHead className="font-semibold text-xs">
                      Action
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="text-xs text-gray-900">
                      CUS-83927XJ
                    </TableCell>
                    <TableCell className="text-xs text-gray-900">
                      4BR Apartment, 10, Adeniji Street, Lagos
                    </TableCell>
                    <TableCell className="text-xs text-gray-600">
                      Outright
                    </TableCell>
                    <TableCell>
                      <img
                        src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=100&h=100&fit=crop"
                        alt="Property"
                        className="w-12 h-12 object-cover rounded"
                      />
                    </TableCell>
                    <TableCell className="text-xs text-gray-900 font-medium">
                      N 10,000,000
                    </TableCell>
                    <TableCell className="text-xs text-gray-600">10</TableCell>
                    <TableCell>
                      <span className="inline-flex px-2 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700">
                        On-going
                      </span>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu
                        trigger={
                          <button className="p-1 hover:bg-gray-100 rounded">
                            <MoreVertical className="w-4 h-4 text-gray-400" />
                          </button>
                        }
                      >
                        <DropdownMenuItem>View Property</DropdownMenuItem>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        {/*<DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>*/}
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
