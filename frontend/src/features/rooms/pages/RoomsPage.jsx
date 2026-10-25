import { useState } from "react";
import Navbar from "../../../shared/layout/Navbar";
import useRoomSearch from "../hooks/useRoomSearch";

function localDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function defaultBookingDate() {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return localDate(date);
}

export default function Rooms() {
  const [filters, setFilters] = useState({
    // Default ke esok hari agar jam awal tidak langsung kedaluwarsa.
    tanggal: defaultBookingDate(),
    jam_mulai: "09:00",
    jam_selesai: "10:00",
    kapasitas: "1",
    lokasi: "",
  });
  const [purposes, setPurposes] = useState({});
  const { rooms, hasSearched, error, notice, loading, search, book } = useRoomSearch(filters);

  function updateFilter(event) {
    setFilters((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  return (
    <main className="min-h-screen bg-slate-50 pt-16">
      <Navbar />
      <section className="mx-auto max-w-6xl px-5 py-8">
        <h1 className="mb-2 text-3xl font-bold text-slate-900">Cari ruangan</h1>
        <p className="mb-6 text-slate-600">Pilih jadwal untuk melihat ruang yang tersedia.</p>

        <form onSubmit={search} className="grid gap-4 rounded-2xl bg-white p-5 shadow-sm md:grid-cols-3">
          <label className="grid gap-1 text-sm font-medium">Tanggal
            <input className="rounded-lg border p-2" type="date" name="tanggal" value={filters.tanggal} onChange={updateFilter} required />
          </label>
          <label className="grid gap-1 text-sm font-medium">Jam mulai
            <input className="rounded-lg border p-2" type="time" name="jam_mulai" value={filters.jam_mulai} onChange={updateFilter} required />
          </label>
          <label className="grid gap-1 text-sm font-medium">Jam selesai
            <input className="rounded-lg border p-2" type="time" name="jam_selesai" value={filters.jam_selesai} onChange={updateFilter} required />
          </label>
          <label className="grid gap-1 text-sm font-medium">Kapasitas minimum
            <input className="rounded-lg border p-2" type="number" min="1" max="50" name="kapasitas" value={filters.kapasitas} onChange={updateFilter} required />
          </label>
          <label className="grid gap-1 text-sm font-medium">Lokasi (opsional)
            <input className="rounded-lg border p-2" name="lokasi" value={filters.lokasi} onChange={updateFilter} />
          </label>
          <button className="self-end rounded-lg bg-blue-700 px-4 py-2 font-semibold text-white disabled:opacity-60" disabled={loading}>
            {loading ? "Mencari..." : "Cari ruangan"}
          </button>
        </form>

        {error && <p role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-red-700">{error}</p>}
        {notice && <p role="status" className="mt-4 rounded-lg bg-green-50 p-3 text-green-700">{notice}</p>}

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {rooms.map((room) => (
            <article key={room.id} className="rounded-2xl bg-white p-5 shadow-sm">
              <h2 className="text-xl font-semibold">{room.nama_ruangan}</h2>
              <p className="mt-1 text-sm text-slate-600">{room.lokasi} · kapasitas {room.kapasitas} orang</p>
              <label className="mt-4 grid gap-1 text-sm font-medium">Tujuan peminjaman
                <input
                  className="rounded-lg border p-2"
                  maxLength="255"
                  value={purposes[room.id] || ""}
                  onChange={(event) => setPurposes((current) => ({ ...current, [room.id]: event.target.value }))}
                />
              </label>
              <button type="button" onClick={() => book(room, purposes[room.id] || "")} className="mt-3 rounded-lg bg-blue-700 px-4 py-2 font-semibold text-white">
                Ajukan booking
              </button>
            </article>
          ))}
        </div>
        {!loading && rooms.length === 0 && !error && (
          <p className="mt-6 text-slate-600">
            {hasSearched ? "Tidak ada ruangan yang tersedia untuk jadwal tersebut." : "Cari jadwal untuk melihat ruangan yang tersedia."}
          </p>
        )}
      </section>
    </main>
  );
}
