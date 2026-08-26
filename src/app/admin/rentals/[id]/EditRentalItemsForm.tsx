"use client";

import { useState } from "react";
import { getEditAvailability } from "@/src/app/admin/rentals/actions";
import CostumeSearchSelect from "@/src/components/admin/CostumeSearchSelect";

type Costume = {
  id: string;
  name: string;
  total_quantity: number;
};

type Item = {
  costumeId: string;
  quantity: number;
  unitPrice: number;
};

type AvailabilityInfo = {
  totalQuantity: number;
  occupiedQuantity: number;
  availableQuantity: number;
};

type Props = {
  rentalId: string;
  startDate: string;
  endDate: string;
  costumes: Costume[];
  initialItems: Item[];
  saveItems: (formData: FormData) => Promise<void>;
  addVatInitial: boolean;
};

export default function EditRentalItemsForm({
  rentalId,
  startDate,
  endDate,
  costumes,
  initialItems,
  addVatInitial,
  saveItems,
}: Props) {
  const [items, setItems] = useState<Item[]>(initialItems);
const [showVat, setShowVat] = useState(addVatInitial);
  const [availability, setAvailability] = useState<
    Record<string, AvailabilityInfo>
  >({});

const priceBeforeVat = items.reduce(
  (sum, item) => sum + item.quantity * item.unitPrice,
  0
);

const priceAfterVat = priceBeforeVat * 1.18;

  async function loadAvailability(costumeId: string) {
    if (!costumeId) return;

    const result = await getEditAvailability(
      rentalId,
      costumeId,
      startDate,
      endDate
    );

    setAvailability((current) => ({
      ...current,
      [costumeId]: result,
    }));
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
    changes: Partial<Item>
  ) {
    setItems((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index
          ? { ...item, ...changes }
          : item
      )
    );
  }

  return (
    <form
      action={saveItems}
      className="space-y-6 rounded-2xl bg-white p-6 shadow-sm"
    >
      <input
        type="hidden"
        name="items"
        value={JSON.stringify(items)}
      />

      <div>
        <h2 className="text-xl font-bold">
          עריכת התלבושות בהשכרה
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          שינוי התלבושות יעדכן אוטומטית את המחיר ואת המלאי.
        </p>
      </div>

      <div className="space-y-4">
        {items.map((item, index) => {
          const selectedCostume = costumes.find(
            (costume) => costume.id === item.costumeId
          );

          const availabilityInfo =
            availability[item.costumeId];

          const maxQuantity =
            availabilityInfo?.availableQuantity ??
            selectedCostume?.total_quantity ??
            0;

          return (
            <div
              key={index}
              className="rounded-xl border border-gray-200 p-4"
            >
              <div className="grid gap-4 md:grid-cols-[1fr_120px_150px_auto]">

                {/* תלבושת */}
                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    תלבושת
                  </label>

                 <CostumeSearchSelect
  costumes={costumes}
  value={item.costumeId}
  onChange={async (costumeId) => {
    updateItem(index, {
      costumeId,
      quantity: 1,
    });

    if (costumeId) {
      await loadAvailability(costumeId);
    }
  }}
/>
                </div>

                {/* כמות */}
                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    כמות
                  </label>

                  <input
                    type="number"
                    min="1"
                    max={maxQuantity || undefined}
                    value={item.quantity}
                    disabled={!item.costumeId}
                    onFocus={() => {
                      if (
                        item.costumeId &&
                        !availability[item.costumeId]
                      ) {
                        loadAvailability(item.costumeId);
                      }
                    }}
                    onChange={(e) => {
                      const value = Number(e.target.value);

                      const safeValue =
                        maxQuantity > 0
                          ? Math.min(
                              Math.max(value, 1),
                              maxQuantity
                            )
                          : Math.max(value, 1);

                      updateItem(index, {
                        quantity: safeValue,
                      });
                    }}
                    className="w-full rounded-xl border border-gray-300 px-3 py-3 disabled:bg-gray-100"
                  />

                  {availabilityInfo && (
                    <p className="mt-1 text-xs text-green-700">
                      זמינות:{" "}
                      {availabilityInfo.availableQuantity}
                    </p>
                  )}
                </div>

                {/* מחיר */}
                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    מחיר ליחידה
                  </label>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.unitPrice}
                    onChange={(e) =>
                      updateItem(index, {
                        unitPrice: Number(e.target.value),
                      })
                    }
                    className="w-full rounded-xl border border-gray-300 px-3 py-3"
                  />
                </div>

                {/* הסרה */}
                <div className="flex items-end">
                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="rounded-xl border border-red-200 px-3 py-3 text-sm text-red-600"
                    >
                      הסרה
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={addItem}
        className="rounded-xl border border-gray-300 px-4 py-2 font-semibold"
      >
        + הוספת תלבושת להשכרה
      </button>

      {/* סיכום מחיר */}
     <div className="rounded-xl bg-gray-50 p-4">
  <div>
    <p className="text-sm text-gray-500">
      מחיר לפני מע״מ
    </p>

    <p className="text-xl font-bold">
      ₪{priceBeforeVat.toFixed(2)}
    </p>
  </div>

  <label className="mt-4 flex cursor-pointer items-center gap-3 rounded-xl border border-gray-300 bg-white p-4">
<input
  type="checkbox"
  name="add_vat"
  value="true"
  defaultChecked={addVatInitial}
  onChange={(e) => setShowVat(e.target.checked)}
  className="h-4 w-4"
/>

    <span className="font-semibold">
      הוסף מע״מ
    </span>
  </label>

 {showVat && (
    <div className="mt-4 border-t border-gray-200 pt-4">
      <p className="text-sm text-gray-500">
        מחיר אחרי מע״מ
      </p>

      <p className="text-xl font-bold">
        ₪{priceAfterVat.toFixed(2)}
      </p>
    </div>
  )}
</div>

      <button
        type="submit"
        className="w-full rounded-xl bg-red-600 px-5 py-3 font-bold text-white"
      >
        שמירת התלבושות
      </button>
    </form>
  );
}