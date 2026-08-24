"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/src/utils/supabase/server";

export async function updateRental(
  id: string,
  formData: FormData
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("אין הרשאה");
  }

  const startDate = String(
    formData.get("start_date") ?? ""
  );

  const endDate = String(
    formData.get("end_date") ?? ""
  );

  if (!startDate || !endDate) {
    throw new Error("חובה להזין תאריכים");
  }

  if (endDate < startDate) {
    throw new Error(
      "תאריך ההחזרה לא יכול להיות לפני תאריך היציאה"
    );
  }

  const { error } = await supabase
    .from("rentals")
    .update({
      start_date: startDate,
      end_date: endDate,
      status: String(
        formData.get("status") ?? "reserved"
      ),
      is_paid:
        formData.get("is_paid") === "true",
      notes: String(
        formData.get("notes") ?? ""
      ).trim(),
    })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath(`/admin/rentals/${id}`);
  revalidatePath("/admin/rentals");
  revalidatePath("/");
}
type RentalItemInput = {
  costumeId: string;
  quantity: number;
  unitPrice: number;
};

export async function getEditAvailability(
  rentalId: string,
  costumeId: string,
  startDate: string,
  endDate: string
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("אין הרשאה");
  }

  const { data: costume, error: costumeError } = await supabase
    .from("costumes")
    .select("name, total_quantity")
    .eq("id", costumeId)
    .single();

  if (costumeError || !costume) {
    throw new Error("התלבושת לא נמצאה");
  }

  const { data: rentalItems, error: itemsError } = await supabase
    .from("rental_items")
    .select(`
      quantity,
      rentals!inner (
        id,
        start_date,
        end_date,
        status
      )
    `)
    .eq("costume_id", costumeId);

  if (itemsError) {
    throw new Error(itemsError.message);
  }

  const occupied = (rentalItems ?? []).reduce(
    (total: number, row: any) => {
      const relatedRental = Array.isArray(row.rentals)
        ? row.rentals[0]
        : row.rentals;

      if (!relatedRental) return total;

      // לא סופרים את ההשכרה שאנחנו עורכים עכשיו
      if (relatedRental.id === rentalId) {
        return total;
      }

      const blocksInventory =
        relatedRental.status === "reserved" ||
        relatedRental.status === "active";

      const overlaps =
        relatedRental.start_date <= endDate &&
        relatedRental.end_date >= startDate;

      if (blocksInventory && overlaps) {
        return total + Number(row.quantity);
      }

      return total;
    },
    0
  );

  return {
    totalQuantity: Number(costume.total_quantity),
    occupiedQuantity: occupied,
    availableQuantity: Math.max(
      Number(costume.total_quantity) - occupied,
      0
    ),
  };
}
export async function updateRentalItems(
  rentalId: string,
  startDate: string,
  endDate: string,
  formData: FormData
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("אין הרשאה");
  }

  const itemsValue = formData.get("items");

  let items: RentalItemInput[] = [];

  if (typeof itemsValue === "string") {
    try {
      items = JSON.parse(itemsValue);
    } catch {
      items = [];
    }
  }

  items = items.filter(
    (item) =>
      item.costumeId &&
      Number(item.quantity) > 0
  );

  if (items.length === 0) {
    throw new Error("חייבת להיות לפחות תלבושת אחת בהשכרה");
  }

  // בדיקת זמינות אמיתית לפני השמירה
  for (const item of items) {
    const availability = await getEditAvailability(
      rentalId,
      item.costumeId,
      startDate,
      endDate
    );

    if (
      Number(item.quantity) >
      availability.availableQuantity
    ) {
      const { data: costume } = await supabase
        .from("costumes")
        .select("name")
        .eq("id", item.costumeId)
        .single();

      throw new Error(
        `אין מספיק יחידות של "${costume?.name ?? "התלבושת"}". ` +
          `לתאריכים האלה זמינות רק ${availability.availableQuantity}.`
      );
    }
  }

  // אחרי שכל הבדיקות עברו - מחליפים את הפריטים
  const { error: deleteError } = await supabase
    .from("rental_items")
    .delete()
    .eq("rental_id", rentalId);

  if (deleteError) {
    throw new Error(deleteError.message);
  }

  const rows = items.map((item) => ({
    rental_id: rentalId,
    costume_id: item.costumeId,
    quantity: Number(item.quantity),
    unit_price: Number(item.unitPrice),
  }));

  const { error: insertError } = await supabase
    .from("rental_items")
    .insert(rows);

  if (insertError) {
    throw new Error(insertError.message);
  }

  const priceBeforeVat = items.reduce(
    (sum, item) =>
      sum + Number(item.quantity) * Number(item.unitPrice),
    0
  );

  const priceAfterVat = priceBeforeVat * 1.18;

  const { error: rentalError } = await supabase
    .from("rentals")
    .update({
      price_before_vat: priceBeforeVat,
      price_after_vat: priceAfterVat,
    })
    .eq("id", rentalId);

  if (rentalError) {
    throw new Error(rentalError.message);
  }

  revalidatePath(`/admin/rentals/${rentalId}`);
  revalidatePath("/admin/rentals");
  revalidatePath("/");
}