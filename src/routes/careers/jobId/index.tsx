import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Briefcase,
  MapPin,
  Clock,
  FileText,
  ExternalLink,
  ArrowRight,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import apiClient, { type ApiResponseV2 } from "@/api/simpleApi";
import PageLoader from "@/components/layout/PageLoader";

export const Route = createFileRoute("/careers/jobId/")({
  component: RouteComponent,
});

interface Application {
  id: string;
  jobId: string;
  userId: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  coverLetter: string;
  resumeUrl: string;
  status: "PENDING" | "REVIEWED" | "SHORTLISTED" | "REJECTED";
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

const STATUS_STYLES: Record<
  Application["status"],
  { badge: string; dot: string; label: string }
> = {
  PENDING: {
    badge: "bg-yellow-100 text-yellow-700",
    dot: "bg-yellow-500",
    label: "Pending",
  },
  REVIEWED: {
    badge: "bg-blue-100 text-blue-700",
    dot: "bg-blue-500",
    label: "Reviewed",
  },
  SHORTLISTED: {
    badge: "bg-green-100 text-green-700",
    dot: "bg-green-500",
    label: "Shortlisted",
  },
  REJECTED: {
    badge: "bg-red-100 text-red-700",
    dot: "bg-red-500",
    label: "Rejected",
  },
};

function RouteComponent() {
  const query = useQuery<ApiResponseV2<Application[]>>({
    queryKey: ["my-applications"],
    queryFn: async () => {
      const resp = await apiClient.get("careers/applications/my-applications");
      return resp.data;
    },
  });

  return (
    <div className="min-h-screen bg-[#f8f8f8]">
      {/* Header */}
      <section className="bg-[#333d42] py-16">
        <div className="contain mx-auto px-6">
          <div className="flex items-center gap-3 mb-2">
            <Briefcase className="h-7 w-7 text-brand-orange" />
            <h1 className="text-4xl font-serif font-medium text-white">
              My Applications<span className="text-brand-orange">.</span>
            </h1>
          </div>
          <p className="text-white/70 mt-2 text-base">
            Track the status of your job applications.
          </p>
        </div>
      </section>

      <div className="contain mx-auto px-6 py-12">
        <PageLoader query={query}>
          {(data) => {
            const applications: Application[] = data.data?.data ?? [];

            if (applications.length === 0) {
              return (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                  <div className="w-16 h-16 bg-brand-orange/10 rounded-full flex items-center justify-center mb-4">
                    <Briefcase className="w-8 h-8 text-brand-orange" />
                  </div>
                  <h3 className="text-xl font-serif font-medium text-[#333d42] mb-2">
                    No applications yet
                  </h3>
                  <p className="text-muted-foreground text-sm mb-6 max-w-sm">
                    You haven't applied for any positions yet. Browse our open
                    roles and submit your first application.
                  </p>
                  <Link
                    to="/careers"
                    className="inline-flex items-center gap-2 bg-brand-orange text-white px-6 py-3 rounded-lg font-medium hover:bg-brand-orange/90 transition-colors text-sm"
                  >
                    Browse Open Positions
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              );
            }

            return (
              <div className="space-y-4">
                {applications.map((app) => {
                  const statusStyle =
                    STATUS_STYLES[app.status] ?? STATUS_STYLES.PENDING;
                  return (
                    <div
                      key={app.id}
                      className="bg-white border-l-4 border-brand-orange p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xl font-serif font-medium text-[#333d42]">
                            {app.job?.title}
                          </h3>
                          <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-muted-foreground">
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
                          </div>

                          {app.coverLetter && (
                            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 max-w-2xl mt-3">
                              {app.coverLetter}
                            </p>
                          )}

                          <div className="flex flex-wrap items-center gap-4 mt-4">
                            <span className="text-xs text-muted-foreground">
                              Applied{" "}
                              {new Date(app.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                                },
                              )}
                            </span>
                            {app.resumeUrl && (
                              <a
                                href={app.resumeUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                download
                                className="inline-flex items-center gap-1.5 text-xs text-brand-orange font-medium hover:underline"
                              >
                                <FileText className="w-3.5 h-3.5" />
                                View Resume
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                          </div>
                        </div>

                        <div className="shrink-0">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${statusStyle.badge}`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`}
                            />
                            {statusStyle.label}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}

                <div className="pt-4 text-center">
                  <Link
                    to="/careers"
                    className="inline-flex items-center gap-2 text-sm font-medium text-brand-orange hover:gap-3 transition-all"
                  >
                    Browse more positions
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          }}
        </PageLoader>
      </div>
    </div>
  );
}
