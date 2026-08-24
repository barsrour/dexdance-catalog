"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/src/utils/supabase/server";

export async function createCustomer(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("אין הרשאה");
  }

  const fullName = String(
    formData.get("full_name") ?? ""
  ).trim();

  if (!fullName) {
    throw new Error("חובה להזין שם");
  }

  const { error } = await supabase
    .from("customers")
    .insert({
      full_name: fullName,
      phone: String(
        formData.get("phone") ?? ""
      ).trim(),
      email: String(
        formData.get("email") ?? ""
      ).trim(),
      notes: String(
        formData.get("notes") ?? ""
      ).trim(),
    });

  if (error) {
    throw new Error(error.message);
  }

  redirect("/admin/customers");
}