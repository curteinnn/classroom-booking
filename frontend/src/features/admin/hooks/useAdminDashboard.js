import { useCallback, useEffect, useState } from "react";
import {
  createUser as createAdminUser,
  deleteRoom as deleteAdminRoom,
  getAdminDashboardData,
  saveRoom as saveAdminRoom,
  setBookingStatus,
  setRoomStatus,
  setUserStatus,
} from "../adminApi";

const emptyRoom = { nama_ruangan: "", kapasitas: "", lokasi: "" };
const emptyUser = { nama: "", identifier: "", email: "", role: "mahasiswa" };

export default function useAdminDashboard() {
  const [rooms, setRooms] = useState([]);
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [roomForm, setRoomForm] = useState(emptyRoom);
  const [editingRoomId, setEditingRoomId] = useState(null);
  const [userForm, setUserForm] = useState(emptyUser);
  const [rejectionReasons, setRejectionReasons] = useState({});
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const data = await getAdminDashboardData();
      setRooms(data.rooms);
      setUsers(data.users);
      setBookings(data.bookings);
      setError("");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function runAction(action, fallbackMessage) {
    setError("");
    setNotice("");
    try {
      const data = await action();
      setNotice(data.message || fallbackMessage);
      await refresh();
      return true;
    } catch (requestError) {
      setError(requestError.message);
      return false;
    }
  }

  function editRoom(room) {
    setEditingRoomId(room.id);
    setRoomForm({
      nama_ruangan: room.nama_ruangan,
      kapasitas: String(room.kapasitas),
      lokasi: room.lokasi,
    });
  }

  function cancelRoomEdit() {
    setEditingRoomId(null);
    setRoomForm(emptyRoom);
  }

  async function submitRoom(event) {
    event.preventDefault();
    const payload = { ...roomForm, kapasitas: Number(roomForm.kapasitas) };
    const saved = await runAction(
      () => saveAdminRoom(editingRoomId, payload),
      "Data ruangan berhasil disimpan.",
    );
    if (saved) cancelRoomEdit();
  }

  async function removeRoom(room) {
    if (!window.confirm(`Hapus ruangan ${room.nama_ruangan}?`)) return;
    await runAction(() => deleteAdminRoom(room.id), "Ruangan berhasil dihapus.");
  }

  async function toggleRoom(room) {
    await runAction(
      () => setRoomStatus(room.id, Number(room.is_active) !== 1),
      "Status ruangan berhasil diubah.",
    );
  }

  async function submitUser(event) {
    event.preventDefault();
    const created = await runAction(() => createAdminUser(userForm), "Akun pengguna dibuat.");
    if (created) setUserForm(emptyUser);
  }

  async function toggleUser(user) {
    await runAction(
      () => setUserStatus(user.id, Number(user.is_active) !== 1),
      "Status akun berhasil diubah.",
    );
  }

  async function reviewBooking(booking, status) {
    const rejection_reason = (rejectionReasons[booking.id] || "").trim();
    if (status === "rejected" && !rejection_reason) {
      setError("Isi alasan penolakan sebelum menolak booking.");
      return;
    }
    await runAction(
      () => setBookingStatus(booking.id, { status, rejection_reason }),
      "Status booking berhasil diperbarui.",
    );
  }

  return {
    rooms,
    users,
    bookings,
    roomForm,
    setRoomForm,
    editingRoomId,
    userForm,
    setUserForm,
    rejectionReasons,
    setRejectionReasons,
    notice,
    error,
    loading,
    editRoom,
    cancelRoomEdit,
    submitRoom,
    removeRoom,
    toggleRoom,
    submitUser,
    toggleUser,
    reviewBooking,
  };
}
