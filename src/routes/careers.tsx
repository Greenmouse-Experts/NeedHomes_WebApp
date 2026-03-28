import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Briefcase,
  MapPin,
  Clock,
  ArrowRight,
  Users,
  FileText,
  Upload,
  X,
} from "lucide-react";
import Footer from "@/components/home/Footer";
import { Card, CardContent } from "@/components/ui/Card";
import { useQuery, useMutation } from "@tanstack/react-query";
import apiClient from "@/api/simpleApi";
import type { ApiResponseV2, ApiResponse } from "@/api/simpleApi";
import { useRef, useState } from "react";
import Modal, { type ModalHandle } from "@/components/modals/DialogModal";
import { toast } from "sonner";
import { useAuth } from "@/store/authStore";

export const Route = createFileRoute("/careers")({
  component: RouteComponent,
});

interface Job {
  id: string;
  title: string;
  location: string;
  jobType: string;
  description: string;
  requirements: string;
  category: { id: string; name: string; type: string };
}

interface ApplyForm {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  coverLetter: string;
}

const JOB_TYPE_LABELS: Record<string, string> = {
  FULL_TIME: "Full-time",
  PART_TIME: "Part-time",
  CONTRACT: "Contract",
  REMOTE: "Remote",
  HYBRID: "Hybrid",
};

const EMPTY_FORM: ApplyForm = {
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  coverLetter: "",
};

