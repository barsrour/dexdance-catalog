"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { filterOptions } from "@/data/costumes";
import ScrollToTopButton from "@/src/components/ScrollToTopButton";
import RentalCartButton from "@/src/components/RentalCartButton";

type Costume = {
  id: string;
  slug: string;
  name: string;
  total_quantity: number;
  age_range: string | null;
  age_groups: string[] | null;
  categories: string[] | null;
  images: string[] | null;
  colors: string[] | null;
  clothing_types: string[] | null;
  styles: string[] | null;
  search_keywords: string[] | null;
  extra_search_keywords: string[] | null;
  rented_quantity: number;
available_quantity: number;
rented_until: string | null;
};

export default function CatalogClient({
  costumes,
}: {
  costumes: Costume[];
}) {
  const [search, setSearch] = useState("");
  const [color, setColor] = useState("");
  const [age, setAge] = useState("");
  const [type, setType] = useState("");
  const [style, setStyle] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
const hasRestoredCatalogState = useRef(false);
const pendingScrollY = useRef<number | null>(null);
  const clearFilters = () => {
    setSearch("");
    setColor("");
    setAge("");
    setType("");
    setStyle("");
    setSelectedCategory("");
  };
useEffect(() => {
  const savedState = sessionStorage.getItem("dex-catalog-state");

  if (!savedState) {
    hasRestoredCatalogState.current = true;
    return;
  }

  try {
    const parsed = JSON.parse(savedState);

    setSearch(parsed.search ?? "");
    setColor(parsed.color ?? "");
    setAge(parsed.age ?? "");
    setType(parsed.type ?? "");
    setStyle(parsed.style ?? "");
    setSelectedCategory(parsed.selectedCategory ?? "");

    pendingScrollY.current = Number(parsed.scrollY ?? 0);
  } catch {
    sessionStorage.removeItem("dex-catalog-state");
  }

  hasRestoredCatalogState.current = true;
}, []);

  const filteredCostumes = useMemo(() => {
    return costumes.filter((costume) => {
      const colors = costume.colors ?? [];
      const clothingTypes = costume.clothing_types ?? [];
      const styles = costume.styles ?? [];
      const searchKeywords = costume.search_keywords ?? [];
      const extraSearchKeywords =
  costume.extra_search_keywords ?? [];
      const ageGroups = costume.age_groups ?? [];
      const categories = costume.categories ?? [];

      const searchableText = [
        costume.name,
        costume.age_range ?? "",
        ...ageGroups,
        ...colors,
        ...clothingTypes,
        ...styles,
        ...searchKeywords,
        ...extraSearchKeywords,
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        search === "" ||
        searchableText.includes(search.trim().toLowerCase());

      const matchesColor =
        color === "" || colors.includes(color);

      const matchesAge =
        age === "" || ageGroups.includes(age);

      const matchesType =
        type === "" || clothingTypes.includes(type);

      const matchesStyle =
        style === "" || styles.includes(style);

      const matchesCategory =
        selectedCategory === "" ||
        categories.includes(selectedCategory);

      return (
        matchesSearch &&
        matchesColor &&
        matchesAge &&
        matchesType &&
        matchesStyle &&
        matchesCategory
      );
    });
  }, [
    costumes,
    search,
    color,
    age,
    type,
    style,
    selectedCategory,
  ]);
useEffect(() => {
  if (pendingScrollY.current === null) {
    return;
  }

  const scrollY = pendingScrollY.current;

  const timer = window.setTimeout(() => {
    window.scrollTo({
      top: scrollY,
      behavior: "auto",
    });

    pendingScrollY.current = null;
  }, 300);

  return () => {
    window.clearTimeout(timer);
  };
}, [filteredCostumes]);
useEffect(() => {
  const handleScroll = () => {
    if (!hasRestoredCatalogState.current) return;

    sessionStorage.setItem(
      "dex-catalog-state",
      JSON.stringify({
        search,
        color,
        age,
        type,
        style,
        selectedCategory,
        scrollY: window.scrollY,
      })
    );
  };

  window.addEventListener("scroll", handleScroll, {
    passive: true,
  });

  return () => {
    window.removeEventListener("scroll", handleScroll);
  };
}, [
  search,
  color,
  age,
  type,
  style,
  selectedCategory,
]);
  return (
    <main
      dir="rtl"
      className="min-h-screen bg-white px-4 py-5 text-black"
    >
      {/* כותרת ולוגו */}
      <header className="relative mb-6 text-center">
        
  <div className="absolute left-0 top-0">
    <RentalCartButton />
  </div>
<div className="absolute right-0 top-0">
  <Link
  href="/login"
  className="inline-flex h-9 items-center justify-center rounded-full border border-gray-200 bg-white px-3 text-xs font-semibold text-gray-500 shadow-sm transition hover:border-red-300 hover:text-red-600"
>
  כניסת מנהלות
</Link>
</div>
  <img
    src="/logo.png"
    alt="dex.dance"
    className="mx-auto mb-3 w-28"
  />

  <h1 className="text-2xl font-bold text-red-600">
    קטלוג התלבושות
  </h1>

  <p className="mt-1 text-sm text-gray-500">
    השכרת תלבושות מבית dex.dance
  </p>
</header>
      {/* קטגוריות ראשיות */}
      <section className="mb-5 overflow-x-auto">
        <div className="flex gap-2 pb-1">
          <button
            type="button"
            onClick={() => setSelectedCategory("")}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-sm ${
              selectedCategory === ""
                ? "bg-red-600 font-semibold text-white"
                : "bg-gray-100 text-black"
            }`}
          >
            הכל
          </button>

          <button
            type="button"
            onClick={() => setSelectedCategory("upper")}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-sm ${
              selectedCategory === "upper"
                ? "bg-red-600 font-semibold text-white"
                : "bg-gray-100 text-black"
            }`}
          >
            חלק עליון
          </button>

          <button
            type="button"
            onClick={() => setSelectedCategory("lower")}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-sm ${
              selectedCategory === "lower"
                ? "bg-red-600 font-semibold text-white"
                : "bg-gray-100 text-black"
            }`}
          >
            חלק תחתון
          </button>

          <button
            type="button"
            onClick={() => setSelectedCategory("dresses")}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-sm ${
              selectedCategory === "dresses"
                ? "bg-red-600 font-semibold text-white"
                : "bg-gray-100 text-black"
            }`}
          >
            שמלות
          </button>

          <button
            type="button"
            onClick={() => setSelectedCategory("sets")}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-sm ${
              selectedCategory === "sets"
                ? "bg-red-600 font-semibold text-white"
                : "bg-gray-100 text-black"
            }`}
          >
            סטים
          </button>
        </div>
      </section>

      {/* חיפוש ופילטרים */}
      <section className="mb-6 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="חיפוש תלבושת..."
          className="mb-3 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-red-600"
        />

        <div className="grid grid-cols-2 gap-3">
          {/* צבע */}
          <select
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="rounded-xl border border-gray-300 bg-white p-3 text-sm"
          >
            <option value="">כל הצבעים</option>

            {filterOptions.colors.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          {/* גיל */}
          <select
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="rounded-xl border border-gray-300 bg-white p-3 text-sm"
          >
            <option value="">כל הגילאים</option>

            {filterOptions.ages.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          {/* סוג בגד */}
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="rounded-xl border border-gray-300 bg-white p-3 text-sm"
          >
            <option value="">כל הסוגים</option>

            {filterOptions.clothingTypes.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          {/* סגנון */}
          <select
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            className="rounded-xl border border-gray-300 bg-white p-3 text-sm"
          >
            <option value="">כל הסגנונות</option>

            {filterOptions.styles.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-gray-500">
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
      </section>

      {/* כרטיסי התלבושות */}
      {filteredCostumes.length === 0 ? (
        <div className="rounded-2xl bg-gray-50 p-8 text-center">
          <p className="font-bold">
            לא נמצאו תלבושות מתאימות
          </p>

          <p className="mt-2 text-sm text-gray-500">
            נסי לשנות את החיפוש או את הסינון.
          </p>
        </div>
      ) : (
        <section className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 md:gap-5">
          {filteredCostumes.map((costume) => {
            const images = costume.images ?? [];

            return (
              <div
                key={costume.id}
                className="overflow-hidden rounded-xl border border-gray-200 bg-white p-2 shadow-sm md:p-3"
              >
                {/* גלריה קטנה בכרטיס */}
                <div className="h-36 w-full overflow-x-auto overflow-y-hidden rounded-lg md:h-64">
  <div className="flex h-36 snap-x snap-mandatory md:h-64">
                    {images.length > 0 ? (
                      images.map((image, index) => (
                        <img
                          key={`${image}-${index}`}
                          src={image}
                          alt={costume.name}
                          className="h-36 min-w-full flex-shrink-0 snap-center object-cover md:h-64"
                        />
                      ))
                    ) : (
                      <div className="flex h-36 min-w-full items-center justify-center bg-gray-100 text-xs text-gray-400">
                        אין תמונה
                      </div>
                    )}
                  </div>
                </div>

                {/* נקודות אם יש כמה תמונות */}
                {images.length > 1 && (
                  <div className="mt-2 flex justify-center gap-1">
                    {images.map((_, index) => (
                      <span
                        key={index}
                        className="h-1.5 w-1.5 rounded-full bg-gray-300"
                      />
                    ))}
                  </div>
                )}

                {/* לחיצה על הפרטים פותחת את התלבושת */}
                <Link
  href={`/costume/${costume.slug}`}
  onClick={() => {
    sessionStorage.setItem(
      "dex-catalog-state",
      JSON.stringify({
        search,
        color,
        age,
        type,
        style,
        selectedCategory,
        scrollY: window.scrollY,
      })
    );
  }}
  className="block"
>
                  <h2 className="mt-2 text-xs font-bold leading-tight md:text-lg">
                    {costume.name}
                  </h2>

                 {(costume.age_groups?.length ?? 0) > 0 && (
  <p className="mt-1 text-[11px] text-gray-500 md:text-base">
    {costume.age_groups?.join(", ")}
  </p>
)}
                  <p className="text-[11px] text-gray-500 md:text-base">
                    כמות: {costume.total_quantity}
                  </p>
                  {costume.rented_quantity > 0 && (
  <div className="mt-2 rounded-lg bg-orange-50 p-2 text-[10px]">
    <p className="font-bold text-orange-700">
      {costume.rented_quantity} בהשכרה •{" "}
      {costume.available_quantity} זמינות
    </p>

    {costume.rented_until && (
      <p className="mt-0.5 text-orange-600">
        עד{" "}
        {new Date(
          `${costume.rented_until}T00:00:00`
        ).toLocaleDateString("he-IL")}
      </p>
    )}
  </div>
)}
{costume.available_quantity === 0 &&
  costume.rented_quantity > 0 && (
    <div className="mt-2 rounded-lg bg-red-100 px-2 py-1 text-center text-[10px] font-bold text-red-700">
      לא זמינה כרגע
    </div>
  )}
                </Link>
              </div>
            );
          })}
        </section>
      )}

      <ScrollToTopButton />
    </main>
  );
}