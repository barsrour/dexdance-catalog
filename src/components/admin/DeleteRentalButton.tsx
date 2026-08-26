"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  rentalId: string;
  customerName?: string;
  deleteAction: (id: string) => Promise<{ success: boolean }>;
};

export default function DeleteRentalButton({
  rentalId,
  customerName,
  deleteAction,
}: Props) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(
      `האם את בטוחה שברצונך למחוק את ההשכרה${
        customerName ? ` של ${customerName}` : ""
      }?\n\nלא ניתן לבטל פעולה זו.`
    );

    if (!confirmed) return;

    setIsDeleting(true);

    try {
      await deleteAction(rentalId);
      router.refresh();
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "הייתה שגיאה במחיקת ההשכרה."
      );

      setIsDeleting(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isDeleting}
      className="rounded-xl border border-red-300 px-4 py-2 font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
    >
      {isDeleting ? "מוחקת..." : "מחיקת השכרה"}
    </button>
  );
}