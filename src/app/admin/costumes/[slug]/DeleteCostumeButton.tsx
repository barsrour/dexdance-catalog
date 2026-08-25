"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  costumeName: string;
  deleteAction: () => Promise<{ success: boolean }>;
  size?: "normal" | "small";
};

export default function DeleteCostumeButton({
  costumeName,
  deleteAction,
  size = "normal",
}: Props) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(
      `האם את בטוחה שאת רוצה למחוק את "${costumeName}"?\n\nלא ניתן לבטל את הפעולה.`
    );

    if (!confirmed) return;

    setIsDeleting(true);

    try {
      await deleteAction();

      router.push("/admin/costumes");
      router.refresh();
    } catch (error) {
      console.error("Delete error:", error);
      alert("הייתה שגיאה במחיקת התלבושת.");
      setIsDeleting(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isDeleting}
      
       className={
  size === "small"
    ? "rounded-lg border border-red-200 px-3 py-2 text-sm text-red-600 disabled:opacity-50"
    : "rounded-xl border border-red-300 px-46 py-5 font-bold text-red-600 disabled:opacity-50"
}
    >
     {isDeleting
  ? "מוחקת..."
  : size === "small"
  ? "מחק"
  : "מחיקת תלבושת"}
    </button>
  );
}