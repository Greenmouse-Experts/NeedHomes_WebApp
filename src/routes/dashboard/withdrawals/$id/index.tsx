import apiClient, { type ApiResponse } from "@/api/simpleApi";
import PageLoader from "@/components/layout/PageLoader";
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
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-4">
                  <Link
                    to="/dashboard/withdrawals"
                    className="btn btn-primary btn-soft ring fade gap-2 "
                  >
                    <ArrowLeft className="w-4 h-4" /> Back to Withdrawals
                  </Link>
                  <h1 className="text-3xl font-bold">Withdrawal Details</h1>
                  <p className="text-base-content/60 text-sm font-mono">
                    {resp.id}
                  </p>
                </div>
                <div
                  className={`badge ${config.badge} badge-lg gap-2 py-4 px-6 font-bold`}
                >
                  {config.icon}
                  {resp.status}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Info */}
                <div className="lg:col-span-2 space-y-8">
                  <div className="card bg-base-100 shadow-xl border border-base-200">
                    <div className="card-body">
                      <h2 className="card-title text-primary mb-4">
                        <Banknote className="w-5 h-5" /> Transaction Information
                      </h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        <div className="stats shadow bg-primary text-primary-content">
                          <div className="stat">
                            <div className="stat-title text-primary-content/70">
                              Amount
                            </div>
                            <div className="stat-value text-2xl">
                              ₦{resp.amount.toLocaleString()}
                            </div>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div className="flex items-start gap-3">
                            <Hash className="w-5 h-5 text-base-content/40 mt-1" />
                            <div>
                              <p className="text-xs uppercase font-bold text-base-content/50">
                                Reference
                              </p>
                              <p className="font-mono text-sm break-all">
                                {resp.transferReference}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <Calendar className="w-5 h-5 text-base-content/40 mt-1" />
                            <div>
                              <p className="text-xs uppercase font-bold text-base-content/50">
                                Date Created
                              </p>
                              <p>{new Date(resp.createdAt).toLocaleString()}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="card bg-base-100 shadow-xl border border-base-200">
                    <div className="card-body">
                      <h2 className="card-title text-primary mb-4">
                        <Building2 className="w-5 h-5" /> Bank Destination
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="form-control">
                          <label className="label text-xs uppercase font-bold text-base-content/50">
                            Account Name
                          </label>
                          <p className="font-semibold">{resp.accountName}</p>
                        </div>
                        <div className="form-control">
                          <label className="label text-xs uppercase font-bold text-base-content/50">
                            Account Number
                          </label>
                          <p className="font-mono text-lg tracking-wider">
                            {resp.accountNumber}
                          </p>
                        </div>
                        <div className="form-control">
                          <label className="label text-xs uppercase font-bold text-base-content/50">
                            Bank
                          </label>
                          <p>
                            {resp.bankName}{" "}
                            <span className="badge badge-ghost badge-sm">
                              {resp.bankCode}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-8">
                  <div className="card bg-base-100 shadow-xl border border-base-200">
                    <div className="card-body">
                      <h2 className="card-title text-primary mb-4">
                        <User className="w-5 h-5" /> User Profile
                      </h2>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="avatar placeholder">
                            <div className="bg-neutral text-neutral-content rounded-full w-10">
                              <span>
                                {resp.user.firstName[0]}
                                {resp.user.lastName[0]}
                              </span>
                            </div>
                          </div>
                          <div>
                            <p className="font-bold">
                              {resp.user.firstName} {resp.user.lastName}
                            </p>
                            <p className="badge badge-outline badge-sm uppercase">
                              {resp.user.accountType}
                            </p>
                          </div>
                        </div>
                        <div className="divider my-0"></div>
                        <div className="flex items-center gap-3 text-sm">
                          <Mail className="w-4 h-4 text-base-content/40" />
                          <span className="truncate">{resp.user.email}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <Phone className="w-4 h-4 text-base-content/40" />
                          <span>{resp.user.phone}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="card bg-base-100 shadow-xl border border-base-200 overflow-hidden">
                    <div
                      className={`h-2 ${resp.status === "APPROVED" ? "bg-success" : resp.status === "REJECTED" ? "bg-error" : "bg-warning"}`}
                    />
                    <div className="card-body">
                      <h2 className="card-title text-primary mb-4">
                        <ShieldCheck className="w-5 h-5" /> Audit Trail
                      </h2>
                      {resp.status === "REJECTED" ? (
                        <div className="alert alert-error bg-error/10 border-error/20 text-error items-start">
                          <div className="space-y-1">
                            <p className="font-bold">Reason for Rejection:</p>
                            <p className="text-sm italic">
                              "{resp.rejectionReason}"
                            </p>
                            <div className="pt-2 text-[10px] opacity-70 uppercase">
                              By: {resp.rejectedBy} •{" "}
                              {resp.rejectedAt
                                ? new Date(resp.rejectedAt).toLocaleString()
                                : "N/A"}
                            </div>
                          </div>
                        </div>
                      ) : resp.status === "APPROVED" ? (
                        <div className="alert alert-success bg-success/10 border-success/20 text-success items-start">
                          <div className="space-y-1">
                            <p className="font-bold">Approval Details</p>
                            <p className="text-sm">
                              Transfer Code:{" "}
                              <span className="font-mono">
                                {resp.transferCode || "N/A"}
                              </span>
                            </p>
                            <div className="pt-2 text-[10px] opacity-70 uppercase">
                              By: {resp.approvedBy} •{" "}
                              {resp.approvedAt
                                ? new Date(resp.approvedAt).toLocaleString()
                                : "N/A"}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center py-4 text-center space-y-2">
                          <Clock className="w-8 h-8 text-warning animate-pulse" />
                          <p className="text-sm text-base-content/60 italic">
                            This request is currently awaiting review by an
                            administrator.
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
