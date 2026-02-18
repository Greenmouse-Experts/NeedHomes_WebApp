import apiClient, { type ApiResponse } from "@/api/simpleApi";
import PageLoader from "@/components/layout/PageLoader";
import { useQuery } from "@tanstack/react-query";

export default function ChatPage() {
  const query = useQuery<ApiResponse>({
    queryKey: ["chat"],
    queryFn: () => apiClient.get("/chat/my-conversation"),
  });
  return (
    <PageLoader query={query}>
      {(data) => {
        return <>{JSON.stringify(data)}</>;
      }}
    </PageLoader>
  );
}
