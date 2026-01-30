import { Eye, XCircle, UploadCloud } from "lucide-react";
import { nanoid } from "nanoid";
import { useEffect, useState } from "react";
import Modal from "@/components/modals/DialogModal";
import { useModal } from "@/store/modals";

interface UpdateImagesProps {
  images: { url: string; path: string }[];
  setNew: (item: any) => any;
  setPrev: (item: any) => any;
}

const ImageViewer = ({ imageUrl }: { imageUrl: string }) => {
  return (
    <div className="flex flex-1 justify-center items-center p-4">
      <img
        src={imageUrl}
        alt="Preview"
        className="max-w-full max-h-[70vh] object-contain rounded-lg"
      />
    </div>
  );
};

export default function UpdateImages({
  images,
  setNew,
  setPrev,
}: UpdateImagesProps) {
  const id = nanoid();
  const [prevImages, setPrevImages] = useState<{ url: string; path: string }[]>(
    images || [],
  );
  const {
    ref: previewModalRef,
    showModal: showPreviewModal,
    closeModal: closePreviewModal,
  } = useModal();
  const [currentPreviewImage, setCurrentPreviewImage] = useState<string | null>(
    null,
  );

  useEffect(() => {
    setPrevImages(images);
  }, [images]);

  const [newImages, setNewImages] = useState<FileList | []>([]);
  useEffect(() => {
    if (newImages.length > 0) {
      setNew(newImages);
    } else {
      setNew([]); // Ensure setNew is called with an empty array if newImages becomes empty
    }
  }, [newImages, setNew]);

  const removeNewImage = (indexToRemove: number) => {
    if (newImages) {
      // Convert FileList to array, filter out the file at indexToRemove
      const filesArray = Array.from(newImages);
      const filteredFiles = filesArray.filter(
        (_, index) => index !== indexToRemove,
      );

      // Create a new FileList using DataTransfer
      const dataTransfer = new DataTransfer();
      filteredFiles.forEach((file) => dataTransfer.items.add(file));
      setNewImages(dataTransfer.files); // Update state with new FileList
    }
  };

  const handlePreviewClick = (imageUrl: string) => {
    setCurrentPreviewImage(imageUrl);
    showPreviewModal();
  };

  return (
    <div className="space-y-4">
      <Modal ref={previewModalRef} title="Image Preview">
        {currentPreviewImage && <ImageViewer imageUrl={currentPreviewImage} />}
      </Modal>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4">
        <div className="h-40 flex flex-col justify-center items-center border-2 border-dashed border-base-300 rounded-lg p-4 hover:border-primary transition-colors duration-200">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            name=""
            id={id}
            onChange={(e) => {
              const files = e.target.files;
              //@ts-ignore
              setNewImages((prev) => (prev ? [...prev, ...files] : [...files]));
            }}
            multiple // Allow multiple file selection
          />
          <label
            htmlFor={id}
            className="flex flex-col items-center justify-center text-center cursor-pointer h-full w-full"
          >
            <UploadCloud className="h-12 w-12 text-base-content opacity-60" />
            <span className="mt-2 text-lg font-semibold text-base-content opacity-80">
              Upload Images
            </span>
            <span className="text-sm text-base-content opacity-60">
              Drag and drop or click to upload
            </span>
          </label>
        </div>
        {prevImages?.length > 0 &&
          prevImages?.map((image, index) => (
            <div key={image.path} className="relative h-40 w-full group">
              <img
                className="size-full object-cover rounded-lg shadow-md"
                src={image.url}
                alt={`Existing image ${index + 1}`}
              />
              <div className="absolute top-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button
                  type="button"
                  className="btn btn-circle btn-info btn-sm"
                  onClick={() => handlePreviewClick(image.url)}
                  aria-label="Preview existing image"
                >
                  <Eye className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  className="btn btn-circle btn-error btn-sm"
                  onClick={() => {
                    setPrevImages((prev) =>
                      prev.filter((img) => img.path !== image.path),
                    );
                    setPrev((prev: any[]) =>
                      prev.filter((img) => img.path !== image.path),
                    ); // Update setPrev as well
                  }}
                  aria-label="Remove existing image"
                >
                  <XCircle className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}

        {newImages &&
          Array.from(newImages).map((image, index) => (
            <div
              key={image.name + index}
              className="relative h-40 w-full group"
            >
              <img
                className="size-full object-cover rounded-lg shadow-md"
                src={URL.createObjectURL(image)}
                alt={`New image ${index + 1}`}
              />
              <div className="absolute top-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button
                  type="button"
                  className="btn btn-circle btn-info btn-sm"
                  onClick={() => handlePreviewClick(URL.createObjectURL(image))}
                  aria-label="Preview new image"
                >
                  <Eye className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  className="btn btn-circle btn-error btn-sm"
                  onClick={() => {
                    removeNewImage(index);
                  }}
                  aria-label="Remove new image"
                >
                  <XCircle className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
