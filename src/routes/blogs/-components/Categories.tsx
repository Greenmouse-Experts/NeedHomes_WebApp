import apiClient from "@/api/simpleApi";
import QueryCompLayout from "@/components/layout/QueryCompLayout";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { useSearch } from "@tanstack/react-router";

export default function Categories() {
  const selected = useSearch({
    strict: false,
  });
  //@ts-ignore
  const cat = selected["category"];
  const query = useQuery({
    queryKey: ["blog-categories"],
    queryFn: async () => {
      let resp = await apiClient.get("blogs/categories");
      return resp.data;
    },
  });
  return (
    <div className="rounded-box ring fade">
      <h2 className="p-4 border-b fade text-xl font-bold">Categories</h2>
      <div className="p-2">
        <QueryCompLayout query={query}>
          {(resp) => {
            let data = resp.data.data as any[];
            return (
              <ul className="menu w-full gap-1">
                {data.map((item) => {
                  return (
                    <>
                      <li className="" key={item.id}>
                        <Link
                          to={`/blogs`}
                          search={{ category: encodeURIComponent(item.name) }}
                          className="p-2 capitalize"
                        >
                          {item.name}
                        </Link>
                      </li>
                    </>
                  );
                })}
              </ul>
            );
          }}
        </QueryCompLayout>
      </div>
    </div>
  );
}
