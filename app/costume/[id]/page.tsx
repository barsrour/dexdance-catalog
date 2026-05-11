import { costumes } from "@/data/costumes";
import Link from "next/link";
import { notFound } from "next/navigation";
import ImageGallery from "@/components/ImagesGallery";

export default async function CostumePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const costume = costumes.find((item) => item.id === id);

  if (!costume) {
    return notFound();
  }

  return (
    <main dir="rtl" className="min-h-screen bg-white px-5 py-6 text-black">
<Link
  href="/"
  className="mb-5 inline-block text-sm font-semibold text-red-600"
>
  ← חזרה לקטלוג
</Link>
      <ImageGallery images={costume.images} name={costume.name} />
     <section className="mt-5 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
  <h1 className="text-2xl font-bold text-black">{costume.name}</h1>

  <div className="mt-3 flex gap-2">
    <span className="rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white">
      {costume.ageRange}
    </span>

    <span className="rounded-full bg-black px-3 py-1 text-xs font-semibold text-white">
      כמות: {costume.quantity}
    </span>
  </div>

  <div className="mt-5 space-y-4">
    <div>
      <h2 className="mb-2 text-sm font-bold text-red-600">צבעים</h2>
      <div className="flex flex-wrap gap-2">
        {costume.colors.map((color) => (
          <span
            key={color}
            className="rounded-full border border-gray-200 px-3 py-1 text-xs text-gray-700"
          >
            {color}
          </span>
        ))}
      </div>
    </div>

    <div>
      <h2 className="mb-2 text-sm font-bold text-red-600">סוג בגד</h2>
      <div className="flex flex-wrap gap-2">
        {costume.clothingTypes.map((type) => (
          <span
            key={type}
            className="rounded-full border border-gray-200 px-3 py-1 text-xs text-gray-700"
          >
            {type}
          </span>
        ))}
      </div>
    </div>

    <div>
      <h2 className="mb-2 text-sm font-bold text-red-600">סגנון</h2>
      <div className="flex flex-wrap gap-2">
        {costume.styles.map((style) => (
          <span
            key={style}
            className="rounded-full border border-gray-200 px-3 py-1 text-xs text-gray-700"
          >
            {style}
          </span>
        ))}
      </div>
    </div>
  </div>
</section>

      {costume.description && (
        <p className="mt-5 rounded-xl bg-gray-50 p-4 text-sm leading-6 text-gray-700">
          {costume.description}
        </p>
      )}
    </main>
  );
}