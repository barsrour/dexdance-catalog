import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/src/utils/supabase/server";
import EditRentalForm from "@/src/app/admin/rentals/EditRentalForm";
import EditRentalItemsForm from "./EditRentalItemsForm";
import {
  updateRental,
  updateRentalItems,
} from "@/src/app/admin/rentals/actions";

export default async function RentalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createClient();

  const { data: rental, error } = await supabase
    .from("rentals")
    .select(`
      id,
      start_date,
      end_date,
      status,
      price_before_vat,
      price_after_vat,
      is_paid,
      notes,
      created_at,

      customers (
        id,
        full_name,
        phone,
        email
      ),

      rental_items (
        id,
        quantity,
        unit_price,

        costumes (
          id,
          slug,
          name,
          total_quantity
        )
      )
    `)
    .eq("id", id)
    .maybeSingle();

  if (error || !rental) {
    console.error("Rental error:", error);
    notFound();
  }
  const customer = Array.isArray(rental.customers)
  ? rental.customers[0]
  : rental.customers;
const initialItems = (rental.rental_items ?? []).map(
  (item: any) => {
    const costume = Array.isArray(item.costumes)
      ? item.costumes[0]
      : item.costumes;

    return {
      costumeId: costume?.id ?? "",
      quantity: Number(item.quantity),
      unitPrice: Number(item.unit_price ?? 0),
    };
  }
);
  const statusText =
    rental.status === "active"
      ? "בהשכרה"
      : rental.status === "reserved"
      ? "שמורה"
      : rental.status === "returned"
      ? "הוחזרה"
      : rental.status === "cancelled"
      ? "בוטלה"
      : "הצעת מחיר";
const { data: costumes } = await supabase
  .from("costumes")
  .select("id, name, total_quantity")
  .eq("is_active", true)
  .order("name");
  return (
    <div dir="rtl" className="space-y-6">
      {/* כותרת */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link
            href="/admin/rentals"
            className="mb-2 inline-block text-sm text-gray-500 hover:text-black"
          >
            ← חזרה להשכרות
          </Link>

          <h1 className="text-3xl font-bold">
            {customer?.full_name ?? "השכרה"}
          </h1>

          <p className="mt-1 text-gray-500">
            {rental.start_date} — {rental.end_date}
          </p>
        </div>

        <div className="flex gap-2">
          <span className="rounded-full bg-gray-100 px-4 py-2 font-semibold">
            {statusText}
          </span>

          <span
            className={`rounded-full px-4 py-2 font-semibold ${
              rental.is_paid
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {rental.is_paid ? "שולם" : "טרם שולם"}
          </span>
        </div>
      </div>

      {/* פרטי לקוחה */}
      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-bold">
          פרטי לקוחה
        </h2>

        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <p className="text-sm text-gray-500">שם</p>
            <p className="font-semibold">
              {customer?.full_name ?? "-"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">טלפון</p>
            <p className="font-semibold">
              {customer?.phone ?? "-"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">אימייל</p>
            <p className="font-semibold">
              {customer?.email ?? "-"}
            </p>
          </div>
        </div>
      </section>

      {/* תאריכים */}
      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-bold">
          תקופת ההשכרה
        </h2>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm text-gray-500">
              תאריך יציאה
            </p>
            <p className="text-lg font-semibold">
              {rental.start_date}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              תאריך החזרה
            </p>
            <p className="text-lg font-semibold">
              {rental.end_date}
            </p>
          </div>
        </div>
      </section>

      {/* תלבושות */}
      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-bold">
          תלבושות בהשכרה
        </h2>

        <div className="space-y-3">
          {rental.rental_items?.map((item: any) => (
            <div
              key={item.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-xl bg-gray-50 p-4"
            >
              <div>
                <p className="font-bold">
                  {item.costumes?.name ?? "תלבושת"}
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  כמות: {item.quantity}
                </p>
              </div>

              <div className="text-left">
                <p className="text-sm text-gray-500">
                  מחיר ליחידה
                </p>

                <p className="font-bold">
                  ₪{Number(item.unit_price ?? 0).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* מחיר */}
      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-bold">
          תשלום
        </h2>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm text-gray-500">
              מחיר לפני מע״מ
            </p>

            <p className="text-2xl font-bold">
              ₪{Number(rental.price_before_vat ?? 0).toFixed(2)}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              מחיר אחרי מע״מ
            </p>

            <p className="text-2xl font-bold">
              ₪{Number(rental.price_after_vat ?? 0).toFixed(2)}
            </p>
          </div>
        </div>
      </section>

      {/* הערות */}
      {rental.notes && (
        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-3 text-xl font-bold">
            הערות
          </h2>

          <p className="whitespace-pre-wrap text-gray-700">
            {rental.notes}
          </p>
        </section>
      )}
        <EditRentalForm
  rental={rental}
  saveRental={updateRental.bind(null, rental.id)}
/>
<EditRentalItemsForm
  rentalId={rental.id}
  startDate={rental.start_date}
  endDate={rental.end_date}
  costumes={costumes ?? []}
  initialItems={initialItems}
  saveItems={updateRentalItems.bind(
    null,
    rental.id,
    rental.start_date,
    rental.end_date
  )}
/>
    </div>
    
  );

}