const cards = [
  { key: "rooms", label: "Total ruang", icon: "M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6M9 9h.01M15 9h.01", color: "bg-blue-50 text-blue-700" },
  { key: "activeRooms", label: "Ruangan aktif", icon: "M5 13l4 4L19 7", color: "bg-emerald-50 text-emerald-700" },
  { key: "activeUsers", label: "Akun aktif", icon: "M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2m6-10a4 4 0 1 0 0-8 4 4 0 0 0 0 8m6 2a4 4 0 0 1 4 4v2m-3-18a4 4 0 0 1 0 8", color: "bg-violet-50 text-violet-700" },
  { key: "pendingBookings", label: "Booking menunggu", icon: "M8 2v4m8-4v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14H3V6a2 2 0 0 1 2-2", color: "bg-amber-50 text-amber-700" },
];

export default function DashboardStats({ stats }) {
  const values = Object.fromEntries(stats.map(({ key, value }) => [key, value]));

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Ringkasan dashboard">
      {cards.map((card) => (
        <article data-motion="card" key={card.key} className="flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl ${card.color}`}>
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
              <path d={card.icon} />
            </svg>
          </span>
          <div className="min-w-0">
            <p className="text-sm font-medium text-slate-500">{card.label}</p>
            <p className="mt-1 text-2xl font-bold tracking-tight text-slate-900">{values[card.key] ?? 0}</p>
          </div>
        </article>
      ))}
    </section>
  );
}
