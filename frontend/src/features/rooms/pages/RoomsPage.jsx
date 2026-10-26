import Navbar from "../../../shared/layout/Navbar";
import RoomSearchForm from "../components/RoomSearchForm";
import useRoomsPage from "../hooks/useRoomsPage";

export default function Rooms() {
  const {
    pageRef,
    searchPanelRef,
    mode,
    roomName,
    filters,
    purposes,
    rooms,
    hasSearched,
    error,
    notice,
    loading,
    bookingRoomId,
    handleModeSelect,
    handleRoomNameChange,
    handleFilterChange,
    handleSearch,
    handlePurposeChange,
    handleBookClick,
  } = useRoomsPage();

  return (
    <main
      ref={pageRef}
      className="app-background min-h-[100dvh] pt-16 md:pl-64 md:pt-8"
    >
      <Navbar />
      <section className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        <header data-motion="heading" className="mb-6">
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Cari ruang kelas
          </h1>
          <p className="mt-2 max-w-2xl text-slate-600">
            Temukan ruang yang tersedia sesuai kebutuhan dan jadwal kegiatanmu.
          </p>
        </header>

        <RoomSearchForm
          panelRef={searchPanelRef}
          mode={mode}
          roomName={roomName}
          filters={filters}
          loading={loading}
          onModeSelect={handleModeSelect}
          onRoomNameChange={handleRoomNameChange}
          onFilterChange={handleFilterChange}
          onSubmit={handleSearch}
        />

        {error && (
          <p
            role="alert"
            className="mt-5 rounded-xl border border-red-200 bg-red-50/95 p-4 text-sm text-red-800"
          >
            {error}
          </p>
        )}
        {notice && (
          <p
            role="status"
            className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50/95 p-4 text-sm text-emerald-800"
          >
            {notice}
          </p>
        )}

        {hasSearched && !loading && rooms.length > 0 && (
          <div className="mb-4 mt-8 flex flex-wrap items-end justify-between gap-2">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                Ruang tersedia
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Menampilkan {rooms.length} ruang untuk {filters.tanggal},{" "}
                {filters.jam_mulai}–{filters.jam_selesai}.
              </p>
            </div>
          </div>
        )}

        {loading && (
          <p
            role="status"
            className="mt-8 rounded-xl bg-white/90 p-5 text-sm text-slate-600"
          >
            Memeriksa ketersediaan ruang...
          </p>
        )}
        {!loading && hasSearched && !error && rooms.length === 0 && (
          <div className="mt-8 rounded-2xl border border-white/70 bg-white/90 px-6 py-10 text-center shadow-sm">
            <h2 className="font-semibold text-slate-900">
              Belum ada ruang yang cocok
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Coba ubah nama ruang, lokasi, kapasitas, atau jadwal.
            </p>
          </div>
        )}

        {!loading && !hasSearched && !error && (
          <div className="mt-8 rounded-2xl border border-white/70 bg-white/85 px-6 py-8 text-center text-sm text-slate-600">
            Pilih kriteria pencarian untuk melihat ruang yang tersedia.
          </div>
        )}

        {rooms.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {rooms.map((room) => (
              <article
                data-motion="card"
                key={room.id}
                className="flex h-full flex-col rounded-2xl border border-white/70 bg-white/95 p-5 shadow-sm backdrop-blur-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
                      Ruang kelas
                    </p>
                    <h2 className="mt-1 text-xl font-semibold text-slate-900">
                      {room.nama_ruangan}
                    </h2>
                  </div>
                  <span className="shrink-0 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800">
                    Tersedia
                  </span>
                </div>
                <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <dt className="text-slate-500">Kapasitas</dt>
                    <dd className="mt-0.5 font-medium text-slate-800">
                      {room.kapasitas} orang
                    </dd>
                  </div>
                  <div>
                    <dt className="text-slate-500">Lokasi</dt>
                    <dd className="mt-0.5 font-medium text-slate-800">
                      {room.lokasi}
                    </dd>
                  </div>
                </dl>
                <label className="mt-5 grid gap-1.5 text-sm font-medium text-slate-700">
                  Tujuan peminjaman
                  <input
                    data-room-id={room.id}
                    className="rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    maxLength="255"
                    value={purposes[room.id] || ""}
                    onChange={handlePurposeChange}
                    placeholder="Contoh: kuliah pengganti"
                  />
                </label>
                <button
                  data-motion="button"
                  data-room-id={room.id}
                  type="button"
                  onClick={handleBookClick}
                  disabled={bookingRoomId !== null}
                  className="mt-4 rounded-xl bg-blue-700 px-4 py-2.5 font-semibold text-white transition hover:bg-blue-800 disabled:cursor-wait disabled:opacity-60"
                >
                  {bookingRoomId === room.id
                    ? "Mengirim pengajuan..."
                    : "Ajukan booking"}
                </button>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
