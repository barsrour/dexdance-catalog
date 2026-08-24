"use client";

import { useState } from "react";
import CostumeImageUploader from "@/src/components/admin/CostumeImageUploader";
import { updateCostume, deleteCostume } from "./actions";
import DeleteCostumeButton from "./DeleteCostumeButton";

type Costume = {
  id: string;
  slug: string;
  name: string;
  total_quantity: number;
  age_range: string | null;
  age_groups: string[] | null;
  colors: string[] | null;
  clothing_types: string[] | null;
  styles: string[] | null;
  images: string[] | null;
  description: string | null;
  location: string | null;
};

type Props = {
  costume: Costume;
  saveCostume: (formData: FormData) => Promise<void>;
};

export default function EditCostumeForm({
  costume,
  saveCostume,
}: Props) {
  const [images, setImages] = useState<string[]>(
    costume.images ?? []
  );

  return (
    <form
      action={saveCostume}
      className="space-y-6 rounded-2xl bg-white p-6 shadow-sm"
    >
      <input
        type="hidden"
        name="images"
        value={JSON.stringify(images)}
      />

      <div>
        <label className="mb-2 block text-sm font-bold">
          שם התלבושת
        </label>

        <input
          name="name"
          defaultValue={costume.name}
          required
          className="w-full rounded-xl border border-gray-300 px-4 py-3"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-bold">
          כמות
        </label>

        <input
          name="total_quantity"
          type="number"
          min="0"
          defaultValue={costume.total_quantity}
          required
          className="w-full rounded-xl border border-gray-300 px-4 py-3"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-bold">
          טווח גיל
        </label>

        <input
          name="age_range"
          defaultValue={costume.age_range ?? ""}
          className="w-full rounded-xl border border-gray-300 px-4 py-3"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-bold">
          צבעים
        </label>

        <input
          name="colors"
          defaultValue={(costume.colors ?? []).join(", ")}
          placeholder="אדום, שחור, לבן"
          className="w-full rounded-xl border border-gray-300 px-4 py-3"
        />

        <p className="mt-1 text-xs text-gray-400">
          הפרידי בין ערכים באמצעות פסיק.
        </p>
      </div>

      <div>
        <label className="mb-2 block text-sm font-bold">
          סוגי בגד
        </label>

        <input
          name="clothing_types"
          defaultValue={(costume.clothing_types ?? []).join(", ")}
          placeholder="חצאית, טופ"
          className="w-full rounded-xl border border-gray-300 px-4 py-3"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-bold">
          סגנונות
        </label>

        <input
          name="styles"
          defaultValue={(costume.styles ?? []).join(", ")}
          placeholder="ג׳אז, מודרני"
          className="w-full rounded-xl border border-gray-300 px-4 py-3"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-bold">
          מיקום במחסן
        </label>

        <input
          name="location"
          defaultValue={costume.location ?? ""}
          className="w-full rounded-xl border border-gray-300 px-4 py-3"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-bold">
          תיאור
        </label>

        <textarea
          name="description"
          defaultValue={costume.description ?? ""}
          rows={4}
          className="w-full rounded-xl border border-gray-300 px-4 py-3"
        />
      </div>

      <CostumeImageUploader
        currentImages={images}
        onImagesChange={setImages}
      />

      <button
        type="submit"
        className="w-full rounded-xl bg-red-600 px-5 py-3 font-bold text-white"
      >
        שמירת שינויים
      </button>
       <DeleteCostumeButton
   costumeName={costume.name}
    deleteAction={deleteCostume.bind(null, costume.slug)}
    />
     
      
    </form>
  );
}