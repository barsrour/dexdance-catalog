import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div dir="rtl" className="flex min-h-screen">
      <aside className="w-64 bg-zinc-900 text-white p-6">
        <h1 className="mb-8 text-2xl font-bold">
          dex.dance
        </h1>

        <nav className="space-y-3">

          <Link
            href="/admin"
            className="block rounded-lg px-3 py-2 hover:bg-zinc-800"
          >
            📊 דשבורד
          </Link>

          <Link
            href="/admin/costumes"
            className="block rounded-lg px-3 py-2 hover:bg-zinc-800"
          >
            👗 תלבושות
          </Link>

          <Link
            href="/admin/customers"
            className="block rounded-lg px-3 py-2 hover:bg-zinc-800"
          >
            👥 לקוחות
          </Link>

          <Link
            href="/admin/rentals"
            className="block rounded-lg px-3 py-2 hover:bg-zinc-800"
          >
            📦 השכרות
          </Link>

          <Link
            href="/admin/calendar"
            className="block rounded-lg px-3 py-2 hover:bg-zinc-800"
          >
            📅 לוח שנה
          </Link>

        </nav>
      </aside>

     <main className="flex-1 bg-gray-100 p-8 text-black">
  {children}
</main>
    </div>
  );
}