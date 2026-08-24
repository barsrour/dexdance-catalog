"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/src/utils/supabase/server";

export async function login(formData: FormData) {
  const email = formData.get("email");
  const password = formData.get("password");

  if (typeof email !== "string" || typeof password !== "string") {
    redirect("/login?error=יש למלא אימייל וסיסמה");
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    redirect("/login?error=האימייל או הסיסמה אינם נכונים");
  }

  redirect("/admin");
}