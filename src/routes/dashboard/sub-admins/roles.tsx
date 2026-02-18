import apiClient, { type ApiResponse } from "@/api/simpleApi";
import PageLoader from "@/components/layout/PageLoader";
import SearchBar from "@/routes/-components/Searchbar";
import ThemeProvider from "@/simpleComps/ThemeProvider";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import CustomTable, { type columnType } from "@/components/tables/CustomTable";
import { type Actions } from "@/components/tables/pop-up";
import { useModal } from "@/store/modals";
import Modal from "@/components/modals/DialogModal";
import { useForm, FormProvider } from "react-hook-form";
import { toast } from "sonner";
import SimpleSelect from "@/simpleComps/inputs/SimpleSelect";

export const Route = createFileRoute("/dashboard/sub-admins/roles")({
  component: RouteComponent,
});

interface RoleFormInputs {
  name: string;
  permissions: string[];
}

function RouteComponent() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const {
    ref: addRoleModalRef,
    showModal: openAddRoleModal,
    closeModal: closeAddRoleModal,
  } = useModal();
  const queryClient = useQueryClient();

  const methods = useForm<RoleFormInputs>();
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = methods;

  const query = useQuery<
    ApiResponse<
      { id: string; name: string; permissionCount: number; userCount: number }[]
    >
  >({
    queryKey: ["roles", search],
    queryFn: async () => {
      const response = await apiClient.get("admin/roles", {
        params: {
          search,
        },
      });
      return response.data;
    },
  });

  const addRoleMutation = useMutation<ApiResponse<any>, Error, RoleFormInputs>({
    mutationFn: async (newRole) => {
      const response = await apiClient.post("admin/roles", newRole);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Role added successfully!");
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      closeAddRoleModal();
      reset();
    },
    onError: (error) => {
      toast.error(`Failed to add role: ${error.message}`);
    },
  });

  const onSubmit = (data: RoleFormInputs) => {
    addRoleMutation.mutate(data);
  };

  const columns: columnType<{
    id: string;
    name: string;
    permissionCount: number;
    userCount: number;
  }>[] = [
    {
      key: "name",
      label: "Role Name",
    },
    {
      key: "permissionCount",
      label: "Permissions",
      render: (value) => `${value} Permissions`,
    },
    {
      key: "userCount",
      label: "Users",
      render: (value) => `${value} Users`,
    },
  ];

  const actions: Actions<{
    id: string;
    name: string;
    permissionCount: number;
    userCount: number;
  }>[] = [
    {
      key: "edit",
      label: "Edit",
      action: (item) => {
        navigate({ to: `/dashboard/sub-admins/roles/${item.id}/edit` });
      },
    },
    {
      key: "delete",
      label: "Delete",
      action: (item) => {
        // Handle delete action
        console.log("Delete role:", item.id);
      },
    },
  ];

  return (
    <>
      <ThemeProvider>
        <section className="bg-base-100 fade ring shadow  rounded-box ">
          <div className="p-4 border-b font-bold text-xl fade flex items-center justify-between">
            Roles{" "}
            <button
              className="btn btn-primary btn-sm"
              onClick={openAddRoleModal}
            >
              Add Role
            </button>
          </div>
          <div className="p-4">
            <SearchBar value={search} onChange={setSearch} />
          </div>
        </section>
        <section className="my-4">
          <PageLoader query={query}>
            {(data) => {
              const roles = data.data;

              return (
                <CustomTable data={roles} columns={columns} actions={actions} />
              );
            }}
          </PageLoader>
        </section>
      </ThemeProvider>

      <Modal ref={addRoleModalRef} title="Add New Role">
        <ThemeProvider>
          {" "}
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="label">
                  <span className="label-text">Role Name</span>
                </label>
                <input
                  type="text"
                  placeholder="Role Name"
                  className={`input input-bordered w-full ${errors.name ? "input-error" : ""}`}
                  {...register("name", { required: "Role name is required" })}
                />
                {errors.name && (
                  <p className="text-error text-sm mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div>
                <SimpleSelect
                  route="admin/roles/permissions"
                  label="Permissions"
                  name="permissions"
                  render={(item) => (
                    <option key={item.id} value={item.id}>
                      {item.category}
                    </option>
                  )}
                />
                {errors.permissions && (
                  <p className="text-error text-sm mt-1">
                    {errors.permissions.message}
                  </p>
                )}
              </div>
              <div className="modal-action">
                <button
                  type="button"
                  className="btn"
                  onClick={closeAddRoleModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={addRoleMutation.isPending}
                >
                  {addRoleMutation.isPending ? "Adding..." : "Add Role"}
                </button>
              </div>
            </form>
          </FormProvider>
        </ThemeProvider>
      </Modal>
    </>
  );
}
