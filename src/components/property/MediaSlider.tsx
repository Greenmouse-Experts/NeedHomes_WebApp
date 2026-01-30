import { useState } from "react";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";

interface MediaSliderProps {
  images: string[];
  videos?: string[];
  coverImage?: string;
}

export function MediaSlider({
  images,
  videos = [],
  coverImage,
}: MediaSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVideo, setIsVideo] = useState(false);

  // Combine all media items
  const allMedia = [
    ...(coverImage ? [{ type: "image", url: coverImage }] : []),
    ...images.map((url) => ({ type: "image", url })),
    ...videos.map((url) => ({ type: "video", url })),
  ];

  // Remove duplicates
  const uniqueMedia = allMedia.filter(
    (media, index, self) =>
      index === self.findIndex((m) => m.url === media.url),
  );

  const currentMedia = uniqueMedia[currentIndex];

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? uniqueMedia.length - 1 : prev - 1));
    setIsVideo(false);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === uniqueMedia.length - 1 ? 0 : prev + 1));
    setIsVideo(false);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsVideo(false);
  };

  if (uniqueMedia.length === 0) {
    return (
      <div className="relative h-96 bg-gray-200 flex items-center justify-center rounded-lg">
        <p className="text-gray-500">No images available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Display */}
      <div className="relative h-96 bg-gray-200 rounded-lg overflow-hidden group">
        {currentMedia?.type === "image" ? (
          <img
            src={currentMedia.url}
            alt={`Property image ${currentIndex + 1}`}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src =
                'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="600"%3E%3Crect fill="%23ddd" width="800" height="600"/%3E%3C/svg%3E';
            }}
          />
        ) : (
          <div className="relative w-full h-full bg-black flex items-center justify-center">
            {!isVideo ? (
              <button
                onClick={() => setIsVideo(true)}
                className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 hover:bg-opacity-30 transition-all"
              >
                <div className="bg-white rounded-full p-4 hover:scale-110 transition-transform">
                  <Play className="w-12 h-12 text-[var(--color-orange)]" />
                </div>
              </button>
            ) : (
              <video
                src={currentMedia?.url}
                controls
                autoPlay
                className="w-full h-full"
              />
            )}
          </div>
        )}

        {/* Navigation Arrows */}
        {uniqueMedia.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6 text-gray-800" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6 text-gray-800" />
            </button>
          </>
        )}

        {/* Counter */}
        <div className="absolute bottom-4 right-4 bg-black bg-opacity-60 text-white px-3 py-1 rounded-full text-sm">
          {currentIndex + 1} / {uniqueMedia.length}
        </div>
      </div>

      {/* Thumbnails */}
      {uniqueMedia.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {uniqueMedia.map((media, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                currentIndex === index
                  ? "border-[var(--color-orange)] ring-2 ring-[var(--color-orange)] ring-opacity-50"
                  : "border-gray-300 hover:border-gray-400"
              }`}
            >
              {media.type === "image" ? (
                <img
                  src={media.url}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-black flex items-center justify-center">
                  <Play className="w-6 h-6 text-white" />
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
