"use client";

import { useState } from "react";
import {
  addToRentalCart,
} from "@/src/lib/rentalCart";

type Props = {
  costumeId: string;
  slug: string;
  name: string;
  image: string | null;
  availableQuantity: number;
};

export default function AddToRentalRequestButton({
  costumeId,
  slug,
  name,
  image,
  availableQuantity,
}: Props) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    if (availableQuantity <= 0) {
      return;
    }

    addToRentalCart({
      costumeId,
      slug,
      name,
      image,
      quantity,
      maxQuantity: availableQuantity,
    });

    setAdded(true);

    setTimeout(() => {
      setAdded(false);
    }, 1800);
  };

  if (availableQuantity <= 0) {
    return (
      <div className="mt-5 rounded-xl bg-gray-100 p-4 text-center font-semibold text-gray-500">
        התלבושת אינה זמינה כרגע
      </div>
    );
  }

  return (
    <div className="mt-5 border-t border-gray-200 pt-5">
      <p className="mb-3 font-bold">
        כמה יחידות תרצו?
      </p>

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() =>
            setQuantity((current) =>
              Math.max(1, current - 1)
            )
          }
          className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 text-xl font-bold"
        >
          −
        </button>

      <input
  type="number"
  min={1}
  max={availableQuantity}
  value={quantity}
  onChange={(e) => {
    const value = Number(e.target.value);

    if (Number.isNaN(value)) return;

    setQuantity(
      Math.max(
        1,
        Math.min(value, availableQuantity)
      )
    );
  }}
  className="h-10 w-16 rounded-xl border border-gray-300 text-center text-lg font-bold outline-none focus:border-red-600"
/>

        <button
          type="button"
          onClick={() =>
            setQuantity((current) =>
              Math.min(
                availableQuantity,
                current + 1
              )
            )
          }
          className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 text-xl font-bold"
        >
          +
        </button>

        <span className="text-sm text-gray-500">
          מתוך {availableQuantity} זמינות
        </span>
      </div>

      <button
        type="button"
        onClick={handleAdd}
        className="mt-4 w-full rounded-xl bg-red-600 px-5 py-3 font-bold text-white transition hover:bg-red-700"
      >
        {added
          ? "✓ נוסף לבקשת ההשכרה"
          : "הוסף לבקשת השכרה"}
      </button>
    </div>
  );
}