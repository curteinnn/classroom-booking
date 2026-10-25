export default function RoomManagementPanel({
  rooms,
  loading,
  form,
  setForm,
  editingRoomId,
  onSubmit,
  onEdit,
  onCancelEdit,
  onToggleStatus,
  onDelete,
}) {
  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm">
      <div className="mb-5">
        <h2 className="text-xl font-bold">Pengelolaan ruangan</h2>
        <p className="mt-1 text-sm text-slate-600">Tambah, ubah, nonaktifkan, atau hapus ruangan.</p>
      </div>
      <form onSubmit={onSubmit} className="grid gap-3 rounded-xl bg-slate-50 p-4 md:grid-cols-4">
        <input className="rounded-lg border bg-white p-2" placeholder="Nama ruangan" maxLength="100" value={form.nama_ruangan} onChange={(event) => setForm({ ...form, nama_ruangan: event.target.value })} required />
        <input className="rounded-lg border bg-white p-2" placeholder="Lokasi" maxLength="150" value={form.lokasi} onChange={(event) => setForm({ ...form, lokasi: event.target.value })} required />
        <input className="rounded-lg border bg-white p-2" placeholder="Kapasitas" type="number" min="1" max="50" value={form.kapasitas} onChange={(event) => setForm({ ...form, kapasitas: event.target.value })} required />
        <div className="flex gap-2">
          <button className="flex-1 rounded-lg bg-blue-700 px-4 py-2 font-semibold text-white">{editingRoomId ? "Simpan perubahan" : "Tambah ruangan"}</button>
          {editingRoomId && <button type="button" onClick={onCancelEdit} className="rounded-lg border px-3 py-2">Batal</button>}
        </div>
      </form>

      <div className="mt-4 divide-y">
        {rooms.map((room) => (
          <article key={room.id} className="flex flex-col justify-between gap-3 py-4 sm:flex-row sm:items-center">
            <div>
              <h3 className="font-semibold text-slate-900">{room.nama_ruangan}</h3>
              <p className="text-sm text-slate-600">{room.lokasi} · {room.kapasitas} orang · {Number(room.is_active) === 1 ? "Aktif" : "Nonaktif"}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => onEdit(room)} className="rounded-lg border px-3 py-2 text-sm">Ubah</button>
              <button type="button" onClick={() => onToggleStatus(room)} className="rounded-lg border px-3 py-2 text-sm">{Number(room.is_active) === 1 ? "Nonaktifkan" : "Aktifkan"}</button>
              <button type="button" onClick={() => onDelete(room)} className="rounded-lg border border-red-200 px-3 py-2 text-sm text-red-700">Hapus</button>
            </div>
          </article>
        ))}
        {!loading && rooms.length === 0 && <p className="py-4 text-sm text-slate-500">Belum ada ruangan.</p>}
      </div>
    </section>
  );
}
