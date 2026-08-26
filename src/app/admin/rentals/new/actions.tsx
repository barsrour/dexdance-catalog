"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/src/utils/supabase/server";

type RentalItemInput = {
  costumeId: string;
  quantity: number;
  unitPrice: number;
};
async function getAvailableQuantity(
  supabase: any,
  costumeId: string,
  startDate: string,
  endDate: string
) {
  const { data: costume, error: costumeError } =
    await supabase
      .from("costumes")
      .select("name, total_quantity")
      .eq("id", costumeId)
      .single();

  if (costumeError || !costume) {
    throw new Error("התלבושת לא נמצאה");
  }

  const { data: rentalItems, error: rentalItemsError } =
    await supabase
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

  if (rentalItemsError) {
    throw new Error(rentalItemsError.message);
  }

  const occupied = (rentalItems ?? []).reduce(
    (total: number, row: any) => {
      const rental = row.rentals;

      if (!rental) return total;

      const blocksInventory =
        rental.status === "reserved" ||
        rental.status === "active";

      const overlaps =
        rental.start_date <= endDate &&
        rental.end_date >= startDate;

      return blocksInventory && overlaps
        ? total + Number(row.quantity)
        : total;
    },
    0
  );

  return {
    name: costume.name,
    available: Math.max(
      costume.total_quantity - occupied,
      0
    ),
  };
}
export async function createRental(
  formData: FormData
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("אין הרשאה");
  }

  const customerId = String(
    formData.get("customer_id") ?? ""
  );

  const startDate = String(
    formData.get("start_date") ?? ""
  );

  const endDate = String(
    formData.get("end_date") ?? ""
  );

  const status = String(
    formData.get("status") ?? "reserved"
  );

  if (
    !customerId ||
    !startDate ||
    !endDate
  ) {
    throw new Error(
      "חסרים פרטים להשכרה"
    );
  }

  if (endDate < startDate) {
    throw new Error(
      "תאריך ההחזרה לא יכול להיות לפני תאריך היציאה"
    );
  }

  const itemsValue =
    formData.get("items");

  let items: RentalItemInput[] = [];
for (const item of items) {
  const { data: costume, error } = await supabase
    .from("costumes")
    .select("name, total_quantity")
    .eq("id", item.costumeId)
    .single();

  if (error || !costume) {
    throw new Error("אחת התלבושות שנבחרו לא נמצאה");
  }

  if (item.quantity > costume.total_quantity) {
    throw new Error(
      `לא ניתן להשכיר ${item.quantity} יחידות של ${costume.name}. במלאי קיימות רק ${costume.total_quantity}.`
    );
  }
}
for (const item of items) {
  const availability =
    await getAvailableQuantity(
      supabase,
      item.costumeId,
      startDate,
      endDate
    );

  if (item.quantity > availability.available) {
    throw new Error(
      `אין מספיק יחידות של "${availability.name}". ` +
        `לתאריכים שנבחרו זמינות רק ${availability.available} יחידות.`
    );
  }
}
  if (
    typeof itemsValue === "string"
  ) {
    try {
      items = JSON.parse(
        itemsValue
      );
    } catch {
      items = [];
    }
  }

  items = items.filter(
    (item) =>
      item.costumeId &&
      item.quantity > 0
  );

  if (items.length === 0) {
    throw new Error(
      "יש לבחור לפחות תלבושת אחת"
    );
  }
const priceBeforeVat = Number(
  formData.get("price_before_vat") ?? 0
);

const addVat =
  formData.get("add_vat") === "true";

const priceAfterVat = addVat
  ? priceBeforeVat * 1.18
  : priceBeforeVat;
  const {
    
    data: rental,
    error: rentalError,
    
  } = await supabase
    .from("rentals")
    .insert({
      customer_id: customerId,
      start_date: startDate,
      end_date: endDate,
      status,
      price_before_vat: priceBeforeVat,
price_after_vat: priceAfterVat,
add_vat: addVat,
is_paid: formData.get("is_paid") === "true",
      notes: String(
        formData.get(
          "notes"
        ) ?? ""
      ).trim(),
    })
    .select("id")
    .single();

  if (
    rentalError ||
    !rental
  ) {
    throw new Error(
      rentalError?.message ??
        "לא הצלחנו ליצור השכרה"
    );
  }

  const rentalItems =
    items.map((item) => ({
      rental_id: rental.id,
      costume_id:
        item.costumeId,
      quantity:
        item.quantity,
      unit_price:
        item.unitPrice,
    }));

  const {
    error: itemsError,
  } = await supabase
    .from("rental_items")
    .insert(rentalItems);

  if (itemsError) {
    await supabase
      .from("rentals")
      .delete()
      .eq("id", rental.id);

    throw new Error(
      itemsError.message
    );
  }

  redirect("/admin/rentals");
}
