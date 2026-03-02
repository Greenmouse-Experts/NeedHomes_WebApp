import { Textarea } from "@/components/ui/Textarea";
import LocalSelect from "@/simpleComps/inputs/LocalSelect";
import SimpleInput from "@/simpleComps/inputs/SimpleInput";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { gallery_helper } from "../../-components/upload_helpers";
import { useImages } from "@/helpers/images";
import UpdateImages from "@/simpleComps/inputs/UpdateImages";
import apiClient from "@/api/simpleApi";
import { toast } from "sonner";
import { extract_message } from "@/helpers/apihelpers";
import SimpleSelect from "@/simpleComps/inputs/SimpleSelect";

export const Route = createFileRoute("/dashboard/blogs/create/")({
  component: RouteComponent,
});

interface FORM_PROPS {
  title: string;
  photoUrl: string | null;
  content: string;
  categoryIds: string[];
  allowComments: boolean;
}
function RouteComponent() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "Updated Title",
      content: "Updated content...",
      photoUrl: null,
      categoryIds: ["uuid-of-category"],
      allowComments: false,
    },
  });
  const useImageProps = useImages([]);

  const mutation = useMutation({
    mutationFn: async (data: FORM_PROPS) => {
      const allGallery = await gallery_helper(useImageProps);
      if (allGallery.length === 0) {
        return Promise.reject(new Error("No images uploaded"));
      }
      const payload = {
        photoUrl: allGallery,
        title: data.title,
        content: data.content,
        categoryIds: data.categoryIds,
        allowComments: data.allowComments,
      };
      const resp = await apiClient.post("/blogs", payload);
      return resp.data;
    },
  });

  const onSubmit = (data: FORM_PROPS) => {
    console.log(data);
    toast.promise(mutation.mutateAsync(data), {
      loading: "Creating blog...",
      success: "Blog created successfully!",
      error: extract_message,
    });
  };

  return (
    <div className="mx-auto p-6 bg-base-100 rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6">Create Blog</h1>
      <div className="my-2">
        {/*//@ts-ignore*/}
        <UpdateImages {...useImageProps} />
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <SimpleInput {...register("title")} label="Title" />
        <div>
          <label className="text-current/50 mb-2 text-sm font-semibold">
            Content
          </label>
          <Textarea {...register("content")} />
        </div>
        {/** If you want to support multiple photo URLs, you can add more fields */}
        {/*<LocalSelect label="Category">
          <option value="uuid-of-category">Category 1</option>
        </LocalSelect>*/}

        <SimpleSelect
          route="blogs/categories"
          render={(option: { id: string; name: string }) => {
            return (
              <option value={option.id} className="capitalize">
                {option.name}
              </option>
            );
          }}
        ></SimpleSelect>
        <div className="form-control">
          <label className="label cursor-pointer">
            <span className="label-text font-semibold">Allow Comments</span>
            <input
              type="checkbox"
              className="checkbox"
              {...register("allowComments")}
              defaultChecked={false}
            />
          </label>
        </div>

        <button
          disabled={mutation.isPending}
          type="submit"
          className="btn btn-primary w-full"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
