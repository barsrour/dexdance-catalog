"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/src/utils/supabase/server";

function createSlug(name: string) {
  return `${Date.now()}-${name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")}`;
}

export async function createCostume(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("אין הרשאה");
  }

  const name = String(formData.get("name") ?? "").trim();

  if (!name) {
    throw new Error("חובה להזין שם");
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

  const slug = createSlug(name);
const extraSearchKeywords = String(
  formData.get("extra_search_keywords") ?? ""
)
  .split(",")
  .map((keyword) => keyword.trim())
  .filter(Boolean);
  const { error } = await supabase
    .from("costumes")
    .insert({
      slug,
      name,
      total_quantity: Number(
        formData.get("total_quantity") ?? 0
      ),
     search_keywords: [
  name,
  ...formData.getAll("age_groups").map(String),
  ...formData.getAll("colors").map(String),
  ...formData.getAll("clothing_types").map(String),
  ...formData.getAll("styles").map(String),
  ...formData.getAll("categories").map(String),
  ...extraSearchKeywords,
],
      age_groups: formData
        .getAll("age_groups")
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
      categories: formData
        .getAll("categories")
        .map(String),
      images,
      cover_image: images[0] ?? null,
      location: String(
        formData.get("location") ?? ""
      ).trim(),
      description: String(
        formData.get("description") ?? ""
      ).trim(),
      is_active: true,
    });

  if (error) {
    throw new Error(error.message);
  }

  redirect("/admin/costumes");
}