import { createFileRoute } from "@tanstack/react-router";
import { Bell, Send } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import { useForm, Controller } from "react-hook-form";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  Undo,
  Redo,
} from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import apiClient, { type ApiResponseV2 } from "@/api/simpleApi";
import QueryCompLayout from "@/components/layout/QueryCompLayout";
import { toast } from "sonner";
import { extract_message } from "@/helpers/apihelpers";
import ThemeProvider from "@/simpleComps/ThemeProvider";
import RenderFormattedText from "@/components/RenderFormattedText";

export const Route = createFileRoute("/dashboard/announcements")({
  component: AnnouncementsPage,
});

type AnnouncementTarget =
  | "INDIVIDUAL_INVESTORS"
  | "CORPORATE_INVESTORS"
  | "ALL_INVESTORS"
  | "ALL_PARTNERS"
  | "REAL_ESTATE_AGENT_PARTNERS"
  | "PROPERTY_DEVELOPERS"
  | "INVESTORS_AND_PARTNERS"
  | "ALL_USERS";

const userTypes: { value: AnnouncementTarget; label: string }[] = [
  { value: "ALL_USERS", label: "All Users" },
  { value: "ALL_INVESTORS", label: "All Investors" },
  { value: "INDIVIDUAL_INVESTORS", label: "Individual Investors" },
  { value: "CORPORATE_INVESTORS", label: "Corporate Investors" },
  { value: "ALL_PARTNERS", label: "All Partners" },
  { value: "REAL_ESTATE_AGENT_PARTNERS", label: "Real Estate Agent Partners" },
  { value: "PROPERTY_DEVELOPERS", label: "Property Developers" },
  { value: "INVESTORS_AND_PARTNERS", label: "Investors & Partners" },
];

interface Announcement {
  id: string;
  title: string;
  content: string;
  target: AnnouncementTarget;
  createdBy: string;
  createdAt: string;
  deletedAt: string | null;
}

type AnnouncementFormValues = {
  title: string;
  content: string;
  target: AnnouncementTarget;
};

function AnnouncementEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Placeholder.configure({ placeholder: "Type in your announcement..." }),
    ],
    content: value,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none min-h-[200px] p-4 focus:outline-none",
      },
    },
  });

  if (!editor) return null;

  const btn = (
    active: boolean,
    onClick: () => void,
    title: string,
    icon: React.ReactNode,
  ) => (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`btn btn-xs btn-ghost ${active ? "btn-active bg-base-200" : ""}`}
    >
      {icon}
    </button>
  );

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      <div className="flex flex-wrap items-center gap-0.5 p-2 border-b border-gray-200 bg-gray-50">
        {btn(
          editor.isActive("bold"),
          () => editor.chain().focus().toggleBold().run(),
          "Bold",
          <Bold size={13} />,
        )}
        {btn(
          editor.isActive("italic"),
          () => editor.chain().focus().toggleItalic().run(),
          "Italic",
          <Italic size={13} />,
        )}
        {btn(
          editor.isActive("underline"),
          () => editor.chain().focus().toggleUnderline().run(),
          "Underline",
          <UnderlineIcon size={13} />,
        )}
        <div className="w-px h-5 bg-gray-200 mx-1" />
        {btn(
          editor.isActive("bulletList"),
          () => editor.chain().focus().toggleBulletList().run(),
          "Bullet List",
          <List size={13} />,
        )}
        {btn(
          editor.isActive("orderedList"),
          () => editor.chain().focus().toggleOrderedList().run(),
          "Numbered List",
          <ListOrdered size={13} />,
        )}
        <div className="w-px h-5 bg-gray-200 mx-1" />
        {btn(
          false,
          () => editor.chain().focus().undo().run(),
          "Undo",
          <Undo size={13} />,
        )}
        {btn(
          false,
          () => editor.chain().focus().redo().run(),
          "Redo",
          <Redo size={13} />,
        )}
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}

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
    control,
    formState: { isValid },
  } = useForm<AnnouncementFormValues>({
    defaultValues: {
      title: "",
      content: "",
      target: "ALL_USERS",
    },
  });

  const onSubmit = (data: AnnouncementFormValues) => {
    toast.promise(annouce.mutateAsync(data), {
      loading: "Sending notification...",
      success: "Notification sent successfully!",
      error: extract_message,
    });
  };

  const annouce = useMutation({
    mutationFn: (data: { title: string; content: string; target: string }) => {
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
                            {announcement.title && (
                              <p className="font-semibold text-sm text-gray-900 mb-0.5">
                                {announcement.title}
                              </p>
                            )}
                            <RenderFormattedText text={announcement.content} />
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

            {/* Title */}
            <div className="space-y-2">
              <Label
                htmlFor="title"
                className="text-sm font-semibold text-gray-700 flex items-center gap-2"
              >
                Title
                <span className="text-red-500">*</span>
              </Label>
              <input
                id="title"
                className="input input-bordered w-full"
                placeholder="e.g. Platform Maintenance Notice"
                {...register("title", { required: true })}
              />
            </div>

            {/* Announcement WYSIWYG */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                Announcement <span className="text-red-500">*</span>
              </Label>
              <Controller
                name="content"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <AnnouncementEditor
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
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
