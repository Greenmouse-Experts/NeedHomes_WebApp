import apiClient, { type ApiResponseV2 } from "@/api/simpleApi";
import QueryCompLayout from "@/components/layout/QueryCompLayout";
import Modal, { type ModalHandle } from "@/components/modals/DialogModal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

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

export default function ListComment({ id }: { id: string }) {
  const deleteModalRef = useRef<ModalHandle>(null);
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const query = useQuery<ApiResponseV2<Comment[]>>({
    queryKey: ["comments", id],
    queryFn: async () => {
      const resp = await apiClient.get(`/blogs/${id}/comments`);
      return resp.data;
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: async (commentId: string) => {
      const resp = await apiClient.delete(`/blogs/comments/${commentId}`);
      return resp.data;
    },
    onSuccess: () => {
      toast.success("Comment deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["comments", id] });
      deleteModalRef.current?.close();
      setCommentToDelete(null);
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Failed to delete comment";
      toast.error(message);
    },
  });

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

      <QueryCompLayout query={query}>
        {(resp) => {
          const comments = resp.data.data;

          if (!comments || comments.length === 0) {
            return (
              <div className="text-center text-gray-500 py-8">
                No comments yet.
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
                          {comment.author.firstName} {comment.author.lastName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      className="btn btn-error btn-soft ring fade btn-sm"
                      disabled={deleteCommentMutation.isPending}
                      title="Delete comment"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <p className="mt-3 text-gray-700">{comment.content}</p>
                </div>
              ))}
            </div>
          );
        }}
      </QueryCompLayout>
    </>
  );
}
