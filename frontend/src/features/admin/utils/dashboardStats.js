export default function getDashboardStats({ rooms, users, bookings }) {
  const bookingCounts = bookings.reduce((counts, booking) => {
    if (Object.hasOwn(counts, booking.status)) counts[booking.status] += 1;
    return counts;
  }, { pending: 0, approved: 0, rejected: 0 });

  return {
    summary: [
      { key: "rooms", label: "Total ruang", value: rooms.length },
      { key: "activeRooms", label: "Ruangan aktif", value: rooms.filter((room) => Number(room.is_active) === 1).length },
      { key: "activeUsers", label: "Akun aktif", value: users.filter((user) => Number(user.is_active) === 1).length },
      { key: "pendingBookings", label: "Booking menunggu", value: bookingCounts.pending },
    ],
    bookingCounts,
  };
}
