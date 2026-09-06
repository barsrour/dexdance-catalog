import Link from "next/link";
import { createClient } from "@/src/utils/supabase/server";

export default async function AdminPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div dir="rtl">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">
            דשבורד
          </h1>

          <p className="mt-2 text-gray-600">
            מחוברת בתור {user?.email}
          </p>
        </div>

        <Link
          href="/"
          className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:border-red-300 hover:text-red-600"
        >
          ← חזרה לקטלוג
        </Link>
      </div>

      <div className="mt-8 rounded-2xl bg-white p-6 shadow">
        <h2 className="text-xl font-bold">
          ברוכה הבאה למערכת הניהול
        </h2>

        <p className="mt-2 text-gray-600">
          מכאן ניתן לנהל תלבושות, לקוחות, השכרות ולוח שנה.
        </p>
      </div>
    </div>
  );
}