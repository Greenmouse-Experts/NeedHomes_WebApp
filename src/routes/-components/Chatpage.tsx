import apiClient, { type ApiResponse } from "@/api/simpleApi";
import PageLoader from "@/components/layout/PageLoader";
import QueryCompLayout from "@/components/layout/QueryCompLayout";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import Conversations from "./Conversations";
import { toast } from "sonner";
import { extract_message } from "@/helpers/apihelpers";

export default function ChatPage() {
  const query = useQuery<ApiResponse>({
    queryKey: ["chat"],
    queryFn: async () => {
      let resp = await apiClient.get("/chat/my-conversation");
      return resp.data;
    },
  });
  const { convoId } = useParams({
    strict: false,
  });
  const mutation = useMutation({
    mutationFn: async () => {
      let resp = await apiClient.post("/chat/conversations", {
        message: "Hello nice ",
      });
      return resp.data;
    },
    onSuccess: (data) => {
      query.refetch();
    },
  });
  return (
    <>
      <div className="ring fade rounded-box">
        <div className="p-6 border-b fade">
          <h2 className="text-xl font-bold">Chat</h2>
        </div>
        <div className="">
          <h2 className="p-4 text-lg font-bold border-b fade">
            My Conversations
          </h2>
          <section className="p-4 ">
            <QueryCompLayout query={query}>
              {(data) => {
                const convos = data.data;
                // if (convos) {
                //   return (
                //     <div className="p-4 grid place-items-center bg-info/10 m-4 ring ring-info/50  rounded-box font-bold ">
                //       <div>
                //         <h2 className="text-info">No Conversations Started</h2>
                //         <button
                //           onClick={() => {
                //             toast.promise(mutation.mutateAsync, {
                //               loading: "loading",
                //               success: "success",
                //               error: extract_message,
                //             });
                //           }}
                //           disabled={mutation.isPending}
                //           className="btn btn-block btn-primary mt-4 btn-soft ring fade"
                //         >
                //           Start Conversation
                //         </button>
                //       </div>
                //     </div>
                //   );
                // }
                return (
                  <>
                    {JSON.stringify(convos)}
                    <ul className="menu">
                      <li>
                        <a>Sidebar Item 1</a>
                      </li>
                      <li>
                        <a>Sidebar Item 2</a>
                      </li>
                    </ul>
                    ;
                  </>
                );
              }}
            </QueryCompLayout>
          </section>
        </div>
      </div>
    </>
  );
}
