import { useState } from "react";
import {
  IconX,
  IconChevronLeft,
  IconChevronRight,
  IconPlayerPlay,
} from "@tabler/icons-react";
import { Text } from "@mantine/core";

interface EnhancedImageGalleryProps {
  images: string[];
  videoTour?: string;
}

export default function EnhancedImageGallery({
  images,
  videoTour,
}: EnhancedImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

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
    document.body.style.overflow = "unset";
  };

  return (
    <>
      <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[500px]">
        {/* Featured Item */}
        <div
          className="col-span-2 row-span-2 relative cursor-pointer overflow-hidden rounded-l-xl"
          onClick={() => openLightbox(0)}
        >
          <img
            src={media[0].url}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            alt="Main"
          />
          {media[0].type === "video" && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <div className="bg-white/90 p-4 rounded-full shadow-xl">
                <IconPlayerPlay size={30} color="#290665" />
              </div>
            </div>
          )}
        </div>

        {/* Sub Grid */}
        {media.slice(1, 4).map((item, idx) => (
          <div
            key={idx}
            className="relative cursor-pointer overflow-hidden border-l border-white"
            onClick={() => openLightbox(idx + 1)}
          >
            <img
              src={item.url}
              className="w-full h-full object-cover hover:opacity-90 transition-opacity"
              alt="Property"
            />
          </div>
        ))}

        {/* View All Overlay */}
        {media.length > 4 && (
          <div
            className="relative cursor-pointer rounded-tr-xl overflow-hidden"
            onClick={() => openLightbox(4)}
          >
            <img
              src={media[4].url}
              className="w-full h-full object-cover"
              alt="More"
            />
            <div className="absolute inset-0 bg-[#290665]/80 flex items-center justify-center">
              <Text c="white" fw={700}>
                +{media.length - 4} Photos
              </Text>
            </div>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {selectedIndex !== null && (
        <div className="fixed inset-0 bg-black z-[999] flex items-center justify-center p-10">
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 text-white hover:text-[#CF8205] transition-colors"
          >
            <IconX size={32} />
          </button>
          <img
            src={media[selectedIndex].url}
            className="max-w-full max-h-full object-contain shadow-2xl"
            alt="Full view"
          />
        </div>
      )}
    </>
  );
}
