"use client";

import { useState } from "react";

type ImageGalleryProps = {
  images: string[];
  name: string;
};

export default function ImageGallery({ images, name }: ImageGalleryProps) {
  const [openImage, setOpenImage] = useState<string | null>(null);

  return (
    <>
      <section className="mb-3">
        <div className="flex gap-3 overflow-x-auto scroll-smooth">
          {images.map((img, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setOpenImage(img)}
              className="h-80 w-[85%] flex-shrink-0 overflow-hidden rounded-2xl bg-gray-100"
            >
              <img
                src={img}
                alt={name}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>

        {images.length > 1 && (
          <div className="mt-3 flex justify-center gap-1.5">
            {images.map((_, index) => (
              <div key={index} className="h-2 w-2 rounded-full bg-gray-300" />
            ))}
          </div>
        )}
      </section>

      {openImage && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/90 p-4"
          onClick={() => setOpenImage(null)}
        >
          <img
            src={openImage}
            alt={name}
            className="max-h-full max-w-full rounded-xl object-contain"
          />
        </div>
      )}
    </>
  );
}