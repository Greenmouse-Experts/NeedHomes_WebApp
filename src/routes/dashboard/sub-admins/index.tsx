import apiClient from "@/api/simpleApi";
import PageLoader from "@/components/layout/PageLoader";
import Modal from "@/components/modals/DialogModal";
import SearchBar from "@/routes/-components/Searchbar";
import ThemeProvider from "@/simpleComps/ThemeProvider";
import { useModal } from "@/store/modals";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";

export const Route = createFileRoute("/dashboard/sub-admins/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [search, setSearch] = useState("");
  const query = useQuery({
    queryKey: ["sub-admins"],
    queryFn: async () => {
      let resp = await apiClient.get("/admin/sub-admins");
      return resp.data;
    },
  });
  const methods = useForm({});

  const dialog = useModal();
  return (
    <ThemeProvider className="">
      <Modal ref={dialog.ref} title="Create Sub-Admin"></Modal>
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
            return <></>;
          }}
        </PageLoader>
      </section>
    </ThemeProvider>
  );
}
