"use client";

export default function PrintRentalButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="rounded-xl bg-red-600 px-5 py-3 font-bold text-white"
    >
      שמירה / הורדה כ־PDF
    </button>
  );
}