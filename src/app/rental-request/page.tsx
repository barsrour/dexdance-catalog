"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import {
  RentalCartItem,
  getRentalCart,
  removeFromRentalCart,
  updateRentalCartQuantity,
} from "@/src/lib/rentalCart";
import { submitRentalRequest } from "./actions";

export default function RentalRequestPage() {
  const [items, setItems] = useState<
    RentalCartItem[]
  >([]);

  const refreshCart = () => {
    setItems(getRentalCart());
  };
const [name, setName] = useState("");
const [phone, setPhone] = useState("");
const [startDate, setStartDate] = useState("");
const [endDate, setEndDate] = useState("");
const [notes, setNotes] = useState("");

const [isSubmitting, setIsSubmitting] =
  useState(false);

const [error, setError] = useState("");
const [success, setSuccess] = useState(false);

type AvailabilityWarning = {
  costumeId: string;
  costumeName: string;
  requestedQuantity: number;
  availableQuantity: number;
};

const [
  availabilityWarnings,
  setAvailabilityWarnings,
] = useState<AvailabilityWarning[]>([]);

  useEffect(() => {
    refreshCart();

    window.addEventListener(
      "rental-cart-updated",
      refreshCart
    );

    return () => {
      window.removeEventListener(
        "rental-cart-updated",
        refreshCart
      );
    };
  }, []);
const [requestNumber, setRequestNumber] = useState<number | null>(null);
const sendRentalRequest = async (
  forceSubmit = false
) => {
  const result = await submitRentalRequest({
    name,
    phone,
    startDate,
    endDate,
    notes,
    forceSubmit,

    items: items.map((item) => ({
      costumeId: item.costumeId,
      quantity: item.quantity,
    })),
  });

  if (
    !result.success &&
    result.availabilityWarnings
  ) {
    setAvailabilityWarnings(
      result.availabilityWarnings
    );

    return false;
  }

  if (result.success) {
    setRequestNumber(result.requestNumber);

    localStorage.removeItem(
      "dex-rental-cart"
    );

    window.dispatchEvent(
      new CustomEvent(
        "rental-cart-updated"
      )
    );

    setItems([]);
    setAvailabilityWarnings([]);
    setSuccess(true);

    return true;
  }

  return false;
};
const handleSubmit = async (
  event: FormEvent<HTMLFormElement>
) => {
  event.preventDefault();

  setError("");

  if (!name.trim()) {
    setError("יש להזין שם.");
    return;
  }

  if (!phone.trim()) {
    setError("יש להזין מספר טלפון.");
    return;
  }

  if (!startDate || !endDate) {
    setError(
      "יש לבחור תאריך יציאה ותאריך החזרה."
    );
    return;
  }

  if (endDate < startDate) {
    setError(
      "תאריך ההחזרה לא יכול להיות לפני תאריך היציאה."
    );
    return;
  }

 try {
  setIsSubmitting(true);

  await sendRentalRequest(false);
} catch (error) {
  setError(
    error instanceof Error
      ? error.message
      : "הייתה שגיאה בשליחת הבקשה."
  );
} finally {
  setIsSubmitting(false);
  }
};
const formatWhatsAppDate = (date: string) => {
  if (!date) return "";

  const [year, month, day] = date.split("-");

  return `${day}/${month}/${year}`;
};

const whatsappMessage = `היי, שלחתי בקשת השכרה דרך קטלוג dex.dance 🛒

שם: ${name}
טלפון: ${phone}
תאריכי השכרה: ${formatWhatsAppDate(startDate)} - ${formatWhatsAppDate(endDate)}
מספר בקשה: #${requestNumber}

הבקשה כבר נשמרה במערכת.`;

const whatsappUrl = `https://wa.me/972547276767?text=${encodeURIComponent(
  whatsappMessage
)}`;
if (availabilityWarnings.length > 0) {
  return (
    <main
      dir="rtl"
      className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-8 text-black"
    >
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-sm">
        <div className="text-center">
          <div className="text-4xl">
            ⚠️
          </div>

          <h1 className="mt-3 text-2xl font-bold">
            שימי לב
          </h1>

          <p className="mt-2 text-gray-600">
            חלק מהתלבושות אינן זמינות
            בכמות שביקשת בתאריכים שבחרת.
          </p>
        </div>

        <div className="mt-6 space-y-3">
          {availabilityWarnings.map(
            (warning) => (
              <div
                key={warning.costumeId}
                className="rounded-xl bg-yellow-50 p-4"
              >
                <p className="font-bold">
                  {warning.costumeName}
                </p>

                <div className="mt-2 text-sm text-gray-700">
                  <p>
                    ביקשת:{" "}
                    <strong>
                      {warning.requestedQuantity}
                    </strong>
                  </p>

                  <p>
                    זמין בתאריכים שבחרת:{" "}
                    <strong>
                      {warning.availableQuantity}
                    </strong>
                  </p>
                </div>
              </div>
            )
          )}
        </div>

        <div className="mt-5 rounded-xl bg-gray-50 p-4 text-sm text-gray-600">
          תקופת ההשכרה:{" "}
          <strong>
            {formatWhatsAppDate(startDate)}
            {" - "}
            {formatWhatsAppDate(endDate)}
          </strong>
        </div>

        <p className="mt-5 text-center text-sm text-gray-600">
          האם ברצונך לשלוח את הבקשה בכל
          זאת?
          <br />
          נבדוק אם ניתן למצוא עבורך פתרון
          חלופי.
        </p>

        {error && (
          <div className="mt-4 rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700">
            {error}
          </div>
        )}

        <button
          type="button"
          disabled={isSubmitting}
          onClick={async () => {
            try {
              setError("");
              setIsSubmitting(true);

              await sendRentalRequest(true);
            } catch (error) {
              setError(
                error instanceof Error
                  ? error.message
                  : "הייתה שגיאה בשליחת הבקשה."
              );
            } finally {
              setIsSubmitting(false);
            }
          }}
          className="mt-6 w-full rounded-xl bg-red-600 px-5 py-3 font-bold text-white disabled:bg-gray-300"
        >
          {isSubmitting
            ? "שולח בקשה..."
            : "שליחה בכל זאת"}
        </button>

        <button
          type="button"
          onClick={() =>
            setAvailabilityWarnings([])
          }
          className="mt-3 w-full rounded-xl border border-gray-300 px-5 py-3 font-bold"
        >
          עריכת הבקשה
        </button>
      </div>
    </main>
  );
}
if (success) {
  return (
    <main
      dir="rtl"
      className="flex min-h-screen items-center justify-center bg-gray-50 px-4 text-black"
    >
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">
        <div className="text-5xl">
          ✓
        </div>

        <h1 className="mt-4 text-2xl font-bold">
          הבקשה נשמרה בהצלחה!
        </h1>

        <p className="mt-3 leading-7 text-gray-600">
          קיבלנו את בקשת ההשכרה שלך.
          כדי שנוכל לטפל בה במהירות, שלחו לנו
          הודעה ב-WhatsApp.
        </p>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-3 font-bold text-white transition hover:bg-green-700"
        >
          <span>💬</span>
          שליחת הבקשה ב-WhatsApp
        </a>

        <p className="mt-3 text-xs text-gray-400">
          ההודעה כבר מוכנה – נשאר רק ללחוץ על שליחה ב-WhatsApp.
        </p>

        <Link
          href="/"
          className="mt-5 inline-block w-full rounded-xl border border-gray-300 px-5 py-3 font-bold text-gray-700"
        >
          חזרה לקטלוג
        </Link>
      </div>
    </main>
  );
}
  return (
    <main
      dir="rtl"
      className="min-h-screen bg-gray-50 px-4 py-6 text-black"
    >
      <div className="mx-auto max-w-3xl">
        <Link
          href="/"
          className="text-sm font-semibold text-red-600"
        >
          ← המשך לקטלוג
        </Link>

        <h1 className="mt-5 text-2xl font-bold">
          בקשת ההשכרה שלי
        </h1>

        {items.length === 0 ? (
          <div className="mt-6 rounded-2xl bg-white p-8 text-center shadow-sm">
            <p className="font-bold">
              עדיין לא הוספת תלבושות
            </p>

            <Link
              href="/"
              className="mt-4 inline-block rounded-xl bg-red-600 px-5 py-3 font-bold text-white"
            >
              חזרה לקטלוג
            </Link>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {items.map((item) => (
              <div
                key={item.costumeId}
                className="flex gap-4 rounded-2xl bg-white p-4 shadow-sm"
              >
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-28 w-24 rounded-xl object-cover"
                  />
                ) : (
                  <div className="h-28 w-24 rounded-xl bg-gray-100" />
                )}

                <div className="min-w-0 flex-1">
                  <Link
                    href={`/costume/${item.slug}`}
                    className="font-bold"
                  >
                    {item.name}
                  </Link>

                  <div className="mt-4 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        updateRentalCartQuantity(
                          item.costumeId,
                          item.quantity - 1
                        );
                      }}
                      className="flex h-8 w-8 items-center justify-center rounded-full border"
                    >
                      −
                    </button>

                    <input
  type="number"
  min={1}
  max={item.maxQuantity}
  value={item.quantity}
  onChange={(e) => {
    const value = Number(e.target.value);

    if (Number.isNaN(value)) return;

    updateRentalCartQuantity(
      item.costumeId,
      Math.max(
        1,
        Math.min(value, item.maxQuantity)
      )
    );
  }}
  className="h-8 w-16 rounded-lg border border-gray-300 text-center font-bold outline-none focus:border-red-600"
/>

                    <button
                      type="button"
                      onClick={() => {
                        updateRentalCartQuantity(
                          item.costumeId,
                          item.quantity + 1
                        );
                      }}
                      className="flex h-8 w-8 items-center justify-center rounded-full border"
                    >
                      +
                    </button>
                  </div>

                  <p className="mt-2 text-xs text-gray-500">
                    עד {item.maxQuantity} יחידות
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      removeFromRentalCart(
                        item.costumeId
                      )
                    }
                    className="mt-3 text-sm font-semibold text-red-600"
                  >
                    הסרה
                  </button>
                </div>
              </div>
            ))}

            <form
  onSubmit={handleSubmit}
  className="rounded-2xl bg-white p-5 shadow-sm"
