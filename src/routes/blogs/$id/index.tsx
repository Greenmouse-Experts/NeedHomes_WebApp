import apiClient from "@/api/simpleApi";
import BackButton from "@/components/BackButton";
import PageLoader from "@/components/layout/PageLoader";
import ListComment from "@/routes/dashboard/blogs/-components/ListComments";
import ThemeProvider from "@/simpleComps/ThemeProvider";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/blogs/$id/")({
  component: RouteComponent,
});

interface Author {
  id: string;
  firstName: string;
  lastName: string;
  profilePicture: string;
}

interface BlogCategory {
  id: string;
  name: string;
}

interface BlogCount {
  comments: number;
}

interface BlogDetails {
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
  author: Author;
  blogCategories: BlogCategory[];
  _count: BlogCount;
}

function RouteComponent() {
  const { id } = Route.useParams();
  const query = useQuery({
    queryKey: ["blog-details", id],
    queryFn: async () => {
      let resp = await apiClient.get("blogs/" + id);
      return resp.data;
    },
  });

  return (
    <ThemeProvider className="bg-white min-h-screen py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Top Navigation */}
        <div className="mb-8 flex items-center justify-between">
          <BackButton />
        </div>

        <PageLoader query={query}>
          {(resp) => {
            const data = resp.data as BlogDetails;
            return (
              <article className="w-full rounded-lg bg-white shadow-sm ring-1 ring-gray-200">
                {/* Featured Image */}
                {data.photoUrl && data.photoUrl.length > 0 && (
                  <div className="h-96 w-full overflow-hidden rounded-t-lg bg-gray-200">
                    <img
                      src={data.photoUrl[0]}
                      alt="Blog cover"
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}

                {/* Title Section */}
                <div className="border-b border-gray-100 px-6 py-10 sm:px-10 sm:py-12">
                  <h1 className="mb-6 text-4xl font-bold text-gray-900 sm:text-5xl">
                    {data.title}
                  </h1>

                  {/* Author and Date */}
                  <div className="mb-6 flex items-center gap-4">
                    <img
                      src={data.author.profilePicture}
                      alt={`${data.author.firstName} ${data.author.lastName}`}
                      className="h-14 w-14 rounded-full object-cover ring-1 ring-gray-200"
                    />
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">
                        {data.author.firstName} {data.author.lastName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(data.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Categories */}
                  {data.blogCategories.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-6">
                      {data.blogCategories.map((cat) => (
                        <span
                          key={cat.id}
                          className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 hover:bg-blue-100 transition"
                        >
                          {cat.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="border-b border-gray-100 px-6 py-10 sm:px-10">
                  <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {data.content}
                  </div>
                </div>

                {/* Metadata */}
                <div className="border-b border-gray-100 px-6 py-6 sm:px-10">
                  <div className="flex flex-wrap gap-6">
                    {data._count.comments > 0 && (
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900">
                          {data._count.comments}
                        </span>
                        <span className="text-sm text-gray-600">
                          {data._count.comments === 1 ? "Comment" : "Comments"}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Deleted State Warning */}
                {data.deletedAt && (
                  <div className="border-b border-red-100 bg-red-50 px-6 py-4 sm:px-10">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 shrink-0 rounded-full bg-red-600"></div>
                      <span className="text-sm font-medium text-red-700">
                        This post has been deleted
                      </span>
                    </div>
                  </div>
                )}

                {/* Comments Section */}
                {data.allowComments && (
                  <div className="px-6 py-10 sm:px-10">
                    <h2 className="mb-8 text-2xl font-bold text-gray-900">
                      Comments
                    </h2>
                    <ListComment id={id} />
                  </div>
                )}
              </article>
            );
          }}
        </PageLoader>
      </div>
    </ThemeProvider>
  );
}
