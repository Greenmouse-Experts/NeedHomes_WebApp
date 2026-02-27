import { createFileRoute } from "@tanstack/react-router";
import {
  CreditCard,
  Download,
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownLeft,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/api/simpleApi";
import PageLoader from "@/components/layout/PageLoader";

export const Route = createFileRoute("/investors/transactions")({
  component: RouteComponent,
});

const transactions = [
  {
    id: "TRX-83729",
    type: "deposit",
    description: "Wallet Deposit via Bank Transfer",
    amount: "N 5,000,000",
    date: "Jan 26, 2025",
    time: "10:30 AM",
    status: "successful",
  },
  {
    id: "TRX-83730",
    type: "investment",
    description: "Investment in 4BR Duplex",
    amount: "N 2,500,000",
    date: "Jan 25, 2025",
    time: "02:15 PM",
    status: "successful",
  },
  {
    id: "TRX-83731",
    type: "withdrawal",
    description: "Withdrawal to GTBank ****1234",
    amount: "N 100,000",
    date: "Jan 24, 2025",
    time: "09:00 AM",
    status: "pending",
  },
  {
    id: "TRX-83732",
    type: "deposit",
    description: "Wallet Deposit via Card",
    amount: "N 500,000",
    date: "Jan 23, 2025",
    time: "04:45 PM",
    status: "failed",
  },
  {
    id: "TRX-83733",
    type: "dividend",
    description: "Dividend Payout - Jan 2025",
    amount: "N 50,000",
    date: "Jan 22, 2025",
    time: "12:00 PM",
    status: "successful",
  },
];

function RouteComponent() {
  const [searchTerm, setSearchTerm] = useState("");
  const query = useQuery({
    queryKey: ["transactions"],
    queryFn: async () => {
      let resp = await apiClient.get("/my-investments/transactions");
      return resp.data;
    },
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "successful":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Successful
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            Pending
          </span>
        );
      case "failed":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            Failed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

  const getTypeIcon = (type: string) => {
    if (type === "deposit" || type === "dividend") {
      return (
        <div className="p-2 bg-green-100 rounded-full">
          <ArrowDownLeft className="w-4 h-4 text-green-600" />
        </div>
      );
    }
    return (
      <div className="p-2 bg-red-100 rounded-full">
        <ArrowUpRight className="w-4 h-4 text-red-600" />
      </div>
    );
  };

  const filteredTransactions = transactions.filter(
    (t) =>
      t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.id.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <CreditCard className="h-6 w-6 text-indigo-600" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Transactions
          </h1>
        </div>
        <p className="text-gray-600 text-sm sm:text-base">
          Manage and view your financial history.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search transactions..."
              className="pl-9 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="flex items-center gap-2 text-gray-600"
            >
              <Filter className="w-4 h-4" />
              Filter
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2 text-gray-600"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </Button>
          </div>
        </div>
        <PageLoader query={query}>
          {(resp) => {
            let data = resp.data;
            return <></>;
          }}
        </PageLoader>
      </div>
    </div>
  );
}
