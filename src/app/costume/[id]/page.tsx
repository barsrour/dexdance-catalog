import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/src/utils/supabase/server";
import ImageGallery from "@/src/components/ImagesGallery";
import AddToRentalRequestButton from "@/src/components/AddToRentalRequestButton";
import RentalCartButton from "@/src/components/RentalCartButton";

export default async function CostumePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const decodedId = decodeURIComponent(id);
console.log("URL ID:", id);
  const supabase = await createClient();

  const { data: costume, error } = await supabase
    .from("costumes")
    .select("*")
    .eq("slug", decodedId)
    .eq("is_active", true)
    .maybeSingle();

    console.log("Costume:", costume);
console.log("Error:", error);

  if (error || !costume) {
    notFound();
  }

  const images: string[] = costume.images ?? [];
  const colors: string[] = costume.colors ?? [];
  const clothingTypes: string[] = costume.clothing_types ?? [];
  const styles: string[] = costume.styles ?? [];
  const ageGroups: string[] = costume.age_groups ?? [];

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
    <main
      dir="rtl"
      className="min-h-screen bg-white px-5 py-6 text-black"
    >
      <div className="mb-5 flex items-center justify-between">
  <Link
    href="/"
    className="text-sm font-semibold text-red-600"
  >
    ← חזרה לקטלוג
  </Link>

  <RentalCartButton />
</div>
      <ImageGallery
        images={images}
        name={costume.name}
      />

      <section className="mt-5 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <h1 className="text-2xl font-bold text-black">
          {costume.name}
        </h1>

        <div className="mt-3 flex flex-wrap gap-2">
          {costume.age_range && (
            <span className="rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white">
              {costume.age_range}
            </span>
          )}

          <span className="rounded-full bg-black px-3 py-1 text-xs font-semibold text-white">
            כמות: {costume.total_quantity}
          </span>
        </div>

        {ageGroups.length > 0 && (
          <div className="mt-5">
            <h2 className="mb-2 text-sm font-bold text-red-600">
              קבוצות גיל
            </h2>

            <div className="flex flex-wrap gap-2">
              {ageGroups.map((group) => (
                <span
                  key={group}
                  className="rounded-full border border-gray-200 px-3 py-1 text-xs text-gray-700"
                >
                  {group}
                </span>
              ))}
            </div>
          </div>
        )}

        {colors.length > 0 && (
          <div className="mt-5">
            <h2 className="mb-2 text-sm font-bold text-red-600">
              צבעים
            </h2>

            <div className="flex flex-wrap gap-2">
              {colors.map((color) => (
                <span
                  key={color}
                  className="rounded-full border border-gray-200 px-3 py-1 text-xs text-gray-700"
                >
                  {color}
                </span>
              ))}
            </div>
          </div>
        )}

        {clothingTypes.length > 0 && (
          <div className="mt-5">
            <h2 className="mb-2 text-sm font-bold text-red-600">
              סוג בגד
            </h2>

            <div className="flex flex-wrap gap-2">
              {clothingTypes.map((type) => (
                <span
                  key={type}
                  className="rounded-full border border-gray-200 px-3 py-1 text-xs text-gray-700"
                >
                  {type}
                </span>
              ))}
            </div>
          </div>
        )}

        {styles.length > 0 && (
          <div className="mt-5">
            <h2 className="mb-2 text-sm font-bold text-red-600">
              סגנון
            </h2>

            <div className="flex flex-wrap gap-2">
              {styles.map((style) => (
                <span
                  key={style}
                  className="rounded-full border border-gray-200 px-3 py-1 text-xs text-gray-700"
                >
                  {style}
                </span>
              ))}
            </div>
          </div>
        )}

        {costume.description && (
          <p className="mt-5 rounded-xl bg-gray-50 p-4 text-sm leading-6 text-gray-700">
            {costume.description}
          </p>
        )}
        <section className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
  <h2 className="mb-5 text-xl font-bold">
    זמינות
  </h2>

  <div className="grid grid-cols-3 gap-3 text-center">
    <div className="rounded-xl bg-gray-50 p-4">
      <p className="text-sm text-gray-500">
        כמות כוללת
      </p>

      <p className="mt-1 text-2xl font-bold">
        {costume.total_quantity}
      </p>
    </div>

    <div className="rounded-xl bg-orange-50 p-4">
      <p className="text-sm text-orange-700">
        בהשכרה
      </p>

      <p className="mt-1 text-2xl font-bold text-orange-700">
        {rentedQuantity}
      </p>
    </div>

    <div className="rounded-xl bg-green-50 p-4">
      <p className="text-sm text-green-700">
        זמינות
      </p>

      <p className="mt-1 text-2xl font-bold text-green-700">
        {availableQuantity}
      </p>
    </div>
  </div>

  {rentedQuantity > 0 && rentedUntil && (
    <div className="mt-4 rounded-xl bg-orange-50 p-4 text-center">
      <p className="font-semibold text-orange-700">
        {rentedQuantity} יחידות נמצאות כרגע בהשכרה
      </p>

      <p className="mt-1 text-sm text-orange-600">
        עד{" "}
        {new Date(
          `${rentedUntil}T00:00:00`
        ).toLocaleDateString("he-IL")}
      </p>
    </div>
  )}

  {rentedQuantity === 0 && (
    <div className="mt-4 rounded-xl bg-green-50 p-4 text-center">
      <p className="font-semibold text-green-700">
        ✓ כל היחידות זמינות כרגע
      </p>
    </div>
  )}

  {availableQuantity === 0 && rentedQuantity > 0 && (
    <div className="mt-4 rounded-xl bg-red-50 p-4 text-center">
      <p className="font-bold text-red-700">
        התלבושת אינה זמינה כרגע
      </p>
    </div>
  )}

</section>
  <AddToRentalRequestButton
  costumeId={costume.id}
  slug={costume.slug}
  name={costume.name}
  image={images[0] ?? null}
  availableQuantity={availableQuantity}
/>
      </section>
    </main>
  );
}