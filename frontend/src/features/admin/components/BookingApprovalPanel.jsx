function dateLabel(value) {
  return value ? String(value).slice(0, 10) : "-";
}

export default function BookingApprovalPanel({ bookings, loading, reasons, setReasons, onReview }) {
  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="text-xl font-bold">Persetujuan booking</h2>
        <p className="mt-1 text-sm text-slate-600">Booking pending ditampilkan lebih dahulu. Persetujuan memeriksa ulang bentrok jadwal.</p>
      </div>
      <div className="divide-y">
        {bookings.map((booking) => (
          <article key={booking.id} className="grid gap-4 py-4 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,0.7fr)]">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-semibold">{booking.nama_ruangan}</h3>
                <span className={`rounded-full px-2 py-1 text-xs font-medium ${booking.status === "pending" ? "bg-amber-100 text-amber-800" : "bg-slate-100 text-slate-700"}`}>{booking.status}</span>
              </div>
              <p className="mt-1 text-sm text-slate-600">{booking.nama_pemesan} ({booking.role_pemesan}) · {booking.identifier}</p>
              <p className="text-sm text-slate-600">{dateLabel(booking.tanggal)} · {String(booking.jam_mulai).slice(0, 5)}–{String(booking.jam_selesai).slice(0, 5)} · {booking.lokasi}</p>
              <p className="mt-1 text-sm">Tujuan: {booking.tujuan}</p>
              {booking.rejection_reason && <p className="text-sm text-red-700">Alasan penolakan: {booking.rejection_reason}</p>}
            </div>
            {booking.status === "pending" && (
              <div className="flex flex-col gap-2">
                <input className="rounded-lg border p-2 text-sm" maxLength="500" placeholder="Alasan penolakan (wajib jika menolak)" value={reasons[booking.id] || ""} onChange={(event) => setReasons((current) => ({ ...current, [booking.id]: event.target.value }))} />
                <div className="flex gap-2">
                  <button type="button" onClick={() => onReview(booking, "approved")} className="flex-1 rounded-lg bg-green-700 px-3 py-2 text-sm font-semibold text-white">Setujui</button>
                  <button type="button" onClick={() => onReview(booking, "rejected")} className="flex-1 rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-700">Tolak</button>
                </div>
              </div>
            )}
          </article>
        ))}
        {!loading && bookings.length === 0 && <p className="py-4 text-sm text-slate-500">Belum ada booking.</p>}
      </div>
    </section>
  );
}
