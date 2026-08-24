import { loadEnvConfig } from "@next/env";
import { createClient } from "@supabase/supabase-js";
import { costumes } from "../data/costumes";

loadEnvConfig(process.cwd());

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const secretKey = process.env.SUPABASE_SECRET_KEY;

if (!supabaseUrl || !secretKey) {
  throw new Error(
    "חסרים NEXT_PUBLIC_SUPABASE_URL או SUPABASE_SECRET_KEY בקובץ .env.local"
  );
}

const supabase = createClient(supabaseUrl, secretKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

async function importCostumes() {
  const rows = costumes.map((costume) => ({
    slug: costume.id,
    name: costume.name,
    total_quantity: costume.quantity,
    age_range: costume.ageRange,
    age_groups: costume.ageGroup,
    categories: costume.categories,
    images: costume.images,
    cover_image: costume.images[0] ?? null,
    colors: costume.colors,
    clothing_types: costume.clothingTypes,
    styles: costume.styles,
    search_keywords: costume.searchKeywords,
    description: costume.description ?? null,
    is_active: true,
  }));

  const { error } = await supabase
    .from("costumes")
    .upsert(rows, {
      onConflict: "slug",
    });

  if (error) {
    console.error("שגיאה בייבוא:");
    console.error(error);
    process.exit(1);
  }

  console.log(`הייבוא הסתיים בהצלחה: ${rows.length} תלבושות הועברו.`);
}

importCostumes().catch((error) => {
  console.error("שגיאה לא צפויה:");
  console.error(error);
  process.exit(1);
});