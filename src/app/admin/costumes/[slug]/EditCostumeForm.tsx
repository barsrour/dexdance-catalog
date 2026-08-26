"use client";

import { useEffect, useState } from "react";
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
  search_keywords: string[] | null;
  extra_search_keywords: string[] | null;
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
const [ageGroups, setAgeGroups] = useState<string[]>(
  costume.age_groups ?? []
);

const [categories, setCategories] = useState<string[]>(
  costume.categories ?? []
);

const [colors, setColors] = useState<string[]>(
  costume.colors ?? []
);

const [clothingTypes, setClothingTypes] = useState<string[]>(
  costume.clothing_types ?? []
);

const [styles, setStyles] = useState<string[]>(
  costume.styles ?? []
);
const [extraSearchKeywords, setExtraSearchKeywords] = useState(
  costume.extra_search_keywords?.join(", ") ?? ""
);
useEffect(() => {
  setImages(costume.images ?? []);
  setAgeGroups(costume.age_groups ?? []);
  setCategories(costume.categories ?? []);
  setColors(costume.colors ?? []);
  setClothingTypes(costume.clothing_types ?? []);
  setStyles(costume.styles ?? []);
  setExtraSearchKeywords(
    costume.extra_search_keywords?.join(", ") ?? ""
  );
}, [costume]);
function toggleValue(
  value: string,
  values: string[],
  setValues: React.Dispatch<React.SetStateAction<string[]>>
) {
  setValues(
    values.includes(value)
      ? values.filter((item) => item !== value)
      : [...values, value]
  );
}
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
          checked={ageGroups.includes(age)}
onChange={() =>
  toggleValue(age, ageGroups, setAgeGroups)
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
  checked={colors.includes(color)}
  onChange={() =>
    toggleValue(color, colors, setColors)
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
  checked={clothingTypes.includes(type)}
  onChange={() =>
    toggleValue(type, clothingTypes, setClothingTypes)
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
  checked={styles.includes(style)}
  onChange={() =>
    toggleValue(style, styles, setStyles)
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
  checked={categories.includes(value)}
  onChange={() =>
    toggleValue(value, categories, setCategories)
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
    מילות חיפוש נוספות
  </label>

  <input
  type="text"
  name="extra_search_keywords"
  value={extraSearchKeywords}
  onChange={(e) => setExtraSearchKeywords(e.target.value)}
  placeholder="לדוגמה: נצנצים, כתף אחת, מבריק"
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