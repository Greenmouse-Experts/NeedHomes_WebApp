import apiClient from "@/api/simpleApi";

export async function suspend_unsuspend(props: {
  userId: string;
  status: "suspend" | "unsuspend";
}) {
  const resp = await apiClient.post(`/${props.userId}/${props.status}`, {
    status: props.status,
  });
  return resp.data;
}
