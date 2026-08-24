import { createClient } from "@/src/utils/supabase/server";
import RentalCalendar from "@/src/app/admin/calendar/RentalCalendar";

export default async function CalendarPage() {
  const supabase = await createClient();

  const { data: rentals, error } = await supabase
    .from("rentals")
    .select(`
      id,
      start_date,
      end_date,
      status,
      customers (
        full_name
      ),
      rental_items (
        quantity,
        costumes (
          name
        )
      )
    `)
    .neq("status", "cancelled")
    .order("start_date");

  if (error) {
    console.error("Calendar rentals error:", error);
  }

  return (
    <div dir="rtl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">
          לוח השכרות
        </h1>

        <p className="mt-1 text-gray-500">
          צפייה בכל ההשכרות לפי תאריך
        </p>
      </div>

      <RentalCalendar rentals={rentals ?? []} />
    </div>
  );
}