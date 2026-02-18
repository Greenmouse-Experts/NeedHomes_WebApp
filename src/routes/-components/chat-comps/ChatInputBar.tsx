import apiClient from "@/api/simpleApi";
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
        className="flex gap-2"
        onSubmit={form.handleSubmit((data) => {
          if (data.message.trim()) {
            if (convos) {
              console.log(socket.current);
              return socket.current.emit("chat:sendMessage", {
                conversationId: convos.id,
                message: data.message,
              });
            }
            return mutation.mutate(data);
          }
          toast.info("Message is empty");
        })}
      >
        <SimpleTextArea
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
