import type { ApiResponseV2 } from "@/api/simpleApi";
import apiClient from "@/api/simpleApi";
import QueryCompLayout from "@/components/layout/QueryCompLayout";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";

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
export default function Featured() {
  const query = useQuery<ApiResponseV2<Blog[]>>({
    queryKey: ["user-blogs"],
    queryFn: async () => {
      let resp = await apiClient.get("/blogs");
      return resp.data;
    },
  });
  return (
    <div className="ring fade rounded-box">
      <h2 className="p-4 border-b fade font-bold text-lg bg-primary rounded-t-box  text-primary-content">
        Related News
      </h2>
      <div className="p-4">
        <QueryCompLayout query={query}>
          {(resp) => {
            return (
              <div className="flex flex-col gap-4">
                {resp.data.data.map((blog) => (
                  <Link key={blog.id} to={`/blogs/${blog.id}`}>
                    <div className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow">
                      <div className="card-body p-4 flex-row">
                        {/*<div className="flex">
                          <img
                            src={blog.photoUrl[0]}
                            className="size-15 rounded-box"
                            alt=""
                          />
                        </div>*/}
                        <div>
                          <h3 className="card-title text-lg hover:text-primary transition-colors">
                            {blog.title}
                          </h3>
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {blog.content}
                          </p>
                          <div className="card-actions justify-between items-center pt-2">
                            <span className="text-xs text-gray-500">
                              {blog.author.firstName} {blog.author.lastName}
                            </span>
                            <span className="text-xs text-gray-500">
                              {blog._count.comments} comments
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            );
          }}
        </QueryCompLayout>
      </div>
    </div>
  );
}
