"use server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/src/utils/supabase/server";

function splitValues(value: FormDataEntryValue | null) {
  if (typeof value !== "string") return [];

  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export async function updateCostume(
  slug: string,
  formData: FormData
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("אין הרשאה");
  }

  const imagesValue = formData.get("images");

  let images: string[] = [];

  if (typeof imagesValue === "string") {
    try {
      images = JSON.parse(imagesValue);
    } catch {
      images = [];
    }
  }

  const name = String(formData.get("name") ?? "").trim();

  const totalQuantity = Number(
    formData.get("total_quantity") ?? 0
  );

  const { error } = await supabase
  .from("costumes")
  .update({
    name,
    total_quantity: totalQuantity,

    age_range: String(
      formData.get("age_range") ?? ""
    ).trim(),

    age_groups: formData
      .getAll("age_groups")
      .map(String),

    categories: formData
      .getAll("categories")
      .map(String),

    colors: formData
      .getAll("colors")
      .map(String),

    clothing_types: formData
      .getAll("clothing_types")
      .map(String),

    styles: formData
      .getAll("styles")
      .map(String),

    location: String(
      formData.get("location") ?? ""
    ).trim(),

    description: String(
      formData.get("description") ?? ""
    ).trim(),

    images,

    cover_image: images[0] ?? null,
  })
  .eq("slug", slug);
}
export async function deleteCostume(slug: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("אין הרשאה");
  }

  const { error } = await supabase
    .from("costumes")
    .delete()
    .eq("slug", slug);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/costumes");
  revalidatePath("/");
   return { success: true };

}