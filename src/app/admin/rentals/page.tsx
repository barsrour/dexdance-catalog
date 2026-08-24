import Link from "next/link";
import { createClient } from "@/src/utils/supabase/server";

export default async function RentalsPage() {
  const supabase = await createClient();

  const { data: rentals, error } = await supabase
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
        full_name,
        phone
      ),
      rental_items (
        id,
        quantity,
        unit_price,
        costumes (
          name
        )
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Rentals error:", error);

    return (
      <div dir="rtl">
        <h1 className="text-3xl font-bold">השכרות</h1>

        <p className="mt-4 text-red-600">
          הייתה שגיאה בטעינת ההשכרות.
        </p>
      </div>
    );
  }

  return (
    <div dir="rtl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">השכרות</h1>

          <p className="mt-1 text-gray-500">
            ניהול השכרות פעילות, עתידיות והיסטוריה
          </p>
        </div>

        <Link
          href="/admin/rentals/new"
          className="rounded-xl bg-red-600 px-4 py-3 font-semibold text-white"
        >
          + השכרה חדשה
        </Link>
      </div>

      {!rentals || rentals.length === 0 ? (
        <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
          <p className="font-semibold">
            עדיין אין השכרות במערכת
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {rentals.map((rental: any) => (
            <div
              key={rental.id}
              className="rounded-2xl bg-white p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold">
                    {rental.customers?.full_name ?? "לקוחה ללא שם"}
                  </h2>

                  {rental.customers?.phone && (
                    <p className="mt-1 text-sm text-gray-500">
                      {rental.customers.phone}
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      rental.status === "active"
                        ? "bg-red-100 text-red-700"
                        : rental.status === "reserved"
                        ? "bg-yellow-100 text-yellow-700"
                        : rental.status === "returned"
                        ? "bg-green-100 text-green-700"
                        : rental.status === "cancelled"
                        ? "bg-gray-200 text-gray-600"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {rental.status === "active"
                      ? "בהשכרה"
                      : rental.status === "reserved"
                      ? "שמורה"
                      : rental.status === "returned"
                      ? "הוחזרה"
                      : rental.status === "cancelled"
                      ? "בוטלה"
                      : "הצעת מחיר"}
                  </span>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      rental.is_paid
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {rental.is_paid ? "שולם" : "טרם שולם"}
                  </span>
                </div>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-xs text-gray-500">
                    תקופת השכרה
                  </p>

                  <p className="font-semibold">
                    {rental.start_date} — {rental.end_date}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">
                    מחיר
                  </p>

                  <p className="font-semibold">
                    ₪{Number(rental.price_before_vat ?? 0).toFixed(2)}
                    {" "}לפני מע״מ
                  </p>

                  <p className="text-sm text-gray-500">
                    ₪{Number(rental.price_after_vat ?? 0).toFixed(2)}
                    {" "}אחרי מע״מ
                  </p>
                </div>
              </div>

              <div className="mt-5 border-t border-gray-100 pt-4">
                <h3 className="mb-2 font-bold">
                  תלבושות
                </h3>

                <div className="space-y-2">
                  {rental.rental_items?.map((item: any) => (
                    <div
                      key={item.id}
                      className="flex justify-between rounded-lg bg-gray-50 px-3 py-2 text-sm"
                    >
                      <span>
                        {item.costumes?.name ?? "תלבושת"}
                      </span>

                      <span className="font-semibold">
                        כמות: {item.quantity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {rental.notes && (
                <div className="mt-4 rounded-lg bg-gray-50 p-3 text-sm text-gray-600">
                  {rental.notes}
                </div>
              )}
              <div className="mt-5 border-t border-gray-100 pt-4">
  <Link
    href={`/admin/rentals/${rental.id}`}
    className="inline-block rounded-xl bg-red-600 px-4 py-2 font-semibold text-white"
  >
    פתיחת השכרה
  </Link>
</div>
            </div>
            
          ))}
        </div>
      )}
    </div>
  );
}