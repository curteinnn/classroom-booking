import { useCallback, useEffect, useState } from "react";
import getDashboardStats from "../utils/dashboardStats";
import {
  createUser as createAdminUser,
  deleteRoom as deleteAdminRoom,
  getAdminDashboardData,
  saveRoom as saveAdminRoom,
  setBookingStatus as updateBookingStatus,
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
  const [activeSection, setActiveSection] = useState("rooms");
  const [bookingStatus, setBookingStatus] = useState("pending");
  const [processingBookingId, setProcessingBookingId] = useState(null);
  const [userSearch, setUserSearch] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState("all");

  const applyDashboardData = useCallback((data) => {
    setRooms(data.rooms);
    setUsers(data.users);
    setBookings(data.bookings);
  }, []);

  const refresh = useCallback(async () => {
    try {
      const data = await getAdminDashboardData();
      applyDashboardData(data);
      setError("");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }, [applyDashboardData]);

  useEffect(() => {
    let active = true;
    getAdminDashboardData()
      .then((data) => {
        if (!active) return;
        applyDashboardData(data);
        setError("");
      })
      .catch((requestError) => {
        if (active) setError(requestError.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [applyDashboardData]);

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

  function handleRoomFormChange(event) {
    const { field } = event.target.dataset;
    setRoomForm((current) => ({ ...current, [field]: event.target.value }));
  }

  function handleUserFormChange(event) {
    const { field } = event.target.dataset;
    setUserForm((current) => ({ ...current, [field]: event.target.value }));
  }

  function handleRoomAction(event) {
    const button = event.target.closest("[data-room-action]");
    if (!button) return;
    const room = rooms.find(({ id }) => String(id) === button.dataset.roomId);
    if (button.dataset.roomAction === "cancel") cancelRoomEdit();
    if (!room) return;
    if (button.dataset.roomAction === "edit") editRoom(room);
    if (button.dataset.roomAction === "toggle") toggleRoom(room);
    if (button.dataset.roomAction === "delete") removeRoom(room);
  }

  function handleUserStatus(event) {
    const user = users.find(({ id }) => String(id) === event.currentTarget.dataset.userId);
    if (user) toggleUser(user);
  }

  function handleBookingReasonChange(event) {
    const bookingId = event.target.dataset.bookingId;
    setRejectionReasons((current) => ({ ...current, [bookingId]: event.target.value }));
  }

  function handleBookingReview(event) {
    const booking = bookings.find(({ id }) => String(id) === event.currentTarget.dataset.bookingId);
    if (booking) reviewBooking(booking, event.currentTarget.dataset.status);
  }

  function handleSectionSelect(event) {
    setActiveSection(event.currentTarget.dataset.section);
  }

  function handleBookingStatusSelect(event) {
    setBookingStatus(event.currentTarget.dataset.status);
  }

  function handleUserSearch(event) {
    setUserSearch(event.target.value);
  }

  function handleUserRoleFilter(event) {
    setUserRoleFilter(event.target.value);
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
    if (processingBookingId !== null) return;
    const rejection_reason = (rejectionReasons[booking.id] || "").trim();
    if (status === "rejected" && !rejection_reason) {
      setError("Isi alasan penolakan sebelum menolak booking.");
      return;
    }
    setProcessingBookingId(booking.id);
    try {
      await runAction(
        () => updateBookingStatus(booking.id, { status, rejection_reason }),
        "Status booking berhasil diperbarui.",
      );
    } finally {
      setProcessingBookingId(null);
    }
  }

  const filteredUsers = users.filter((user) => {
    const query = userSearch.trim().toLowerCase();
    const matchesQuery = !query || [user.nama, user.identifier, user.email].some((value) => String(value || "").toLowerCase().includes(query));
    const matchesRole = userRoleFilter === "all" || user.role === userRoleFilter;
    return matchesQuery && matchesRole;
  });
  const filteredBookings = bookings.filter((booking) => booking.status === bookingStatus);
  const dashboardStats = getDashboardStats({ rooms, users, bookings });
  const menuCounts = { rooms: rooms.length, users: users.length, bookings: bookings.length, pending: dashboardStats.bookingCounts.pending };

  return {
    stats: dashboardStats.summary,
    bookingCounts: dashboardStats.bookingCounts,
    menuCounts,
    activeSection,
    bookingStatus,
    processingBookingId,
    rooms,
    users,
    filteredUsers,
    userSearch,
    userRoleFilter,
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
    handleRoomFormChange,
    handleUserFormChange,
    handleRoomAction,
    handleUserStatus,
    handleBookingReasonChange,
    handleBookingReview,
    handleSectionSelect,
    handleBookingStatusSelect,
    handleUserSearch,
    handleUserRoleFilter,
    filteredBookings,
    cancelRoomEdit,
    submitRoom,
    removeRoom,
    toggleRoom,
    submitUser,
    toggleUser,
    reviewBooking,
  };
}
