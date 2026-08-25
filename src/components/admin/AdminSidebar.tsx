"use client";

import Link from "next/link";
import { useState } from "react";

export default function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const menu = (
    <nav className="space-y-2">
      <Link
        href="/admin"
        onClick={() => setIsOpen(false)}
        className="block rounded-lg px-3 py-3 hover:bg-zinc-800"
      >
        📊 דשבורד
      </Link>

      <Link
        href="/admin/costumes"
        onClick={() => setIsOpen(false)}
        className="block rounded-lg px-3 py-3 hover:bg-zinc-800"
      >
        👗 תלבושות
      </Link>

      <Link
        href="/admin/customers"
        onClick={() => setIsOpen(false)}
        className="block rounded-lg px-3 py-3 hover:bg-zinc-800"
      >
        👥 לקוחות
      </Link>

      <Link
        href="/admin/rentals"
        onClick={() => setIsOpen(false)}
        className="block rounded-lg px-3 py-3 hover:bg-zinc-800"
      >
        📦 השכרות
      </Link>

      <Link
        href="/admin/calendar"
        onClick={() => setIsOpen(false)}
        className="block rounded-lg px-3 py-3 hover:bg-zinc-800"
      >
        📅 לוח שנה
      </Link>
    </nav>
  );

  return (
    <>
      {/* פס עליון במובייל */}
     <div className="sticky top-0 z-40 flex items-center justify-between bg-zinc-900 px-4 py-3 text-white md:hidden">
  <button
    type="button"
    onClick={() => setIsOpen(true)}
    aria-label="פתיחת תפריט ניהול"
    className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-800 text-2xl"
  >
    ☰
  </button>

  <span className="font-bold">
    dex.dance Admin
  </span>
</div>

      {/* Sidebar בדסקטופ */}
      <aside className="hidden min-h-screen w-64 flex-shrink-0 bg-zinc-900 p-6 text-white md:block">
        <h1 className="mb-8 text-2xl font-bold">
          dex.dance
        </h1>

        {menu}
      </aside>

      {/* שכבה כהה במובייל */}
      {isOpen && (
        <button
          type="button"
          aria-label="סגירת תפריט"
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
        />
      )}

      {/* תפריט נשלף במובייל */}
      <aside
        className={`fixed right-0 top-0 z-50 h-full w-[80%] max-w-[300px] bg-zinc-900 p-6 text-white shadow-2xl transition-transform duration-300 md:hidden ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-xl font-bold">
            dex.dance
          </h1>

          <button
            type="button"
            onClick={() => setIsOpen(false)}
            aria-label="סגירת תפריט ניהול"
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-800 text-xl"
          >
            ✕
          </button>
        </div>

        {menu}
      </aside>
    </>
  );
}