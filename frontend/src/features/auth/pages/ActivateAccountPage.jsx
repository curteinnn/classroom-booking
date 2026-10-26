import { Link } from "react-router-dom";
import useActivationPage from "../hooks/useActivationPage";

export default function ActivateAccount() {
  const view = useActivationPage();

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-5">
      <form
        onSubmit={view.handleSubmit}
        className="w-full max-w-md space-y-4 rounded-2xl bg-white p-7 shadow-sm"
      >
        <h1 className="text-2xl font-bold">Aktivasi akun</h1>
        <p className="text-sm text-slate-600">
          Buat password minimal 12 karakter untuk mengaktifkan akun.
        </p>
        <label className="grid gap-1 text-sm font-medium">
          Password
          <input
            className="rounded-lg border p-2"
            type="password"
            minLength="12"
            maxLength="72"
            autoComplete="new-password"
            value={view.password}
            onChange={view.handlePasswordChange}
            required
          />
        </label>
        <label className="grid gap-1 text-sm font-medium">
          Ulangi password
          <input
            className="rounded-lg border p-2"
            type="password"
            minLength="12"
            maxLength="72"
            autoComplete="new-password"
            value={view.confirmation}
            onChange={view.handleConfirmationChange}
            required
          />
        </label>
        {view.error && (
          <p role="alert" className="text-sm text-red-700">
            {view.error}
          </p>
        )}
        {view.message && (
          <p role="status" className="text-sm text-green-700">
            {view.message}{" "}
            <Link className="underline" to="/">
              Login
            </Link>
          </p>
        )}
        <button
          disabled={view.loading}
          className="w-full rounded-lg bg-blue-700 px-4 py-2 font-semibold text-white disabled:opacity-60"
        >
          {view.loading ? "Memproses..." : "Aktifkan akun"}
        </button>
      </form>
    </main>
  );
}
