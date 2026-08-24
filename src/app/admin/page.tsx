import { redirect } from "next/navigation";
import { createClient } from "@/src/utils/supabase/server";

export default async function AdminPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <main dir="rtl" className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-bold">אזור ניהול</h1>

        <p className="mt-2 text-gray-600">
          התחברת בהצלחה בתור {user.email}
        </p>

        <div className="mt-8 rounded-2xl bg-white p-6 shadow">
          <h2 className="text-xl font-bold">המערכת מחוברת</h2>

          <p className="mt-2 text-gray-600">
            מכאן ננהל תלבושות, לקוחות, הצעות מחיר והשכרות.
          </p>
        </div>
      </div>
    </main>
  );
}