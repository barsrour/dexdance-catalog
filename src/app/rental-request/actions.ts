"use server";

import { createClient } from "@/src/utils/supabase/server";

type RentalRequestItem = {
  costumeId: string;
  quantity: number;
};

type SubmitRentalRequestInput = {
  name: string;
  phone: string;
  startDate: string;
  endDate: string;
  notes: string;
  items: RentalRequestItem[];

  forceSubmit?: boolean;
};

export async function submitRentalRequest(
  input: SubmitRentalRequestInput
) {
  const supabase = await createClient();

  const name = input.name.trim();
  const phone = input.phone.trim();
  const startDate = input.startDate;
  const endDate = input.endDate;
  const notes = input.notes.trim();

  if (!name) {
    throw new Error("יש להזין שם.");
  }

  if (!phone) {
    throw new Error("יש להזין מספר טלפון.");
  }

  if (!startDate || !endDate) {
    throw new Error("יש לבחור תאריכי השכרה.");
  }

  if (endDate < startDate) {
    throw new Error(
      "תאריך ההחזרה לא יכול להיות לפני תאריך היציאה."
    );
  }

  if (input.items.length === 0) {
    throw new Error(
      "לא נוספו תלבושות לבקשת ההשכרה."
    );
  }
const costumeIds = input.items.map(
  (item) => item.costumeId
);

const { data: availability, error: availabilityError } =
  await supabase.rpc(
    "get_costume_availability_for_dates",
    {
      p_costume_ids: costumeIds,
      p_start_date: startDate,
      p_end_date: endDate,
    }
  );

if (availabilityError) {
  console.error(
    "Availability check error:",
    availabilityError
  );

  throw new Error(
    "לא הצלחנו לבדוק את זמינות התלבושות."
  );
}

const availabilityWarnings = input.items
  .map((item) => {
    const costumeAvailability =
      availability?.find(
        (row: any) =>
          row.costume_id === item.costumeId
      );

    if (!costumeAvailability) {
      return null;
    }

    const availableQuantity = Number(
      costumeAvailability.available_quantity ?? 0
    );

    if (item.quantity <= availableQuantity) {
      return null;
    }

    return {
      costumeId: item.costumeId,
      costumeName:
        costumeAvailability.costume_name ??
        "תלבושת",
      requestedQuantity: item.quantity,
      availableQuantity,
    };
  })
  .filter(
    (
      warning
    ): warning is {
      costumeId: string;
      costumeName: string;
      requestedQuantity: number;
      availableQuantity: number;
    } => warning !== null
  );
  if (
  availabilityWarnings.length > 0 &&
  !input.forceSubmit
) {
  return {
    success: false as const,
    availabilityWarnings,
  };
}
  // מנרמלים טלפון כדי להקטין סיכוי לכפילויות
  const normalizedPhone = phone.replace(
    /[\s\-()]/g,
    ""
  );

  // חיפוש לקוחה קיימת לפי טלפון
  const { data: existingCustomer, error: customerSearchError } =
    await supabase
      .from("customers")
      .select("*")
      .eq("phone", normalizedPhone)
      .maybeSingle();

  if (customerSearchError) {
    console.error(customerSearchError);

    throw new Error(
      "הייתה שגיאה בבדיקת פרטי הלקוחה."
    );
  }

  let customerId = existingCustomer?.id;

  // אם אין לקוחה כזאת - יוצרים אותה
  if (!customerId) {
    const { data: newCustomer, error: customerInsertError } =
      await supabase
        .from("customers")
        .insert({
  full_name: name,
  phone: normalizedPhone,
})
        .select("id")
        .single();

    if (customerInsertError || !newCustomer) {
      console.error(customerInsertError);

      throw new Error(
        "לא הצלחנו לשמור את פרטי הלקוחה."
      );
    }

    customerId = newCustomer.id;
  }

  // יוצרים את בקשת ההשכרה
  const { data: rental, error: rentalError } =
    await supabase
      .from("rentals")
      .insert({
        has_availability_warning:
  Boolean(input.forceSubmit) &&
  availabilityWarnings.length > 0,
  availability_warning_details:
  Boolean(input.forceSubmit) &&
  availabilityWarnings.length > 0
    ? availabilityWarnings
    : [],
        customer_id: customerId,
        start_date: startDate,
        end_date: endDate,

        status: "quote",

        price_before_vat: 0,
        price_after_vat: 0,

        is_paid: false,
        add_vat: false,

        notes: notes || null,

        request_source: "public_catalog",
      })
     .select("id, request_number")
.single();

  if (rentalError || !rental) {
    console.error(rentalError);

    throw new Error(
      "לא הצלחנו ליצור את בקשת ההשכרה."
    );
  }

  const rentalItems = input.items.map((item) => ({
    rental_id: rental.id,
    costume_id: item.costumeId,
    quantity: item.quantity,

    // המחיר יוזן על ידך באדמין
    unit_price: 0,
  }));

  const { error: itemsError } = await supabase
    .from("rental_items")
    .insert(rentalItems);

  if (itemsError) {
    console.error(itemsError);

    // אם הכנסת הפריטים נכשלה,
    // מוחקים את ההשכרה הריקה
    await supabase
      .from("rentals")
      .delete()
      .eq("id", rental.id);

    throw new Error(
      "לא הצלחנו לשמור את התלבושות בבקשה."
    );
  }

  return {
  success: true,
  rentalId: rental.id,
  requestNumber: rental.request_number,
};
}