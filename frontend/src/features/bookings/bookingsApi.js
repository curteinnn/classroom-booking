import { apiRequest } from "../../shared/api/httpClient";

export function createBooking(payload) {
  return apiRequest("/api/bookings", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getMyBookings() {
  return apiRequest("/api/bookings/my");
}

export function cancelBooking(bookingId) {
  return apiRequest(`/api/bookings/${bookingId}/cancel`, { method: "PATCH" });
}
