"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  customerName: string;
  deleteAction: () => Promise<{ success: boolean }>;
};

export default function DeleteCustomerButton({
  customerName,
  deleteAction,
}: Props) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(
      `האם את בטוחה שאת רוצה למחוק את "${customerName}"?`
    );

    if (!confirmed) return;

    setIsDeleting(true);

    try {
      await deleteAction();
      router.refresh();
    } catch (error) {
      console.error(error);

     alert(
  error instanceof Error
    ? error.message
    : "הייתה שגיאה במחיקת הלקוחה."
);

      setIsDeleting(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isDeleting}
      className="rounded-lg border border-red-300 px-3 py-2 text-sm font-semibold text-red-600 disabled:opacity-50"
    >
      {isDeleting ? "מוחקת..." : "מחק"}
    </button>
  );
}