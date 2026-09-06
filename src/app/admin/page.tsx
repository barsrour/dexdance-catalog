import { createClient } from "@/src/utils/supabase/server";

export default async function AdminPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div dir="rtl">
      <h1 className="text-3xl font-bold">
        דשבורד
      </h1>

      <p className="mt-2 text-gray-600">
        מחוברת בתור {user?.email}
      </p>

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