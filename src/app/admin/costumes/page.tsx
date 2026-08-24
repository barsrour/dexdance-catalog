import { createClient } from "@/src/utils/supabase/server";
import Link from "next/link";
import DeleteCostumeButton from "./[slug]/DeleteCostumeButton";
import { deleteCostume } from "./[slug]/actions";

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
        {costumes?.map((costume) => (
          <div
            key={costume.id}
            className="flex items-center gap-4 border-b border-gray-100 p-4 last:border-b-0"
          >
            <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-gray-100">
              {costume.cover_image && (
                <img
                  src={costume.cover_image}
                  alt={costume.name}
                  className="h-full w-full object-cover"
                />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <h2 className="font-bold text-black">
                {costume.name}
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                כמות: {costume.total_quantity}
              </p>

              {costume.age_range && (
                <p className="text-sm text-gray-500">
                  גיל: {costume.age_range}
                </p>
              )}
            </div>

            <div className="flex gap-2">
             <Link
  href={`/admin/costumes/${costume.slug}`}
  className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
>
  פתיחה
</Link>

              <DeleteCostumeButton
  costumeName={costume.name}
  deleteAction={deleteCostume.bind(null, costume.slug)}
  size="small"
/>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}