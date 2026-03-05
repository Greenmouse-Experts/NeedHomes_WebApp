import apiClient, { type ApiResponseV2 } from "@/api/simpleApi";
import QueryCompLayout from "@/components/layout/QueryCompLayout";
import Modal, { type ModalHandle } from "@/components/modals/DialogModal";
import { useAuth } from "@/store/authStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useRef, useState } from "react";
import { Trash2 } from "lucide-react";

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  author: {
    id: string;
    firstName: string;
    lastName: string;
    profilePicture: string;
  };
}

interface CommentFormData {
  content: string;
}

export default function Comments({ blogId }: { blogId: string }) {
  const [auth] = useAuth();
  const modalRef = useRef<ModalHandle>(null);
  const deleteModalRef = useRef<ModalHandle>(null);
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);

  const queryClient = useQueryClient();

  const query = useQuery<ApiResponseV2<Comment[]>>({
    queryKey: ["comments", blogId],
    queryFn: async () => {
      let resp = await apiClient.get(`/blogs/${blogId}/comments`);
      return resp.data;
    },
  });

  const createCommentMutation = useMutation({
    mutationFn: async (data: CommentFormData) => {
      let resp = await apiClient.post(`/blogs/${blogId}/comments`, data);
      return resp.data;
    },
    onSuccess: () => {
      toast.success("Comment added successfully");
      query.refetch();
      queryClient.invalidateQueries({ queryKey: ["comments", blogId] });
      modalRef.current?.close();
      comment_form.reset();
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Failed to add comment";
      toast.error(message);
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: async (commentId: string) => {
      let resp = await apiClient.delete(`/blogs/comments/${commentId}`);
      return resp.data;
    },
    onSuccess: () => {
      toast.success("Comment deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["comments", blogId] });
      deleteModalRef.current?.close();
      setCommentToDelete(null);
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Failed to delete comment";
      toast.error(message);
    },
  });

  const comment_form = useForm<CommentFormData>({
    defaultValues: { content: "" },
  });

  const onSubmit = (data: CommentFormData) => {
    if (!data.content.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }
    createCommentMutation.mutate(data);
  };

  const handleDeleteComment = (commentId: string) => {
    setCommentToDelete(commentId);
    deleteModalRef.current?.open();
  };

  const confirmDelete = () => {
    if (commentToDelete) {
      deleteCommentMutation.mutate(commentToDelete);
    }
  };

  return (
    <>
      <Modal
        ref={modalRef}
        title="Add a Comment"
        actions={
          <div className="flex gap-2">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => modalRef.current?.close()}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={comment_form.handleSubmit(onSubmit)}
              disabled={createCommentMutation.isPending}
            >
              {createCommentMutation.isPending ? "Posting..." : "Post Comment"}
            </button>
          </div>
        }
      >
        <form
          onSubmit={comment_form.handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <textarea
            placeholder="Write your comment here... (max 2000 characters)"
            maxLength={2000}
            {...comment_form.register("content", {
              required: "Comment cannot be empty",
              maxLength: {
                value: 2000,
                message: "Comment must be less than 2000 characters",
              },
            })}
            className="textarea textarea-bordered w-full"
            rows={4}
          />
          {comment_form.formState.errors.content && (
            <p className="text-red-500 text-sm">
              {comment_form.formState.errors.content.message}
            </p>
          )}
        </form>
      </Modal>

      <Modal
        ref={deleteModalRef}
        title="Delete Comment"
        actions={
          <div className="flex gap-2">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => deleteModalRef.current?.close()}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-error"
              onClick={confirmDelete}
              disabled={deleteCommentMutation.isPending}
            >
              {deleteCommentMutation.isPending ? "Deleting..." : "Delete"}
            </button>
          </div>
        }
      >
        <p>Are you sure you want to delete this comment?</p>
      </Modal>

      <div className="ring fade rounded-box">
        <div className="flex items-center p-4 border-b fade">
          <h2 className="font-semibold">Comments</h2>
          <button
            disabled={!auth}
            onClick={() => {
              if (!auth) {
                toast.error("You must be logged in to comment");
                return;
              }
              modalRef.current?.open();
            }}
            className="btn btn-primary ml-auto"
          >
            Add Comment
          </button>
        </div>

        <div className="p-4">
          <QueryCompLayout query={query}>
            {(resp) => {
              const comments = resp.data.data;

              if (!comments || comments.length === 0) {
                return (
                  <div className="text-center text-gray-500 py-8">
                    No comments yet. Be the first to comment!
                  </div>
                );
              }

              return (
                <div className="space-y-4">
                  {comments.map((comment: Comment) => (
                    <div
                      key={comment.id}
                      className="border rounded-lg p-4 hover:bg-gray-50 transition fade"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          {comment.author.profilePicture && (
                            <img
                              src={comment.author.profilePicture}
                              alt={`${comment.author.firstName} ${comment.author.lastName}`}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          )}
                          <div>
                            <p className="font-semibold">
                              {comment.author.firstName}{" "}
                              {comment.author.lastName}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(comment.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        {auth && auth.user.id === comment.author.id && (
                          <button
                            onClick={() => handleDeleteComment(comment.id)}
                            className="btn btn-error btn-soft ring fade btn-sm"
                            disabled={deleteCommentMutation.isPending}
                            title="Delete comment"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                      <p className="mt-3 text-gray-700">{comment.content}</p>
                    </div>
                  ))}
                </div>
              );
            }}
          </QueryCompLayout>
        </div>
      </div>
    </>
  );
}
