import { useCallback, useEffect, useRef, useState } from "react";
import { usePageAnimations } from "../../../animations/cardAnimations";
import { cancelBooking, getMyBookings } from "../bookingsApi";

export default function useBookingHistory() {
  const pageRef = useRef(null);
  usePageAnimations(pageRef);
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const data = await getMyBookings();
      setBookings(data.bookings || []);
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

  async function cancel(bookingId) {
    setError("");
    try {
      await cancelBooking(bookingId);
      await refresh();
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  function handleCancel(event) {
    cancel(event.currentTarget.dataset.bookingId);
  }

  return { pageRef, bookings, error, loading, handleCancel };
}
