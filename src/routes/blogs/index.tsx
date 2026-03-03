import apiClient, { type ApiResponseV2 } from "@/api/simpleApi";
import PageLoader from "@/components/layout/PageLoader";
import ThemeProvider from "@/simpleComps/ThemeProvider";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import SearchBar from "../-components/Searchbar";

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
      className="bg-white ring fade rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
    >
      {blog.photoUrl && blog.photoUrl.length > 0 && (
        <img
          src={blog.photoUrl[0]}
          alt={blog.title}
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-4">
        <h3 className="text-lg font-bold mb-2">{blog.title}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-3">
          {blog.content}
        </p>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <img
              src={blog.author.profilePicture}
              alt={`${blog.author.firstName} ${blog.author.lastName}`}
              className="w-8 h-8 rounded-full"
            />
            <span className="text-sm font-medium">{`${blog.author.firstName} ${blog.author.lastName}`}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mb-3">
          {blog.blogCategories.map((category) => (
            <span
              key={category.id}
              className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded"
            >
              {category.name}
            </span>
          ))}
        </div>
        <div className="flex justify-between text-xs text-gray-500">
          <span>{blog._count.comments} comments</span>
          <span>{blog.isPublished ? "Published" : "Draft"}</span>
        </div>
      </div>
    </Link>
  );
}

export const Route = createFileRoute("/blogs/")({
  component: RouteComponent,
});

function RouteComponent() {
  const query = useQuery<ApiResponseV2<Blog[]>>({
    queryKey: ["admin-blogs"],
    queryFn: async () => {
      let resp = await apiClient.get("/blogs");
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
            <SearchBar />
          </div>
        </div>
      </div>
      <div className="mx-auto container">
        <PageLoader query={query}>
          {(resp) => {
            let data = resp.data.data as Blog[];
            return (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.map((blog) => (
                  <BlogCard key={blog.id} blog={blog} />
                ))}
              </div>
            );
          }}
        </PageLoader>
      </div>
    </ThemeProvider>
  );
}
