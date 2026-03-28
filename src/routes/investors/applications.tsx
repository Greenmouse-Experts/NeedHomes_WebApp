import apiClient, { type ApiResponseV2 } from "@/api/simpleApi";
import PageLoader from "@/components/layout/PageLoader";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Briefcase,
  MapPin,
  Clock,
  FileText,
  ExternalLink,
  ArrowRight,
  CheckCircle2,
  Eye,
} from "lucide-react";
import { useState, useRef } from "react";
import Modal, { type ModalHandle } from "@/components/modals/DialogModal";

export const Route = createFileRoute("/investors/applications")({
  component: RouteComponent,
});

type AppStatus = "PENDING" | "REVIEWED" | "SHORTLISTED" | "REJECTED";

interface Application {
  id: string;
  jobId: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  coverLetter: string;
  resumeUrl: string;
  status: AppStatus;
  createdAt: string;
  updatedAt: string;
  job: {
    id: string;
    title: string;
    slug: string;
    location: string;
    jobType: string;
  };
}

const JOB_TYPE_LABELS: Record<string, string> = {
  FULL_TIME: "Full-time",
  PART_TIME: "Part-time",
  CONTRACT: "Contract",
  REMOTE: "Remote",
  HYBRID: "Hybrid",
};

const STATUS_CONFIG: Record<
  AppStatus,
  { label: string; badge: string; dot: string }
> = {
  PENDING: {
    label: "Pending",
    badge: "bg-yellow-50 text-yellow-700 border border-yellow-200",
    dot: "bg-yellow-400",
  },
  REVIEWED: {
    label: "Reviewed",
    badge: "bg-blue-50 text-blue-700 border border-blue-200",
    dot: "bg-blue-400",
  },
  SHORTLISTED: {
    label: "Shortlisted",
    badge: "bg-green-50 text-green-700 border border-green-200",
    dot: "bg-green-400",
  },
  REJECTED: {
    label: "Rejected",
    badge: "bg-red-50 text-red-700 border border-red-200",
    dot: "bg-red-400",
  },
};

