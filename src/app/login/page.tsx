import { login } from "./actions";

type LoginPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function LoginPage({
  searchParams,
}: LoginPageProps) {
  const params = await searchParams;

  return (
    <main
  dir="rtl"
  className="flex min-h-screen items-center justify-center bg-gray-100 px-4 text-black"
>
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="mb-2 text-center text-3xl font-bold">
          כניסה לניהול
        </h1>

        <p className="mb-8 text-center text-gray-500">
          קטלוג התלבושות של dex.dance
        </p>

        {params.error && (
          <div className="mb-5 rounded-lg bg-red-100 p-3 text-center text-sm text-red-700">
            {params.error}
          </div>
        )}

        <form action={login} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block font-medium"
            >
              אימייל
            </label>

            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-black outline-none focus:border-black"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block font-medium"
            >
              סיסמה
            </label>

            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-black outline-none focus:border-black"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-black px-4 py-3 font-bold text-white transition hover:bg-gray-800"
          >
            כניסה
          </button>
        </form>
      </div>
    </main>
  );
}