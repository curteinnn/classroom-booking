import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import useAccountActivation from "../hooks/useAccountActivation";

export default function ActivateAccount() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const { error, message, loading, submit } = useAccountActivation(token);

  async function completeActivation(event) {
    event.preventDefault();
    await submit(password, confirmation);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-5">
      <form onSubmit={completeActivation} className="w-full max-w-md space-y-4 rounded-2xl bg-white p-7 shadow-sm">
        <h1 className="text-2xl font-bold">Aktivasi akun</h1>
        <p className="text-sm text-slate-600">Buat password minimal 12 karakter untuk mengaktifkan akun.</p>
        <label className="grid gap-1 text-sm font-medium">Password
          <input className="rounded-lg border p-2" type="password" minLength="12" maxLength="72" autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} required />
        </label>
        <label className="grid gap-1 text-sm font-medium">Ulangi password
          <input className="rounded-lg border p-2" type="password" minLength="12" maxLength="72" autoComplete="new-password" value={confirmation} onChange={(event) => setConfirmation(event.target.value)} required />
        </label>
        {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
        {message && <p role="status" className="text-sm text-green-700">{message} <Link className="underline" to="/">Login</Link></p>}
        <button disabled={loading} className="w-full rounded-lg bg-blue-700 px-4 py-2 font-semibold text-white disabled:opacity-60">
          {loading ? "Memproses..." : "Aktifkan akun"}
        </button>
      </form>
    </main>
  );
}
