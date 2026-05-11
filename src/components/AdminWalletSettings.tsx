import { useState } from "react";
import apiClient, { type ApiResponse } from "@/api/simpleApi";
import QueryCompLayout from "@/components/layout/QueryCompLayout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import SimpleInput from "@/simpleComps/inputs/SimpleInput";
import { toast } from "sonner";
import ThemeProvider from "@/simpleComps/ThemeProvider";
import { extract_message } from "@/helpers/apihelpers";
import { Pencil, Trash2, Plus, Check, X, KeyRound } from "lucide-react";

interface SecurityQuestion {
  id: string;
  question: string;
  isActive: boolean;
  order: number;
}

export default function AdminWalletSettings() {
  const query = useQuery<ApiResponse<SecurityQuestion[]>>({
    queryKey: ["admin-security-questions"],
    queryFn: async () => {
      const res = await apiClient.get("/admin/security-questions");
      return res.data;
    },
  });

  return (
    <ThemeProvider className="ring fade rounded-box">
      <div className="flex items-center gap-2 p-4 border-b fade">
        <KeyRound className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-bold">Withdrawal PIN — Security Questions</h2>
      </div>
      <div className="p-4">
        <QueryCompLayout query={query}>
          {(data) => <QuestionManager questions={data.data ?? []} />}
        </QueryCompLayout>
      </div>
    </ThemeProvider>
  );
}

