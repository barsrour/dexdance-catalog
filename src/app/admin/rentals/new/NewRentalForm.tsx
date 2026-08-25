"use client";

import { useState } from "react";
import { getCostumeAvailability } from "./availability";
import CostumeSearchSelect from "@/src/components/admin/CostumeSearchSelect";

type Customer = {
  id: string;
  full_name: string;
  phone: string | null;
};

type Costume = {
  id: string;
  slug: string;
  name: string;
  total_quantity: number;
};

type RentalItem = {
  costumeId: string;
  quantity: number;
  unitPrice: number;
};

type Props = {
  customers: Customer[];
  costumes: Costume[];
  saveRental: (formData: FormData) => Promise<void>;
};

export default function NewRentalForm({
  customers,
  costumes,
  saveRental,
}: Props) {
  const [items, setItems] = useState<RentalItem[]>([
    {
      costumeId: "",
      quantity: 1,
      unitPrice: 0,
    },
  ]);
const [startDate, setStartDate] = useState("");
const [endDate, setEndDate] = useState("");

const [availability, setAvailability] = useState<
  Record<
    string,
    {
      totalQuantity: number;
      rentedQuantity: number;
      availableQuantity: number;
    }
  >
>({});
async function checkAvailability(costumeId: string) {
  if (!costumeId || !startDate || !endDate) {
    return;
  }

  const result = await getCostumeAvailability(
    costumeId,
    startDate,
    endDate
  );

  if (!result) return;

  setAvailability((current) => ({
    ...current,
    [costumeId]: result,
  }));
}
 async function refreshAllAvailability(
  newStartDate: string,
  newEndDate: string
) {
  if (!newStartDate || !newEndDate) return;

  for (const item of items) {
    if (!item.costumeId) continue;

    const result = await getCostumeAvailability(
      item.costumeId,
      newStartDate,
      newEndDate
    );

    if (!result) continue;

    setAvailability((current) => ({
      ...current,
      [item.costumeId]: result,
    }));
  }
}
  function addItem() {
    setItems((current) => [
      ...current,
      {
        costumeId: "",
        quantity: 1,
        unitPrice: 0,
      },
    ]);
  }

  function removeItem(index: number) {
    setItems((current) =>
      current.filter((_, itemIndex) => itemIndex !== index)
    );
  }

  function updateItem(
    index: number,
    field: keyof RentalItem,
    value: string | number
  ) {
    setItems((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              [field]: value,
            }
          : item
      )
    );
  }
const priceBeforeVat = items.reduce(
  (total, item) => total + item.quantity * item.unitPrice,
  0
);

