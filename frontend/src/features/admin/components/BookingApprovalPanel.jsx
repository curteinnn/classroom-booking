import { formatBookingDate } from "../utils/bookingFormatters";

const statusTabs = [
  { key: "pending", label: "Pending", style: "bg-amber-50 text-amber-800" },
  {
    key: "approved",
    label: "Approved",
    style: "bg-emerald-50 text-emerald-800",
  },
  { key: "rejected", label: "Rejected", style: "bg-rose-50 text-rose-800" },
];

export default function BookingApprovalPanel({
  bookings,
  loading,
  reasons,
  status,
  counts,
  processingId,
  onStatusChange,
  onReasonChange,
  onReview,
}) {
  return (
    <section
      data-motion="section"
      className="rounded-2xl bg-white p-5 shadow-sm"
    >
      <div className="mb-4">
        <h2 className="text-xl font-bold">Persetujuan booking</h2>
        <p className="mt-1 text-sm text-slate-600">
          Tinjau detail booking dan proses permohonan pending sesuai kebijakan.
        </p>
      </div>
      <div
        role="group"
        aria-label="Filter status booking"
        className="mb-3 flex flex-wrap gap-2 border-b border-slate-200 pb-3"
      >
        {statusTabs.map((tab) => (
          <button
            data-status={tab.key}
            key={tab.key}
            type="button"
            aria-pressed={status === tab.key}
            onClick={onStatusChange}
            className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${status === tab.key ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
          >
            {tab.label}
            <span
              className={`ml-2 rounded-full px-2 py-0.5 text-xs ${status === tab.key ? "bg-white/15 text-white" : tab.style}`}
            >
              {counts[tab.key]}
            </span>
          </button>
        ))}
      </div>
      <div className="divide-y">
        {bookings.map((booking) => (
          <article
            data-motion="card"
            key={booking.id}
            className="grid gap-4 py-4 transition-colors hover:bg-slate-50 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,0.7fr)]"
          >
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-semibold">{booking.nama_ruangan}</h3>
                <span
                  className={`rounded-full px-2 py-1 text-xs font-semibold ${statusTabs.find((tab) => tab.key === booking.status)?.style || "bg-slate-100 text-slate-700"}`}
                >
                  {booking.status}
                </span>
              </div>
              <p className="mt-1 text-sm text-slate-600">
                {booking.nama_pemesan} ({booking.role_pemesan}) &middot;{" "}
                {booking.identifier}
              </p>
              <p className="text-sm text-slate-600">
                {formatBookingDate(booking.tanggal)} &middot;{" "}
                {String(booking.jam_mulai).slice(0, 5)}&ndash;
                {String(booking.jam_selesai).slice(0, 5)} &middot;{" "}
                {booking.lokasi}
              </p>
              <p className="mt-1 text-sm">Tujuan: {booking.tujuan}</p>
              {booking.rejection_reason && (
                <p className="text-sm text-red-700">
                  Alasan penolakan: {booking.rejection_reason}
                </p>
              )}
              <details className="mt-2 text-sm text-slate-600">
                <summary className="w-fit cursor-pointer font-medium text-blue-700">
                  Detail booking
                </summary>
                <dl className="mt-2 grid gap-x-5 gap-y-1 sm:grid-cols-2">
                  <div>
                    <dt className="inline font-medium">ID: </dt>
                    <dd className="inline">{booking.id}</dd>
                  </div>
                  <div>
                    <dt className="inline font-medium">Kapasitas ruang: </dt>
                    <dd className="inline">{booking.kapasitas} orang</dd>
                  </div>
                  <div>
                    <dt className="inline font-medium">Role pemesan: </dt>
                    <dd className="inline">{booking.role_pemesan}</dd>
                  </div>
                  <div>
                    <dt className="inline font-medium">Dibuat: </dt>
                    <dd className="inline">
                      {formatBookingDate(booking.created_at)}
                    </dd>
                  </div>
                </dl>
              </details>
            </div>
            {booking.status === "pending" && (
              <div className="flex flex-col gap-2">
                <input
                  data-booking-id={booking.id}
                  aria-label={`Alasan penolakan booking ${booking.id}`}
                  className="rounded-lg border p-2 text-sm"
                  maxLength="500"
                  placeholder="Alasan penolakan (wajib jika menolak)"
                  value={reasons[booking.id] || ""}
                  onChange={onReasonChange}
                  disabled={processingId !== null}
                />
                <div className="flex gap-2">
                  <button
                    data-motion="button"
                    data-booking-id={booking.id}
                    data-status="approved"
                    type="button"
                    onClick={onReview}
                    disabled={processingId !== null}
                    className="flex-1 rounded-lg bg-green-700 px-3 py-2 text-sm font-semibold text-white disabled:cursor-wait disabled:opacity-60"
                  >
                    {processingId === booking.id ? "Memproses..." : "Approve"}
                  </button>
                  <button
                    data-motion="button"
                    data-booking-id={booking.id}
                    data-status="rejected"
                    type="button"
                    onClick={onReview}
                    disabled={processingId !== null}
                    className="flex-1 rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-700 disabled:cursor-wait disabled:opacity-60"
                  >
                    {processingId === booking.id ? "Memproses..." : "Reject"}
                  </button>
                </div>
              </div>
            )}
          </article>
        ))}
        {loading && (
          <p className="py-5 text-sm text-slate-500" role="status">
            Memuat booking...
          </p>
        )}
        {!loading && bookings.length === 0 && (
          <p className="py-5 text-sm text-slate-500">
            Belum ada booking berstatus {status}.
          </p>
        )}
      </div>
    </section>
  );
}
