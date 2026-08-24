import { createCustomer } from "./actions";

export default function NewCustomerPage() {
  return (
    <div dir="rtl">
      <h1 className="mb-6 text-3xl font-bold">
        לקוחה חדשה
      </h1>

      <form
        action={createCustomer}
        className="space-y-5 rounded-2xl bg-white p-6 shadow-sm"
      >
        <div>
          <label className="mb-2 block text-sm font-bold">
            שם מלא
          </label>

          <input
            name="full_name"
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
            className="w-full rounded-xl border border-gray-300 px-4 py-3"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-xl bg-red-600 px-5 py-3 font-bold text-white"
        >
          שמירת לקוחה
        </button>
      </form>
    </div>
  );
}