import apiClient, { type ApiResponseV2 } from "@/api/simpleApi";
import PageLoader from "@/components/layout/PageLoader";
import Modal from "@/components/modals/DialogModal";
import CustomTable, { type columnType } from "@/components/tables/CustomTable";
import type { Actions } from "@/components/tables/pop-up";
import { extract_message } from "@/helpers/apihelpers";
import { usePagination } from "@/helpers/pagination";
import { useModal } from "@/store/modals";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type JobCategoryType =
  | "TECH"
  | "MARKETING"
  | "FINANCE"
  | "OPERATIONS"
  | "SALES"
  | "CUSTOMER_SERVICE"
  | "DESIGN"
  | "HUMAN_RESOURCES"
  | "OTHERS";

interface Category {
  id: string;
  name: string;
  type: JobCategoryType;
  slug?: string;
}

export const Route = createFileRoute("/dashboard/jobs/categories/")({
  component: RouteComponent,
});

function RouteComponent() {
  const queryClient = useQueryClient();
  const { ref, showModal, closeModal } = useModal();
  const [name, setName] = useState("");
  const [type, setType] = useState<JobCategoryType>("TECH");
  const [editCategory, setEditCategory] = useState<Category | null>(null);
  const [editName, setEditName] = useState("");
  const [editType, setEditType] = useState<JobCategoryType>("TECH");
  const props = usePagination();

  const categoryTypes: JobCategoryType[] = [
    "TECH",
    "MARKETING",
    "FINANCE",
    "OPERATIONS",
    "SALES",
    "CUSTOMER_SERVICE",
    "DESIGN",
    "HUMAN_RESOURCES",
    "OTHERS",
  ];

  const query = useQuery<ApiResponseV2<Category[]>>({
    queryKey: ["jobs-categories", props.page],
    queryFn: async () => {
      let resp = await apiClient.get("/careers/categories", {
        params: {
          page: props.page,
        },
      });
      return resp.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: { name: string; type: JobCategoryType }) => {
      const resp = await apiClient.post("/careers/categories", data);
      return resp.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs-categories"] });
      setName("");
      setType("TECH");
      closeModal();
      toast.success("Category created successfully");
    },
    onError: extract_message,
  });

  const editMutation = useMutation({
    mutationFn: async (data: {
      id: string;
      name: string;
      type: JobCategoryType;
    }) => {
      const resp = await apiClient.patch(`/careers/categories/${data.id}`, {
        name: data.name,
        type: data.type,
      });
      return resp.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs-categories"] });
      setEditCategory(null);
      setEditName("");
      setEditType("TECH");
      closeModal();
      toast.success("Category updated successfully");
    },
    onError: extract_message,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const resp = await apiClient.delete(`/careers/categories/${id}`);
      return resp.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs-categories"] });
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
    { key: "type", label: "Type" },
    { key: "slug", label: "Slug" },
  ];

  const actions: Actions[] = [
    {
      key: "edit",
      label: "Edit",
      action: (item: Category) => {
        setEditCategory(item);
        setEditName(item.name);
        setEditType(item.type);
        showModal();
      },
    },
    {
      key: "delete",
      label: "Delete",
      action: (item: Category) => {
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
        <h1 className="text-2xl font-bold">Job Categories</h1>
        <button className="btn btn-primary " onClick={showModal}>
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
              paginationProps={props}
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
                  setEditType("TECH");
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
                        type: editType,
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
                  call_endpoint(
                    () => createMutation.mutateAsync({ name, type }),
                    {
                      loading: "Creating category...",
                      success: "Category created successfully",
                    },
                  )
                }
              >
                {createMutation.isPending ? "Creating..." : "Create Category"}
              </button>
            </>
          )
        }
      >
        <div className="space-y-4">
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Category Name</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Engineering"
              className="input input-bordered w-full"
              maxLength={100}
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

          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Category Type</span>
            </label>
            <select
              className="select select-bordered w-full"
              value={editCategory ? editType : type}
              onChange={(e) => {
                const value = e.target.value as JobCategoryType;
                if (editCategory) {
                  setEditType(value);
                } else {
                  setType(value);
                }
              }}
            >
              {categoryTypes.map((categoryType) => (
                <option key={categoryType} value={categoryType}>
                  {categoryType}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Modal>
    </div>
  );
}
