import { notFound } from "next/navigation";
import { createClient } from "@/src/utils/supabase/server";
import PrintRentalButton from "@/src/app/admin/rentals/[id]/document/PrintRentalButton";

function formatDate(dateString: string | null) {
  if (!dateString) return "-";

  const [year, month, day] = dateString.split("-");

  return `${day}/${month}/${year}`;
}

export default async function RentalDocumentPage({
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
        full_name,
        phone,
        email
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
    .eq("id", id)
    .maybeSingle();

  if (error || !rental) {
    notFound();
  }

  const customer = Array.isArray(rental.customers)
    ? rental.customers[0]
    : rental.customers;

  const items = (rental.rental_items ?? []).map((item: any) => {
    const costume = Array.isArray(item.costumes)
      ? item.costumes[0]
      : item.costumes;

    return {
      id: item.id,
      name: costume?.name ?? "תלבושת",
      quantity: Number(item.quantity),
      unitPrice: Number(item.unit_price ?? 0),
    };
  });

  const priceBeforeVat = Number(rental.price_before_vat ?? 0);
  const priceAfterVat = Number(rental.price_after_vat ?? 0);
  const vatAmount = priceAfterVat - priceBeforeVat;

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-gray-100 px-4 py-8 text-black print:bg-white print:p-0"
    >
      {/* לא יודפס */}
      <div className="mx-auto mb-5 flex max-w-4xl justify-end print:hidden">
        <PrintRentalButton />
      </div>

      {/* המסמך */}
      <article className="mx-auto min-h-[1120px] max-w-4xl bg-white p-8 shadow-lg print:min-h-0 print:max-w-none print:p-10 print:shadow-none">
        {/* כותרת */}
        <header className="border-b-2 border-black pb-6">
          <div className="flex items-start justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold">
                פירוט השכרה
              </h1>

              <p className="mt-2 text-gray-500">
                dex.dance
              </p>
            </div>

            <img
              src="/logo.png"
              alt="dex.dance"
              className="h-auto w-24 object-contain"
            />
          </div>
        </header>

        {/* לקוחה ותאריכים */}
        <section className="mt-8 grid grid-cols-2 gap-8">
          <div>
            <h2 className="mb-3 text-lg font-bold">
              פרטי לקוחה
            </h2>

            <div className="space-y-2 text-sm">
              <p>
                <span className="font-semibold">שם: </span>
                {customer?.full_name ?? "-"}
              </p>

              <p>
                <span className="font-semibold">טלפון: </span>
                <span dir="ltr">
                  {customer?.phone ?? "-"}
                </span>
              </p>

              {customer?.email && (
                <p>
                  <span className="font-semibold">אימייל: </span>
                  {customer.email}
                </p>
              )}
            </div>
          </div>

          <div>
            <h2 className="mb-3 text-lg font-bold">
              תקופת ההשכרה
            </h2>

            <div className="space-y-2 text-sm">
              <p>
                <span className="font-semibold">תאריך יציאה: </span>
                <span dir="ltr">
                  {formatDate(rental.start_date)}
                </span>
              </p>

              <p>
                <span className="font-semibold">תאריך החזרה: </span>
                <span dir="ltr">
                  {formatDate(rental.end_date)}
                </span>
              </p>
            </div>
          </div>
        </section>

        {/* טבלת תלבושות */}
        <section className="mt-10">
          <h2 className="mb-4 text-xl font-bold">
            פירוט התלבושות
          </h2>

          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b-2 border-black">
                <th className="py-3 text-right">
                  תלבושת
                </th>

                <th className="py-3 text-center">
                  כמות
                </th>

                <th className="py-3 text-center">
                  מחיר ליחידה
                </th>

                <th className="py-3 text-left">
                  סה״כ
                </th>
              </tr>
            </thead>

            <tbody>
              {items.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-gray-200"
                >
                  <td className="py-4 font-semibold">
                    {item.name}
                  </td>

                  <td className="py-4 text-center">
                    {item.quantity}
                  </td>

                  <td className="py-4 text-center">
                    ₪{item.unitPrice.toFixed(2)}
                  </td>

                  <td className="py-4 text-left font-semibold">
                    ₪{(
                      item.quantity * item.unitPrice
                    ).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* סיכום */}
        <section className="mt-10 mr-auto w-full max-w-sm rounded-xl bg-gray-50 p-5">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>מחיר לפני מע״מ</span>

              <strong>
                ₪{priceBeforeVat.toFixed(2)}
              </strong>
            </div>

            <div className="flex justify-between text-gray-600">
              <span>מע״מ</span>

              <span>
                ₪{vatAmount.toFixed(2)}
              </span>
            </div>

            <div className="border-t border-gray-300 pt-3">
              <div className="flex justify-between text-lg">
                <strong>מחיר אחרי מע״מ</strong>

                <strong>
                  ₪{priceAfterVat.toFixed(2)}
                </strong>
              </div>
            </div>
          </div>
        </section>

        {/* תשלום */}
        <section className="mt-6">
          <div
            className={`inline-block rounded-lg px-4 py-2 text-sm font-bold ${
              rental.is_paid
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {rental.is_paid ? "שולם" : "טרם שולם"}
          </div>
        </section>

        {/* הערות */}
        {rental.notes && (
          <section className="mt-8 border-t border-gray-200 pt-6">
            <h2 className="mb-2 font-bold">
              הערות
            </h2>

            <p className="whitespace-pre-wrap text-sm leading-6 text-gray-700">
              {rental.notes}
            </p>
          </section>
        )}

        <footer className="mt-12 border-t border-gray-200 pt-4 text-center text-xs text-gray-400">
          dex.dance • פירוט השכרה
        </footer>
      </article>
    </main>
  );
}