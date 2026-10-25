export default function UserManagementPanel({ users, loading, form, setForm, onSubmit, onToggleStatus }) {
  return (
    <section className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="text-xl font-bold">Buat akun pengguna</h2>
        <p className="mb-4 mt-1 text-sm text-slate-600">Pengguna menerima tautan aktivasi melalui email.</p>
        <form onSubmit={onSubmit} className="space-y-3">
          <input className="w-full rounded-lg border p-2" placeholder="Nama lengkap" maxLength="100" value={form.nama} onChange={(event) => setForm({ ...form, nama: event.target.value })} required />
          <input className="w-full rounded-lg border p-2" placeholder="Identifier" maxLength="50" value={form.identifier} onChange={(event) => setForm({ ...form, identifier: event.target.value })} required />
          <input className="w-full rounded-lg border p-2" type="email" placeholder="Email" maxLength="150" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
          <select className="w-full rounded-lg border bg-white p-2" value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })}>
            <option value="mahasiswa">Mahasiswa</option>
            <option value="dosen">Dosen</option>
          </select>
          <button className="w-full rounded-lg bg-blue-700 px-4 py-2 font-semibold text-white">Buat akun</button>
        </form>
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="text-xl font-bold">Daftar pengguna</h2>
        <div className="mt-3 max-h-[34rem] divide-y overflow-auto">
          {users.map((user) => (
            <article key={user.id} className="flex items-center justify-between gap-3 py-3">
              <div className="min-w-0">
                <p className="truncate font-medium">{user.nama} <span className="text-xs font-normal uppercase text-slate-500">{user.role}</span></p>
                <p className="truncate text-sm text-slate-600">{user.identifier} · {user.email}</p>
                <p className="text-xs text-slate-500">{Number(user.is_active) === 1 ? "Aktif" : "Belum aktif / nonaktif"}</p>
              </div>
              {String(user.role || "").trim().toLowerCase() !== "admin" && (
                <button type="button" onClick={() => onToggleStatus(user)} className="shrink-0 rounded-lg border px-3 py-2 text-xs">
                  {Number(user.is_active) === 1 ? "Nonaktifkan" : "Aktifkan"}
                </button>
              )}
            </article>
          ))}
          {!loading && users.length === 0 && <p className="py-4 text-sm text-slate-500">Belum ada pengguna.</p>}
        </div>
      </div>
    </section>
  );
}
