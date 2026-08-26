import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/src/utils/supabase/server";
import { updateCustomer } from "../actions";

export default async function CustomerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createClient();

  const { data: customer, error } = await supabase
    .from("customers")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !customer) {
    notFound();
  }

  return (
    <div dir="rtl">
      <Link
        href="/admin/customers"
        className="mb-5 inline-block text-sm text-gray-500"
      >
        ← חזרה ללקוחות
      </Link>

      <h1 className="mb-6 text-3xl font-bold">
        עריכת לקוחה
      </h1>

      <form
        action={updateCustomer.bind(
          null,
          customer.id
        )}
        className="space-y-5 rounded-2xl bg-white p-6 shadow-sm"
      >
        <div>
          <label className="mb-2 block text-sm font-bold">
            שם מלא
          </label>

          <input
            name="full_name"
            defaultValue={customer.full_name}
            required
            className="w-full rounded-xl border border-gray-300 px-4 py-3"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold">
            טלפון
          </label>

          <input
            name="phone"
            type="tel"
            defaultValue={customer.phone ?? ""}
            className="w-full rounded-xl border border-gray-300 px-4 py-3"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold">
            אימייל
          </label>

          <input
            name="email"
            type="email"
            defaultValue={customer.email ?? ""}
            className="w-full rounded-xl border border-gray-300 px-4 py-3"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold">
            הערות
          </label>

          <textarea
            name="notes"
            rows={4}
            defaultValue={customer.notes ?? ""}
            className="w-full rounded-xl border border-gray-300 px-4 py-3"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-xl bg-red-600 px-5 py-3 font-bold text-white"
        >
          שמירת שינויים
        </button>
      </form>
    </div>
  );
}