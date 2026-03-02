import { createFileRoute } from "@tanstack/react-router";
import { useForm } from "react-hook-form";

export const Route = createFileRoute("/dashboard/blogs/$id/edit/")({
  component: RouteComponent,
});

function RouteComponent() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "Updated Title",
      content: "Updated content...",
      photoUrl: ["https://cdn.example.com/new-image.jpg"],
      categoryIds: ["uuid-of-category"],
      allowComments: false,
    },
  });

  const onSubmit = (data: any) => {
    // Handle form submission logic here
    console.log(data);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-base-100 rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6">Edit Blog</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block mb-2 font-semibold">Title</label>
          <input
            type="text"
            className={`input input-bordered w-full ${errors.title ? "input-error" : ""}`}
            {...register("title", { required: "Title is required" })}
          />
          {errors.title && (
            <span className="text-error text-sm">{errors.title.message}</span>
          )}
        </div>

        <div>
          <label className="block mb-2 font-semibold">Content</label>
          <textarea
            className={`textarea textarea-bordered w-full ${errors.content ? "textarea-error" : ""}`}
            rows={6}
            {...register("content", { required: "Content is required" })}
          />
          {errors.content && (
            <span className="text-error text-sm">{errors.content.message}</span>
          )}
        </div>

        <div>
          <label className="block mb-2 font-semibold">Photo URL</label>
          <input
            type="url"
            className={`input input-bordered w-full ${errors.photoUrl ? "input-error" : ""}`}
            {...register("photoUrl.0", { required: "Photo URL is required" })}
          />
          {errors.photoUrl && errors.photoUrl[0] && (
            <span className="text-error text-sm">
              {errors.photoUrl[0].message}
            </span>
          )}
          {/** If you want to support multiple photo URLs, you can add more fields */}
        </div>

        <div>
          <label className="block mb-2 font-semibold">Category</label>
          <select
            className={`select select-bordered w-full ${errors.categoryIds ? "select-error" : ""}`}
            {...register("categoryIds.0", { required: "Category is required" })}
          >
            <option value="uuid-of-category">Category 1</option>
            {/* Add more options as needed */}
          </select>
          {errors.categoryIds && errors.categoryIds[0] && (
            <span className="text-error text-sm">
              {errors.categoryIds[0].message}
            </span>
          )}
        </div>

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

        <button type="submit" className="btn btn-primary w-full">
          Save Changes
        </button>
      </form>
    </div>
  );
}
