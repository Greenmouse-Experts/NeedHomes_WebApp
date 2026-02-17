import apiClient from "@/api/simpleApi";
import PageLoader from "@/components/layout/PageLoader";
import SearchBar from "@/routes/-components/Searchbar";
import ThemeProvider from "@/simpleComps/ThemeProvider";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/dashboard/sub-admins/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [search, setSearch] = useState("");
  const query = useQuery({
    queryKey: ["sub-admins"],
    queryFn: async () => {
      let resp = await apiClient.get("/admin/sub-admins");
    },
  });
  return (
    <ThemeProvider className="">
      <section className="bg-base-100 fade ring shadow  rounded-box ">
        <h2 className="p-4 border-b font-bold text-xl fade">Sub-admins</h2>
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
