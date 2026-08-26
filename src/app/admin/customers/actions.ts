"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/src/utils/supabase/server";

export async function deleteCustomer(id: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("אין הרשאה");
  }

  // בודקים אם קיימת אפילו השכרה אחת ללקוחה
  const { count, error: rentalCheckError } = await supabase
    .from("rentals")
    .select("id", {
      count: "exact",
      head: true,
    })
    .eq("customer_id", id);

  if (rentalCheckError) {
    throw new Error(rentalCheckError.message);
  }

  if ((count ?? 0) > 0) {
    throw new Error(
      "לא ניתן למחוק לקוחה שיש לה היסטוריית השכרות"
    );
  }

  const { error } = await supabase
    .from("customers")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/customers");

  return { success: true };
}

export async function updateCustomer(
  id: string,
  formData: FormData
) {
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
    .update({
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
    })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/customers");
  revalidatePath(`/admin/customers/${id}`);
}