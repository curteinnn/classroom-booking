const modes = [
  { id: "time", label: "Cari berdasarkan waktu" },
  { id: "room", label: "Cari berdasarkan ruang" },
];

export default function RoomSearchForm({ panelRef, mode, roomName, filters, loading, onModeSelect, onRoomNameChange, onFilterChange, onSubmit }) {
  return (
    <section ref={panelRef} data-motion="section" className="rounded-2xl border border-white/70 bg-white/95 p-5 shadow-lg backdrop-blur-sm sm:p-6">
      <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Temukan ruang yang sesuai</h2>
          <p className="mt-1 text-sm text-slate-600">Pilih cara mencari, lalu atur jadwal peminjaman.</p>
        </div>
        <div role="group" aria-label="Mode pencarian" className="grid grid-cols-2 rounded-xl bg-slate-100 p-1">
          {modes.map((item) => (
            <button
              data-mode={item.id}
              key={item.id}
              type="button"
              aria-pressed={mode === item.id}
              onClick={onModeSelect}
              className={`rounded-lg px-3 py-2 text-left text-xs font-semibold transition sm:px-4 sm:text-sm ${mode === item.id ? "bg-white text-blue-800 shadow-sm" : "text-slate-600 hover:text-slate-900"}`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={onSubmit}>
        <div data-search-mode-content className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {mode === "room" && (
            <label className="grid gap-1.5 text-sm font-medium text-slate-700 sm:col-span-2 xl:col-span-3">
              Nama ruang
              <input
                autoComplete="off"
                className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                value={roomName}
                onChange={onRoomNameChange}
                placeholder="Contoh: Ruang 301"
                required
              />
            </label>
          )}
          <label className="grid gap-1.5 text-sm font-medium text-slate-700">
            Tanggal
            <input className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" type="date" name="tanggal" value={filters.tanggal} onChange={onFilterChange} required />
          </label>
          <label className="grid gap-1.5 text-sm font-medium text-slate-700">
            Jam mulai
            <input className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" type="time" name="jam_mulai" value={filters.jam_mulai} onChange={onFilterChange} required />
          </label>
          <label className="grid gap-1.5 text-sm font-medium text-slate-700">
            Jam selesai
            <input className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" type="time" name="jam_selesai" value={filters.jam_selesai} onChange={onFilterChange} required />
          </label>
          <label className="grid gap-1.5 text-sm font-medium text-slate-700">
            Kapasitas minimum
            <input className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" type="number" min="1" max="50" name="kapasitas" value={filters.kapasitas} onChange={onFilterChange} required />
          </label>
          <label className="grid gap-1.5 text-sm font-medium text-slate-700">
            Lokasi <span className="font-normal text-slate-400">(opsional)</span>
            <input className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" name="lokasi" value={filters.lokasi} onChange={onFilterChange} placeholder="Gedung atau lokasi" />
          </label>
          <button data-motion="button" type="submit" disabled={loading} className="self-end rounded-xl bg-blue-700 px-5 py-2.5 font-semibold text-white shadow-sm transition hover:bg-blue-800 disabled:cursor-wait disabled:opacity-60">
            {loading ? "Mencari ruang..." : "Cari ruang tersedia"}
          </button>
        </div>
      </form>
    </section>
  );
}
