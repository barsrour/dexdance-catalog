import CatalogClient from "@/src/components/CatalogClient";
import { createClient } from "@/src/utils/supabase/server";

export default async function HomePage() {
  const supabase = await createClient();

  const { data: costumes, error } = await supabase
    .from("costumes")
    .select(
      `
      id,
      slug,
      name,
      total_quantity,
      age_range,
      age_groups,
      categories,
      images,
      colors,
      clothing_types,
      styles,
      search_keywords,
      extra_search_keywords
      `
    )
    .eq("is_active", true)
    .order("name");

  if (error) {
    console.error(error);

    return (
      <main dir="rtl" className="p-6">
        <p>לא הצלחנו לטעון את הקטלוג.</p>
      </main>
    );
  }
const { data: availabilityData, error: availabilityError } =
  await supabase.rpc("get_current_costume_availability");

if (availabilityError) {
  console.error("Availability error:", availabilityError);
}
type AvailabilityRow = {
  costume_id: string;
  rented_quantity: number | string | null;
  available_quantity: number | string | null;
  rented_until: string | null;
};

const availabilityMap = new Map<string, AvailabilityRow>(
  ((availabilityData ?? []) as AvailabilityRow[]).map((item) => [
    item.costume_id,
    item,
  ])
);

const costumesWithAvailability = (costumes ?? []).map((costume) => {
  const availability = availabilityMap.get(costume.id);

  return {
    ...costume,

    rented_quantity: Number(
      availability?.rented_quantity ?? 0
    ),

    available_quantity: Number(
      availability?.available_quantity ??
        costume.total_quantity
    ),

    rented_until:
      availability?.rented_until ?? null,
  };
});

 return (
  <CatalogClient
    costumes={costumesWithAvailability}
  />
);
}