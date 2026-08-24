"use server";

import { createClient } from "@/src/utils/supabase/server";

export async function getCostumeAvailability(
  costumeId: string,
  startDate: string,
  endDate: string
) {
  if (!costumeId || !startDate || !endDate) {
    return null;
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("אין הרשאה");
  }

  // הכמות הכוללת של התלבושת
  const { data: costume, error: costumeError } = await supabase
    .from("costumes")
    .select("id, name, total_quantity")
    .eq("id", costumeId)
    .single();

  if (costumeError || !costume) {
    throw new Error("התלבושת לא נמצאה");
  }

  // כל פריטי ההשכרה של התלבושת
  const { data: rentalItems, error: itemsError } = await supabase
    .from("rental_items")
    .select(`
      quantity,
      rentals!inner (
        start_date,
        end_date,
        status
      )
    `)
    .eq("costume_id", costumeId);

  if (itemsError) {
    throw new Error(itemsError.message);
  }

  const rentedQuantity = (rentalItems ?? []).reduce(
    (total, item: any) => {
      const rental = item.rentals;

      if (!rental) return total;

      const blocksInventory =
        rental.status === "reserved" ||
        rental.status === "active";

      const datesOverlap =
        rental.start_date <= endDate &&
        rental.end_date >= startDate;

      if (blocksInventory && datesOverlap) {
        return total + Number(item.quantity);
      }

      return total;
    },
    0
  );

  const availableQuantity = Math.max(
    costume.total_quantity - rentedQuantity,
    0
  );

  return {
    totalQuantity: costume.total_quantity,
    rentedQuantity,
    availableQuantity,
  };
}