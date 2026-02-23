import apiClient from "@/api/simpleApi";
import SimpleInput from "@/simpleComps/inputs/SimpleInput";
import SimpleTextArea from "@/simpleComps/inputs/SimpleTextArea";
import { Query, useMutation } from "@tanstack/react-query";
import type { RefObject } from "react";
import { FormProvider, useForm } from "react-hook-form";
import type { Socket } from "socket.io-client";
import { toast } from "sonner";
export default function ChatInputBar({
  convos,
  socket,
}: {
  convos: any;
  socket: RefObject<Socket>;
}) {
  const form = useForm({
    defaultValues: {
      message: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: { message: string }) => {
      let resp = await apiClient.post("/chat/conversations", {
        message: data.message,
      });
      return resp.data;
    },
    // onSuccess: (data) => {},
  });
  return (
    <FormProvider {...form}>
      <form
        className="flex gap-2 sticky bottom-0 p-4 z-10 bg-base-100 border-t  fade"
        onSubmit={form.handleSubmit((data) => {
          if (data.message.trim()) {
            if (convos) {
              // console.log(socket.current);
              return socket.current.emit("chat:sendMessage", {
                conversationId: convos.id,
                content: data.message,
              });
            }
            return mutation.mutate(data);
          }
          toast.info("Message is empty");
        })}
      >
        <SimpleInput
          className="min-h-32"
          {...form.register("message")}
          placeholder="Type your message here..."
        />
        <div className="">
          <button className="btn btn-primary">Submit</button>
        </div>
      </form>
    </FormProvider>
  );
}
