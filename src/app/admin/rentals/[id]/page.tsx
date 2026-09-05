import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/src/utils/supabase/server";
import EditRentalForm from "@/src/app/admin/rentals/EditRentalForm";
import EditRentalItemsForm from "./EditRentalItemsForm";
import {
  updateRental,
  updateRentalItems,
} from "@/src/app/admin/rentals/actions";

function formatDate(dateString: string | null) {
  if (!dateString) return "—";

  const [year, month, day] = dateString.split("-");

  return `${day}/${month}/${year}`;
}

function formatDateParts(dateString: string | null) {
  if (!dateString) {
    return {
      day: "--",
      month: "--",
      year: "----",
    };
  }

  const [year, month, day] = dateString.split("-");

  return {
    day,
    month,
    year,
  };
}

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
  add_vat,
  is_paid,
  notes,
  request_source,
  request_number,
  created_at,
has_availability_warning,
availability_warning_details,
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
      const isNewCatalogRequest =
  rental.request_source === "public_catalog" &&
  rental.status === "quote";
const { data: costumes } = await supabase
  .from("costumes")
  .select("id, name, total_quantity")
  .eq("is_active", true)
  .order("name");
  return (
    <div dir="rtl" className="space-y-6">
      {rental.has_availability_warning && (
  <div className="rounded-2xl border border-yellow-300 bg-yellow-50 p-5">
    <p className="text-lg font-bold text-yellow-800">
      ⚠️ הבקשה נשלחה למרות בעיית זמינות
    </p>

    <p className="mt-1 text-sm text-yellow-700">
      הלקוחה בחרה להמשיך בשליחת הבקשה למרות שחלק מהכמות
      לא הייתה זמינה בתאריכים שבחרה.
    </p>

    {Array.isArray(rental.availability_warning_details) &&
      rental.availability_warning_details.length > 0 && (
        <div className="mt-4 space-y-2">
          {rental.availability_warning_details.map(
            (warning: any, index: number) => (
              <div
                key={`${warning.costumeId}-${index}`}
                className="rounded-xl bg-white/70 p-3"
              >
                <p className="font-bold text-yellow-900">
                  {warning.costumeName ?? "תלבושת"}
                </p>

                <div className="mt-1 flex flex-wrap gap-4 text-sm text-yellow-800">
                  <span>
                    ביקשה:{" "}
                    <strong>
                      {warning.requestedQuantity}
                    </strong>
                  </span>

                  <span>
                    היה זמין:{" "}
                    <strong>
                      {warning.availableQuantity}
                    </strong>
                  </span>

                  <span>
                    חסר:{" "}
                    <strong>
                      {Math.max(
                        Number(warning.requestedQuantity ?? 0) -
                          Number(warning.availableQuantity ?? 0),
                        0
                      )}
                    </strong>
                  </span>
                </div>
              </div>
            )
          )}
        </div>
      )}
  </div>
)}
        {isNewCatalogRequest && (
  <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5">
    <div className="flex items-start gap-3">
      <span className="text-2xl">🛒</span>

      <div>
        <p className="text-lg font-bold text-blue-800">
          בקשה חדשה מהקטלוג
        </p>

        <p className="mt-1 text-sm text-blue-700">
          הלקוחה בנתה בקשת השכרה דרך הקטלוג הציבורי.
          בדקי את הפריטים, הכמויות והתאריכים,
          הזיני מחירים ולאחר הטיפול עדכני את הסטטוס.
        </p>
      </div>
    </div>
  </div>
)}
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
          {rental.request_number && (
  <p className="mt-1 font-semibold text-gray-600">
    בקשה #{rental.request_number}
  </p>
)}
{isNewCatalogRequest && (
  <p className="mt-1 font-semibold text-blue-600">
    בקשה להצעת מחיר מהקטלוג
  </p>
)}
          <p className="mt-1 text-gray-500">
             {(() => {
  const date = formatDateParts(rental.start_date);

  return (
    <span
      dir="ltr"
      className="inline-flex items-center gap-1"
    >
      <span>{date.day}</span>
      <span>/</span>
      <span>{date.month}</span>
      <span>/</span>
      <span>{date.year}</span>
    </span>
  );
})()} —   {(() => {
  const date = formatDateParts(rental.end_date);

  return (
    <span
      dir="ltr"
      className="inline-flex items-center gap-1"
    >
      <span>{date.day}</span>
      <span>/</span>
      <span>{date.month}</span>
      <span>/</span>
      <span>{date.year}</span>
    </span>
  );
})()}
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
             <span dir="ltr">
  {(() => {
  const date = formatDateParts(rental.start_date);

  return (
    <span
      dir="ltr"
      className="inline-flex items-center gap-1"
    >
      <span>{date.day}</span>
      <span>/</span>
      <span>{date.month}</span>
      <span>/</span>
      <span>{date.year}</span>
    </span>
  );
})()}
</span>
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              תאריך החזרה
            </p>
            <p className="text-lg font-semibold">
             <span dir="ltr">
 {(() => {
  const date = formatDateParts(rental.end_date);

  return (
    <span
      dir="ltr"
      className="inline-flex items-center gap-1"
    >
      <span>{date.day}</span>
      <span>/</span>
      <span>{date.month}</span>
      <span>/</span>
      <span>{date.year}</span>
    </span>
  );
})()}
</span>
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
           {rental.add_vat && (
  <p className="text-sm text-gray-500">
    ₪{Number(rental.price_after_vat ?? 0).toFixed(2)}
    {" "}אחרי מע״מ
  </p>
)}
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
  startDate={formatDate(rental.start_date)}
  endDate=  {formatDate(rental.end_date)}
  addVatInitial={Boolean(rental.add_vat)}
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