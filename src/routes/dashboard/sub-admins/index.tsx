import apiClient, { type ApiResponseV2 } from "@/api/simpleApi";
import PageLoader from "@/components/layout/PageLoader";
import Modal from "@/components/modals/DialogModal";
import CustomTable, { type columnType } from "@/components/tables/CustomTable";
import { extract_message } from "@/helpers/apihelpers";
import SearchBar from "@/routes/-components/Searchbar";
import SimpleInput from "@/simpleComps/inputs/SimpleInput";
import SimpleSelect from "@/simpleComps/inputs/SimpleSelect";
import ThemeProvider from "@/simpleComps/ThemeProvider";
import { useModal } from "@/store/modals";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { type Actions } from "@/components/tables/pop-up";

export const Route = createFileRoute("/dashboard/sub-admins/")({
  component: RouteComponent,
});
interface SubAdmin {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  createdAt: string;
  roles: { id: string; name: string }[];
}
function RouteComponent() {
  const [search, setSearch] = useState("");
  const query = useQuery<ApiResponseV2<SubAdmin[]>>({
    queryKey: ["sub-admins"],
    queryFn: async () => {
      let resp = await apiClient.get("/admin/sub-admins");
      return resp.data;
    },
  });
  const methods = useForm({});
  const mutation = useMutation({
    mutationFn: async (data: any) => {
      let resp = await apiClient.post("admin/sub-admins", data);
      return resp.data;
    },
    onSuccess: () => {
      dialog.closeModal();
      query.refetch();
    },
  });
  const dialog = useModal();
  const onSubmit = (data: any) => {
    toast.promise(mutation.mutateAsync(data), {
      loading: "Creating sub-admin...",
      success: "Sub-admin created successfully!",
      error: extract_message,
    });
  };

  const columns: columnType<SubAdmin>[] = [
    { key: "firstName", label: "First Name" },
    { key: "lastName", label: "Last Name" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    {
      key: "roles",
      label: "Roles",
      render: (value: { name: string }[]) =>
        value.map((role) => role.name).join(", "),
    },
    {
      key: "createdAt",
      label: "Created At",
      render: (value) => new Date(value).toLocaleString(),
    },
  ];

  const actions: Actions<SubAdmin>[] = [
    {
      key: "edit",
      label: "Edit",
      action: (item, nav) => {
        // Handle edit action, e.g., navigate to edit page or open edit modal
        toast.info(`Editing sub-admin: ${item.firstName} ${item.lastName}`);
      },
    },
    {
      key: "delete",
      label: "Delete",
      action: (item, nav) => {
        // Handle delete action
        toast.error(`Deleting sub-admin: ${item.firstName} ${item.lastName}`);
      },
    },
  ];

  return (
    <ThemeProvider className="">
      <Modal ref={dialog.ref} title="Create Sub-Admin">
        <form className="space-y-6" onSubmit={methods.handleSubmit(onSubmit)}>
          <SimpleInput label="First Name" {...methods.register("firstName")} />
          <SimpleInput label="Last Name" {...methods.register("lastName")} />
          <SimpleInput label="Email" {...methods.register("email")} />
          <SimpleInput
            label="Password"
            type="password"
            {...methods.register("password")}
          />
          <SimpleInput label="Phone Number" {...methods.register("phone")} />
          <Controller
            control={methods.control}
            name="roleId"
            render={({ field }) => {
              return (
                <>
                  <SimpleSelect
                    {...field}
                    label="Role"
                    route="/admin/roles"
                    render={(item: { id: string; name: string }) => {
                      return <option value={item.id}>{item.name}</option>;
                    }}
                  ></SimpleSelect>
                </>
              );
            }}
          ></Controller>
          <div className="">
            <button className="btn btn-primary">Create Sub Admin</button>
          </div>
        </form>
      </Modal>
      <section className="bg-base-100 fade ring shadow  rounded-box ">
        <div className="p-4 border-b font-bold text-xl fade flex items-center">
          Sub-admins{" "}
          <button
            className="btn btn-primary ml-auto"
            onClick={dialog.showModal}
          >
            Create Sub Admin
          </button>
        </div>
        <div className="p-4">
          <SearchBar value={search} onChange={setSearch} />
        </div>
      </section>
      <section className="my-4">
        <PageLoader query={query}>
          {(data) => {
            const list = data.data.data;
            return (
              <CustomTable data={list} columns={columns} actions={actions} />
            );
          }}
        </PageLoader>
      </section>
    </ThemeProvider>
  );
}
