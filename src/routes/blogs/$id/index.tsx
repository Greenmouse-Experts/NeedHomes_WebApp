import apiClient from "@/api/simpleApi";
import BackButton from "@/components/BackButton";
import PageLoader from "@/components/layout/PageLoader";
import ListComment from "@/routes/dashboard/blogs/-components/ListComments";
import ThemeProvider from "@/simpleComps/ThemeProvider";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import Featured from "../-components/Featured";
import { Facebook, Twitter, Linkedin, Copy, Check } from "lucide-react";
import { useState } from "react";
import Comments from "../-components/Comments";

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
  const date = new Date();
  const current_date = {
    day: date.getDay(),
    day_name: date.toLocaleDateString("en-US", { weekday: "long" }),
    year: date.getFullYear(),
    month: date.toLocaleDateString("en-US", { month: "long" }),
    day_of_month: date.getDate(),
  };
  const [copied, setCopied] = useState(false);
  const query = useQuery({
    queryKey: ["blog-details", id],
    queryFn: async () => {
      let resp = await apiClient.get("blogs/" + id);
      return resp.data;
    },
  });

  const handleShare = (platform: string, title: string) => {
    const url = window.location.href;
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);

    switch (platform) {
      case "facebook":
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
          "_blank",
        );
        break;
      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
          "_blank",
        );
        break;
      case "linkedin":
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
          "_blank",
        );
        break;
      case "copy":
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        break;
    }
  };

  return (
    <ThemeProvider className="bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Top Navigation */}
        <div className="mb-8 flex items-center justify-between">
          <BackButton />
        </div>

        <section className="flex gap-2">
          {/* Social Links Sidebar */}
          <div className="md:block hidden flex-1 max-w-sm">
            <Featured />
          </div>
          <div className="flex-1">
            <PageLoader query={query}>
              {(resp) => {
                const data = resp.data as BlogDetails;
                return (
                  <article className="w-full flex-1 bg-base-100 p-2">
                    {/* Featured Image */}
                    {data.photoUrl && data.photoUrl.length > 0 && (
                      <div className="mb-8 h-100 w-full overflow-hidden rounded-xl bg-gray-200 shadow-lg">
                        <img
                          src={data.photoUrl[0]}
                          alt="Blog cover"
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}

                    {/* Content Card */}
                    <div className="rounded-xl bg-white p-8 sm:p-12 shadow-md ring fade">
                      {/* Title Section */}
                      <div className="mb-8">
                        <h1 className="mb-6 text-4xl font-bold text-gray-900 sm:text-5xl leading-tight">
                          {data.title}
                        </h1>

                        {/* Categories */}
                        {data.blogCategories.length > 0 && (
                          <div className="flex flex-wrap gap-2 pb-6 border-b border-gray-200">
                            {data.blogCategories.map((cat) => (
                              <span
                                key={cat.id}
                                className="rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100 transition"
                              >
                                {cat.name}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Author and Date */}
                        <div className="mt-6 flex items-center gap-4">
                          <img
                            src={data.author.profilePicture}
                            alt={`${data.author.firstName} ${data.author.lastName}`}
                            className="h-16 w-16 rounded-full object-cover ring-2 ring-gray-200"
                          />
                          <div className="flex-1">
                            <div className="font-semibold text-gray-900 text-lg">
                              {data.author.firstName} {data.author.lastName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {new Date(data.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                },
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="border-b border-gray-200 pb-8 mb-8">
                        <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
                          {data.content}
                        </div>
                      </div>

                      {/* Metadata */}
                      <div className="border-b border-gray-200 pb-8 mb-8">
                        <div className="flex flex-wrap gap-6">
                          {data._count.comments > 0 && (
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-gray-900 text-lg">
                                {data._count.comments}
                              </span>
                              <span className="text-sm text-gray-600">
                                {data._count.comments === 1
                                  ? "Comment"
                                  : "Comments"}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Deleted State Warning */}
                      {data.deletedAt && (
                        <div className="rounded-lg border border-red-200 bg-red-50 p-4 mb-8">
                          <div className="flex items-center gap-3">
                            <div className="h-2 w-2 shrink-0 rounded-full bg-red-600"></div>
                            <span className="text-sm font-medium text-red-700">
                              This post has been deleted
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Comments Section */}
                      {data.allowComments && <Comments id={id} />}
                    </div>
                  </article>
                );
              }}
            </PageLoader>
          </div>

          <div className="sticky top-8 h-fit hidden md:flex flex-col gap-4 p-4  rounded-box shadow">
            <div className="p-4 bg-white rounded-xl shadow-md">
              <div className="text-center">
                <div className="text-sm font-semibold text-gray-900">
                  {current_date.day_name}
                </div>
                <div className="text-2xl font-bold text-gray-900 mt-1">
                  {current_date.day_of_month}
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  {current_date.month} {current_date.year}
                </div>
              </div>
            </div>
            {/*//social*/}
            <div className="flex flex-col gap-3 bg-white rounded-xl p-4 shadow-md ring fade  items-center">
              <button
                onClick={() =>
                  query.data && handleShare("facebook", query.data.data.title)
                }
                className="p-3 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 transition duration-200"
                title="Share on Facebook"
              >
                <Facebook size={20} />
              </button>
              <button
                onClick={() =>
                  query.data && handleShare("twitter", query.data.data.title)
                }
                className="p-3 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-600 transition duration-200"
                title="Share on Twitter"
              >
                <Twitter size={20} />
              </button>
              <button
                onClick={() =>
                  query.data && handleShare("linkedin", query.data.data.title)
                }
                className="p-3 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 transition duration-200"
                title="Share on LinkedIn"
              >
                <Linkedin size={20} />
              </button>
              <button
                onClick={() =>
                  query.data && handleShare("copy", query.data.data.title)
                }
                className="p-3 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition duration-200"
                title="Copy link"
              >
                {copied ? <Check size={20} /> : <Copy size={20} />}
              </button>
            </div>
          </div>
        </section>
      </div>
    </ThemeProvider>
  );
}