>
  <h2 className="text-xl font-bold">
    פרטי בקשת ההשכרה
  </h2>

  <p className="mt-1 text-sm text-gray-500">
    מלאו את הפרטים ונחזור אליכם עם הצעת מחיר.
  </p>

  <div className="mt-5 grid gap-4 md:grid-cols-2">
    <div>
      <label className="mb-1 block text-sm font-semibold">
        שם *
      </label>

      <input
        type="text"
        required
        value={name}
        onChange={(e) =>
          setName(e.target.value)
        }
        placeholder="שם מלא"
        className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-red-600"
      />
    </div>

    <div>
      <label className="mb-1 block text-sm font-semibold">
        טלפון *
      </label>

      <input
        type="tel"
        required
        value={phone}
        onChange={(e) =>
          setPhone(e.target.value)
        }
        placeholder="05X-XXXXXXX"
        inputMode="tel"
        className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-red-600"
      />
    </div>

    <div>
      <label className="mb-1 block text-sm font-semibold">
        תאריך יציאה *
      </label>

      <input
        type="date"
        required
        value={startDate}
        onChange={(e) =>
          setStartDate(e.target.value)
        }
        className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-red-600"
      />
    </div>

    <div>
      <label className="mb-1 block text-sm font-semibold">
        תאריך החזרה *
      </label>

      <input
        type="date"
        required
        value={endDate}
        min={startDate || undefined}
        onChange={(e) =>
          setEndDate(e.target.value)
        }
        className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-red-600"
      />
    </div>
  </div>

  <div className="mt-4">
    <label className="mb-1 block text-sm font-semibold">
      הערות
      <span className="mr-1 font-normal text-gray-400">
        (לא חובה)
      </span>
    </label>

    <textarea
      value={notes}
      onChange={(e) =>
        setNotes(e.target.value)
      }
      rows={4}
      placeholder="לדוגמה: התלבושות מיועדות למופע, בקשה מיוחדת למידות וכו׳"
      className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-red-600"
    />
  </div>

  {error && (
    <div className="mt-4 rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700">
      {error}
    </div>
  )}

  <button
    type="submit"
    disabled={isSubmitting}
    className="mt-5 w-full rounded-xl bg-red-600 px-5 py-3 font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-gray-300"
  >
    {isSubmitting
      ? "שולח בקשה..."
      : "בקש הצעת מחיר"}
  </button>

  <p className="mt-3 text-center text-xs text-gray-400">
    שליחת הבקשה אינה מהווה אישור להשכרה.
    לאחר בדיקת הזמינות תישלח הצעת מחיר.
  </p>
</form>
          </div>
        )}
           </div>
    </main>
  );
}