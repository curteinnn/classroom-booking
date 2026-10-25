import { useCallback, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { apiRequest } from "../services/api";

export default function BookingHistory() {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const loadBookings = useCallback(async () => {
    setError("");
    try {
      const data = await apiRequest("/api/bookings/my");
      setBookings(data.bookings || []);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  async function cancelBooking(id) {
    setError("");
    try {
      await apiRequest(`/api/bookings/${id}/cancel`, { method: "PATCH" });
      await loadBookings();
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 pt-16">
      <Navbar />
      <section className="mx-auto max-w-5xl px-5 py-8">
        <h1 className="mb-6 text-3xl font-bold text-slate-900">Riwayat booking</h1>
        {error && <p role="alert" className="mb-4 rounded-lg bg-red-50 p-3 text-red-700">{error}</p>}
        {loading ? <p>Memuat booking...</p> : bookings.length === 0 ? <p className="text-slate-600">Belum ada booking.</p> : (
          <div className="grid gap-4">
            {bookings.map((booking) => (
              <article key={booking.id} className="flex flex-col justify-between gap-4 rounded-2xl bg-white p-5 shadow-sm sm:flex-row sm:items-center">
                <div>
                  <h2 className="text-lg font-semibold">{booking.nama_ruangan}</h2>
                  <p className="text-sm text-slate-600">{booking.tanggal} · {String(booking.jam_mulai).slice(0, 5)}–{String(booking.jam_selesai).slice(0, 5)}</p>
                  <p className="mt-1 text-sm">{booking.tujuan}</p>
                  {booking.rejection_reason && <p className="mt-1 text-sm text-red-700">Alasan: {booking.rejection_reason}</p>}
                  <p className="mt-2 text-sm font-medium capitalize">Status: {booking.status}</p>
                </div>
                {["pending", "approved"].includes(booking.status) && (
                  <button type="button" onClick={() => cancelBooking(booking.id)} className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50">
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