function RouteComponent() {
  const modalRef = useRef<ModalHandle>(null);
  const [selected, setSelected] = useState<Application | null>(null);

  const query = useQuery<ApiResponseV2<Application[]>>({
    queryKey: ["investors", "applications"],
    queryFn: async () => {
      const resp = await apiClient.get("careers/applications/my-applications");
      return resp.data;
    },
  });

  const handleOpen = (app: Application) => {
    setSelected(app);
    modalRef.current?.open();
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 sm:p-8">
      {/* Detail Modal */}
      <Modal ref={modalRef} title="Application Details">
        {selected && (
          <div className="space-y-5 text-sm">
            <div className="flex items-center justify-between">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${STATUS_CONFIG[selected.status].badge}`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${STATUS_CONFIG[selected.status].dot}`}
                />
                {STATUS_CONFIG[selected.status].label}
              </span>
              <span className="text-xs text-gray-400">
                Applied{" "}
                {new Date(selected.createdAt).toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>

            <div className="bg-orange-50 rounded-xl p-4 border border-orange-100">
              <p className="font-semibold text-gray-900 text-base">
                {selected.job?.title}
              </p>
              <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-gray-500">
                {selected.job?.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {selected.job.location}
                  </span>
                )}
                {selected.job?.jobType && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {JOB_TYPE_LABELS[selected.job.jobType] ??
                      selected.job.jobType}
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Name</p>
                <p className="font-medium text-gray-800">
                  {selected.firstName} {selected.lastName}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Email</p>
                <p className="font-medium text-gray-800 truncate">
                  {selected.email}
                </p>
              </div>
              {selected.phone && (
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Phone</p>
                  <p className="font-medium text-gray-800">{selected.phone}</p>
                </div>
              )}
              {selected.resumeUrl && (
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Resume</p>
                  <a
                    href={selected.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-orange-600 hover:underline"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    Download
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>

            {selected.coverLetter && (
              <div>
                <p className="text-xs text-gray-400 mb-1.5">Cover Letter</p>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line bg-gray-50 rounded-xl p-4 text-sm border border-gray-100">
                  {selected.coverLetter}
                </p>
              </div>
            )}
          </div>
        )}
      </Modal>

      <div className="mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2.5 bg-orange-500 rounded-xl shadow-sm shadow-orange-200">
                <Briefcase className="size-5 text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                My Applications
              </h1>
            </div>
            <p className="text-gray-500 text-sm sm:text-base ml-1">
              Track the status of your job applications.
            </p>
          </div>
          <Link
            to="/careers"
            className="inline-flex items-center gap-2 text-sm font-medium text-orange-600 hover:text-orange-700 transition-colors self-start sm:self-auto"
          >
            Browse open positions
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <PageLoader query={query}>
          {(data) => {
            const applications: Application[] = data.data?.data ?? [];

            const counts = applications.reduce(
              (acc, a) => {
                acc[a.status] = (acc[a.status] ?? 0) + 1;
                return acc;
              },
              {} as Record<AppStatus, number>,
            );

            if (applications.length === 0) {
              return (
                <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
                  <div className="inline-flex p-4 bg-orange-50 rounded-full mb-4">
                    <Briefcase className="h-8 w-8 text-orange-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    No applications yet
                  </h3>
                  <p className="text-gray-500 mt-1 text-sm max-w-xs mx-auto">
                    Browse our open positions and submit your first application.
                  </p>
                  <Link
                    to="/careers"
                    className="inline-flex items-center gap-2 mt-5 bg-orange-500 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-orange-600 transition-colors"
                  >
                    Browse Positions
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              );
            }

            return (
              <div className="space-y-6">
                {/* Summary strip */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {(
                    [
                      "PENDING",
                      "REVIEWED",
                      "SHORTLISTED",
                      "REJECTED",
                    ] as AppStatus[]
                  ).map((s) => {
                    const cfg = STATUS_CONFIG[s];
                    return (
                      <div
                        key={s}
                        className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-3 shadow-sm"
                      >
                        <span
                          className={`w-2.5 h-2.5 rounded-full shrink-0 ${cfg.dot}`}
                        />
                        <div>
                          <p className="text-xl font-bold text-gray-900">
                            {counts[s] ?? 0}
                          </p>
                          <p className="text-xs text-gray-500">{cfg.label}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Application cards */}
                <div className="grid gap-4">
                  {applications.map((app) => {
                    const cfg =
                      STATUS_CONFIG[app.status] ?? STATUS_CONFIG.PENDING;
                    const isShortlisted = app.status === "SHORTLISTED";
                    return (
                      <div
                        key={app.id}
                        onClick={() => handleOpen(app)}
                        className="group relative bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 hover:border-orange-200 hover:shadow-xl hover:shadow-orange-500/5 transition-all duration-300 cursor-pointer"
                      >
                        <div className="flex items-start gap-4">
                          <div className="hidden sm:flex shrink-0 w-12 h-12 rounded-xl bg-orange-50 items-center justify-center group-hover:bg-orange-100 transition-colors">
                            <Briefcase className="w-5 h-5 text-orange-500" />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                              <h3 className="text-base font-bold text-gray-900 group-hover:text-orange-600 transition-colors truncate">
                                {app.job?.title}
                              </h3>
                              <div className="flex items-center gap-2 shrink-0">
                                {isShortlisted && (
                                  <span className="hidden sm:inline-flex items-center gap-1 text-xs font-medium text-green-600">
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    Shortlisted
                                  </span>
                                )}
                                <span
                                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${cfg.badge}`}
                                >
                                  <span
                                    className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`}
                                  />
                                  {cfg.label}
                                </span>
                              </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mb-2.5">
                              {app.job?.location && (
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3.5 h-3.5" />
                                  {app.job.location}
                                </span>
                              )}
                              {app.job?.jobType && (
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3.5 h-3.5" />
                                  {JOB_TYPE_LABELS[app.job.jobType] ??
                                    app.job.jobType}
                                </span>
                              )}
                              <span className="text-gray-400">
                                Applied{" "}
                                {new Date(app.createdAt).toLocaleDateString(
                                  "en-US",
                                  {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  },
                                )}
                              </span>
                            </div>

                            {app.coverLetter && (
                              <p className="text-xs text-gray-500 line-clamp-1 max-w-xl">
                                {app.coverLetter}
                              </p>
                            )}

                            {app.resumeUrl && (
                              <a
                                href={app.resumeUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                download
                                onClick={(e) => e.stopPropagation()}
                                className="inline-flex items-center gap-1.5 mt-2 text-xs font-medium text-orange-500 hover:underline"
                              >
                                <FileText className="w-3.5 h-3.5" />
                                View Resume
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                          </div>

                          <div className="shrink-0 self-center">
                            <div className="p-2 rounded-full bg-gray-50 text-gray-400 group-hover:bg-orange-100 group-hover:text-orange-600 transition-all">
                              <Eye className="h-4 w-4" />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          }}
        </PageLoader>
      </div>
    </div>
  );
}
