"use client";

import { useState } from "react";
import { createClient } from "@/src/utils/supabase/client";

type CostumeImageUploaderProps = {
  currentImages: string[];
  onImagesChange: (images: string[]) => void;
};

export default function CostumeImageUploader({
  currentImages,
  onImagesChange,
}: CostumeImageUploaderProps) {
  const [uploading, setUploading] = useState(false);

  async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;

    if (!files || files.length === 0) {
      return;
    }

    setUploading(true);

    const supabase = createClient();
    const newImages: string[] = [];

    try {
      for (const file of Array.from(files)) {
        const extension = file.name.split(".").pop();

        const fileName = `${crypto.randomUUID()}.${extension}`;

        const filePath = `costumes/${fileName}`;

        const { error } = await supabase.storage
          .from("costume-images")
          .upload(filePath, file);

        if (error) {
          console.error(error);
          alert(`לא הצלחתי להעלות את ${file.name}`);
          continue;
        }

        const { data } = supabase.storage
          .from("costume-images")
          .getPublicUrl(filePath);

        newImages.push(data.publicUrl);
      }

      onImagesChange([...currentImages, ...newImages]);
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  return (
    <div>
      <label className="mb-2 block text-sm font-bold">
        תמונות
      </label>

      <label className="flex cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-6 text-center hover:bg-gray-100">
        <span className="text-sm text-gray-600">
          {uploading
            ? "מעלה תמונות..."
            : "לחצי כאן לבחירת תמונות"}
        </span>

        <input
          type="file"
          accept="image/*"
          multiple
          disabled={uploading}
          onChange={handleUpload}
          className="hidden"
        />
      </label>

      {currentImages.length > 0 && (
        <div className="mt-4 grid grid-cols-3 gap-3">
          {currentImages.map((image, index) => (
            <div
              key={`${image}-${index}`}
              className="relative overflow-hidden rounded-xl border bg-gray-100"
            >
              <img
                src={image}
                alt=""
                className="aspect-square w-full object-cover"
              />

              <button
                type="button"
                onClick={() =>
                  onImagesChange(
                    currentImages.filter((_, i) => i !== index)
                  )
                }
                className="absolute left-2 top-2 rounded-full bg-black/70 px-2 py-1 text-xs text-white"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}