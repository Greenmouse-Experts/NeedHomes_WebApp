import SimpleTextArea from "@/simpleComps/inputs/SimpleTextArea";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";

export default function ChatInputBar() {
  const form = useForm({
    defaultValues: {
      message: "",
    },
  });
  return (
    <FormProvider {...form}>
      <form
        className="flex gap-2"
        onSubmit={form.handleSubmit((data) => {
          toast.info(data.message);
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
