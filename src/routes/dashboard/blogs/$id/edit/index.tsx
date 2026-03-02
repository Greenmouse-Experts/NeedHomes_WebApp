import apiClient, { type ApiResponse } from "@/api/simpleApi";
import BackButton from "@/components/BackButton";
import PageLoader from "@/components/layout/PageLoader";
import { Textarea } from "@/components/ui/Textarea";
import { extract_message } from "@/helpers/apihelpers";
import { useImages } from "@/helpers/images";
import useSelect from "@/helpers/selectors";
import { gallery_helper } from "@/routes/dashboard/-components/upload_helpers";
import SimpleInput from "@/simpleComps/inputs/SimpleInput";
import SimpleMultiSelect from "@/simpleComps/inputs/SimpleMultiSelect";
import UpdateImages from "@/simpleComps/inputs/UpdateImages";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/blogs/$id/edit/")({
  component: RouteComponent,
});
interface FORM_PROPS {
  title: string;
  photoUrl: string[] | null;
  content: string;
  categoryIds: string[];
  allowComments: boolean;
}
function RouteComponent() {
  const { id } = Route.useParams();
  const query = useQuery({
    queryKey: ["blog-details", id],
    queryFn: async () => {
      let resp = await apiClient.get("blogs/admin/" + id);
      return resp.data;
    },
  });

  const onSubmit = (data: any) => {
    // Handle form submission logic here
    console.log(data);
  };
  return (
    <>
      <BackButton />
      <PageLoader query={query}>
        {(resp) => {
          let data = resp.data;
          return (
            <>
              <FormField defaultValues={data as FORM_PROPS} />
            </>
          );
        }}
      </PageLoader>
    </>
  );
}
function FormField({ defaultValues }: { defaultValues: FORM_PROPS }) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    control,
    getValues,
  } = useForm({
    defaultValues: {
      ...defaultValues,
    },
  });
  const useImageProps = useImages(
    //@ts-ignore
    defaultValues?.photoUrl.map((item) => {
      return {
        url: item,
        path: item,
      };
    }),
  );
  const nav = useNavigate();
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
      const resp = await apiClient.patch("/blogs/" + defaultValues.id, payload);
      return resp.data;
    },
    onSuccess: (data: ApiResponse) => {
      const id = data.data.id;
      return nav({
        to: `/dashboard/blogs/$id/details`,
        params: {
          id: id,
        },
      });
    },
  });
  const selectProps = useSelect();

  const onSubmit = (data: FORM_PROPS) => {
    console.log(data);
    toast.promise(mutation.mutateAsync(data), {
      loading: "Creating blog...",
      success: "Blog created successfully!",
      error: extract_message,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 to-base-100 p-4 md:p-8">
      <div className="">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-base-content mb-2">
            Create Blog
          </h1>
          <p className="text-base-content/60">
            Share your thoughts and ideas with the world
          </p>
        </div>

        <div className="bg-base-100 rounded-xl shadow-lg p-6 md:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Image Upload Section */}
            <div className="border-2 border-dashed border-base-300 rounded-lg p-4 hover:border-primary transition-colors">
              <h3 className="text-sm font-semibold text-base-content mb-3">
                Featured Image
              </h3>
              {/*//@ts-ignore*/}
              <UpdateImages {...useImageProps} />
            </div>

            {/* Title Input */}
            <div>
              <SimpleInput
                {...register("title", { required: "Title is required" })}
                label="Blog Title"
                placeholder="Enter an engaging title"
              />
              {errors.title && (
                <p className="text-error text-sm mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Content Input */}
            <div>
              <label className="block text-sm font-semibold text-base-content mb-3">
                Content
              </label>
              <Textarea
                {...register("content", { required: "Content is required" })}
                placeholder="Write your blog content here..."
                className="textarea textarea-bordered min-h-48"
              />
              {errors.content && (
                <p className="text-error text-sm mt-1">
                  {errors.content.message}
                </p>
              )}
            </div>

            {/* Categories Section */}
            <div className="border border-base-300 rounded-lg overflow-hidden">
              <div className="bg-base-200 px-4 py-3 border-b border-base-300">
                <h2 className="text-sm font-semibold text-base-content">
                  Categories
                </h2>
              </div>
              <div className="p-4">
                <SimpleMultiSelect
                  route="blogs/categories"
                  //@ts-ignore
                  render={(item: { name: string; id: string }) => {
                    const add_to = () => {
                      selectProps.add_to({
                        id: item.id as any,
                        name: item.name,
                      });
                      setValue("categoryIds", selectProps.mapped);
                      return;
                    };
                    const remove_from = () => {
                      selectProps.remove(item.id as any);
                      setValue("categoryIds", selectProps.mapped);
                      return;
                    };
                    const exists = () => {
                      return selectProps.exists(item.id as any);
                    };
                    if (exists()) {
                      return (
                        <div
                          className="inline-block mr-2 mb-2 cursor-pointer"
                          onMouseUp={() => {
                            remove_from();
                          }}
                        >
                          <span className="badge badge-primary gap-2 px-3 py-2">
                            {item.name}
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </span>
                        </div>
                      );
                    }
                    return (
                      <div
                        className="inline-block mr-2 mb-2 cursor-pointer"
                        onMouseUp={() => {
                          add_to();
                        }}
                      >
                        <span className="badge badge-outline gap-2 px-3 py-2 hover:badge-primary transition-all">
                          {item.name}
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 4v16m8-8H4"
                            />
                          </svg>
                        </span>
                      </div>
                    );
                  }}
                ></SimpleMultiSelect>
              </div>
            </div>

            {/* Allow Comments Checkbox */}
            <div className="bg-base-200 rounded-lg p-4">
              <label className="label cursor-pointer justify-start gap-3">
                <input
                  type="checkbox"
                  className="checkbox checkbox-primary"
                  {...register("allowComments")}
                  defaultChecked={false}
                />
                <span className="label-text font-semibold text-base-content">
                  Allow readers to comment on this blog
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              disabled={mutation.isPending}
              type="submit"
              className="btn btn-primary w-full btn-lg font-semibold"
            >
              {mutation.isPending ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Creating...
                </>
              ) : (
                "Publish Blog"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
