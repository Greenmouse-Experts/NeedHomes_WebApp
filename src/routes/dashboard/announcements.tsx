import { createFileRoute } from "@tanstack/react-router";
import { Bell, Send } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import apiClient, { type ApiResponseV2 } from "@/api/simpleApi";
import QueryCompLayout from "@/components/layout/QueryCompLayout";
import { toast } from "sonner";
import { extract_message } from "@/helpers/apihelpers";
import ThemeProvider from "@/simpleComps/ThemeProvider";

export const Route = createFileRoute("/dashboard/announcements")({
  component: AnnouncementsPage,
});

const userTypes = [
  { value: "ALL_USERS", label: "All Users" },
  { value: "INVESTORS", label: "Investors" },
  { value: "PARTNERS", label: "Partners" },
  { value: "INVESTORS_AND_PARTNERS", label: "Investors & Partners" },
];

interface Announcement {
  id: string;
  content: string;
  target: "ALL_USERS" | "INVESTORS" | "PARTNERS" | "INVESTORS_AND_PARTNERS";
  createdBy: string;
  createdAt: string;
  deletedAt: string | null;
}

type AnnouncementFormValues = {
  content: string;
  target: "ALL_USERS" | "INVESTORS" | "PARTNERS" | "INVESTORS_AND_PARTNERS";
};

function AnnouncementsPage() {
  const query = useQuery<ApiResponseV2<Announcement[]>>({
    queryKey: ["announcements"],
    queryFn: async () => {
      let resp = await apiClient.get("/announcements");
      return resp.data;
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { isValid },
  } = useForm<AnnouncementFormValues>({
    defaultValues: {
      content: "",
      target: "ALL_USERS",
    },
  });

  const announcementText = watch("content");

  const onSubmit = (data: AnnouncementFormValues) => {
    toast.promise(annouce.mutateAsync(data), {
      loading: "Sending notification...",
      success: "Notification sent successfully!",
      error: extract_message,
    });
  };

  const annouce = useMutation({
    mutationFn: (data: { content: string; target: string }) => {
      return apiClient.post("/announcements", data);
    },
    onSuccess: () => {
      reset();
      query.refetch();
    },
  });

  return (
    <DashboardLayout title="Super Admin Dashboard" subtitle="Announcements">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Announcements List */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden flex flex-col">
          <div className="p-4 md:p-6 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <h2 className="text-lg md:text-xl font-bold text-gray-900">
                Announcement History
              </h2>
              <span className="text-xs md:text-sm text-gray-500 bg-white px-2 md:px-3 py-1 rounded-full border border-gray-200">
                {query.data?.data?.length || 0} Total
              </span>
            </div>
          </div>

          <div className="overflow-y-auto flex-1 max-h-[calc(100vh-300px)]">
            <div className="divide-y divide-gray-100">
              <QueryCompLayout query={query}>
                {(data) => {
                  const announcements = data.data.data;
                  return (
                    <>
                      {announcements.map((announcement) => (
                        <ThemeProvider
                          key={announcement.id}
                          className="p-5 hover:bg-base-200/50 transition-all duration-200 flex gap-4 items-start border-b  fade last:border-0 group first:!border-b"
                        >
                          <div className="flex-none">
                            <div className="bg-primary/10 text-primary rounded-2xl w-10 h-10 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                              <Bell className="w-5 h-5" />
                            </div>
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <div className="badge badge-accent mb-1 badge-soft badge-sm ring fade bg-base-200 border-none text-[10px] font-bold tracking-tight uppercase opacity-70">
                                {announcement.target.replace(/_/g, " ")}
                              </div>
                              <span className="text-[11px] font-medium opacity-40">
                                {new Date(
                                  announcement.createdAt,
                                ).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                              </span>
                            </div>
                            <p className="">{announcement.content}</p>
                          </div>
                        </ThemeProvider>
                      ))}
                      {announcements.length === 0 && (
                        <div className="p-8 text-center text-gray-500">
                          No announcements found.
                        </div>
                      )}
                    </>
                  );
                }}
              </QueryCompLayout>
            </div>
          </div>
        </div>

        {/* Send Notification Form */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4 md:p-6">
          <div className="mb-4 md:mb-6 pb-3 md:pb-4 border-b border-gray-200">
            <div className="flex items-center gap-2 md:gap-3 mb-2">
              <div className="p-1.5 md:p-2 bg-(--color-orange)/10 rounded-lg">
                <Send className="w-4 h-4 md:w-5 md:h-5 text-(--color-orange)" />
              </div>
              <h2 className="text-lg md:text-xl font-bold text-gray-900">
                SEND NOTIFICATION
              </h2>
            </div>
            <p className="text-xs md:text-sm text-gray-500 ml-8 md:ml-11">
              Create and send announcements to users
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* User Type Selection */}
            <div className="space-y-2">
              <Label
                htmlFor="target"
                className="text-sm font-semibold text-gray-700 flex items-center gap-2"
              >
                User Type
                <span className="text-red-500">*</span>
              </Label>
              <Select
                id="target"
                options={userTypes}
                {...register("target", { required: true })}
                className="w-full"
              />
            </div>

            {/* Announcement Textarea */}
            <div className="space-y-2">
              <Label
                htmlFor="content"
                className="text-sm font-semibold text-gray-700 flex items-center gap-2"
              >
                Announcement
                <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="content"
                placeholder="Type in your announcement..."
                {...register("content", { required: true })}
                rows={10}
                className="resize-none min-h-50"
              />
              <p className="text-xs text-gray-500">
                {announcementText.length} characters
              </p>
            </div>

            {/* Send Button */}
            <Button
              type="submit"
              variant="primary"
              className="w-full gap-2 h-12 text-base font-semibold shadow-md hover:shadow-lg transition-all"
              disabled={!isValid || annouce.isPending}
            >
              <Send className="w-5 h-5" />
              Send Notification
            </Button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
