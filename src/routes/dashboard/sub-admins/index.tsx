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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { type Actions } from "@/components/tables/pop-up";
import { usePagination } from "@/helpers/pagination";

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
  account_status: string;
  roles: { id: string; name: string }[];
}
function RouteComponent() {
  const [search, setSearch] = useState("");
  const props = usePagination();

  const query = useQuery<ApiResponseV2<SubAdmin[]>>({
    queryKey: ["sub-admins", props.page, search],
    queryFn: async () => {
      let resp = await apiClient.get("/admin/sub-admins", {
        params: {
          page: props.page,
          search,
        },
      });
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
  const queryClient = useQueryClient();

  const suspendMutation = useMutation({
    mutationFn: async (id: string) => {
      const resp = await apiClient.patch(`${id}/suspend`);
      return resp.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sub-admins"] });
    },
  });

  const unsuspendMutation = useMutation({
    mutationFn: async (id: string) => {
      const resp = await apiClient.patch(`${id}/unsuspend`);
      return resp.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sub-admins"] });
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
      key: "account_status",
      label: "Status",
      render: (value) => (
        <span
          className={`badge badge-soft badge-sm ${
            value === "SUSPENDED" ? "badge-error" : "badge-success"
          }`}
        >
          {value ?? "ACTIVE"}
        </span>
      ),
    },
    {
      key: "createdAt",
      label: "Created At",
      render: (value) => new Date(value).toLocaleString(),
    },
  ];

  const actions: Actions<SubAdmin>[] = [
    {
      key: "suspend",
      label: "Suspend",
      disabled: (item) => item.account_status === "SUSPENDED",
      action: (item) => {
        toast.promise(suspendMutation.mutateAsync(item.id), {
          loading: "Suspending sub-admin...",
          success: "Sub-admin suspended",
          error: extract_message,
        });
      },
    },
    {
      key: "unsuspend",
      label: "Unsuspend",
      disabled: (item) => item.account_status !== "SUSPENDED",
      action: (item) => {
        toast.promise(unsuspendMutation.mutateAsync(item.id), {
          loading: "Unsuspending sub-admin...",
          success: "Sub-admin unsuspended",
          error: extract_message,
        });
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
              <CustomTable
                paginationProps={props}
                data={list}
                columns={columns}
                actions={actions}
              />
            );
          }}
        </PageLoader>
      </section>
    </ThemeProvider>
  );
}
