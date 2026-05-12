"use client";

export default function ScrollToTopButton() {
  return (
    <div
      className="fixed inset-x-0 z-[9999] flex justify-end px-4 pointer-events-none"
      style={{
        bottom: "max(20px, env(safe-area-inset-bottom))",
      }}
    >
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="pointer-events-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-600 text-3xl text-white shadow-2xl"
      >
        ↑
      </button>
    </div>
  );
}