import Link from "next/link";
import { createClient } from "@/src/utils/supabase/server";

export default async function CustomersPage() {
  const supabase = await createClient();

  const { data: customers } = await supabase
    .from("customers")
    .select("*")
    .order("full_name");

  return (
    <div dir="rtl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">לקוחות</h1>
          <p className="mt-1 text-gray-500">
            ניהול לקוחות והשכרות
          </p>
        </div>

        <Link
          href="/admin/customers/new"
          className="rounded-xl bg-red-600 px-4 py-3 font-semibold text-white"
        >
          + לקוחה חדשה
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
        {customers?.length ? (
          customers.map((customer) => (
            <div
              key={customer.id}
              className="border-b border-gray-100 p-4 last:border-b-0"
            >
              <h2 className="font-bold">
                {customer.full_name}
              </h2>

              {customer.phone && (
                <p className="mt-1 text-sm text-gray-500">
                  {customer.phone}
                </p>
              )}

              {customer.email && (
                <p className="text-sm text-gray-500">
                  {customer.email}
                </p>
              )}
            </div>
          ))
        ) : (
          <p className="p-6 text-gray-500">
            עדיין אין לקוחות במערכת.
          </p>
        )}
      </div>
    </div>
  );
}