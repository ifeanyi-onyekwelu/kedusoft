// components/screens/Public/EnhancedImageGallery.tsx
import { useState } from "react";
import { X, ChevronLeft, ChevronRight, Play } from "lucide-react";

interface EnhancedImageGalleryProps {
  images: string[];
  videoTour?: string;
}

export default function EnhancedImageGallery({
  images,
  videoTour,
}: EnhancedImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const media = videoTour
    ? [
        { type: "video", url: videoTour },
        ...images.map((url) => ({ type: "image", url })),
      ]
    : images.map((url) => ({ type: "image", url }));

  const openLightbox = (index: number) => {
    setSelectedIndex(index);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setSelectedIndex(null);
    setIsVideoPlaying(false);
    document.body.style.overflow = "unset";
  };

  const goNext = () => {
    if (selectedIndex === null) return;
    setSelectedIndex((selectedIndex + 1) % media.length);
  };

  const goPrev = () => {
    if (selectedIndex === null) return;
    setSelectedIndex((selectedIndex - 1 + media.length) % media.length);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowRight") goNext();
    if (e.key === "ArrowLeft") goPrev();
  };

  // Better grid layout - more balanced and responsive
  return (
    <>
      {/* Improved Main Gallery Grid */}
      <div className="grid grid-cols-4 grid-rows-2 gap-3 rounded-2xl overflow-hidden h-96">
        {/* Main featured image/video - takes 2x2 space */}
        {media[0] && (
          <div
            className="col-span-2 row-span-2 relative group cursor-pointer"
            onClick={() => openLightbox(0)}
          >
            {media[0].type === "video" ? (
              <div className="relative w-full h-full bg-gray-100 rounded-xl overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                  <div className="text-center">
                    <div className="bg-white/90 backdrop-blur-sm rounded-full p-4 inline-flex items-center justify-center mb-2">
                      <Play className="w-6 h-6 text-blue-600" />
                    </div>
                    <p className="text-sm text-gray-600 font-medium">
                      Video Tour
                    </p>
                  </div>
                </div>
                <div className="absolute inset-0 bg-black/5 group-hover:bg-black/10 transition-all duration-200" />
              </div>
            ) : (
              <img
                src={media[0].url}
                alt="Main property image"
                className="w-full h-full object-cover rounded-xl"
              />
            )}
          </div>
        )}

        {/* Secondary images - smaller grid */}
        {media.slice(1, 5).map((item, index) => (
          <div
            key={index + 1}
            className="relative group cursor-pointer"
            onClick={() => openLightbox(index + 1)}
          >
            {item.type === "video" ? (
              <div className="relative w-full h-full bg-gray-100 rounded-lg overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                  <Play className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            ) : (
              <img
                src={item.url}
                alt={`Property image ${index + 2}`}
                className="w-full h-full object-cover rounded-lg"
              />
            )}
          </div>
        ))}

        {/* More images overlay on last thumbnail */}
        {media.length > 5 && (
          <div
            className="relative group cursor-pointer"
            onClick={() => openLightbox(4)}
          >
            <img
              src={media[4].url}
              alt="Property image"
              className="w-full h-full object-cover rounded-lg"
            />
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-lg group-hover:bg-black/70 transition-all duration-200">
              <span className="text-white font-semibold text-sm">
                +{media.length - 5} more
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Lightbox Modal - Keep your existing lightbox code */}
      {selectedIndex !== null && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          {/* Your existing lightbox code remains the same */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white p-2 hover:bg-white/10 rounded-full z-10"
          >
            <X className="w-6 h-6" />
          </button>

          {media.length > 1 && (
            <>
              <button
                onClick={goPrev}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white p-3 hover:bg-white/10 rounded-full z-10"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={goNext}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white p-3 hover:bg-white/10 rounded-full z-10"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          <div className="relative w-full h-full max-w-6xl max-h-[80vh] flex items-center justify-center p-8">
            {media[selectedIndex].type === "video" ? (
              <div className="w-full h-full">
                <video
                  controls
                  autoPlay
                  className="w-full h-full object-contain rounded-lg"
                  onPlay={() => setIsVideoPlaying(true)}
                >
                  <source src={media[selectedIndex].url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            ) : (
              <img
                src={media[selectedIndex].url}
                alt={`Property image ${selectedIndex + 1}`}
                className="max-w-full max-h-full object-contain rounded-lg"
              />
            )}
          </div>

          {media.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 max-w-full overflow-x-auto px-4 py-2">
              {media.map((item, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedIndex(index)}
                  className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 ${
                    index === selectedIndex
                      ? "border-blue-500"
                      : "border-transparent"
                  }`}
                >
                  {item.type === "video" ? (
                    <div className="relative w-full h-full bg-gray-800">
                      <Play className="absolute inset-0 m-auto w-4 h-4 text-white" />
                    </div>
                  ) : (
                    <img
                      src={item.url}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
