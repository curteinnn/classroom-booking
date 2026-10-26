import { useState } from "react";
import { createBooking } from "../../bookings/bookingsApi";
import { searchAvailableRooms } from "../roomsApi";

export default function useRoomSearch(filters) {
  const [rooms, setRooms] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);

  async function search(event) {
    event.preventDefault();
    setError("");
    setNotice("");
    setHasSearched(true);
    setLoading(true);
    try {
      const data = await searchAvailableRooms(filters);
      setRooms(data.rooms || []);
    } catch (requestError) {
      setError(requestError.message);
      setRooms([]);
    } finally {
      setLoading(false);
    }
  }

  async function book(room, purpose) {
    const tujuan = purpose.trim();
    if (!tujuan) {
      setError("Isi tujuan peminjaman sebelum mengajukan booking.");
      return;
    }
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
      setNotice(
        data.message || "Booking diajukan dan menunggu persetujuan admin.",
      );
      setRooms((current) => current.filter((item) => item.id !== room.id));
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  return { rooms, hasSearched, error, notice, loading, search, book };
}
