import { apiRequest } from "../../shared/api/httpClient";

export function searchAvailableRooms(filters) {
  const query = new URLSearchParams({
    tanggal: filters.tanggal,
    jam_mulai: filters.jam_mulai,
    jam_selesai: filters.jam_selesai,
    kapasitas: filters.kapasitas,
  });
  if (filters.lokasi.trim()) query.set("lokasi", filters.lokasi.trim());

  return apiRequest(`/api/admin/rooms/search/available?${query}`);
}
