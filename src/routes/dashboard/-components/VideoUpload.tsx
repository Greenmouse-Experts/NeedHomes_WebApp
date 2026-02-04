import { useState } from "react";

export default function VideoUpload({
  videoProps,
}: {
  videoProps: ReturnType<typeof useVideoUpload>;
}) {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      videoProps.setVideoFile(event.target.files[0]);
    } else {
      videoProps.setVideoFile(null);
    }
  };

  return (
    <div className="form-control w-full max-w-xs">
      <label className="label">
        <span className="label-text">Pick a video file</span>
      </label>
      <input
        type="file"
        accept="video/*"
        className="file-input file-input-bordered w-full max-w-xs"
        onChange={handleFileChange}
      />
      {videoProps.url}
      {videoProps.url && (
        <div className="mt-4">
          <label className="label">
            <span className="label-text">Video Preview</span>
          </label>
          <video
            controls
            src={videoProps.url}
            className="w-full h-auto max-h-64 object-contain"
          />
        </div>
      )}
    </div>
  );
}

export const useVideoUpload = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  let url = videoFile ? URL.createObjectURL(videoFile) : null;
  return {
    videoFile,
    setVideoFile,
    url,
  };
};
