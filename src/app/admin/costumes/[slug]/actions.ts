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

  const name = String(
    formData.get("name") ?? ""
  ).trim();

  const totalQuantity = Number(
    formData.get("total_quantity") ?? 0
  );

  const ageGroups = formData
    .getAll("age_groups")
    .map(String);

  const categories = formData
    .getAll("categories")
    .map(String);

  const colors = formData
    .getAll("colors")
    .map(String);

  const clothingTypes = formData
    .getAll("clothing_types")
    .map(String);

  const styles = formData
    .getAll("styles")
    .map(String);
const extraSearchKeywords = String(
  formData.get("extra_search_keywords") ?? ""
)
  .split(",")
  .map((keyword) => keyword.trim())
  .filter(Boolean);
  const { error } = await supabase
    .from("costumes")
    .update({
      name,
      total_quantity: totalQuantity,
      extra_search_keywords: extraSearchKeywords,
search_keywords: [
  name,
  ...ageGroups,
  ...colors,
  ...clothingTypes,
  ...styles,
  ...categories,
  ...extraSearchKeywords,
],
      age_groups: ageGroups,
      categories,
      colors,
      clothing_types: clothingTypes,
      styles,

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

  if (error) {
    console.error("Update costume error:", error);
    throw new Error(error.message);
  }

  // מרענן את כל המקומות שמשתמשים בנתוני התלבושת
  revalidatePath(`/admin/costumes/${slug}`);
  revalidatePath("/admin/costumes");
  revalidatePath("/");
  revalidatePath(`/costume/${slug}`);
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