import apiClient, { type ApiResponseV2 } from "@/api/simpleApi";
import PageLoader from "@/components/layout/PageLoader";
import Modal from "@/components/modals/DialogModal";
import CustomTable, { type columnType } from "@/components/tables/CustomTable";
import type { Actions } from "@/components/tables/pop-up";
import { extract_message } from "@/helpers/apihelpers";
import { useModal } from "@/store/modals";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/blogs/categories/")({
  component: RouteComponent,
});

function RouteComponent() {
  const queryClient = useQueryClient();
  const { ref, showModal, closeModal } = useModal();
  const [name, setName] = useState("");
  const [editCategory, setEditCategory] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [editName, setEditName] = useState("");
  const nav = useNavigate();

  const query = useQuery<ApiResponseV2<[{ name: string; id: string }]>>({
    queryKey: ["blog-categories"],
    queryFn: async () => {
      let resp = await apiClient.get("/blogs/categories");
      return resp.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: { name: string }) => {
      const resp = await apiClient.post("/blogs/categories", data);
      return resp.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog-categories"] });
      setName("");
      closeModal();
    },
  });

  const editMutation = useMutation({
    mutationFn: async (data: { id: string; name: string }) => {
      const resp = await apiClient.patch(`/blogs/categories/${data.id}`, {
        name: data.name,
      });
      return resp.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog-categories"] });
      setEditCategory(null);
      setEditName("");
      closeModal();
      toast.success("Category updated successfully");
    },
    onError: extract_message,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const resp = await apiClient.delete(`/blogs/categories/${id}`);
      return resp.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog-categories"] });
      toast.success("Category deleted successfully");
    },
    onError: extract_message,
  });

  const call_endpoint = async (
    func: any,
    opts?: { loading?: string; success?: string },
  ) => {
    toast.promise(func, {
      loading: opts?.loading || "Processing...",
      success: opts?.success || "Success",
      error: extract_message,
    });
  };

  const columns: columnType[] = [
    { key: "id", label: "ID" },
    { key: "name", label: "Name" },
    { key: "slug", label: "Slug" },
  ];

  const actions: Actions[] = [
    {
      key: "edit",
      label: "Edit",
      action: (item: any) => {
        setEditCategory(item);
        setEditName(item.name);
        showModal();
      },
    },
    {
      key: "delete",
      label: "Delete",
      action: (item: any) => {
        toast.promise(() => deleteMutation.mutateAsync(item.id), {
          loading: "Deleting category...",
          success: "Category deleted successfully",
          error: extract_message,
        });
      },
    },
  ];

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Blog Categories</h1>
        <button className="btn btn-primary btn-sm" onClick={showModal}>
          <Plus size={18} /> Add Category
        </button>
      </div>

      <PageLoader query={query}>
        {(data) => {
          const categories = data?.data?.data || [];
          return (
            <CustomTable
              data={categories}
              columns={columns}
              ring={true}
              actions={actions}
            />
          );
        }}
      </PageLoader>

      <Modal
        ref={ref}
        title={editCategory ? "Edit Category" : "Create New Category"}
        actions={
          editCategory ? (
            <>
              <button
                className="btn btn-ghost"
                onClick={() => {
                  setEditCategory(null);
                  setEditName("");
                  closeModal();
                }}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                disabled={editMutation.isPending}
                onClick={() =>
                  call_endpoint(
                    () =>
                      editMutation.mutateAsync({
                        id: editCategory.id,
                        name: editName,
                      }),
                    {
                      loading: "Updating category...",
                      success: "Category updated successfully",
                    },
                  )
                }
              >
                {editMutation.isPending ? "Updating..." : "Update Category"}
              </button>
            </>
          ) : (
            <>
              <button className="btn btn-ghost" onClick={closeModal}>
                Cancel
              </button>
              <button
                className="btn btn-primary"
                disabled={createMutation.isPending}
                onClick={() =>
                  call_endpoint(() => createMutation.mutateAsync({ name }), {
                    loading: "Creating category...",
                    success: "Category created successfully",
                  })
                }
              >
                {createMutation.isPending ? "Creating..." : "Create Category"}
              </button>
            </>
          )
        }
      >
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Category Name</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Investment Tips"
            className="input input-bordered w-full"
            value={editCategory ? editName : name}
            onChange={(e) => {
              if (editCategory) {
                setEditName(e.target.value);
              } else {
                setName(e.target.value);
              }
            }}
          />
        </div>
      </Modal>
    </div>
  );
}
