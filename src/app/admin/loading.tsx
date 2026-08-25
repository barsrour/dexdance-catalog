export default function AdminLoading() {
  return (
    <div
      dir="rtl"
      className="flex min-h-[50vh] items-center justify-center"
    >
      <div className="text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-red-600" />

        <p className="mt-3 text-sm text-gray-500">
          טוען...
        </p>
      </div>
    </div>
  );
}