import NewRentalForm from "./NewRentalForm";
import { createRental } from "./actions";
import { createClient } from "@/src/utils/supabase/server";

export default async function NewRentalPage() {
  const supabase = await createClient();

  const { data: customers } = await supabase
    .from("customers")
    .select("id, full_name, phone")
    .order("full_name");

  const { data: costumes } = await supabase
    .from("costumes")
    .select("id, slug, name, total_quantity")
    .eq("is_active", true)
    .order("name");

  return (
    <div dir="rtl">
      <h1 className="mb-6 text-3xl font-bold">
        השכרה חדשה
      </h1>

      <NewRentalForm
        customers={customers ?? []}
        costumes={costumes ?? []}
        saveRental={createRental}
      />
    </div>
  );
}