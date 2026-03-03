import type { ApiResponseV2 } from "@/api/simpleApi";
import apiClient from "@/api/simpleApi";
import QueryCompLayout from "@/components/layout/QueryCompLayout";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";

export default function LatestBlog() {
  const query = useQuery<ApiResponseV2<any[]>>({
    queryKey: ["user-blogs"],
    queryFn: async () => {
      let resp = await apiClient.get("/blogs");
      return resp.data;
    },
  });
  return (
    <>
      <QueryCompLayout query={query}>
        {(resp) => {
          let data = resp.data.data;
          const latest = data[0];

          return (
            <>
              {latest && (
                <section className="mb-12">
                  <Link
                    to="/blogs/$id"
                    params={{ id: latest.id }}
                    className="block group"
                  >
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow xl:flex">
                      {latest.photoUrl && latest.photoUrl.length > 0 && (
                        <div className="relative md:min-w-120 h-96 flex overflow-hidden bg-gray-200">
                          <img
                            src={latest.photoUrl[0]}
                            alt={latest.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <div className="p-8 flex flex-col">
                        <div className="mb-4">
                          <span className="inline-block text-xs font-semibold text-white bg-primary px-3 py-1 rounded-full">
                            Latest
                          </span>
                          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide ml-3">
                            {new Date(latest.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              },
                            )}
                          </span>
                        </div>
                        <h2 className="text-3xl font-bold mb-4 text-gray-900 group-hover:text-primary transition-colors">
                          {latest.title}
                        </h2>
                        <p className="text-gray-600 text-base mb-6 line-clamp-4">
                          {latest.content}
                        </p>
                        <div className="flex mt-auto items-center gap-4 pt-4 border-t border-gray-200">
                          {latest.author.profilePicture && (
                            <img
                              src={latest.author.profilePicture}
                              alt={`${latest.author.firstName} ${latest.author.lastName}`}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          )}
                          <div className="">
                            <p className="text-sm font-medium text-gray-900">
                              {`${latest.author.firstName} ${latest.author.lastName}`}
                            </p>
                            <p className="text-xs text-gray-500">
                              {latest._count.comments}{" "}
                              {latest._count.comments === 1
                                ? "comment"
                                : "comments"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </section>
              )}
            </>
          );
        }}
      </QueryCompLayout>
    </>
  );
}
