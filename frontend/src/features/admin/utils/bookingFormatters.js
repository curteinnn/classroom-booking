export function formatBookingDate(value) {
  return value ? String(value).slice(0, 10) : "-";
}
