import apiClient, { type ApiResponseV2 } from "@/api/simpleApi";
import PageLoader from "@/components/layout/PageLoader";
import ThemeProvider from "@/simpleComps/ThemeProvider";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import SearchBar from "../-components/Searchbar";
import { useState } from "react";
import EmptyList from "@/simpleComps/EmptyList";
import QueryCompLayout from "@/components/layout/QueryCompLayout";
import Categories from "./-components/Categories";
import LatestBlog from "./-components/Latest";

interface BlogCategory {
  id: string;
  name: string;
}

interface BlogAuthor {
  id: string;
  firstName: string;
  lastName: string;
  profilePicture: string;
}

interface Blog {
  id: string;
  title: string;
  content: string;
  authorId: string;
  isPublished: boolean;
  photoUrl: string[];
  createdAt: string;
  allowComments: boolean;
  updatedAt: string;
  deletedAt: string | null;
  author: BlogAuthor;
  blogCategories: BlogCategory[];
  _count: {
    comments: number;
  };
}

function BlogCard({ blog }: { blog: Blog }) {
  return (
    <Link
      to="/blogs/$id"
      params={{ id: blog.id }}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col"
    >
      {blog.photoUrl && blog.photoUrl.length > 0 && (
        <div className="relative h-64 overflow-hidden bg-gray-200">
          <img
            src={blog.photoUrl[0]}
            alt={blog.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="p-6 flex flex-col flex-grow">
        <div className="mb-4">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            {new Date(blog.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
          <h3 className="text-xl font-bold mt-2 text-gray-900 line-clamp-2">
            {blog.title}
          </h3>
        </div>
        <p className="text-gray-600 text-sm mb-6 line-clamp-3 flex-grow">
          {blog.content}
        </p>
        <div className="pt-4 border-t border-gray-200">
          <div className="flex items-center gap-3">
            {blog.author.profilePicture && (
              <img
                src={blog.author.profilePicture}
                alt={`${blog.author.firstName} ${blog.author.lastName}`}
                className="w-10 h-10 rounded-full object-cover"
              />
            )}
            <div>
              <p className="text-sm font-medium text-gray-900">
                {`${blog.author.firstName} ${blog.author.lastName}`}
              </p>
              <p className="text-xs text-gray-500">
                {blog._count.comments}{" "}
                {blog._count.comments === 1 ? "comment" : "comments"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export const Route = createFileRoute("/blogs/")({
  component: RouteComponent,
  validateSearch: (
    search: Record<string, unknown>,
  ): Record<string, unknown> => {
    return search as Record<string, unknown>;
  },
});

function RouteComponent() {
  const [search, setSearch] = useState("");
  const { category } = Route.useSearch();
  const query = useQuery<ApiResponseV2<Blog[]>>({
    queryKey: ["user-blogs", search, category],
    queryFn: async () => {
      let resp = await apiClient.get("/blogs", {
        params: { search, categoryId: category },
      });
      return resp.data;
    },
  });
  return (
    <ThemeProvider className="">
      <div className="bg-linear-120 from-primary to-primary/50 py-16 mb-8">
        <div className="mx-auto container px-4">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Our Blog
            </h1>
            <p className="text-blue-100 text-lg mb-6">
              Discover insights, stories, and updates from our team
            </p>
            <SearchBar value={search} onChange={setSearch} />
          </div>
        </div>
      </div>
      <main className="flex  container mx-auto gap-4 px-4">
        <section className="flex-1">
          <div className="my-4 container mx-auto">
            <h2 className="text-2xl font-bold">Latest News</h2>
            <div className="mt-4">
              <LatestBlog />
            </div>
          </div>
          <div className="mx-auto container">
            <h2 className="text-2xl font-bold mb-8">All News</h2>
            <PageLoader query={query}>
              {(resp) => {
                let data = resp.data.data as Blog[];
                return (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {data.map((blog) => (
                        <BlogCard key={blog.id} blog={blog} />
                      ))}
                    </div>
                    <EmptyList list={data} />
                  </>
                );
              }}
            </PageLoader>
          </div>
        </section>
        <section className="flex-1 lg:block hidden max-w-sm ">
          <Categories />
        </section>
      </main>
    </ThemeProvider>
  );
}
