import apiClient from "@/api/simpleApi";
import QueryCompLayout from "@/components/layout/QueryCompLayout";
import { useQuery } from "@tanstack/react-query";

export default function InvPaymentSchedule({ id }: { id: string }) {
  const query = useQuery({
    queryKey: ["inv-schedule" + id],
    queryFn: async () => {
      let resp = await apiClient.get(`investments/${id}/installments`);
      return resp.data;
    },
  });
  return (
    <QueryCompLayout query={query}>
      {(data) => {
        return <>{JSON.stringify(data.data)}</>;
      }}
    </QueryCompLayout>
  );
}
