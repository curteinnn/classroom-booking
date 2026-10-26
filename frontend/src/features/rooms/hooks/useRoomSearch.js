import { useRef, useState } from "react";
import { createBooking } from "../../bookings/bookingsApi";
import { searchAvailableRooms, searchRoomsByName } from "../roomsApi";

export default function useRoomSearch(filters, activeModeRef) {
  const [rooms, setRooms] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);
  const [bookingRoomId, setBookingRoomId] = useState(null);
  const searchInProgress = useRef(false);
  const searchRevision = useRef(0);
  const bookingInProgress = useRef(false);

  function clearResults() {
    searchRevision.current += 1;
    setRooms([]);
    setHasSearched(false);
    setError("");
    setNotice("");
  }

  async function search(event, { mode, roomName }) {
    event.preventDefault();
    if (searchInProgress.current) return;
    if (mode === "room" && !roomName.trim()) {
      setError("Masukkan nama ruang untuk memulai pencarian.");
      return;
    }

    searchInProgress.current = true;
    const revision = ++searchRevision.current;
    setError("");
    setNotice("");
    setHasSearched(true);
    setRooms([]);
    setLoading(true);
    try {
      let resultRooms;
      if (mode === "room") {
        const [availableData, namedData] = await Promise.all([
          searchAvailableRooms(filters),
          searchRoomsByName(roomName),
        ]);
        const availableIds = new Set((availableData.rooms || []).map((room) => String(room.id)));
        resultRooms = (namedData.rooms || []).filter((room) => availableIds.has(String(room.id)));
      } else {
        const availableData = await searchAvailableRooms(filters);
        resultRooms = availableData.rooms || [];
      }

      if (searchRevision.current === revision && activeModeRef.current === mode) setRooms(resultRooms);
    } catch (requestError) {
      if (searchRevision.current === revision && activeModeRef.current === mode) {
        setError(requestError.message);
        setRooms([]);
      }
    } finally {
      searchInProgress.current = false;
      setLoading(false);
    }
  }

  async function book(room, purpose) {
    if (bookingInProgress.current) return;
    const tujuan = purpose.trim();
    if (!tujuan) {
      setError("Isi tujuan peminjaman sebelum mengajukan booking.");
      return;
    }
    bookingInProgress.current = true;
    setBookingRoomId(room.id);
    setError("");
    setNotice("");
    try {
      const data = await createBooking({
        room_id: room.id,
        tanggal: filters.tanggal,
        jam_mulai: filters.jam_mulai,
        jam_selesai: filters.jam_selesai,
        tujuan,
      });
      setNotice(data.message || "Booking diajukan dan menunggu persetujuan admin.");
      setRooms((current) => current.filter((item) => item.id !== room.id));
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      bookingInProgress.current = false;
      setBookingRoomId(null);
    }
  }

  return { rooms, hasSearched, error, notice, loading, bookingRoomId, search, book, clearResults };
}
