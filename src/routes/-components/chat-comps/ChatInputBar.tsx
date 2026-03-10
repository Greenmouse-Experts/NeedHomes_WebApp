import apiClient from "@/api/simpleApi";
import { uploadImage } from "@/api/imageApi";
import SimpleInput from "@/simpleComps/inputs/SimpleInput";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ImageIcon, Loader2, X } from "lucide-react";
import type { RefObject } from "react";
import { useRef, useState } from "react";
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    // clear the input so the same file can be re-selected
    e.target.value = "";
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const sendMessage = async (text: string) => {
    if (convos) {
      socket.current?.emit("chat:sendMessage", {
        conversationId: convos.id,
        content: text,
      });
    } else {
      await mutation.mutateAsync({ message: text });
    }
  };

  const handleSubmit = async () => {
    const text = form.getValues("message").trim();

    if (!imageFile && !text) {
      toast.info("Message is empty");
      return;
    }

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    emitTyping(false);

    try {
      if (imageFile) {
        setIsUploading(true);
        const uploaded = await uploadImage(imageFile);
        await sendMessage(uploaded.data.url);
        clearImage();
      }
      if (text) {
        await sendMessage(text);
      }
    } catch {
      toast.error("Failed to send message");
    } finally {
      setIsUploading(false);
    }

    form.reset();
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
      <div className="sticky bottom-0 z-10 bg-base-100 border-t fade">
        {/* Image preview */}
        {imagePreview && (
          <div className="px-4 pt-3 flex items-start gap-2">
            <div className="relative inline-block">
              <img
                src={imagePreview}
                alt="preview"
                className="h-20 w-20 rounded-lg object-cover ring ring-base-300"
              />
              <button
                type="button"
                onClick={clearImage}
                className="absolute -top-2 -right-2 btn btn-xs btn-circle btn-error"
              >
                <X size={10} />
              </button>
            </div>
          </div>
        )}

        <form
          className="flex gap-2 p-4"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />

          {/* Image button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="btn btn-ghost btn-square shrink-0"
            title="Send image"
          >
            <ImageIcon size={20} className="opacity-60" />
          </button>

          <SimpleInput
            {...form.register("message")}
            onInput={handleInput}
            placeholder="Type your message here..."
          />

          <div>
            <button
              type="submit"
              disabled={mutation.isPending || isUploading}
              className="btn btn-primary"
            >
              {isUploading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                "Send"
              )}
            </button>
          </div>
        </form>
      </div>
    </FormProvider>
  );
}
