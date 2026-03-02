import apiClient, { type ApiResponseV2 } from "@/api/simpleApi";
import PageLoader from "@/components/layout/PageLoader";
import Modal from "@/components/modals/DialogModal";
import CustomTable, { type columnType } from "@/components/tables/CustomTable";
import type { Actions } from "@/components/tables/pop-up";
import { extract_message } from "@/helpers/apihelpers";
import { useModal } from "@/store/modals";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
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

  const call_endpoint = async (func: any) => {
    toast.promise(func, {
      loading: "Creating category...",
      success: "Category created successfully",
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
      action: (item: any) => {},
    },
    {
      key: "delete",
      label: "Delete",
      action: (item: any) => {},
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
        title="Create New Category"
        actions={
          <>
            <button className="btn btn-ghost" onClick={closeModal}>
              Cancel
            </button>
            <button
              className="btn btn-primary"
              disabled={createMutation.isPending}
              onClick={() =>
                call_endpoint(() => createMutation.mutateAsync({ name }))
              }
            >
              {createMutation.isPending ? "Creating..." : "Create Category"}
            </button>
          </>
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
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
      </Modal>
    </div>
  );
}
