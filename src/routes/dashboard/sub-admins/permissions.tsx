import apiClient, { type ApiResponse } from "@/api/simpleApi";
import PageLoader from "@/components/layout/PageLoader";
import CustomTable, { type columnType } from "@/components/tables/CustomTable";
import { extract_message } from "@/helpers/apihelpers";
import SearchBar from "@/routes/-components/Searchbar";
import ThemeProvider from "@/simpleComps/ThemeProvider";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { useModal } from "@/store/modals";
import Modal from "@/components/modals/DialogModal";

export const Route = createFileRoute("/dashboard/sub-admins/permissions")({
  component: RouteComponent,
});

interface PERMISSIONS {
  key: string;
  description: string;
  type: string;
}
function RouteComponent() {
  const [search, setSearch] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<PERMISSIONS[]>(
    [],
  );
  const [selectedTitle, setSelectedTitle] = useState("");
  const query = useQuery<
    ApiResponse<{ category: string; permissions: PERMISSIONS[] }[]>
  >({
    queryKey: ["sub-admins"],
    queryFn: async () => {
      let resp = await apiClient.get("/admin/roles/permissions");
      return resp.data;
    },
  });
  const mutation = useMutation({
    mutationFn: async (data: any) => {
      let resp = await apiClient.post("admin/sub-admins", data);
      return resp.data;
    },
    onSuccess: () => {
      createSubAdminDialog.closeModal();
      query.refetch();
    },
  });
  const createSubAdminDialog = useModal();
  const viewPermissionsDialog = useModal();

  const onSubmit = (data: any) => {
    toast.promise(mutation.mutateAsync(data), {
      loading: "Creating sub-admin...",
      success: "Sub-admin created successfully!",
      error: extract_message,
    });
  };

  const columns: columnType[] = [
    {
      key: "category",
      label: "Category",
    },
    {
      key: "permissions",
      label: "Permissions",
      render: (value: PERMISSIONS[]) => (
        <span className="badge badge-primary badge-soft ring fade">
          {value.length} permissions
        </span>
      ),
    },
  ];

  const actions = [
    {
      key: "view-permissions",
      label: "View Permissions",
      action: (item: { category: string; permissions: PERMISSIONS[] }) => {
        setSelectedTitle(item.category);
        setSelectedPermissions(item.permissions);
        viewPermissionsDialog.showModal();
      },
    },
  ];

  return (
    <ThemeProvider className="">
      <section className="bg-base-100 fade ring shadow  rounded-box ">
        <div className="p-4 border-b font-bold text-xl fade flex items-center">
          Permissions{" "}
        </div>
        <div className="p-4">
          <SearchBar value={search} onChange={setSearch} />
        </div>
      </section>
      <section className="my-4">
        <PageLoader query={query}>
          {(data) => {
            const permissionsData = data.data;
            return (
              <CustomTable
                data={permissionsData}
                columns={columns}
                actions={actions}
              />
            );
          }}
        </PageLoader>
      </section>

      <Modal ref={createSubAdminDialog.ref} title="Create New Sub-Admin">
        {/* Form for creating sub-admin goes here */}
        <p>Form to create a new sub-admin will be implemented here.</p>
        <button
          className="btn btn-primary"
          onClick={() =>
            toast.info("Sub-admin creation logic not implemented yet.")
          }
        >
          Submit
        </button>
      </Modal>

      <Modal
        ref={viewPermissionsDialog.ref}
        title={`Role Permissions: ${selectedTitle.toLocaleUpperCase()}`}
      >
        <div className="flex flex-wrap gap-2">
          {selectedPermissions.length > 0 ? (
            selectedPermissions.map((permission, index) => (
              <span key={index} className="badge badge-outline badge-primary">
                {permission.key}
              </span>
            ))
          ) : (
            <p>No permissions assigned.</p>
          )}
        </div>
      </Modal>
    </ThemeProvider>
  );
}
