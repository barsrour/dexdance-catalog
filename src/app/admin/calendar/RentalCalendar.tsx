"use client";

import Link from "next/link";
import { useState } from "react";

type Rental = {
  id: string;
  start_date: string;
  end_date: string;
  status: string;

  customers:
    | {
        full_name: string;
      }
    | {
        full_name: string;
      }[]
    | null;

  rental_items: {
    quantity: number;

    costumes:
      | {
          name: string;
        }
      | {
          name: string;
        }[]
      | null;
  }[];
};

type Props = {
  rentals: Rental[];
};

const weekDays = [
  "א׳",
  "ב׳",
  "ג׳",
  "ד׳",
  "ה׳",
  "ו׳",
  "ש׳",
];

const hebrewMonths = [
  "ינואר",
  "פברואר",
  "מרץ",
  "אפריל",
  "מאי",
  "יוני",
  "יולי",
  "אוגוסט",
  "ספטמבר",
  "אוקטובר",
  "נובמבר",
  "דצמבר",
];

function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    date.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export default function RentalCalendar({
  rentals,
}: Props) {
  const [currentDate, setCurrentDate] =
    useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(
    year,
    month,
    1
  ).getDay();

  const daysInMonth = new Date(
    year,
    month + 1,
    0
  ).getDate();

  function previousMonth() {
    setCurrentDate(
      new Date(year, month - 1, 1)
    );
  }

  function nextMonth() {
    setCurrentDate(
      new Date(year, month + 1, 1)
    );
  }

  function goToToday() {
    setCurrentDate(new Date());
  }

  const cells: (number | null)[] = [];

  for (let i = 0; i < firstDay; i++) {
    cells.push(null);
  }

  for (
    let day = 1;
    day <= daysInMonth;
    day++
  ) {
    cells.push(day);
  }

  while (cells.length % 7 !== 0) {
    cells.push(null);
  }

  const today = formatDate(new Date());

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">

      {/* ניווט חודש */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={previousMonth}
          className="rounded-xl border border-gray-300 px-4 py-2 font-semibold"
        >
          → חודש קודם
        </button>

        <div className="text-center">
          <h2 className="text-2xl font-bold">
            {hebrewMonths[month]} {year}
          </h2>

          <button
            type="button"
            onClick={goToToday}
            className="mt-1 text-sm font-semibold text-red-600"
          >
            חזרה להיום
          </button>
        </div>

        <button
          type="button"
          onClick={nextMonth}
          className="rounded-xl border border-gray-300 px-4 py-2 font-semibold"
        >
          חודש הבא ←
        </button>
      </div>

      {/* שמות ימים */}
      <div className="grid grid-cols-7 border-b border-gray-200">
        {weekDays.map((day) => (
          <div
            key={day}
            className="p-2 text-center text-sm font-bold text-gray-500"
          >
            {day}
          </div>
        ))}
      </div>

      {/* ימים */}
      <div className="grid grid-cols-7">
        {cells.map((day, index) => {
          if (!day) {
            return (
              <div
                key={index}
                className="min-h-[130px] border-b border-l border-gray-100 bg-gray-50"
              />
            );
          }

          const date = new Date(
            year,
            month,
            day
          );

          const dateString =
            formatDate(date);

          const dayRentals =
            rentals.filter(
              (rental) =>
                rental.start_date <=
                  dateString &&
                rental.end_date >=
                  dateString
            );

          const isToday =
            dateString === today;

          return (
            <div
              key={dateString}
              className="min-h-[130px] border-b border-l border-gray-100 p-2"
            >
              <div
                className={`mb-2 flex h-7 w-7 items-center justify-center rounded-full text-sm font-semibold ${
                  isToday
                    ? "bg-red-600 text-white"
                    : "text-gray-700"
                }`}
              >
                {day}
              </div>

              <div className="space-y-1">
                {dayRentals.map(
                  (rental) => {
                    const customer =
                      Array.isArray(
                        rental.customers
                      )
                        ? rental.customers[0]
                        : rental.customers;

                    return (
                      <Link
                        key={rental.id}
                        href={`/admin/rentals/${rental.id}`}
                        className={`block rounded-lg px-2 py-1.5 text-xs font-semibold ${
                          rental.status ===
                          "active"
                            ? "bg-red-100 text-red-700"
                            : rental.status ===
                              "reserved"
                            ? "bg-yellow-100 text-yellow-700"
                            : rental.status ===
                              "returned"
                            ? "bg-green-100 text-green-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {customer?.full_name ??
                          "השכרה"}
                      </Link>
                    );
                  }
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}