const priceAfterVat = priceBeforeVat * 1.18;
  return (
    <form
      action={saveRental}
      className="space-y-6 rounded-2xl bg-white p-6 shadow-sm"
    >
      <input
        type="hidden"
        name="items"
        value={JSON.stringify(items)}
      />

      <div>
        <label className="mb-2 block text-sm font-bold">
          לקוחה
        </label>

        <select
          name="customer_id"
          required
          className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3"
        >
          <option value="">בחרי לקוחה</option>

          {customers.map((customer) => (
            <option
              key={customer.id}
              value={customer.id}
            >
              {customer.full_name}
              {customer.phone
                ? ` - ${customer.phone}`
                : ""}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-bold">
            תאריך יציאה
          </label>

         <input
  name="start_date"
  type="date"
  required
  value={startDate}
  onChange={async (e) => {
  const newStartDate = e.target.value;

  setStartDate(newStartDate);
  setAvailability({});

  if (newStartDate && endDate) {
    await refreshAllAvailability(
      newStartDate,
      endDate
    );
  }
}}
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
  required
  value={endDate}
  min={startDate || undefined}
  onChange={async (e) => {
  const newEndDate = e.target.value;

  setEndDate(newEndDate);
  setAvailability({});

  if (startDate && newEndDate) {
    await refreshAllAvailability(
      startDate,
      newEndDate
    );
  }
}}
  className="w-full rounded-xl border border-gray-300 px-4 py-3"
/>
        </div>
      </div>

      <div>
        <h2 className="mb-3 text-lg font-bold">
          תלבושות בהשכרה
        </h2>

        <div className="space-y-4">
          {items.map((item, index) => (
            <div
              key={index}
              className="rounded-xl border border-gray-200 p-4"
            >
              <div className="grid gap-3 md:grid-cols-[1fr_120px_140px_auto]">

  {/* תלבושת */}
  <div>
    <label className="mb-2 block text-sm font-semibold text-gray-600">
      תלבושת
    </label>

   <CostumeSearchSelect
  costumes={costumes}
  value={item.costumeId}
  onChange={async (costumeId) => {
    setItems((current) =>
  current.map((currentItem, itemIndex) =>
    itemIndex === index
      ? {
          ...currentItem,
          costumeId,
          quantity: 1,
        }
      : currentItem
  )
);

    if (costumeId && startDate && endDate) {
      await checkAvailability(costumeId);
    }
  }}
/>
  </div>

  {/* כמות */}
  <div>

   {(() => {
  const selectedCostume = costumes.find(
    (costume) => costume.id === item.costumeId
  );

  const availabilityInfo =
    item.costumeId
      ? availability[item.costumeId]
      : undefined;

  const maxQuantity =
    availabilityInfo?.availableQuantity ??
    selectedCostume?.total_quantity ??
    0;

  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-gray-600">
        כמות
      </label>

      <input
        type="number"
        min="1"
        max={maxQuantity}
        value={item.quantity}
        disabled={!item.costumeId || maxQuantity === 0}
        onChange={(e) => {
          const value = Number(e.target.value);

          updateItem(
            index,
            "quantity",
            Math.min(
              Math.max(value, 1),
              maxQuantity
            )
          );
        }}
        className="w-full rounded-xl border border-gray-300 px-3 py-3 disabled:bg-gray-100"
      />

      {availabilityInfo ? (
        <div className="mt-2 text-xs">
          <p className="font-semibold text-green-700">
            זמינות לתאריכים שנבחרו:{" "}
            {availabilityInfo.availableQuantity}
          </p>

          {availabilityInfo.rentedQuantity > 0 && (
            <p className="mt-1 text-gray-500">
              {availabilityInfo.rentedQuantity} מתוך{" "}
              {availabilityInfo.totalQuantity} כבר
              שמורות/מושכרות.
            </p>
          )}
        </div>
      ) : selectedCostume ? (
        <p className="mt-1 text-xs text-gray-500">
          כמות כוללת במלאי:{" "}
          {selectedCostume.total_quantity}
        </p>
      ) : null}
    </div>
  );
})()}
  </div>

  {/* מחיר ליחידה */}
  <div>
    <label className="mb-2 block text-sm font-semibold text-gray-600">
      מחיר ליחידה
    </label>

    <input
      type="number"
      min="0"
      step="0.01"
      value={item.unitPrice}
      onChange={(e) =>
        updateItem(index, "unitPrice", Number(e.target.value))
      }
      className="w-full rounded-xl border border-gray-300 px-3 py-3"
    />
  </div>

  {items.length > 1 && (
    <div className="flex items-end">
      <button
        type="button"
        onClick={() => removeItem(index)}
        className="rounded-xl border border-red-200 px-3 py-3 text-sm text-red-600"
      >
        הסרה
      </button>
    </div>
  )}

</div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addItem}
          className="mt-3 rounded-xl border border-gray-300 px-4 py-2 text-sm font-semibold"
        >
          + הוספת תלבושת להשכרה
        </button>
      </div>

   <div className="grid gap-4 md:grid-cols-2">
  <div>
    <label className="mb-2 block text-sm font-bold">
      מחיר לפני מע״מ
    </label>

    <div className="rounded-xl border border-gray-300 bg-gray-50 px-4 py-3">
      ₪{priceBeforeVat.toFixed(2)}
    </div>

    <input
      type="hidden"
      name="price_before_vat"
      value={priceBeforeVat.toFixed(2)}
    />
  </div>

  <div>
    <label className="mb-2 block text-sm font-bold">
      מחיר אחרי מע״מ
    </label>

    <div className="rounded-xl border border-gray-300 bg-gray-50 px-4 py-3">
      ₪{priceAfterVat.toFixed(2)}
    </div>

    <input
      type="hidden"
      name="price_after_vat"
      value={priceAfterVat.toFixed(2)}
    />
  </div>
</div>
  <div>
  <label className="flex items-center gap-3 rounded-xl border border-gray-300 p-4">
    <input
      type="checkbox"
      name="is_paid"
      value="true"
      className="h-4 w-4"
    />

    <span className="font-semibold">
      שולם
    </span>
  </label>
</div>


      <div>
        <label className="mb-2 block text-sm font-bold">
          סטטוס
        </label>

        <select
          name="status"
          defaultValue="reserved"
          className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3"
        >
          <option value="quote">
            הצעת מחיר
          </option>

          <option value="reserved">
            שמורה
          </option>

          <option value="active">
            בהשכרה
          </option>

          <option value="returned">
            הוחזרה
          </option>

          <option value="cancelled">
            בוטלה
          </option>
        </select>
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
        שמירת השכרה
      </button>
    </form>
  );
}