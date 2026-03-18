import { useEffect, useState, useMemo } from "react";

import { XCircle, UploadCloud } from "lucide-react";
import { nanoid } from "nanoid";

export default function VideoUpload({
  videoProps,
}: {
  videoProps: ReturnType<typeof useVideoUpload>;
}) {
  const id = nanoid();

  useEffect(() => {
    return () => {
      if (videoProps.url && videoProps.videoFile) {
        URL.revokeObjectURL(videoProps.url);
      }
    };
  }, [videoProps.url, videoProps.videoFile]);

  return (
    <div className="flex-1 flex flex-col">
      <label htmlFor={id} className="label mb-2">
        <span className="label-text font-semibold">Video File</span>
      </label>

      <div className="relative flex-1 flex flex-col min-h-0 max-h-120 border-2 border-dashed border-base-300 rounded-lg hover:border-primary transition-colors duration-200">
        <input
          type="file"
          accept="video/*"
          className="hidden"
          id={id}
          onChange={(e) => {
            const file = e.target.files?.[0] as File;
            if (file) {
              videoProps.setVideoFile(file);
            } else {
              videoProps.setVideoFile(null);
            }
          }}
        />
        <label
          htmlFor={id}
          className="flex flex-col items-center justify-center text-center cursor-pointer w-full h-full min-h-0 p-4"
        >
          {videoProps.url ? (
            <div className="relative w-full h-full flex items-center justify-center group">
              <video
                controls
                src={videoProps.url}
                className="max-w-full max-h-112 w-full h-full object-contain rounded-lg shadow-md"
                style={{ display: "block" }}
              />
              <button
                type="button"
                className="btn btn-circle btn-error btn-sm absolute -right-2 -top-2 m-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                onClick={(e) => {
                  e.preventDefault();
                  videoProps.setVideoFile(null);
                  videoProps.setPrevVideo(null);
                }}
                aria-label="Remove selected video"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center">
              <UploadCloud className="h-12 w-12 text-base-content opacity-60" />
              <span className="mt-2 text-lg font-semibold text-base-content opacity-80">
                Upload Video
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

export const useVideoUpload = (prev?: string) => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [prevVideo, setPrevVideo] = useState<string | null>(prev ?? null);

  const url = useMemo(() => {
    if (videoFile) return URL.createObjectURL(videoFile);
    return prevVideo;
  }, [videoFile, prevVideo]);

  useEffect(() => {
    console.log(url);
  }, [url]);

  return {
    videoFile,
    setVideoFile,
    prevVideo,
    setPrevVideo,
    url,
  };
};
