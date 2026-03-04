import apiClient from "@/api/simpleApi";
import QueryCompLayout from "@/components/layout/QueryCompLayout";
import { useQuery } from "@tanstack/react-query";

export default function Comments({ blogId }: { blogId: string }) {
  const query = useQuery({
    queryKey: ["comments", blogId],
    queryFn: async () => {
      let resp = await apiClient.get(`/blogs/${blogId}/Comments`);
      return resp.data;
    },
  });
  return (
    <div className="">
      <h2 className="p-4 border-b fade">Comments</h2>
      <div className="p-4">
        <QueryCompLayout query={query}>
          {(resp) => {
            let data = resp.data;
            return <></>;
          }}
        </QueryCompLayout>
      </div>
    </div>
  );
}
