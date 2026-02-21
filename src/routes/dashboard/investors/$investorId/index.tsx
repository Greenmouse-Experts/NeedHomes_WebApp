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
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { DropdownMenu, DropdownMenuItem } from "@/components/ui/DropdownMenu";
import { useQuery } from "@tanstack/react-query";
import apiClient, { type ApiResponse } from "@/api/simpleApi";
import type { ADMIN_INVESTOR_DATA } from "@/types";
import PageLoader from "@/components/layout/PageLoader";
import ThemeProvider from "@/simpleComps/ThemeProvider";
import SimpleAvatar from "@/simpleComps/SimpleAvatar";

export const Route = createFileRoute("/dashboard/investors/$investorId/")({
  component: InvestorDetailsPage,
});

function InvestorDetailsPage() {
  const { investorId } = Route.useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"overview" | "properties">(
    "overview",
  );

  const query = useQuery<ApiResponse<ADMIN_INVESTOR_DATA>>({
    queryKey: ["admin-investor", investorId],
    queryFn: async () => {
      let resp = await apiClient.get("/admin/users/" + investorId);
      return resp.data;
    },
  });

  return (
    <PageLoader query={query}>
      {(response) => {
        const investor = response.data;

        if (!investor) {
          return (
            <div className="text-center py-12">
              <p className="text-gray-500">Investor not found.</p>
              <Button
                variant="outline"
                onClick={() => navigate({ to: "/dashboard/investors" })}
                className="mt-4"
              >
                Back to Investors
              </Button>
            </div>
          );
        }

        return (
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
              <div className="bg-linear-to-r from-orange-50 to-orange-100 p-6 md:p-8">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                  <ThemeProvider className="flex-0! ">
                    <SimpleAvatar
                      url={investor.profilePicture || ""}
                      alt={investor.firstName}
                    />
                  </ThemeProvider>
                  {/* Investor Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                          {investor.firstName} {investor.lastName}
                        </h1>
                        <p className="text-sm text-gray-600 mb-4">
                          Investor ID: {investor.id}
                        </p>
                        <div className="flex flex-wrap gap-3">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                              investor.account_status === "ACTIVE"
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {investor.account_status}
                          </span>
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                            <Calendar className="w-3.5 h-3.5" />
                            Joined{" "}
                            {new Date(investor.createdAt).toLocaleDateString()}
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
                        <DropdownMenuItem>Suspend Investor</DropdownMenuItem>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Section */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-6 md:p-8 border-b border-gray-200">
                <div className="bg-linear-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-green-500 rounded-lg">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-medium">
                        Total Commission
                      </p>
                      <p className="text-xl font-bold text-gray-900">
                        ₦{investor.totalCommission.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-linear-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
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
                        Total Referrals
                      </p>
                      <p className="text-xl font-bold text-gray-900">
                        {investor.totalReferrals}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-linear-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
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
                        Verification Status
                      </p>
                      <p className="text-sm font-bold text-gray-900">
                        {investor.account_verification_status}
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
                        ? "text-brand-orange border-b-2 border-brand-orange"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    Overview
                  </button>
                  <button
                    onClick={() => setActiveTab("properties")}
                    className={`pb-4 px-1 font-medium text-sm transition-colors relative ${
                      activeTab === "properties"
                        ? "text-brand-orange border-b-2 border-brand-orange"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    Properties
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
                            <p className="text-xs text-gray-500">
                              Phone Number
                            </p>
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
                            <p className="text-xs text-gray-500">
                              Email Address
                            </p>
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
                            <p className="text-xs text-gray-500">Address</p>
                            <p className="text-sm font-medium text-gray-900">
                              {investor.verification_document?.address || "N/A"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <div className="p-2 bg-orange-100 rounded-lg">
                            <Share2 className="w-4 h-4 text-orange-600" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">
                              Referral Source
                            </p>
                            <p className="text-sm font-medium text-gray-900">
                              {investor.referral_source || "N/A"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bank and Actions */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Bank Account
                      </h3>
                      {investor.bank_account ? (
                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                          <p className="text-sm font-bold text-gray-900">
                            {investor.bank_account.account_name}
                          </p>
                          <p className="text-sm text-gray-600">
                            {investor.bank_account.account_number}
                          </p>
                          <p className="text-xs text-gray-500">
                            {investor.bank_account.bank_name}
                          </p>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 italic">
                          No bank account linked.
                        </p>
                      )}
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
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">
                      Property data integration pending.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Placeholder for Transactions/Activity */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Recent Activity
                </h3>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="font-semibold text-xs">
                          Type
                        </TableHead>
                        <TableHead className="font-semibold text-xs">
                          Description
                        </TableHead>
                        <TableHead className="font-semibold text-xs">
                          Date
                        </TableHead>
                        <TableHead className="font-semibold text-xs">
                          Status
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="text-xs text-gray-900">
                          Account
                        </TableCell>
                        <TableCell className="text-xs text-gray-900">
                          User profile updated
                        </TableCell>
                        <TableCell className="text-xs text-gray-600">
                          {new Date(investor.updatedAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <span className="inline-flex px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                            Success
                          </span>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          </div>
        );
      }}
    </PageLoader>
  );
}
