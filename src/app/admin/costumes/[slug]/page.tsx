import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/src/utils/supabase/server";
import EditCostumeForm from "./EditCostumeForm";
import { updateCostume, deleteCostume } from "./actions";
import DeleteCostumeButton from "./DeleteCostumeButton";

export default async function CostumeAdminPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  const supabase = await createClient();

  const { data: costume, error } = await supabase
    .from("costumes")
    .select("*")
    .eq("slug", decodedSlug)
    .maybeSingle();

  if (error || !costume) {
    notFound();
  }
const { data: availabilityData, error: availabilityError } =
  await supabase.rpc("get_current_costume_availability", {
    p_costume_id: costume.id,
  });

if (availabilityError) {
  console.error("Availability error:", availabilityError);
}

const availability = availabilityData?.[0];

const rentedQuantity = Number(
  availability?.rented_quantity ?? 0
);

const availableQuantity = Number(
  availability?.available_quantity ??
    costume.total_quantity
);

const rentedUntil =
  availability?.rented_until ?? null;
  return (
     <div dir="rtl">
     <Link
        href="/admin/costumes"
        className="mb-6 inline-block text-sm font-semibold text-red-600"
      >
        ← חזרה לתלבושות
      </Link>
   
        <div className="mt-8">
  <h2 className="mb-4 text-2xl font-bold">
    עריכת התלבושת
  </h2>

  <EditCostumeForm
    costume={costume}
    saveCostume={updateCostume.bind(null, costume.slug)}
  />
 
</div>
     

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <section className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">{costume.name}</h1>

              <p className="mt-2 text-sm text-gray-500">
                מזהה: {costume.slug}
              </p>
            </div>

            <button className="rounded-lg bg-red-600 px-4 py-2 font-semibold text-white">
              עריכת תלבושת
            </button>
          </div>

          {costume.images?.length > 0 && (
            <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3">
              {costume.images.map((image: string, index: number) => (
                <img
                  key={index}
                  src={image}
                  alt={costume.name}
                  className="aspect-square w-full rounded-xl bg-gray-100 object-cover"
                />
              ))}
            </div>
          )}

          {costume.description && (
            <div className="mt-6">
              <h2 className="font-bold">תיאור</h2>
              <p className="mt-2 text-gray-600">{costume.description}</p>
            </div>
          )}
        </section>

        <aside className="space-y-4">
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <h2 className="text-lg font-bold">מלאי</h2>

            <div className="mt-4">
              <p className="text-sm text-gray-500">כמות כוללת</p>
              <div className="mt-4 grid grid-cols-3 gap-3 text-center">
  <div className="rounded-xl bg-gray-50 p-3">
    <p className="text-xs text-gray-500">סה״כ</p>
    <p className="mt-1 text-xl font-bold">
      {costume.total_quantity}
    </p>
  </div>

  <div className="rounded-xl bg-orange-50 p-3">
    <p className="text-xs text-orange-600">בהשכרה</p>
    <p className="mt-1 text-xl font-bold text-orange-700">
      {rentedQuantity}
    </p>
  </div>

  <div className="rounded-xl bg-green-50 p-3">
    <p className="text-xs text-green-600">זמינות</p>
    <p className="mt-1 text-xl font-bold text-green-700">
      {availableQuantity}
    </p>
  </div>
</div>
            </div>

         {rentedQuantity > 0 ? (
  <div className="mt-4 rounded-xl bg-orange-50 p-4">
    <p className="font-bold text-orange-700">
      {rentedQuantity} יחידות נמצאות כרגע בהשכרה
    </p>

    <p className="mt-1 text-sm text-orange-600">
      זמינות כרגע: {availableQuantity} מתוך{" "}
      {costume.total_quantity}
    </p>

    {rentedUntil && (
      <p className="mt-1 text-sm text-orange-600">
        עד{" "}
        {(() => {
          const [year, month, day] = rentedUntil.split("-");

          return (
            <span dir="ltr">
              {day}/{month}/{year}
            </span>
          );
        })()}
      </p>
    )}
  </div>
) : (
  <div className="mt-4 rounded-xl bg-green-50 p-3 font-semibold text-green-700">
    ✓ אין כרגע השכרות פעילות
  </div>
)}
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <h2 className="text-lg font-bold">פרטי התלבושת</h2>

            <div className="mt-4 space-y-4 text-sm">
              <div>
                <p className="font-semibold">גילאים</p>
                <p className="text-gray-600">
                  {costume.age_groups?.join(", ") || "לא הוגדר"}
                </p>
              </div>

              <div>
                <p className="font-semibold">צבעים</p>
                <p className="text-gray-600">
                  {costume.colors?.join(", ") || "לא הוגדר"}
                </p>
              </div>

              <div>
                <p className="font-semibold">סוג בגד</p>
                <p className="text-gray-600">
                  {costume.clothing_types?.join(", ") || "לא הוגדר"}
                </p>
              </div>

              <div>
                <p className="font-semibold">סגנון</p>
                <p className="text-gray-600">
                  {costume.styles?.join(", ") || "לא הוגדר"}
                </p>
              </div>

              {costume.location && (
                <div>
                  <p className="font-semibold">מיקום במחסן</p>
                  <p className="text-gray-600">{costume.location}</p>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <h2 className="text-lg font-bold">השכרות</h2>

            <p className="mt-3 text-sm text-gray-500">
              כאן תופיע בהמשך היסטוריית ההשכרות של התלבושת.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}