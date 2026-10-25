import { useCallback, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { apiRequest } from "../services/api";

const emptyRoom = { nama_ruangan: "", kapasitas: "", lokasi: "" };
const emptyUser = { nama: "", identifier: "", email: "", role: "mahasiswa" };

function dateLabel(value) {
  if (!value) return "-";
  return String(value).slice(0, 10);
}

export default function AdminDashboard() {
  const [rooms, setRooms] = useState([]);
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [roomForm, setRoomForm] = useState(emptyRoom);
  const [editingRoom, setEditingRoom] = useState(null);
  const [userForm, setUserForm] = useState(emptyUser);
  const [rejectionReasons, setRejectionReasons] = useState({});
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const loadDashboard = useCallback(async () => {
    setError("");
    try {
      const [roomData, userData, bookingData] = await Promise.all([
        apiRequest("/api/admin/rooms"),
        apiRequest("/api/admin/users"),
        apiRequest("/api/admin/bookings"),
      ]);
      setRooms(roomData.rooms || []);
      setUsers(userData.users || []);
      setBookings(bookingData.bookings || []);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  function startRoomEdit(room) {
    setEditingRoom(room.id);
    setRoomForm({
      nama_ruangan: room.nama_ruangan,
      kapasitas: String(room.kapasitas),
      lokasi: room.lokasi,
    });
  }

  function resetRoomForm() {
    setEditingRoom(null);
    setRoomForm(emptyRoom);
  }

  async function saveRoom(event) {
    event.preventDefault();
    setError("");
    setNotice("");
    try {
      const isEditing = editingRoom !== null;
      const data = await apiRequest(
        isEditing ? `/api/admin/rooms/${editingRoom}` : "/api/admin/rooms",
        {
          method: isEditing ? "PUT" : "POST",
          body: JSON.stringify({
            ...roomForm,
            kapasitas: Number(roomForm.kapasitas),
          }),
        },
      );
      setNotice(data.message || "Data ruangan tersimpan.");
      resetRoomForm();
      await loadDashboard();
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  async function deleteRoom(room) {
    if (!window.confirm(`Hapus ruangan ${room.nama_ruangan}?`)) return;
    setError("");
    setNotice("");
    try {
      const data = await apiRequest(`/api/admin/rooms/${room.id}`, { method: "DELETE" });
      setNotice(data.message);
      await loadDashboard();
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  async function setRoomActive(room, isActive) {
    setError("");
    setNotice("");
    try {
      const data = await apiRequest(`/api/admin/rooms/${room.id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ is_active: isActive }),
      });
      setNotice(data.message);
      await loadDashboard();
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  async function createUser(event) {
    event.preventDefault();
    setError("");
    setNotice("");
    try {
      const data = await apiRequest("/api/admin/users", {
        method: "POST",
        body: JSON.stringify(userForm),
      });
      setNotice(data.message);
      setUserForm(emptyUser);
      await loadDashboard();
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  async function toggleUser(user) {
    const isActive = Number(user.is_active) !== 1;
    setError("");
    setNotice("");
    try {
      const data = await apiRequest(`/api/admin/users/${user.id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ is_active: isActive }),
      });
      setNotice(data.message);
      await loadDashboard();
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  async function updateBookingStatus(booking, status) {
    const rejection_reason = (rejectionReasons[booking.id] || "").trim();
    if (status === "rejected" && !rejection_reason) {
      setError("Isi alasan penolakan sebelum menolak booking.");
      return;
    }

    setError("");
    setNotice("");
    try {
      const data = await apiRequest(`/api/admin/bookings/${booking.id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status, rejection_reason }),
      });
      setNotice(data.message);
      await loadDashboard();
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  const pendingCount = bookings.filter((booking) => booking.status === "pending").length;
  const activeRoomCount = rooms.filter((room) => Number(room.is_active) === 1).length;
  const activeUserCount = users.filter((user) => Number(user.is_active) === 1).length;

  return (
    <main className="min-h-screen bg-slate-50 pt-16">
      <Navbar />
      <div className="mx-auto max-w-7xl space-y-8 px-5 py-8">
        <header>
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">SmartClass · Admin</p>
          <h1 className="mt-1 text-3xl font-bold text-slate-900">Dashboard admin</h1>
          <p className="mt-2 text-slate-600">Kelola ruangan, akun, dan persetujuan peminjaman dari satu halaman.</p>
        </header>

        {error && <p role="alert" className="rounded-xl bg-red-50 p-4 text-red-800">{error}</p>}
        {notice && <p role="status" className="rounded-xl bg-green-50 p-4 text-green-800">{notice}</p>}

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label="Ringkasan">
          {[
            ["Total ruangan", rooms.length],
            ["Ruangan aktif", activeRoomCount],
            ["Akun aktif", activeUserCount],
            ["Booking menunggu", pendingCount],
          ].map(([label, value]) => (
            <article key={label} className="rounded-2xl bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">{label}</p>
              <p className="mt-2 text-3xl font-bold text-blue-800">{value}</p>
            </article>
          ))}
        </section>

        <section className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="mb-5">
            <h2 className="text-xl font-bold">Pengelolaan ruangan</h2>
            <p className="mt-1 text-sm text-slate-600">Tambah, ubah, nonaktifkan, atau hapus ruangan.</p>
          </div>
          <form onSubmit={saveRoom} className="grid gap-3 rounded-xl bg-slate-50 p-4 md:grid-cols-4">
            <input className="rounded-lg border bg-white p-2" placeholder="Nama ruangan" maxLength="100" value={roomForm.nama_ruangan} onChange={(event) => setRoomForm({ ...roomForm, nama_ruangan: event.target.value })} required />
            <input className="rounded-lg border bg-white p-2" placeholder="Lokasi" maxLength="150" value={roomForm.lokasi} onChange={(event) => setRoomForm({ ...roomForm, lokasi: event.target.value })} required />
            <input className="rounded-lg border bg-white p-2" placeholder="Kapasitas" type="number" min="1" max="50" value={roomForm.kapasitas} onChange={(event) => setRoomForm({ ...roomForm, kapasitas: event.target.value })} required />
            <div className="flex gap-2">
              <button className="flex-1 rounded-lg bg-blue-700 px-4 py-2 font-semibold text-white">{editingRoom ? "Simpan perubahan" : "Tambah ruangan"}</button>
              {editingRoom && <button type="button" onClick={resetRoomForm} className="rounded-lg border px-3 py-2">Batal</button>}
            </div>
          </form>
          <div className="mt-4 divide-y">
            {rooms.map((room) => (
              <article key={room.id} className="flex flex-col justify-between gap-3 py-4 sm:flex-row sm:items-center">
                <div>
                  <h3 className="font-semibold text-slate-900">{room.nama_ruangan}</h3>
                  <p className="text-sm text-slate-600">{room.lokasi} · {room.kapasitas} orang · {Number(room.is_active) === 1 ? "Aktif" : "Nonaktif"}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={() => startRoomEdit(room)} className="rounded-lg border px-3 py-2 text-sm">Ubah</button>
                  <button type="button" onClick={() => setRoomActive(room, Number(room.is_active) !== 1)} className="rounded-lg border px-3 py-2 text-sm">{Number(room.is_active) === 1 ? "Nonaktifkan" : "Aktifkan"}</button>
                  <button type="button" onClick={() => deleteRoom(room)} className="rounded-lg border border-red-200 px-3 py-2 text-sm text-red-700">Hapus</button>
                </div>
              </article>
            ))}
            {!loading && rooms.length === 0 && <p className="py-4 text-sm text-slate-500">Belum ada ruangan.</p>}
          </div>
        </section>

        <section className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <h2 className="text-xl font-bold">Buat akun pengguna</h2>
            <p className="mb-4 mt-1 text-sm text-slate-600">Pengguna menerima tautan aktivasi melalui email.</p>
            <form onSubmit={createUser} className="space-y-3">
              <input className="w-full rounded-lg border p-2" placeholder="Nama lengkap" maxLength="100" value={userForm.nama} onChange={(event) => setUserForm({ ...userForm, nama: event.target.value })} required />
              <input className="w-full rounded-lg border p-2" placeholder="Identifier" maxLength="50" value={userForm.identifier} onChange={(event) => setUserForm({ ...userForm, identifier: event.target.value })} required />
              <input className="w-full rounded-lg border p-2" type="email" placeholder="Email" maxLength="150" value={userForm.email} onChange={(event) => setUserForm({ ...userForm, email: event.target.value })} required />
              <select className="w-full rounded-lg border bg-white p-2" value={userForm.role} onChange={(event) => setUserForm({ ...userForm, role: event.target.value })}>
                <option value="mahasiswa">Mahasiswa</option>
                <option value="dosen">Dosen</option>
              </select>
              <button className="w-full rounded-lg bg-blue-700 px-4 py-2 font-semibold text-white">Buat akun</button>
            </form>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <h2 className="text-xl font-bold">Daftar pengguna</h2>
            <div className="mt-3 max-h-[34rem] divide-y overflow-auto">
              {users.map((user) => (
                <article key={user.id} className="flex items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <p className="truncate font-medium">{user.nama} <span className="text-xs font-normal uppercase text-slate-500">{user.role}</span></p>
                    <p className="truncate text-sm text-slate-600">{user.identifier} · {user.email}</p>
                    <p className="text-xs text-slate-500">{Number(user.is_active) === 1 ? "Aktif" : "Belum aktif / nonaktif"}</p>
                  </div>
                  {user.role !== "admin" && (
                    <button type="button" onClick={() => toggleUser(user)} className="shrink-0 rounded-lg border px-3 py-2 text-xs">
                      {Number(user.is_active) === 1 ? "Nonaktifkan" : "Aktifkan"}
                    </button>
                  )}
                </article>
              ))}
              {!loading && users.length === 0 && <p className="py-4 text-sm text-slate-500">Belum ada pengguna.</p>}
            </div>
          </div>
        </section>

        <section className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="mb-4">
            <h2 className="text-xl font-bold">Persetujuan booking</h2>
            <p className="mt-1 text-sm text-slate-600">Booking pending ditampilkan lebih dahulu. Persetujuan akan memeriksa ulang bentrok jadwal.</p>
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
                    <input className="rounded-lg border p-2 text-sm" maxLength="500" placeholder="Alasan penolakan (wajib jika menolak)" value={rejectionReasons[booking.id] || ""} onChange={(event) => setRejectionReasons({ ...rejectionReasons, [booking.id]: event.target.value })} />
                    <div className="flex gap-2">
                      <button type="button" onClick={() => updateBookingStatus(booking, "approved")} className="flex-1 rounded-lg bg-green-700 px-3 py-2 text-sm font-semibold text-white">Setujui</button>
                      <button type="button" onClick={() => updateBookingStatus(booking, "rejected")} className="flex-1 rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-700">Tolak</button>
                    </div>
                  </div>
                )}
              </article>
            ))}
            {!loading && bookings.length === 0 && <p className="py-4 text-sm text-slate-500">Belum ada booking.</p>}
          </div>
        </section>
      </div>
    </main>
  );
}
