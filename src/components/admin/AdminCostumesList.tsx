"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import DeleteCostumeButton from "@/src/app/admin/costumes/[slug]/DeleteCostumeButton";

type Costume = {
  id: string;
  slug: string;
  name: string;
  total_quantity: number;
  age_range: string | null;
  cover_image: string | null;
  age_groups: string[] | null;
  search_keywords: string[] | null;
extra_search_keywords: string[] | null;
};

type Props = {
  costumes: Costume[];
  deleteCostume: (
    slug: string
  ) => Promise<{ success: boolean }>;
};

export default function AdminCostumesList({
  costumes,
  deleteCostume,
}: Props) {
  const [search, setSearch] = useState("");

  const filteredCostumes = useMemo(() => {
  const value = search.trim().toLowerCase();

  if (!value) return costumes;

  return costumes.filter((costume) => {
    const searchableText = [
      costume.name,
      costume.slug,
      costume.age_range ?? "",
      ...(costume.age_groups ?? []),
      ...(costume.search_keywords ?? []),
      ...(costume.extra_search_keywords ?? []),
    ]
      .join(" ")
      .toLowerCase();

    return searchableText.includes(value);
  });
}, [costumes, search]);

  return (
    <div>
      {/* חיפוש */}
      <div className="mb-4">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="חיפוש תלבושת..."
          className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-black outline-none focus:border-red-600"
        />
      </div>

      <p className="mb-3 text-sm text-gray-500">
        {filteredCostumes.length} תלבושות
      </p>

      <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
        {filteredCostumes.map((costume) => (
          <div
            key={costume.id}
            className="border-b border-gray-100 p-4 last:border-b-0"
          >
            {/* MOBILE */}
            <div className="md:hidden">
              <div className="flex items-start gap-3">
                <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-gray-100">
                  {costume.cover_image ? (
                    <img
                      src={costume.cover_image}
                      alt={costume.name}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-gray-400">
                      אין תמונה
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <h2 className="text-base font-bold leading-snug">
                    {costume.name}
                  </h2>

                  <p className="mt-2 text-sm text-gray-500">
                    כמות: {costume.total_quantity}
                  </p>

                              <p className="mt-1 text-sm text-gray-500">
 גיל: {costume.age_groups?.join(", ")}
</p>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <Link
                  href={`/admin/costumes/${encodeURIComponent(
                    costume.slug
                  )}`}
                  className="flex-1 rounded-lg bg-black px-3 py-2 text-center text-sm font-semibold text-white"
                >
                  פתיחה
                </Link>

                <DeleteCostumeButton
                  costumeName={costume.name}
                  deleteAction={deleteCostume.bind(
                    null,
                    costume.slug
                  )}
                  size="small"
                />
              </div>
            </div>

            {/* DESKTOP */}
            <div className="hidden items-center gap-4 md:flex">
              <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-gray-100">
                {costume.cover_image && (
                  <img
                    src={costume.cover_image}
                    alt={costume.name}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <h2 className="font-bold">
                  {costume.name}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  כמות: {costume.total_quantity}
                </p>

                <p className="mt-1 text-sm text-gray-500">
 גיל: {costume.age_groups?.join(", ")}
</p>
              </div>

              <div className="flex gap-2">
                <Link
                  href={`/admin/costumes/${encodeURIComponent(
                    costume.slug
                  )}`}
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                >
                  פתיחה
                </Link>

                <DeleteCostumeButton
                  costumeName={costume.name}
                  deleteAction={deleteCostume.bind(
                    null,
                    costume.slug
                  )}
                  size="small"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}