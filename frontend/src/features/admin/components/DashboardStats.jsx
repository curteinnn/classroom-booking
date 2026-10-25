export default function DashboardStats({ rooms, users, bookings }) {
  const stats = [
    ["Total ruangan", rooms.length],
    ["Ruangan aktif", rooms.filter((room) => Number(room.is_active) === 1).length],
    ["Akun aktif", users.filter((user) => Number(user.is_active) === 1).length],
    ["Booking menunggu", bookings.filter((booking) => booking.status === "pending").length],
  ];

  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label="Ringkasan">
      {stats.map(([label, value]) => (
        <article key={label} className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-bold text-blue-800">{value}</p>
        </article>
      ))}
    </section>
  );
}
