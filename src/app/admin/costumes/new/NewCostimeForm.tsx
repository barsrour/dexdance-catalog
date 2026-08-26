"use client";

import { useState } from "react";
import CostumeImageUploader from "@/src/components/admin/CostumeImageUploader";
import { filterOptions } from "@/data/costumes";

type Props = {
  saveCostume: (formData: FormData) => Promise<void>;
};

export default function NewCostumeForm({
  saveCostume,
}: Props) {
  const [images, setImages] = useState<string[]>([]);

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
          className="w-full rounded-xl border border-gray-300 px-4 py-3"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-bold">
          תיאור
        </label>

        <textarea
          name="description"
          rows={4}
          className="w-full rounded-xl border border-gray-300 px-4 py-3"
        />
      </div>
<div>
  <label className="mb-2 block text-sm font-bold">
    מילות חיפוש נוספות
  </label>

  <input
    type="text"
    name="extra_search_keywords"
    placeholder="לדוגמה: נצנצים, כתף אחת, מבריק"
    className="w-full rounded-xl border border-gray-300 px-4 py-3"
  />

  <p className="mt-1 text-xs text-gray-500">
    הפרידי בין מילות החיפוש באמצעות פסיק
  </p>
</div>
      <CostumeImageUploader
        currentImages={images}
        onImagesChange={setImages}
      />

      <button
        type="submit"
        className="w-full rounded-xl bg-red-600 px-5 py-3 font-bold text-white"
      >
        הוספת תלבושת
      </button>
    </form>
  );
}