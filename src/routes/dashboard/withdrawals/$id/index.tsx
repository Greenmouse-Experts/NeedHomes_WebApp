import apiClient, { type ApiResponse } from "@/api/simpleApi";
import PageLoader from "@/components/layout/PageLoader";
import SimpleAvatar from "@/simpleComps/SimpleAvatar";
import type { withdrawal_reqeust } from "@/types/withdrawals";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Banknote,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Hash,
  Mail,
  Phone,
  ShieldCheck,
  User,
  XCircle,
} from "lucide-react";

export const Route = createFileRoute("/dashboard/withdrawals/$id/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();
  const query = useQuery<ApiResponse<withdrawal_reqeust>>({
    queryKey: ["withdrawal", id],
    queryFn: async () => {
      let resp = await apiClient.get("admin/withdrawals/" + id);
      return resp.data;
    },
  });

  return (
    <>
      {/* Header Navigation */}
      <div className="flex flex-col gap-6 mb-4">
        <Link
          to="/dashboard/withdrawals"
          className="btn btn-primary btn-soft  w-fit ring fade"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Withdrawals
        </Link>
      </div>

      <PageLoader query={query}>
        {(data) => {
          const resp = data.data as withdrawal_reqeust;

          const statusConfig = {
            APPROVED: {
              badge: "badge-success",
              icon: <CheckCircle2 className="w-4 h-4" />,
            },
            REJECTED: {
              badge: "badge-error",
              icon: <XCircle className="w-4 h-4" />,
            },
            PENDING: {
              badge: "badge-warning",
              icon: <Clock className="w-4 h-4" />,
            },
          };

          const config =
            statusConfig[resp.status as keyof typeof statusConfig] ||
            statusConfig.PENDING;

          return (
            <div className=" space-y-8 pb-12">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-base-200 pb-6">
                <div className="space-y-1">
                  <h1 className="text-4xl font-black tracking-tight">
                    Withdrawal
                  </h1>
                  <p className="text-base-content/50 font-mono text-xs uppercase tracking-widest">
                    ID: {resp.id}
                  </p>
                </div>
                <div
                  className={`badge ${config.badge} badge-lg py-5 px-6 gap-2 font-bold shadow-sm`}
                >
                  {config.icon}
                  <span className="tracking-wide uppercase text-xs">
                    {resp.status}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Transaction Summary & Bank Details */}
                <div className="lg:col-span-2 space-y-8">
                  {/* Hero Transaction Card */}
                  <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-base-100 to-base-200 border border-base-300 shadow-xl">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                      <Banknote className="w-32 h-32 rotate-12" />
                    </div>

                    <div className="relative p-8 md:p-10">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                          <p className=" uppercase font-black text-primary/60 tracking-[0.2em] mb-2">
                            Total Withdrawal Amount
                          </p>
                          <div className="flex items-baseline gap-2">
                            <span className="text-5xl font-black tracking-tighter">
                              ₦{resp.amount.toLocaleString()}
                            </span>
                            <span className="text-sm font-medium opacity-40">
                              NGN
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 md:text-right">
                          <div className="flex items-center md:justify-end gap-2 text-sm font-medium">
                            <Calendar className="w-4 h-4 text-primary" />
                            {new Date(resp.createdAt).toLocaleDateString(
                              undefined,
                              { dateStyle: "full" },
                            )}
                          </div>
                          <div className="flex items-center md:justify-end gap-2 text-xs opacity-50 font-mono">
                            <Clock className="w-3.5 h-3.5" />
                            {new Date(resp.createdAt).toLocaleTimeString()}
                          </div>
                        </div>
                      </div>

                      <div className="mt-10 pt-8 border-t border-base-300/50 grid grid-cols-1 sm:grid-cols-2 gap-8">
                        <div className="group">
                          <p className=" uppercase font-bold text-base-content/40 tracking-widest mb-2 group-hover:text-primary transition-colors">
                            Transfer Reference
                          </p>
                          <div className="flex items-center gap-2">
                            <Hash className="w-4 h-4 opacity-30" />
                            <code className="text-sm font-bold bg-base-300/30 px-2 py-1 rounded">
                              {resp.transferReference}
                            </code>
                          </div>
                        </div>
                        <div>
                          <p className=" uppercase font-bold text-base-content/40 tracking-widest mb-2">
                            System Status
                          </p>
                          <div
                            // @ts-ignore
                            className={`badge ${statusConfig[resp.status as any].badge} ring badge-soft`}
                          >
                            {/*@ts-ignore*/}
                            {statusConfig[resp.status as any].icon}{" "}
                            {resp.status}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bank Destination Card */}
                  <div className="card bg-base-100 border border-base-200 shadow-sm overflow-hidden">
                    <div className="bg-base-200/30 px-6 py-4 border-b border-base-200 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Building2 className="w-5 h-5 text-primary" />
                        </div>
                        <h2 className="font-bold text-sm tracking-tight">
                          Destination Bank Account
                        </h2>
                      </div>
                    </div>
                    <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="space-y-6">
                        <div>
                          <label className=" uppercase font-bold text-base-content/40 block mb-1">
                            Recipient Name
                          </label>
                          <p className="text-xl font-bold tracking-tight">
                            {resp.accountName}
                          </p>
                        </div>
                        <div>
                          <label className=" uppercase font-bold text-base-content/40 block mb-1">
                            Account Number
                          </label>
                          <p className="text-2xl font-mono tracking-widest text-primary">
                            {resp.accountNumber}
                          </p>
                        </div>
                      </div>
                      <div className="bg-base-200/50 rounded-2xl p-6 flex flex-col justify-center border border-base-300/50">
                        <p className=" card-title">Bank Name</p>
                        <p className="text-lg font-black">{resp.bankName}</p>
                        <div className="mt-2 inline-flex items-center gap-2">
                          <span className="badge badge-neutral font-mono ">
                            {resp.bankCode}
                          </span>
                          <span className=" opacity-40 font-bold uppercase tracking-widest">
                            Verified Channel
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: User Profile & Audit */}
                <div className="space-y-8">
                  {/* User Profile Card */}
                  <div className="card bg-base-100 border border-base-200 shadow-sm">
                    <div className="p-6">
                      <div className="flex flex-col items-center text-center">
                        <div className="relative mb-4">
                          <SimpleAvatar
                            className="w-24 h-24 ring-4 ring-base-200 ring-offset-2 ring-offset-base-100"
                            name={`${resp.user.firstName} ${resp.user.lastName}`}
                          />
                          <div className="absolute bottom-1 right-1 bg-success p-1.5 rounded-full border-4 border-base-100">
                            <ShieldCheck className="w-3 h-3 text-white" />
                          </div>
                        </div>
                        <h3 className="text-xl font-black tracking-tight">
                          {resp.user.firstName} {resp.user.lastName}
                        </h3>
                        <p className="text-xs font-medium text-base-content/40 uppercase tracking-widest mt-1">
                          Verified Customer
                        </p>

                        <div className="w-full mt-8 space-y-3">
                          <div className="flex items-center gap-3 p-3 bg-base-200/50 rounded-xl hover:bg-base-200 transition-colors cursor-pointer">
                            <div className="p-2 bg-base-100 rounded-lg shadow-sm">
                              <Mail className="w-4 h-4 text-primary" />
                            </div>
                            <span className="text-sm font-medium truncate">
                              {resp.user.email}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 p-3 bg-base-200/50 rounded-xl hover:bg-base-200 transition-colors cursor-pointer">
                            <div className="p-2 bg-base-100 rounded-lg shadow-sm">
                              <Phone className="w-4 h-4 text-primary" />
                            </div>
                            <span className="text-sm font-medium">
                              {resp.user.phone}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Audit Trail Section */}
                  <div className="card bg-base-900 text-neutral-content border border-neutral shadow-2xl overflow-hidden">
                    <div className="p-6 border-b border-white/10 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-primary" />
                      <h2 className="text-xs font-black uppercase tracking-[0.2em]">
                        Security Audit
                      </h2>
                    </div>

                    <div className="p-6">
                      {resp.status === "REJECTED" ? (
                        <div className="space-y-6">
                          <div className="p-4 bg-error/10 border border-error/20 rounded-2xl">
                            <div className="flex items-center gap-3 mb-2 text-error">
                              <XCircle className="w-5 h-5" />
                              <span className="font-black text-xs uppercase tracking-wider">
                                Declined
                              </span>
                            </div>
                            <p className="text-sm italic opacity-80 leading-relaxed">
                              "{resp.rejectionReason}"
                            </p>
                          </div>
                          <div className=" space-y-1 opacity-50 uppercase font-bold tracking-widest">
                            <p>Reviewer: {resp.rejectedBy}</p>
                            <p>
                              Timestamp:{" "}
                              {resp.rejectedAt
                                ? new Date(resp.rejectedAt).toLocaleString()
                                : "N/A"}
                            </p>
                          </div>
                        </div>
                      ) : resp.status === "APPROVED" ? (
                        <div className="space-y-6">
                          <div className="p-4 bg-success/10 border border-success/20 rounded-2xl">
                            <div className="flex items-center gap-3 mb-2 text-success">
                              <CheckCircle2 className="w-5 h-5" />
                              <span className="font-black text-xs uppercase tracking-wider">
                                Disbursed
                              </span>
                            </div>
                            <p className=" opacity-70 uppercase tracking-tighter mb-2">
                              Transfer Code
                            </p>
                            <p className="font-mono text-sm font-bold text-success">
                              {resp.transferCode || "N/A"}
                            </p>
                          </div>
                          <div className=" space-y-1 opacity-50 uppercase font-bold tracking-widest">
                            <p>Approved By: {resp.approvedBy}</p>
                            <p>
                              Timestamp:{" "}
                              {resp.approvedAt
                                ? new Date(resp.approvedAt).toLocaleString()
                                : "N/A"}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center py-6 text-center">
                          <div className="relative mb-4">
                            <Clock className="w-10 h-10 text-warning animate-[spin_4s_linear_infinite]" />
                          </div>
                          <p className="font-black text-xs uppercase tracking-widest text-warning mb-2">
                            Pending Review
                          </p>
                          <p className=" opacity-50 leading-relaxed max-w-[180px]">
                            This transaction is currently in the security queue.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        }}
      </PageLoader>
    </>
  );
}
