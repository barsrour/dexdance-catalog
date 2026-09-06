import { redirect } from "next/navigation";

import AdminSidebar from "@/src/components/admin/AdminSidebar";
import { createClient } from "@/src/utils/supabase/server";

const ALLOWED_ADMIN_EMAILS =
  process.env.ADMIN_EMAILS
    ?.split(",")
    .map((email) => email.trim().toLowerCase()) ?? [];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // מי שלא מחובר בכלל -> לעמוד ההתחברות
  if (!user) {
    redirect("/login");
  }

  const userEmail = user.email?.trim().toLowerCase();

  // מי שמחובר אבל לא נמצא ברשימת המנהלות -> אין גישה
  const isAllowedAdmin =
    !!userEmail &&
    ALLOWED_ADMIN_EMAILS.includes(userEmail);

  if (!isAllowedAdmin) {
    await supabase.auth.signOut();

    redirect(
      "/login?error=אין למשתמש הזה הרשאה להיכנס למערכת הניהול"
    );
  }

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-gray-100 text-black"
    >
      <div className="md:flex">
        <AdminSidebar />

        <main className="min-w-0 flex-1 p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}