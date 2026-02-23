import SimpleInput from "@/simpleComps/inputs/SimpleInput";
import { useParams, useSearch } from "@tanstack/react-router";
import type { RefObject } from "react";
import { FormProvider, useForm } from "react-hook-form";
import type { Socket } from "socket.io-client";

export default function ChatBar({ socket }: { socket?: RefObject<Socket> }) {
  const { convoId } = useSearch({
    strict: false,
  });
  const form = useForm({
    defaultValues: {
      content: "",
    },
  });
  return (
    <div className="p-4 bg-base-200 border-t border-base-300">
      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit((data) => {
            // console.log(socket, convoId);

            if (socket && convoId) {
              // console.log("ss");
              return socket.current.emit("chat:sendMessage", {
                conversationId: convoId,
                content: data.content,
              });
            }
          })}
          className="flex gap-2"
        >
          <input
            type="text"
            placeholder="Type a message..."
            className="input input-bordered flex-1 focus:outline-none"
            {...form.register("content")}
          />
          <button type="submit" className="btn btn-primary">
            Send
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-4 h-4"
            >
              <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
            </svg>
          </button>
        </form>
      </FormProvider>
    </div>
  );
}
