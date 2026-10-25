export default function UserManagementPanel({ users, totalUsers, loading, form, search, roleFilter, onSearch, onRoleFilter, onFormChange, onSubmit, onToggleStatus }) {
  return (
    <section data-motion="section" className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="text-xl font-bold">Buat akun pengguna</h2>
        <p className="mb-4 mt-1 text-sm text-slate-600">Pengguna menerima tautan aktivasi melalui email.</p>
        <form onSubmit={onSubmit} className="space-y-3">
          <input data-field="nama" className="w-full rounded-lg border p-2" placeholder="Nama lengkap" maxLength="100" value={form.nama} onChange={onFormChange} required />
          <input data-field="identifier" className="w-full rounded-lg border p-2" placeholder="Identifier" maxLength="50" value={form.identifier} onChange={onFormChange} required />
          <input data-field="email" className="w-full rounded-lg border p-2" type="email" placeholder="Email" maxLength="150" value={form.email} onChange={onFormChange} required />
          <select data-field="role" className="w-full rounded-lg border bg-white p-2" value={form.role} onChange={onFormChange}>
            <option value="mahasiswa">Mahasiswa</option>
            <option value="dosen">Dosen</option>
          </select>
          <button data-motion="button" className="w-full rounded-lg bg-blue-700 px-4 py-2 font-semibold text-white">Buat akun</button>
        </form>
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold">Daftar pengguna</h2>
            <p className="mt-1 text-sm text-slate-500">{users.length} dari {totalUsers} pengguna</p>
          </div>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <input aria-label="Cari pengguna" className="rounded-lg border px-3 py-2 text-sm" value={search} onChange={onSearch} placeholder="Cari nama, email, identifier" />
            <select aria-label="Filter role pengguna" className="rounded-lg border bg-white px-3 py-2 text-sm" value={roleFilter} onChange={onRoleFilter}>
              <option value="all">Semua role</option>
              <option value="mahasiswa">Mahasiswa</option>
              <option value="dosen">Dosen</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>
        <div className="mt-3 max-h-[34rem] divide-y overflow-auto">
          {users.map((user) => (
            <article data-motion="card" key={user.id} className="flex items-center justify-between gap-3 py-3 transition-colors hover:bg-slate-50">
              <div className="min-w-0">
                <p className="truncate font-medium">{user.nama} <span className="text-xs font-normal uppercase text-slate-500">{user.role}</span></p>
                <p className="truncate text-sm text-slate-600">{user.identifier} · {user.email}</p>
                <p className="text-xs text-slate-500">{Number(user.is_active) === 1 ? "Aktif" : "Belum aktif / nonaktif"}</p>
                <details className="mt-1 text-xs text-slate-500">
                  <summary className="w-fit cursor-pointer font-medium text-blue-700">Detail akun</summary>
                  <p className="mt-1">ID: {user.id} · Dibuat: {user.created_at ? String(user.created_at).slice(0, 10) : "-"}</p>
                  <p>Status email: {user.email_verified_at ? "Terverifikasi" : "Belum terverifikasi"}</p>
                </details>
              </div>
              {String(user.role || "").trim().toLowerCase() !== "admin" && (
                <button data-motion="button" data-user-id={user.id} type="button" onClick={onToggleStatus} className="shrink-0 rounded-lg border px-3 py-2 text-xs">
                  {Number(user.is_active) === 1 ? "Nonaktifkan" : "Aktifkan"}
                </button>
              )}
            </article>
          ))}
          {loading && <p className="py-4 text-sm text-slate-500">Memuat pengguna...</p>}
          {!loading && users.length === 0 && totalUsers === 0 && <p className="py-4 text-sm text-slate-500">Belum ada pengguna.</p>}
          {!loading && users.length > 0 && totalUsers > 0 && <p className="sr-only" aria-live="polite">Menampilkan {users.length} pengguna.</p>}
          {!loading && users.length === 0 && totalUsers > 0 && <p className="py-4 text-sm text-slate-500">Tidak ada pengguna yang cocok dengan pencarian atau filter.</p>}
        </div>
      </div>
    </section>
  );
}
