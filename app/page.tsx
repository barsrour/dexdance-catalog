"use client";

import { useMemo, useState } from "react";
import { costumes, filterOptions } from "@/data/costumes";
import Link from "next/link";

export default function Home() {
  const [search, setSearch] = useState("");
  const [color, setColor] = useState("");
  const [age, setAge] = useState("");
  const [type, setType] = useState("");
  const [style, setStyle] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const clearFilters = () => {
  setSearch("");
  setColor("");
  setAge("");
  setType("");
  setStyle("");
};

  const filteredCostumes = useMemo(() => {
    return costumes.filter((costume) => {
      
      const text = [
        costume.name,
        costume.ageRange.join(" "),
        costume.colors.join(" "),
        costume.clothingTypes.join(" "),
        costume.styles.join(" "),
        costume.searchKeywords.join(" "),
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch = search === "" || text.includes(search.toLowerCase());
      const matchesColor = color === "" || costume.colors.includes(color);
      const matchesType = type === "" || costume.clothingTypes.includes(type);
      const matchesStyle = style === "" || costume.styles.includes(style);
      const matchesCategory =
  selectedCategory === "" ||
  costume.categories.includes(selectedCategory as any);

      const matchesAge =
        age === "" ||
        costume.ageRange.includes(age);
      return (
  matchesSearch &&
  matchesColor &&
  matchesType &&
  matchesStyle &&
  matchesAge &&
  matchesCategory
);
    });
  }, [search, color, age, type, style, selectedCategory]);

  return (
    <main dir="rtl" className="min-h-screen bg-white px-5 py-6 text-black">
     <header className="sticky top-0 z-50 -mx-5 mb-5 bg-white px-5 py-4 text-center shadow-sm">
        <img src="/logo.png" alt="dex.dance" className="mx-auto mb-4 w-28" />
        <h1 className="text-3xl font-bold text-red-600">קטלוג התלבושות</h1>
        <p className="mt-2 text-sm text-gray-600">
          חיפוש תלבושות לפי צבע, גיל, סוג וסגנון
        </p>
      </header>
      <section className="mb-5 overflow-x-auto">
  <div className="flex gap-2">
    <button
      onClick={() => setSelectedCategory("")}
      className={`rounded-full px-4 py-2 text-sm whitespace-nowrap ${
        selectedCategory === ""
          ? "bg-red-600 text-white"
          : "bg-gray-100 text-black"
      }`}
    >
      הכל
    </button>

    <button
      onClick={() => setSelectedCategory("upper")}
      className={`rounded-full px-4 py-2 text-sm whitespace-nowrap ${
        selectedCategory === "upper"
          ? "bg-red-600 text-white"
          : "bg-gray-100 text-black"
      }`}
    >
      חלק עליון
    </button>

    <button
      onClick={() => setSelectedCategory("lower")}
      className={`rounded-full px-4 py-2 text-sm whitespace-nowrap ${
        selectedCategory === "lower"
          ? "bg-red-600 text-white"
          : "bg-gray-100 text-black"
      }`}
    >
      חלק תחתון
    </button>

    <button
      onClick={() => setSelectedCategory("dresses")}
      className={`rounded-full px-4 py-2 text-sm whitespace-nowrap ${
        selectedCategory === "dresses"
          ? "bg-red-600 text-white"
          : "bg-gray-100 text-black"
      }`}
    >
      שמלות
    </button>

    <button
      onClick={() => setSelectedCategory("sets")}
      className={`rounded-full px-4 py-2 text-sm whitespace-nowrap ${
        selectedCategory === "sets"
          ? "bg-red-600 text-white"
          : "bg-gray-100 text-black"
      }`}
    >
      סטים
    </button>
  </div>
</section>

      <section className="mb-6 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
  <div className="relative mb-3">
 <input
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  placeholder="חיפוש חופשי — למשל: אדום גיל 10 חצאית"
  className="mb-3 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-red-600"
/>


</div>

        <div className="grid grid-cols-2 gap-3">
          <select value={color} onChange={(e) => setColor(e.target.value)} className="rounded-xl border p-3 text-sm">
            <option value="">כל הצבעים</option>
            {filterOptions.colors.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>

          <select value={age} onChange={(e) => setAge(e.target.value)} className="rounded-xl border p-3 text-sm">
            <option value="">כל הגילאים</option>
            {filterOptions.ages.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>

          <select value={type} onChange={(e) => setType(e.target.value)} className="rounded-xl border p-3 text-sm">
            <option value="">כל הסוגים</option>
            {filterOptions.clothingTypes.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>

          <select value={style} onChange={(e) => setStyle(e.target.value)} className="rounded-xl border p-3 text-sm">
            <option value="">כל הסגנונות</option>
            {filterOptions.styles.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>
      </section>
      <div className="mt-4 flex items-center justify-between">
  <p className="text-sm text-gray-600">
    נמצאו {filteredCostumes.length} תלבושות
  </p>

  <button
    type="button"
    onClick={clearFilters}
    className="rounded-full border border-red-600 px-4 py-2 text-sm font-semibold text-red-600"
  >
    ניקוי סינון
  </button>
</div>

      <section className="grid grid-cols-3 gap-2">
      {filteredCostumes.map((costume) => (
  <Link
    key={costume.id}
    href={`/costume/${costume.id}`}
    className="rounded-lg border border-gray-200 p-2"
  >
  <div className="h-24 w-full overflow-x-auto overflow-y-hidden rounded-md">
  <div className="flex h-24">
    {costume.images.map((img, index) => (
      <img
        key={index}
        src={img}
        alt={costume.name}
        className="h-24 min-w-full flex-shrink-0 object-cover"
      />
    ))}
  </div>
</div>


    {costume.images.length > 1 && (
      <div className="mt-1 flex justify-center gap-1">
        {costume.images.map((_, index) => (
          <div
            key={index}
            className="h-1.5 w-1.5 rounded-full bg-gray-300"
          />
        ))}
      </div>
    )}

    <h2 className="mt-2 text-sm font-semibold leading-tight line-clamp-2">
      {costume.name}
    </h2>

    <p className="text-xs text-gray-600">{costume.ageRange}</p>
  </Link>
))}
      </section>
    </main>
  );
}