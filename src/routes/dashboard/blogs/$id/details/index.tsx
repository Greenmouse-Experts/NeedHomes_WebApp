import apiClient from "@/api/simpleApi";
import BackButton from "@/components/BackButton";
import PageLoader from "@/components/layout/PageLoader";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import React from "react";

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
    <>
      <BackButton />
      <PageLoader query={query}>
        {(resp) => {
          const data = resp.data as BlogDetails;
          return (
            <div className="mx-auto bg-white rounded-lg shadow p-6 mt-8">
              <div className="flex items-center mb-6">
                <img
                  src={data.author.profilePicture}
                  alt={`${data.author.firstName} ${data.author.lastName}`}
                  className="w-14 h-14 rounded-full mr-4 object-cover"
                />
                <div>
                  <div className="font-semibold text-lg">
                    {data.author.firstName} {data.author.lastName}
                  </div>
                  <div className="text-sm text-gray-500">Author</div>
                </div>
              </div>
              <div className="mb-4">
                <h1 className="text-2xl font-bold mb-2">{data.title}</h1>
                <div className="flex flex-wrap gap-2 mb-2">
                  {data.blogCategories.map((cat) => (
                    <span
                      key={cat.id}
                      className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs"
                    >
                      {cat.name}
                    </span>
                  ))}
                </div>
                <div className="text-xs text-gray-400">
                  Published:{" "}
                  {data.isPublished
                    ? new Date(data.createdAt).toLocaleDateString()
                    : "Draft"}
                </div>
              </div>
              {data.photoUrl && data.photoUrl.length > 0 && (
                <div className="mb-4">
                  <img
                    src={data.photoUrl[0]}
                    alt="Blog cover"
                    className="w-full h-120 object-cover rounded"
                  />
                </div>
              )}
              <div className="mb-6">
                <div className="text-gray-700 whitespace-pre-line">
                  {data.content}
                </div>
              </div>
              <div className="flex justify-between items-center text-sm text-gray-600">
                <div>
                  Comments allowed:{" "}
                  <span
                    className={
                      data.allowComments ? "text-green-600" : "text-red-600"
                    }
                  >
                    {data.allowComments ? "Yes" : "No"}
                  </span>
                </div>
                <div>
                  Comments:{" "}
                  <span className="font-semibold">{data._count.comments}</span>
                </div>
                <div>
                  Last updated: {new Date(data.updatedAt).toLocaleString()}
                </div>
              </div>
              {data.deletedAt && (
                <div className="mt-4 text-red-600 font-semibold">
                  Deleted at: {new Date(data.deletedAt).toLocaleString()}
                </div>
              )}
            </div>
          );
        }}
      </PageLoader>
    </>
  );
}
