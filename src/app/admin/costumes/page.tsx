import { createClient } from "@/src/utils/supabase/server";
import Link from "next/link";
import DeleteCostumeButton from "./[slug]/DeleteCostumeButton";
import { deleteCostume } from "./[slug]/actions";
import AdminCostumesList from "@/src/components/admin/AdminCostumesList";


export default async function CostumesPage() {
  const supabase = await createClient();

  const { data: costumes, error } = await supabase
    .from("costumes")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    return (
      <div dir="rtl">
        <h1 className="text-3xl font-bold">תלבושות</h1>
        <p className="mt-4 text-red-600">
          הייתה שגיאה בטעינת התלבושות.
        </p>
      </div>
    );
  }

  return (
    <div dir="rtl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">תלבושות</h1>
          <p className="mt-1 text-gray-500">
            ניהול כל התלבושות בקטלוג
          </p>
        </div>

        <Link
  href="/admin/costumes/new"
  className="rounded-lg bg-red-600 px-4 py-2 font-semibold text-white"
>
  + הוספת תלבושת
</Link>
      </div>

      <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
        <AdminCostumesList
  costumes={costumes ?? []}
  deleteCostume={deleteCostume}
/>
      </div>
    </div>
  );
}