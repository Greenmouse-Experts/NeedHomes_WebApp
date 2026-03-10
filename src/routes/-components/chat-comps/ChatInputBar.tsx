import apiClient from "@/api/simpleApi";
import SimpleInput from "@/simpleComps/inputs/SimpleInput";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { RefObject } from "react";
import { useRef } from "react";
import { FormProvider, useForm } from "react-hook-form";
import type { Socket } from "socket.io-client";
import { toast } from "sonner";

export default function ChatInputBar({
  convos,
  socket,
  isClosed,
}: {
  convos: any;
  socket: RefObject<Socket>;
  isClosed?: boolean;
}) {
  const form = useForm({ defaultValues: { message: "" } });
  const client = useQueryClient();
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const mutation = useMutation({
    mutationFn: async (data: { message: string }) => {
      let resp = await apiClient.post("/chat/conversations", {
        message: data.message,
      });
      return resp.data;
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["chat"] });
    },
  });

  const emitTyping = (isTyping: boolean) => {
    const s = socket.current;
    if (!s || !convos?.id) return;
    s.emit("chat:typing", { conversationId: convos.id, isTyping });
  };

  const handleInput = () => {
    emitTyping(true);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => emitTyping(false), 2000);
  };

  if (isClosed) {
    return (
      <div className="p-4 border-t fade text-center text-sm text-current/50">
        This conversation has been closed.
      </div>
    );
  }

  return (
    <FormProvider {...form}>
      <form
        className="flex gap-2 sticky bottom-0 p-4 z-10 bg-base-100 border-t fade"
        onSubmit={form.handleSubmit((data) => {
          if (!data.message.trim()) {
            toast.info("Message is empty");
            return;
          }
          if (convos) {
            socket.current?.emit("chat:sendMessage", {
              conversationId: convos.id,
              content: data.message,
            });
            // stop typing indicator
            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
            emitTyping(false);
          } else {
            mutation.mutate(data);
          }
          form.reset();
        })}
      >
        <SimpleInput
          {...form.register("message")}
          onInput={handleInput}
          placeholder="Type your message here..."
        />
        <div>
          <button
            disabled={mutation.isPending}
            className="btn btn-primary"
          >
            Send
          </button>
        </div>
      </form>
    </FormProvider>
  );
}
