"use client";

export default function ScrollToTopButton() {
  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed left-5 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-red-600 text-2xl font-bold text-white shadow-lg"
      style={{
        bottom: "calc(env(safe-area-inset-bottom) + 24px)",
      }}
    >
      ↑
    </button>
  );
}