import apiClient, { type ApiResponse } from "@/api/simpleApi";
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
  photoUrl: string | null;
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
  );
}
function FormField({ defaultValues }:{defaultValues:FORM_PROPS}) {
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
    defaultValues.photoUrl.map((item as any) => {
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
        {/*
        <SimpleSelect
          route="blogs/categories"
          render={(option: { id: string; name: string }) => {
            return (
              <option value={option.id} className="capitalize">
                {option.name}
              </option>
            );
          }}
        ></SimpleSelect>*/}

        <ul className="menu ring fade rounded-box w-full">
          <h2 className="p-2 border-b fade mb-2">Categories</h2>
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
                  <li
                    className="menu-item "
                    onMouseUp={() => {
                      remove_from();
                    }}
                  >
                    <a className="menu-active">{item.name}</a>
                  </li>
                );
              }
              return (
                <li
                  className="menu-item"
                  onMouseUp={() => {
                    add_to();
                  }}
                >
                  <a className="">{item.name}</a>
                </li>
              );
            }}
          ></SimpleMultiSelect>
        </ul>

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
