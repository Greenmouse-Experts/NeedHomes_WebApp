import apiClient from "@/api/simpleApi";
import BackButton from "@/components/BackButton";
import PageLoader from "@/components/layout/PageLoader";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import ListComment from "../../-components/ListComments";

export const Route = createFileRoute("/dashboard/blogs/$id/details/")({
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
      let resp = await apiClient.get("blogs/admin/" + id);
      return resp.data;
    },
  });

  return (
    <div className=" top-0 z-10 bg-white border-b border-gray-200 rounded-t-box shadow-sm">
      <div className="flex items-center justify-between w-full px-6 py-4">
        <BackButton />
        <div className="ml-auto">
          <Link
            to={`/dashboard/blogs/${id}/edit`}
            className="btn btn-lg btn-primary"
          >
            Edit
          </Link>
        </div>
      </div>

      <PageLoader query={query}>
        {(resp) => {
          const data = resp.data as BlogDetails;
          return (
            <div className="">
              {/* Main Content Card */}
              <article className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
                {/* Author Section */}
                <div className="border-b border-gray-200 p-6">
                  <div className="flex items-center">
                    <img
                      src={data.author.profilePicture}
                      alt={`${data.author.firstName} ${data.author.lastName}`}
                      className="w-12 h-12 rounded-full mr-4 object-cover"
                    />
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">
                        {data.author.firstName} {data.author.lastName}
                      </div>
                      <div className="text-sm text-gray-500">Author</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-500">
                        {data.isPublished ? "Published" : "Draft"}
                      </div>
                      <div className="text-xs font-medium text-gray-700">
                        {data.isPublished
                          ? new Date(data.createdAt).toLocaleDateString()
                          : "Not published"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Title and Categories */}
                <div className="p-6 border-b border-gray-200">
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    {data.title}
                  </h1>
                  {data.blogCategories.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {data.blogCategories.map((cat) => (
                        <span
                          key={cat.id}
                          className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium"
                        >
                          {cat.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Featured Image */}
                {data.photoUrl && data.photoUrl.length > 0 && (
                  <div className="w-full h-96 bg-gray-100 overflow-hidden border-b border-gray-200">
                    <img
                      src={data.photoUrl[0]}
                      alt="Blog cover"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="p-6 border-b border-gray-200">
                  <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-line leading-relaxed">
                    {data.content}
                  </div>
                </div>

                {/* Metadata Footer */}
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Comments Enabled:</span>
                      <span
                        className={`font-semibold ${
                          data.allowComments ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {data.allowComments ? "Yes" : "No"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Total Comments:</span>
                      <span className="font-semibold text-gray-900">
                        {data._count.comments}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Last Updated:</span>
                      <span className="font-semibold text-gray-900">
                        {new Date(data.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Deleted State Warning */}
                {data.deletedAt && (
                  <div className="bg-red-50 px-6 py-4 border-t-2 border-red-200">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-red-600 rounded-full mr-3"></div>
                      <span className="text-red-700 font-semibold">
                        Deleted at: {new Date(data.deletedAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                )}
              </article>

              {/* Comments Section Placeholder */}
              {data.allowComments && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Comments
                  </h2>
                  {/* Comments Component will be loaded here */}
                  <ListComment id={id} />
                </div>
              )}
            </div>
          );
        }}
      </PageLoader>
    </div>
  );
}
