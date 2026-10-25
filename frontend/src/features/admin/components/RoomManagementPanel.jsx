export default function RoomManagementPanel({ rooms, loading, form, onFormChange, editingRoomId, onSubmit, onPanelClick }) {
  return (
    <section data-motion="section" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm" onClick={onPanelClick}>
      <div className="mb-5">
        <h2 className="text-xl font-bold text-slate-900">Pengelolaan ruang</h2>
        <p className="mt-1 text-sm text-slate-600">Tambah, ubah, nonaktifkan, atau hapus ruang. Ruang yang memiliki riwayat booking perlu dinonaktifkan.</p>
      </div>
      <form onSubmit={onSubmit} className="grid gap-3 rounded-xl bg-slate-50 p-4 md:grid-cols-4">
        <input data-field="nama_ruangan" className="rounded-lg border bg-white p-2" placeholder="Nama ruang" maxLength="100" value={form.nama_ruangan} onChange={onFormChange} required />
        <input data-field="lokasi" className="rounded-lg border bg-white p-2" placeholder="Lokasi" maxLength="150" value={form.lokasi} onChange={onFormChange} required />
        <input data-field="kapasitas" className="rounded-lg border bg-white p-2" placeholder="Kapasitas" type="number" min="1" max="50" value={form.kapasitas} onChange={onFormChange} required />
        <div className="flex gap-2">
          <button data-motion="button" className="flex-1 rounded-lg bg-blue-700 px-4 py-2 font-semibold text-white">{editingRoomId ? "Simpan perubahan" : "Tambah ruang"}</button>
          {editingRoomId && <button data-room-action="cancel" type="button" className="rounded-lg border px-3 py-2">Batal</button>}
        </div>
      </form>

      <div className="mt-4 divide-y divide-slate-100">
        {rooms.map((room) => (
          <article data-motion="card" key={room.id} className="flex flex-col justify-between gap-3 py-4 transition-colors hover:bg-slate-50 sm:flex-row sm:items-center">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-semibold text-slate-900">{room.nama_ruangan}</h3>
                <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${Number(room.is_active) === 1 ? "bg-emerald-50 text-emerald-800" : "bg-slate-100 text-slate-600"}`}>{Number(room.is_active) === 1 ? "Aktif" : "Nonaktif"}</span>
              </div>
              <p className="text-sm text-slate-600">{room.lokasi} &middot; Kapasitas {room.kapasitas} orang</p>
              <details className="mt-1 text-xs text-slate-500">
                <summary className="w-fit cursor-pointer font-medium text-blue-700">Detail ruang</summary>
                <p className="mt-1">ID {room.id} &middot; Dibuat {room.created_at ? String(room.created_at).slice(0, 10) : "-"} &middot; Diperbarui {room.updated_at ? String(room.updated_at).slice(0, 10) : "-"}</p>
              </details>
            </div>
            <div className="flex flex-wrap gap-2">
              <button data-motion="button" data-room-action="edit" data-room-id={room.id} type="button" className="rounded-lg border px-3 py-2 text-sm">Ubah</button>
              <button data-motion="button" data-room-action="toggle" data-room-id={room.id} type="button" className="rounded-lg border px-3 py-2 text-sm">{Number(room.is_active) === 1 ? "Nonaktifkan" : "Aktifkan"}</button>
              <button data-motion="button" data-room-action="delete" data-room-id={room.id} type="button" className="rounded-lg border border-red-200 px-3 py-2 text-sm text-red-700">Hapus</button>
            </div>
          </article>
        ))}
        {loading && <p className="py-5 text-sm text-slate-500" role="status">Memuat ruang...</p>}
        {!loading && rooms.length === 0 && <p className="py-5 text-sm text-slate-500">Belum ada ruang. Gunakan formulir di atas untuk menambahkan ruang.</p>}
      </div>
    </section>
  );
}
