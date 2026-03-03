import type { ApiResponseV2 } from "@/api/simpleApi";
import apiClient from "@/api/simpleApi";
import QueryCompLayout from "@/components/layout/QueryCompLayout";
import { useQuery } from "@tanstack/react-query";

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
      <h2 className="p-2 border-b fade font-bold">Featued</h2>
      <div className="p-2">
        <QueryCompLayout query={query}>
          {(resp) => {
            const data = resp.data.data;
            return <div>{}</div>;
          }}
        </QueryCompLayout>
      </div>
    </div>
  );
}
