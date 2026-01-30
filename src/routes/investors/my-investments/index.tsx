import { createFileRoute, Link } from "@tanstack/react-router";
import {
  TrendingUp,
  MoreVertical,
  Filter,
  ChevronDown,
  Plus,
} from "lucide-react";
import { useState } from "react";
export const Route = createFileRoute("/investors/my-investments/")({
  component: RouteComponent,
});

const investments = [
  {
    id: 1,
    propertyId: "LAG-CAT-001",
    propertyName: "Semi Detached Duplex",
    location: "Lekki Phase 1, Lagos",
    amount: "₦10,000,000",
    investmentType: "Outright Purchase",
    status: "Active",
    dateInvested: "Jan 20, 2024",
    returns: "+12.5%",
  },
  {
    id: 2,
    propertyId: "LAG-CAT-002",
    propertyName: "3BR Terrace Duplex",
    location: "Ikeja GRA, Lagos",
    amount: "₦5,500,000",
    investmentType: "Fractional Ownership",
    status: "Active",
    dateInvested: "Feb 15, 2024",
    returns: "+8.3%",
  },
  {
    id: 3,
    propertyId: "LAG-CAT-003",
    propertyName: "Luxury Apartment",
    location: "Victoria Island, Lagos",
    amount: "₦15,000,000",
    investmentType: "Co-Development",
    status: "Pending",
    dateInvested: "Mar 10, 2024",
    returns: "N/A",
  },
];

function RouteComponent() {
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [actionOpen, setActionOpen] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "completed":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-2 bg-purple-100 rounded-lg">
            <TrendingUp className="h-6 w-6 text-purple-600" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            My Investments
          </h1>
        </div>
        <p className="text-gray-600 text-sm sm:text-base">
          Track your investment portfolio and monitor performance.
        </p>
      </div>

      {/* Filters Bar */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="relative">
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className="flex items-center gap-2 px-4 py-2 border-2 border-[var(--color-orange)] text-[var(--color-orange)] rounded-lg hover:bg-orange-50 transition-colors"
          >
            <Filter className="w-4 h-4" />
            Filter
          </button>
          {filterOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setFilterOpen(false)}
              />
              <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20 p-2">
                <button className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded">
                  All Investments
                </button>
                <button className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded">
                  Active
                </button>
                <button className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded">
                  Pending
                </button>
                <button className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded">
                  Completed
                </button>
              </div>
            </>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => setActionOpen(!actionOpen)}
            className="flex items-center gap-2 px-4 py-2 border-2 border-[var(--color-orange)] text-[var(--color-orange)] rounded-lg hover:bg-orange-50 transition-colors"
          >
            Action
            <ChevronDown className="w-4 h-4" />
          </button>
          {actionOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setActionOpen(false)}
              />
              <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20 p-2">
                <button className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded">
                  Export Data
                </button>
                <button className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded">
                  View Reports
                </button>
              </div>
            </>
          )}
        </div>

        <button className="flex items-center gap-2 px-4 py-2 bg-[var(--color-orange)] text-white rounded-lg hover:bg-orange-600 transition-colors">
          <Plus className="w-4 h-4" />
          Add Investment
        </button>
      </div>

      {/* Investments Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Property
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Returns
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {investments.map((investment) => (
                <tr
                  key={investment.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p className="font-semibold text-gray-900">
                        {investment.propertyName}
                      </p>
                      <p className="text-sm text-gray-500">
                        {investment.location}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-semibold text-gray-900">
                      {investment.amount}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-700">
                      {investment.investmentType}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(investment.status)}`}
                    >
                      {investment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`font-semibold ${investment.returns.startsWith("+") ? "text-green-600" : "text-gray-500"}`}
                    >
                      {investment.returns}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600">
                      {investment.dateInvested}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="relative inline-block">
                      <button
                        onClick={() =>
                          setOpenDropdown(
                            openDropdown === investment.id
                              ? null
                              : investment.id,
                          )
                        }
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <MoreVertical className="w-5 h-5 text-gray-600" />
                      </button>
                      {openDropdown === investment.id && (
                        <>
                          <div
                            className="fixed inset-0 z-10"
                            onClick={() => setOpenDropdown(null)}
                          />
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                            <Link
                              to="/investors/my-investments/$investmentId"
                              params={{
                                investmentId: investment.id.toString(),
                              }}
                              className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg"
                              onClick={() => setOpenDropdown(null)}
                            >
                              View Details
                            </Link>
                          </div>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden divide-y divide-gray-200">
          {investments.map((investment) => (
            <div
              key={investment.id}
              className="p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {investment.propertyName}
                  </h3>
                  <p className="text-sm text-gray-500 mb-2">
                    {investment.location}
                  </p>
                  <span
                    className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(investment.status)}`}
                  >
                    {investment.status}
                  </span>
                </div>
                <div className="relative">
                  <button
                    onClick={() =>
                      setOpenDropdown(
                        openDropdown === investment.id ? null : investment.id,
                      )
                    }
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <MoreVertical className="w-5 h-5 text-gray-600" />
                  </button>
                  {openDropdown === investment.id && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setOpenDropdown(null)}
                      />
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                        <Link
                          to="/partners/properties/$propertyId"
                          params={{ propertyId: investment.propertyId }}
                          className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg"
                          onClick={() => setOpenDropdown(null)}
                        >
                          View Details
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-gray-500 mb-1">Amount</p>
                  <p className="font-semibold text-gray-900">
                    {investment.amount}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Returns</p>
                  <p
                    className={`font-semibold ${investment.returns.startsWith("+") ? "text-green-600" : "text-gray-500"}`}
                  >
                    {investment.returns}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Type</p>
                  <p className="text-gray-700">{investment.investmentType}</p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Date</p>
                  <p className="text-gray-700">{investment.dateInvested}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
