"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  getRentalCartCount,
} from "@/src/lib/rentalCart";

export default function RentalCartButton() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const refreshCount = () => {
      setCount(getRentalCartCount());
    };

    refreshCount();

    window.addEventListener(
      "rental-cart-updated",
      refreshCount
    );

    window.addEventListener(
      "storage",
      refreshCount
    );

    return () => {
      window.removeEventListener(
        "rental-cart-updated",
        refreshCount
      );

      window.removeEventListener(
        "storage",
        refreshCount
      );
    };
  }, []);

  return (
    <Link
      href="/rental-request"
      aria-label="בקשת ההשכרה שלי"
      className="relative inline-flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-2xl shadow-sm"
    >
      🛒

      {count > 0 && (
        <span className="absolute -left-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[11px] font-bold text-white">
          {count}
        </span>
      )}
    </Link>
  );
}