function QuestionManager({ questions }: { questions: SecurityQuestion[] }) {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  const editForm = useForm({
    defaultValues: { question: "", order: 0, isActive: true },
  });

  const addForm = useForm({
    defaultValues: { question: "", order: 0 },
  });

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["admin-security-questions"] });

  const createMutation = useMutation({
    mutationFn: async (data: { question: string; order: number }) => {
      const res = await apiClient.post("/admin/security-questions", data);
      return res.data;
    },
    onSuccess: () => {
      invalidate();
      setAdding(false);
      addForm.reset();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: {
      id: string;
      question: string;
      order: number;
      isActive: boolean;
    }) => {
      const { id, ...body } = data;
      const res = await apiClient.patch(
        `/admin/security-questions/${id}`,
        body,
      );
      return res.data;
    },
    onSuccess: () => {
      invalidate();
      setEditingId(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiClient.delete(`/admin/security-questions/${id}`);
      return res.data;
    },
    onSuccess: invalidate,
  });

  const toggleMutation = useMutation({
    mutationFn: async (q: SecurityQuestion) => {
      const res = await apiClient.patch(`/admin/security-questions/${q.id}`, {
        isActive: !q.isActive,
      });
      return res.data;
    },
    onSuccess: invalidate,
  });

  const startEdit = (q: SecurityQuestion) => {
    editForm.reset({ question: q.question, order: q.order, isActive: q.isActive });
    setEditingId(q.id);
  };

  return (
    <div className="space-y-4">
      {/* Question list */}
      <div className="space-y-2">
        {questions.length === 0 && !adding && (
          <p className="text-sm text-gray-400 text-center py-6">
            No security questions yet. Add one below.
          </p>
        )}

        {questions.map((q) =>
          editingId === q.id ? (
            /* ── Inline edit row ── */
            <form
              key={q.id}
              onSubmit={editForm.handleSubmit((data) => {
                toast.promise(
                  updateMutation.mutateAsync({ id: q.id, ...data }),
                  {
                    loading: "Saving...",
                    success: "Question updated.",
                    error: extract_message,
                  },
                );
              })}
              className="flex gap-2 items-start p-3 border border-primary/30 rounded-lg bg-base-100 fade"
            >
              <div className="flex-1 space-y-2">
                <SimpleInput
                  {...editForm.register("question", {
                    required: "Question text is required",
                  })}
                  label=""
                  placeholder="Security question text"
                />
                <div className="flex items-center gap-4">
                  <SimpleInput
                    {...editForm.register("order", { valueAsNumber: true })}
                    label=""
                    type="number"
                    placeholder="Order"
                    className="w-24"
                  />
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-primary checkbox-sm"
                      {...editForm.register("isActive")}
                    />
                    Active
                  </label>
                </div>
              </div>
              <div className="flex gap-1 pt-1">
                <button
                  type="submit"
                  className="btn btn-primary btn-xs gap-1"
                  disabled={updateMutation.isPending}
                >
                  <Check size={13} />
                  Save
                </button>
                <button
                  type="button"
                  className="btn btn-ghost btn-xs"
                  onClick={() => setEditingId(null)}
                >
                  <X size={13} />
                </button>
              </div>
            </form>
          ) : (
            /* ── Display row ── */
            <div
              key={q.id}
              className={`flex items-center gap-3 p-3 border rounded-lg fade ${
                q.isActive
                  ? "border-gray-200 bg-white"
                  : "border-gray-100 bg-gray-50 opacity-60"
              }`}
            >
              <span className="text-xs text-gray-400 w-5 text-center font-mono">
                {q.order}
              </span>
              <p className="flex-1 text-sm text-gray-800">{q.question}</p>
              <span
                className={`badge badge-sm ${q.isActive ? "badge-success" : "badge-ghost"}`}
              >
                {q.isActive ? "Active" : "Inactive"}
              </span>
              <div className="flex gap-1">
                <button
                  type="button"
                  className="btn btn-ghost btn-xs"
                  onClick={() =>
                    toast.promise(toggleMutation.mutateAsync(q), {
                      loading: "Updating...",
                      success: `Question ${q.isActive ? "deactivated" : "activated"}.`,
                      error: extract_message,
                    })
                  }
                  disabled={toggleMutation.isPending}
                  title={q.isActive ? "Deactivate" : "Activate"}
                >
                  {q.isActive ? (
                    <X size={14} className="text-gray-400" />
                  ) : (
                    <Check size={14} className="text-gray-400" />
                  )}
                </button>
                <button
                  type="button"
                  className="btn btn-ghost btn-xs"
                  onClick={() => startEdit(q)}
                  title="Edit"
                >
                  <Pencil size={14} className="text-gray-500" />
                </button>
                <button
                  type="button"
                  className="btn btn-ghost btn-xs text-error"
                  onClick={() => {
                    if (
                      confirm(
                        "Delete this question? Existing users who selected it won't be affected.",
                      )
                    ) {
                      toast.promise(deleteMutation.mutateAsync(q.id), {
                        loading: "Deleting...",
                        success: "Question deleted.",
                        error: extract_message,
                      });
                    }
                  }}
                  disabled={deleteMutation.isPending}
                  title="Delete"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ),
        )}
      </div>

      {/* Add new question */}
      {adding ? (
        <form
          onSubmit={addForm.handleSubmit((data) => {
            toast.promise(createMutation.mutateAsync(data), {
              loading: "Adding question...",
              success: "Security question added.",
              error: extract_message,
            });
          })}
          className="flex gap-2 items-start p-3 border border-dashed border-primary/40 rounded-lg bg-base-100 fade"
        >
          <div className="flex-1 space-y-2">
            <SimpleInput
              {...addForm.register("question", {
                required: "Question text is required",
              })}
              label=""
              placeholder="e.g. What is your middle name?"
            />
            <SimpleInput
              {...addForm.register("order", { valueAsNumber: true })}
              label=""
              type="number"
              placeholder="Display order (optional)"
            />
          </div>
          <div className="flex gap-1 pt-1">
            <button
              type="submit"
              className="btn btn-primary btn-xs gap-1"
              disabled={createMutation.isPending}
            >
              <Check size={13} />
              Add
            </button>
            <button
              type="button"
              className="btn btn-ghost btn-xs"
              onClick={() => {
                setAdding(false);
                addForm.reset();
              }}
            >
              <X size={13} />
            </button>
          </div>
        </form>
      ) : (
        <button
          type="button"
          className="btn btn-ghost btn-sm gap-2 text-primary"
          onClick={() => setAdding(true)}
        >
          <Plus size={16} />
          Add Security Question
        </button>
      )}

      <p className="text-xs text-gray-400 pt-1">
        Deleting a question only prevents new users from selecting it — existing
        users who chose it are not affected.
      </p>
    </div>
  );
}
