"use client";

import { useMemo, useState } from "react";

type Costume = {
  id: string;
  name: string;
  total_quantity: number;
};

type Props = {
  costumes: Costume[];
  value: string;
  onChange: (costumeId: string) => void;
};

export default function CostumeSearchSelect({
  costumes,
  value,
  onChange,
}: Props) {
  const selectedCostume = costumes.find(
    (costume) => costume.id === value
  );

  const [search, setSearch] = useState(
    selectedCostume?.name ?? ""
  );

  const [open, setOpen] = useState(false);

  const results = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return costumes.slice(0, 15);
    }

    return costumes
      .filter((costume) =>
        costume.name.toLowerCase().includes(query)
      )
      .slice(0, 15);
  }, [costumes, search]);

  return (
    <div className="relative">
      <input
        type="text"
        value={search}
        onFocus={() => setOpen(true)}
        onChange={(e) => {
          setSearch(e.target.value);
          setOpen(true);

          if (
            selectedCostume &&
            e.target.value !== selectedCostume.name
          ) {
            onChange("");
          }
        }}
        placeholder="התחילי להקליד שם תלבושת..."
        className="w-full rounded-xl border border-gray-300 bg-white px-3 py-3 text-black outline-none focus:border-red-600"
      />

      {open && (
        <div className="absolute right-0 top-full z-50 mt-1 max-h-64 w-full overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-xl">
          {results.length > 0 ? (
            results.map((costume) => (
              <button
                key={costume.id}
                type="button"
                onClick={() => {
                  onChange(costume.id);
                  setSearch(costume.name);
                  setOpen(false);
                }}
                className="block w-full border-b border-gray-100 px-4 py-3 text-right hover:bg-gray-50"
              >
                <p className="font-semibold">
                  {costume.name}
                </p>

                <p className="text-xs text-gray-500">
                  מלאי כולל:{" "}
                  {costume.total_quantity}
                </p>
              </button>
            ))
          ) : (
            <p className="p-4 text-sm text-gray-500">
              לא נמצאה תלבושת
            </p>
          )}
        </div>
      )}
    </div>
  );
}