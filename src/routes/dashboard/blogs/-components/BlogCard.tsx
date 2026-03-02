interface BlogAuthor {
  id: string;
  firstName: string;
  lastName: string;
}

interface BlogCategory {
  id: string;
  name: string;
}

interface BlogPost {
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

interface BlogCardProps {
  post: BlogPost;
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function BlogCard({ post }: BlogCardProps) {
  return (
    <div className=" w-full max-w-96  hover:shadow-2xl ring fade rounded-box shadow bg-base-100">
      {/* Image & Draft Badge */}
      <figure className="relative">
        <img
          src={post.photoUrl[0]}
          alt={post.title}
          className="h-48 w-full object-cover rounded-t-xl"
        />
        {!post.isPublished && (
          <div className="absolute top-2 right-2 badge badge-secondary shadow-md">
            Draft
          </div>
        )}
      </figure>

      {/* Card Content */}
      <div className="card-body p-4 ">
        <div className="flex justify-between items-center ">
          {/* Meta Info */}
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="inline-flex items-center gap-1">
              <svg
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="inline-block mr-1"
              >
                <circle cx="8" cy="8" r="7" />
                <path d="M8 4v4l2 2" />
              </svg>
              {formatDate(post.createdAt)}
            </span>
            <span className="mx-2">•</span>
            <span>
              By{" "}
              <span className="font-medium text-gray-700">
                {post.author.firstName} {post.author.lastName}
              </span>
            </span>
          </div>
        </div>
        {post.blogCategories.length > 0 && (
          <div className="flex flex-wrap gap-2 my-2">
            {post.blogCategories.map((cat) => (
              <div
                key={cat.id}
                className="badge badge-soft badge-sm ring fade  px-3 py-1  badge-primary"
              >
                {cat.name}
              </div>
            ))}
          </div>
        )}

        {/* Title */}
        <h2 className="card-title text-lg font-semibold line-clamp-2">
          {post.title}
        </h2>

        {/* Content Preview */}
        <p className="line-clamp-3 text-base text-gray-700 ">{post.content}</p>

        {/* Categories */}

        {/* Meta & Actions */}

        {post.allowComments && (
          <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
            <svg
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="inline-block"
            >
              <path d="M2 13V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v10l-3-3H3a1 1 0 0 1-1-1z" />
            </svg>
            {post._count.comments} comment
            {post._count.comments !== 1 ? "s" : ""}
          </div>
        )}
        <button className="btn btn-primary btn-md rounded-full mt-3">
          Read More
        </button>
        {/* Comments */}
      </div>
    </div>
  );
}
