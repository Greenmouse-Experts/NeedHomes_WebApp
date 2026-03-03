import apiClient, { type ApiResponseV2 } from "@/api/simpleApi";
import PageLoader from "@/components/layout/PageLoader";
import CustomTable, { type columnType } from "@/components/tables/CustomTable";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import { type Actions } from "@/components/tables/pop-up";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import SearchBar from "@/routes/-components/Searchbar";
import { toast } from "sonner";
import { extract_message } from "@/helpers/apihelpers";

export const Route = createFileRoute("/dashboard/blogs/")({
  component: RouteComponent,
});

interface Blog {
  id: string;
  title: string;
  slug?: string;
  content: string;
  authorId: string;
  isPublished: boolean;
  photoUrl: string[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  allowComments: boolean;
  author: {
    id: string;
    firstName: string;
    lastName: string;
  };
  blogCategories: any[];
  _count: {
    comments: number;
  };
}

const status = [
  {
    name: "All",
    key: null,
  },
  {
    name: "Published",
    key: "PUBLISHED",
  },
  {
    name: "Draft",
    key: "DRAFT",
  },
];

function RouteComponent() {
  const nav = useNavigate();
  const [search, setSearch] = useState();
  const query = useQuery<ApiResponseV2<Blog[]>>({
    queryKey: ["blogs-admin", search],
    queryFn: async () => {
      const response = await apiClient.get("blogs/admin/all", {
        params: {
          search: search,
          // status: "PUBLISHED",
        },
      });
      return response.data;
    },
  });

  const columns: columnType<Blog>[] = [
    {
      key: "title",
      label: "Title",
      render: (value) => <span className="line-clamp-1">{value}</span>,
    },
    {
      key: "author",
      label: "Author",
      render: (_, item) => `${item.author.firstName} ${item.author.lastName}`,
    },
    {
      key: "isPublished",
      label: "Status",
      render: (value) => (
        <span
          className={`badge badge-sm badge-soft ring  fade ${value ? "badge-success" : "badge-warning"}`}
        >
          {value ? "Published" : "Draft"}
        </span>
      ),
    },
    {
      key: "createdAt",
      label: "Created At",
      render: (value) => new Date(value).toLocaleDateString(),
    },
    {
      key: "_count",
      label: "Comments",
      render: (_, item) => item._count.comments,
    },
  ];

  const actions: Actions<Blog>[] = [
    {
      key: "edit",
      label: "Edit",
      action: (item) => {
        nav({ to: `/dashboard/blogs/${item.id}/edit` });
      },
    },
    {
      key: "status",
      label: "publish",
      action: (item) => {
        return toast.promise(() => publish(item.id, !item.isPublished), {
          loading: "Publishing...",
          success: () => {
            query.refetch();
            return "Published successfully!";
          },
          error: extract_message,
        });
      },
      render: (item) => {
        return <>{item.isPublished ? "Unpublish" : "Publish"}</>;
      },
    },
    {
      key: "view",
      label: "View",
      action: (item) => {
        nav({ to: `/blogs/${item.slug || item.id}` });
      },
    },
    {
      key: "delete",
      label: "Delete",
      action: (item) => {
        // Add delete logic here
        console.log("Delete", item);
      },
    },
  ];
  const publish = async (id: string, isPublished: boolean) => {
    let resp = await apiClient.patch(`blogs/${id}/publish`, {
      isPublished: isPublished,
    });
    return resp.data;
  };
  return (
    <div className="bg-base-100 shadow ring fade p-4 rounded-box">
      <section className="flex flex-col md:flex-row ">
        <div className="mb-6 ">
          <h1 className="text-xl font-bold">Blog</h1>
          <p className="text-base-content/60">Blog management page</p>
        </div>
        <Link
          className="btn btn-primary md:ml-auto"
          to="/dashboard/blogs/create"
        >
          Create Blog
        </Link>
      </section>
      <div className="mb-6">
        <SearchBar value={search} onChange={setSearch} />
      </div>
      <PageLoader query={query}>
        {(data) => {
          const blogs = data.data.data;
          return (
            <CustomTable
              data={blogs}
              columns={columns}
              actions={actions}
              totalCount={blogs.length}
            />
          );
        }}
      </PageLoader>
    </div>
  );
}
