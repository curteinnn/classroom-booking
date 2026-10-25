const menus = [
  { id: "rooms", title: "Pengelolaan ruang", description: "Atur ketersediaan, kapasitas, dan data ruang.", icon: "M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6", accent: "text-blue-700 bg-blue-50", countKey: "rooms" },
  { id: "users", title: "Informasi pengguna", description: "Cari akun dan kelola status akses pengguna.", icon: "M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2m6-10a4 4 0 1 0 0-8 4 4 0 0 0 0 8m6 2a4 4 0 0 1 4 4v2", accent: "text-violet-700 bg-violet-50", countKey: "users" },
  { id: "bookings", title: "Informasi booking", description: "Tinjau permohonan dan status peminjaman ruang.", icon: "M8 2v4m8-4v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14H3V6a2 2 0 0 1 2-2", accent: "text-amber-700 bg-amber-50", countKey: "bookings" },
];

export default function AdminMenuCards({ activeSection, counts, onSelect }) {
  return (
    <section aria-labelledby="admin-menu-title">
      <div className="mb-3">
        <h2 id="admin-menu-title" className="text-lg font-semibold text-slate-900">Menu administrasi</h2>
        <p className="mt-1 text-sm text-slate-500">Pilih area yang ingin Anda kelola.</p>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        {menus.map((menu) => (
          <button
            data-motion="card"
            data-section={menu.id}
            key={menu.id}
            type="button"
            aria-pressed={activeSection === menu.id}
            onClick={onSelect}
            className={`group rounded-2xl border bg-white p-5 text-left shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${activeSection === menu.id ? "border-blue-500 ring-1 ring-blue-500" : "border-slate-200"}`}
          >
            <div className="flex items-start justify-between gap-3">
              <span className={`grid h-11 w-11 place-items-center rounded-xl ${menu.accent}`}>
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                  <path d={menu.icon} />
                </svg>
              </span>
              <span className="text-xs font-semibold text-slate-500">{counts[menu.countKey]}</span>
            </div>
            <h3 className="mt-4 font-semibold text-slate-900">{menu.title}</h3>
            <p className="mt-1 min-h-10 text-sm leading-5 text-slate-600">{menu.description}</p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-blue-700">
              {menu.id === "bookings" ? `${counts.pending} pending · buka booking` : `Buka ${menu.id === "rooms" ? "ruang" : "pengguna"}`}
              <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
