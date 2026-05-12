"use client";

export default function ScrollToTopButton() {
  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed right-4 z-[9999] flex h-12 w-12 items-center justify-center rounded-full bg-red-600 text-2xl font-bold text-white shadow-lg"
      style={{
        bottom: "90px",
      }}
    >
      ↑
    </button>
  );
}