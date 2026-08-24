"use client";

type Props = {
  rental: {
    start_date: string;
    end_date: string;
    status: string;
    price_before_vat: number | null;
    price_after_vat: number | null;
    is_paid: boolean | null;
    notes: string | null;
  };
  saveRental: (formData: FormData) => Promise<void>;
};

export default function EditRentalForm({
  rental,
  saveRental,
}: Props) {
  return (
    <form
      action={saveRental}
      className="space-y-5 rounded-2xl bg-white p-6 shadow-sm"
    >
      <h2 className="text-xl font-bold">עריכת השכרה</h2>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-bold">
            תאריך יציאה
          </label>

          <input
            name="start_date"
            type="date"
            defaultValue={rental.start_date}
            required
            className="w-full rounded-xl border border-gray-300 px-4 py-3"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold">
            תאריך החזרה
          </label>

          <input
            name="end_date"
            type="date"
            defaultValue={rental.end_date}
            required
            className="w-full rounded-xl border border-gray-300 px-4 py-3"
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-bold">
          סטטוס
        </label>

        <select
          name="status"
          defaultValue={rental.status}
          className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3"
        >
          <option value="quote">הצעת מחיר</option>
          <option value="reserved">שמורה</option>
          <option value="active">בהשכרה</option>
          <option value="returned">הוחזרה</option>
          <option value="cancelled">בוטלה</option>
        </select>
      </div>

      <div>
        <label className="flex items-center gap-3 rounded-xl border border-gray-300 p-4">
          <input
            type="checkbox"
            name="is_paid"
            value="true"
            defaultChecked={Boolean(rental.is_paid)}
            className="h-4 w-4"
          />

          <span className="font-semibold">שולם</span>
        </label>
      </div>

      <div>
        <label className="mb-2 block text-sm font-bold">
          הערות
        </label>

        <textarea
          name="notes"
          rows={4}
          defaultValue={rental.notes ?? ""}
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
  );
}