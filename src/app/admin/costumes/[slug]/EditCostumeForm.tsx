"use client";

import { useState } from "react";
import CostumeImageUploader from "@/src/components/admin/CostumeImageUploader";
import { updateCostume, deleteCostume } from "./actions";
import DeleteCostumeButton from "./DeleteCostumeButton";
import { filterOptions } from "@/data/costumes";

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
  categories: string[] | null;
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
    קבוצות גיל
  </label>

  <div className="grid grid-cols-2 gap-2">
    {filterOptions.ages.map((age) => (
      <label
        key={age}
        className="flex items-center gap-2 rounded-lg border p-3"
      >
        <input
          type="checkbox"
          name="age_groups"
          value={age}
          defaultChecked={
            costume.age_groups?.includes(age) ?? false
          }
        />

        {age}
      </label>
    ))}
  </div>
</div>

     <div>
  <label className="mb-2 block text-sm font-bold">
    צבעים
  </label>

  <div className="grid grid-cols-2 gap-2">
    {filterOptions.colors.map((color) => (
      <label
        key={color}
        className="flex items-center gap-2 rounded-lg border p-3"
      >
        <input
          type="checkbox"
          name="colors"
          value={color}
          defaultChecked={
            costume.colors?.includes(color) ?? false
          }
        />

        {color}
      </label>
    ))}
  </div>
</div>
      <div>
  <label className="mb-2 block text-sm font-bold">
    סוג בגד
  </label>

  <div className="grid grid-cols-2 gap-2">
    {filterOptions.clothingTypes.map((type) => (
      <label
        key={type}
        className="flex items-center gap-2 rounded-lg border p-3"
      >
        <input
          type="checkbox"
          name="clothing_types"
          value={type}
          defaultChecked={
            costume.clothing_types?.includes(type) ?? false
          }
        />

        {type}
      </label>
    ))}
  </div>
</div>
      <div>
  <label className="mb-2 block text-sm font-bold">
    סגנון
  </label>

  <div className="grid grid-cols-2 gap-2">
    {filterOptions.styles.map((style) => (
      <label
        key={style}
        className="flex items-center gap-2 rounded-lg border p-3"
      >
        <input
          type="checkbox"
          name="styles"
          value={style}
          defaultChecked={
            costume.styles?.includes(style) ?? false
          }
        />

        {style}
      </label>
    ))}
  </div>
</div>
<div>
  <label className="mb-2 block text-sm font-bold">
    קטגוריות
  </label>

  <div className="grid grid-cols-2 gap-2">
    {[
      ["upper", "חלק עליון"],
      ["bodysuits", "בגדי גוף"],
      ["tops", "טופים"],
      ["shirts", "גופיות וחולצות"],
      ["vests", "וסטים"],
      ["jackets", "ג׳קטים"],
      ["lower", "חלק תחתון"],
      ["pants", "מכנסיים"],
      ["skirts", "חצאיות"],
      ["leggings", "טייצים"],
      ["dresses", "שמלות"],
      ["overol", "אוברול"],
      ["sets", "סטים"],
    ].map(([value, label]) => (
      <label
        key={value}
        className="flex items-center gap-2 rounded-lg border p-3"
      >
        <input
          type="checkbox"
          name="categories"
          value={value}
          defaultChecked={
            costume.categories?.includes(value) ?? false
          }
        />

        {label}
      </label>
    ))}
  </div>
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