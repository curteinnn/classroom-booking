import Navbar from "../../../shared/layout/Navbar";
import useBookingHistory from "../hooks/useBookingHistory";

export default function BookingHistoryPage() {
  const { pageRef, bookings, error, loading, handleCancel } =
    useBookingHistory();

  return (
    <main ref={pageRef} className="app-background min-h-[100dvh] pt-16 md:pl-64 md:pt-8">
      <Navbar />
      <section className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:py-10">
        <h1
          data-motion="heading"
          className="mb-6 text-3xl font-bold text-slate-900"
        >
          Riwayat booking
        </h1>
        {error && (
          <p
            role="alert"
            className="mb-4 rounded-lg bg-red-50 p-3 text-red-700"
          >
            {error}
          </p>
        )}
        {loading ? (
          <p>Memuat booking...</p>
        ) : bookings.length === 0 ? (
          <p className="text-slate-600">Belum ada booking.</p>
        ) : (
          <div className="grid gap-4">
            {bookings.map((booking) => (
              <article
                data-motion="card"
                key={booking.id}
                className="flex flex-col justify-between gap-4 rounded-2xl bg-white p-5 shadow-sm transition-shadow hover:shadow-lg sm:flex-row sm:items-center"
              >
                <div>
                  <h2 className="text-lg font-semibold">
                    {booking.nama_ruangan}
                  </h2>
                  <p className="text-sm text-slate-600">
                    {booking.tanggal} · {String(booking.jam_mulai).slice(0, 5)}–
                    {String(booking.jam_selesai).slice(0, 5)}
                  </p>
                  <p className="mt-1 text-sm">{booking.tujuan}</p>
                  {booking.rejection_reason && (
                    <p className="mt-1 text-sm text-red-700">
                      Alasan: {booking.rejection_reason}
                    </p>
                  )}
                  <p className="mt-2 text-sm font-medium capitalize">
                    Status: {booking.status}
                  </p>
                </div>
                {["pending", "approved"].includes(booking.status) && (
                  <button
                    data-motion="button"
                    data-booking-id={booking.id}
                    type="button"
                    onClick={handleCancel}
                    className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
                  >
                    Batalkan
                  </button>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