function RouteComponent() {
  const [authUser] = useAuth();
  const modalRef = useRef<ModalHandle>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [form, setForm] = useState<ApplyForm>(EMPTY_FORM);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);

  const jobsQuery = useQuery<ApiResponseV2<Job[]>>({
    queryKey: ["careers-public"],
    queryFn: async () => {
      const resp = await apiClient.get("/careers");
      return resp.data;
    },
  });

  const myApplicationsQuery = useQuery<ApiResponse>({
    queryKey: ["my-applications"],
    queryFn: async () => {
      const resp = await apiClient.get("careers/applications/my-applications");
      return resp.data;
    },
    enabled: !!authUser,
  });

  const appliedJobIds = new Set<string>(
    (myApplicationsQuery.data?.data?.data ?? []).map((a: any) => a.jobId),
  );

  const uploadResumeMutation = useMutation({
    mutationFn: async (file: File) => {
      const fd = new FormData();
      fd.append("file", file);
      const resp = await apiClient.post("multimedia/upload", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return resp.data.data.url as string;
    },
  });

  const applyMutation = useMutation({
    mutationFn: async ({
      jobId,
      body,
    }: {
      jobId: string;
      body: ApplyForm & { resumeUrl: string };
    }) => {
      const resp = await apiClient.post(`careers/${jobId}/apply`, body);
      return resp.data;
    },
    onSuccess: () => {
      toast.success("Application submitted successfully!");
      modalRef.current?.close();
      setForm(EMPTY_FORM);
      setResumeFile(null);
      setResumeUrl(null);
      myApplicationsQuery.refetch();
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.message ?? "Failed to submit application.";
      toast.error(msg);
    },
  });

  const handleApplyClick = (job: Job) => {
    if (!authUser) {
      toast.error("Please sign in to apply for this position.");
      return;
    }
    setSelectedJob(job);
    setForm({
      firstName: (authUser.user as any)?.firstName ?? "",
      lastName: (authUser.user as any)?.lastName ?? "",
      email: (authUser.user as any)?.email ?? "",
      phone: "",
      coverLetter: "",
    });
    setResumeFile(null);
    setResumeUrl(null);
    modalRef.current?.open();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJob) return;

    if (!resumeFile && !resumeUrl) {
      toast.error("Please upload your resume (PDF).");
      return;
    }

    let url = resumeUrl;
    if (!url && resumeFile) {
      try {
        url = await uploadResumeMutation.mutateAsync(resumeFile);
        setResumeUrl(url);
      } catch {
        toast.error("Failed to upload resume. Please try again.");
        return;
      }
    }

    applyMutation.mutate({
      jobId: selectedJob.id,
      body: { ...form, resumeUrl: url! },
    });
  };

  const isSubmitting =
    uploadResumeMutation.isPending || applyMutation.isPending;

  const jobs: Job[] = jobsQuery.data?.data?.data ?? [];

  const benefits = [
    {
      title: "Competitive Salary",
      description:
        "Industry-leading compensation packages with performance bonuses and equity opportunities.",
    },
    {
      title: "Professional Growth",
      description:
        "Access to training programs, conferences, and mentorship from industry leaders.",
    },
    {
      title: "Health & Wellness",
      description:
        "Comprehensive health insurance coverage for you and your immediate family.",
    },
    {
      title: "Flexible Work",
      description:
        "Hybrid work environment with flexible hours to support work-life balance.",
    },
    {
      title: "Investment Opportunities",
      description:
        "Exclusive access to NeedHomes investment deals with preferential terms for employees.",
    },
    {
      title: "Team Culture",
      description:
        "Collaborative environment with regular team events and professional development sessions.",
    },
  ];

  const values = [
    {
      title: "Innovation",
      description:
        "We constantly seek new ways to improve the real estate investment experience.",
    },
    {
      title: "Integrity",
      description:
        "Transparency and ethical conduct are the foundation of everything we do.",
    },
    {
      title: "Excellence",
      description:
        "We set high standards and consistently deliver exceptional results.",
    },
    {
      title: "Collaboration",
      description:
        "We believe the best outcomes come from diverse perspectives working together.",
    },
  ];

  return (
    <>
      <div className="min-h-screen bg-white">
        {/* Header Section */}
        <section className="bg-[#333d42] py-20">
          <div className="contain mx-auto px-6">
            <h1 className="text-5xl md:text-6xl font-serif font-medium text-white">
              Careers<span className="text-brand-orange">.</span>
            </h1>
            <p className="text-white/80 mt-4 text-lg max-w-2xl">
              Join us in transforming the future of real estate investment in
              Africa.
            </p>
          </div>
        </section>

        {/* Mission Statement */}
        <section className="py-20 bg-[#f8f8f8]">
          <div className="contain mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
            <h2 className="text-3xl md:text-4xl font-serif font-medium leading-tight text-[#333d42]">
              Build the future of property wealth with Africa's leading PropTech
              innovators<span className="text-brand-orange">.</span>
            </h2>
            <div className="space-y-6 text-muted-foreground leading-relaxed">
              <p>
                At NeedHomes, we're not just building properties—we're building
                futures. Our team is composed of passionate professionals
                dedicated to making real estate investment accessible and
                profitable across Africa.
              </p>
              <p>
                If you're driven by innovation, committed to excellence, and
                ready to make a meaningful impact, we want to hear from you.
              </p>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="py-24">
          <div className="contain mx-auto px-6">
            <h2 className="text-4xl font-serif font-medium text-[#333d42] mb-4">
              Our Values<span className="text-brand-orange">.</span>
            </h2>
            <p className="text-muted-foreground mb-12 max-w-3xl">
              These core values guide everything we do and define who we are as
              a company.
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, i) => (
                <Card
                  key={i}
                  className="border-none bg-[#f8f8f8] rounded-none shadow-none relative overflow-hidden"
                >
                  <CardContent className="p-8 space-y-4">
                    <h3 className="text-xl font-serif font-medium text-[#333d42]">
                      {value.title}
                      <span className="text-brand-orange">.</span>
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {value.description}
                    </p>
                  </CardContent>
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-brand-orange" />
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Open Positions */}
        <section className="py-24 bg-[#f8f8f8]">
          <div className="contain mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
              <div>
                <h2 className="text-4xl font-serif font-medium text-[#333d42]">
                  Open Positions<span className="text-brand-orange">.</span>
                </h2>
                <p className="text-muted-foreground mt-4">
                  Explore current opportunities to join our growing team.
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Users className="w-4 h-4 text-brand-orange" />
                <span className="text-muted-foreground">
                  {jobs.length} position{jobs.length !== 1 ? "s" : ""} available
                </span>
              </div>
            </div>

            {jobsQuery.isLoading && (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="bg-white p-6 md:p-8 border-l-4 border-brand-orange animate-pulse"
                  >
                    <div className="h-7 bg-gray-200 rounded w-1/3 mb-3" />
                    <div className="h-4 bg-gray-100 rounded w-1/2 mb-4" />
                    <div className="h-4 bg-gray-100 rounded w-full" />
                  </div>
                ))}
              </div>
            )}

            {jobsQuery.isError && (
              <p className="text-muted-foreground">
                Failed to load positions. Please try again later.
              </p>
            )}

            {!jobsQuery.isLoading && !jobsQuery.isError && jobs.length === 0 && (
              <p className="text-muted-foreground">
                No open positions at the moment. Check back soon.
              </p>
            )}

            <div className="space-y-4">
              {jobs.map((job) => {
                const hasApplied = appliedJobIds.has(job.id);
                return (
                  <div
                    key={job.id}
                    className="bg-white p-6 md:p-8 border-l-4 border-brand-orange hover:shadow-lg transition-shadow group"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                      <div>
                        <h3 className="text-2xl font-serif font-medium text-[#333d42] group-hover:text-brand-orange transition-colors">
                          {job.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground">
                          {job.category && (
                            <span className="flex items-center gap-1">
                              <Briefcase className="w-4 h-4" />
                              {job.category.name}
                            </span>
                          )}
                          {job.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {job.location}
                            </span>
                          )}
                          {job.jobType && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {JOB_TYPE_LABELS[job.jobType] ?? job.jobType}
                            </span>
                          )}
                        </div>
                      </div>
                      {hasApplied ? (
                        <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-green-50 text-green-700 text-sm font-medium whitespace-nowrap">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                          Applied
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleApplyClick(job)}
                          className="flex items-center gap-2 text-sm font-medium text-brand-orange hover:gap-3 transition-all whitespace-nowrap"
                        >
                          Apply Now
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      {job.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Benefits & Perks */}
        <section className="py-24">
          <div className="contain mx-auto px-6">
            <h2 className="text-4xl font-serif font-medium text-[#333d42] mb-4">
              Benefits & Perks<span className="text-brand-orange">.</span>
            </h2>
            <p className="text-muted-foreground mb-12 max-w-3xl">
              We invest in our team because we believe great people deliver
              great results.
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {benefits.map((benefit, i) => (
                <div key={i} className="space-y-3">
                  <div className="w-12 h-12 bg-brand-orange/10 rounded-lg flex items-center justify-center">
                    <span className="text-2xl font-serif text-brand-orange">
                      {i + 1}
                    </span>
                  </div>
                  <h3 className="text-xl font-serif font-medium text-[#333d42]">
                    {benefit.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-[#333d42]">
          <div className="contain mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-serif font-medium text-white mb-4">
              Don't see a role that fits?
            </h2>
            <p className="text-white/80 mb-8 max-w-2xl mx-auto">
              We're always looking for talented individuals to join our team.
              Send us your resume and tell us how you can contribute to our
              mission.
            </p>
            <Link
              to="/contact-us"
              className="inline-flex items-center gap-2 bg-brand-orange text-white px-8 py-4 rounded-lg font-medium hover:bg-brand-orange/90 transition-colors"
            >
              Get in Touch
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </div>

      {/* Apply Modal */}
      <Modal ref={modalRef} title={`Apply — ${selectedJob?.title ?? ""}`}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                maxLength={100}
                value={form.firstName}
                onChange={(e) =>
                  setForm((f) => ({ ...f, firstName: e.target.value }))
                }
                className="input input-bordered w-full"
                placeholder="John"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                maxLength={100}
                value={form.lastName}
                onChange={(e) =>
                  setForm((f) => ({ ...f, lastName: e.target.value }))
                }
                className="input input-bordered w-full"
                placeholder="Doe"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) =>
                setForm((f) => ({ ...f, email: e.target.value }))
              }
              className="input input-bordered w-full"
              placeholder="john.doe@example.com"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              required
              maxLength={20}
              value={form.phone}
              onChange={(e) =>
                setForm((f) => ({ ...f, phone: e.target.value }))
              }
              className="input input-bordered w-full"
              placeholder="08012345678"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">
              Cover Letter{" "}
              <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <textarea
              maxLength={2000}
              rows={4}
              value={form.coverLetter}
              onChange={(e) =>
                setForm((f) => ({ ...f, coverLetter: e.target.value }))
              }
              className="textarea textarea-bordered w-full resize-none"
              placeholder="Tell us why you're a great fit for this role…"
            />
            <p className="text-xs text-gray-400 text-right">
              {form.coverLetter.length}/2000
            </p>
          </div>

          {/* Resume Upload */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">
              Resume / CV <span className="text-red-500">*</span>
            </label>
            {resumeFile ? (
              <div className="flex items-center gap-3 p-3 border rounded-lg bg-gray-50">
                <FileText className="w-5 h-5 text-brand-orange shrink-0" />
                <span className="text-sm text-gray-700 flex-1 truncate">
                  {resumeFile.name}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setResumeFile(null);
                    setResumeUrl(null);
                  }}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center gap-2 h-24 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-brand-orange transition-colors">
                <Upload className="w-5 h-5 text-gray-400" />
                <span className="text-sm text-gray-500">
                  Click to upload PDF (max 100MB)
                </span>
                <input
                  type="file"
                  accept=".pdf,application/pdf"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setResumeFile(file);
                      setResumeUrl(null);
                    }
                  }}
                />
              </label>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => modalRef.current?.close()}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn bg-brand-orange text-white hover:bg-brand-orange/90 border-none min-w-28"
            >
              {isSubmitting ? (
                <span className="loading loading-spinner loading-sm" />
              ) : (
                "Submit Application"
              )}
            </button>
          </div>
        </form>
      </Modal>

      <Footer />
    </>
  );
}
