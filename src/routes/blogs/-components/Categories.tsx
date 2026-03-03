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
  const decoded = cat ? decodeURIComponent(cat) : null;
  const query = useQuery({
    queryKey: ["blog-categories"],
    queryFn: async () => {
      let resp = await apiClient.get("blogs/categories");
      return resp.data;
    },
  });
  return (
    <div className="rounded-box ring fade">
      <h2 className="p-4 border-b fade text-lg font-bold rounded-t-box bg-primary text-primary-content">
        Categories
      </h2>
      <div className="p-2">
        <QueryCompLayout query={query}>
          {(resp) => {
            let data = resp.data.data as any[];
            return (
              <ul className="menu w-full gap-1">
                {data.map((item) => {
                  if (cat == item.name) {
                    return (
                      <li className="" key={item.id}>
                        <Link
                          to={`/blogs`}
                          search={{ category: encodeURIComponent(item.name) }}
                          className="p-2 capitalize menu-active "
                        >
                          {item.name}
                        </Link>
                      </li>
                    );
                  }
                  return (
                    <>
                      <li className="" key={item.id}>
                        <Link
                          to={`/blogs`}
                          search={{ category: encodeURIComponent(item.name) }}
                          className="p-2 capitalize "
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
