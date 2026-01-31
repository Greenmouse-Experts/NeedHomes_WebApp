import type { useSelectImage } from "@/helpers/images";
import { XCircle, UploadCloud } from "lucide-react";
import { nanoid } from "nanoid";
import { useEffect } from "react";
interface ImageProps extends ReturnType<typeof useSelectImage> {
  title?: string;
}

export default function SelectImage(props: ImageProps) {
  const id = nanoid();

  // Clean up the object URL when the component unmounts or image changes
  useEffect(() => {
    return () => {
      if (props.image_link) {
        URL.revokeObjectURL(props.image_link);
      }
    };
  }, [props.image_link]);

  return (
    <div className="flex-1 flex flex-col  ">
      {props.title && (
        <label htmlFor={id} className="label mb-2">
          <span className="label-text font-semibold">{props.title}</span>
        </label>
      )}

      <div className="relative flex-1 flex flex-col min-h-0 border-2 border-dashed border-base-300 rounded-lg hover:border-primary transition-colors duration-200">
        <input
          type="file"
          accept="image/*"
          className="hidden"
          id={id}
          onChange={(e) => {
            const file = e.target.files?.[0] as File;
            if (file) {
              props.setImage(file);
            } else {
              props.setImage(null);
            }
          }}
        />
        <label
          htmlFor={id}
          className="flex flex-col items-center justify-center text-center cursor-pointer w-full h-full min-h-0 p-4"
        >
          {props.image && props.image_link ? (
            <div className="relative w-full h-full flex items-center justify-center group ">
              <img
                className="max-w-full max-h-full w-full h-full object-contain rounded-lg shadow-md"
                style={{ display: "block" }}
                src={props.image_link}
                alt={`Selected image`}
              />
              <button
                type="button"
                className="btn btn-circle btn-error btn-sm absolute -right-2 -top-2 m-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                onClick={(e) => {
                  e.preventDefault();
                  props.setImage(null);
                }}
                aria-label="Remove selected image"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>
          ) : props.prev ? (
            <div className="relative w-full h-full flex items-center justify-center group overflow-hidden">
              <img
                className="max-w-full max-h-full w-full h-full object-contain rounded-lg shadow-md"
                style={{ display: "block" }}
                src={props.prev}
                alt={`Selected image`}
              />
              <button
                type="button"
                className="btn btn-circle btn-error btn-sm absolute -right-2 -top-2 m-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                onClick={(e) => {
                  e.preventDefault();
                  props.setPrev(null as any);
                }}
                aria-label="Remove selected image"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center">
              <UploadCloud className="h-12 w-12 text-base-content opacity-60" />
              <span className="mt-2 text-lg font-semibold text-base-content opacity-80">
                Upload Image
              </span>
              <span className="text-sm text-base-content opacity-60">
                Drag and drop or click to upload
              </span>
            </div>
          )}
        </label>
      </div>
    </div>
  );
}
