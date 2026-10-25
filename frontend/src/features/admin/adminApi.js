import { apiRequest } from "../../shared/api/httpClient";

export async function getAdminDashboardData() {
  const [rooms, users, bookings] = await Promise.all([
    apiRequest("/api/admin/rooms"),
    apiRequest("/api/admin/users"),
    apiRequest("/api/admin/bookings"),
  ]);
  return {
    rooms: rooms.rooms || [],
    users: users.users || [],
    bookings: bookings.bookings || [],
  };
}

export function saveRoom(roomId, payload) {
  return apiRequest(roomId ? `/api/admin/rooms/${roomId}` : "/api/admin/rooms", {
    method: roomId ? "PUT" : "POST",
    body: JSON.stringify(payload),
  });
}

export function deleteRoom(roomId) {
  return apiRequest(`/api/admin/rooms/${roomId}`, { method: "DELETE" });
}

export function setRoomStatus(roomId, is_active) {
  return apiRequest(`/api/admin/rooms/${roomId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ is_active }),
  });
}

export function createUser(payload) {
  return apiRequest("/api/admin/users", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function setUserStatus(userId, is_active) {
  return apiRequest(`/api/admin/users/${userId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ is_active }),
  });
}

export function setBookingStatus(bookingId, payload) {
  return apiRequest(`/api/admin/bookings/${bookingId}/status`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}
