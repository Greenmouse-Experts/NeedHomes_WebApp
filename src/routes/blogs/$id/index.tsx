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
    <ThemeProvider className="bg-gray-50 min-h-screen py-12">
      <div className="container ring fade rounded-xl mx-auto">
        {/* Top Navigation */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
          <div className="flex items-center justify-between w-full px-4 sm:px-6 py-4">
            <BackButton />
          </div>
        </div>

        <PageLoader query={query}>
          {(resp) => {
            const data = resp.data as BlogDetails;
            return (
              <article className="w-full">
                {/* Featured Image */}
                {data.photoUrl && data.photoUrl.length > 0 && (
                  <div className="w-full h-96 bg-gray-200 overflow-hidden">
                    <img
                      src={data.photoUrl[0]}
                      alt="Blog cover"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Title Section */}
                <div className="bg-white px-4 sm:px-6 pt-8 pb-6 sm:pt-12 sm:pb-8">
                  <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                    {data.title}
                  </h1>

                  {/* Author and Date */}
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={data.author.profilePicture}
                      alt={`${data.author.firstName} ${data.author.lastName}`}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">
                        {data.author.firstName} {data.author.lastName}
                      </div>
                      <div className="text-sm text-gray-600">
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
                    <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200">
                      {data.blogCategories.map((cat) => (
                        <span
                          key={cat.id}
                          className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded text-sm font-medium hover:bg-gray-200 transition"
                        >
                          {cat.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="bg-white px-4 sm:px-6 py-8 border-b border-gray-200">
                  <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {data.content}
                  </div>
                </div>

                {/* Metadata */}
                <div className="bg-white px-4 sm:px-6 py-6 text-sm text-gray-600 border-b border-gray-200">
                  <div className="flex flex-wrap gap-6">
                    {data._count.comments > 0 && (
                      <div>
                        <span className="font-medium text-gray-900">
                          {data._count.comments}
                        </span>
                        <span className="ml-2">
                          {data._count.comments === 1 ? "Comment" : "Comments"}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Deleted State Warning */}
                {data.deletedAt && (
                  <div className="bg-red-50 px-4 sm:px-6 py-4 border-b border-red-200">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-red-600 rounded-full flex-shrink-0"></div>
                      <span className="text-red-700">
                        This post has been deleted
                      </span>
                    </div>
                  </div>
                )}

                {/* Comments Section */}
                {data.allowComments && (
                  <div className="bg-white px-4 sm:px-6 py-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-8">
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
