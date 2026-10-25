function isValidDate(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

function normalizeTime(value) {
  if (typeof value !== "string") return null;

  const match = /^(\d{2}):(\d{2})(?::(\d{2}))?$/.exec(value);
  if (!match) return null;

  const [, hour, minute, second = "00"] = match;
  if (Number(hour) > 23 || Number(minute) > 59 || Number(second) > 59) {
    return null;
  }

  return `${hour}:${minute}:${second}`;
}

function parseCapacity(value) {
  if (
    typeof value !== "number" &&
    !(typeof value === "string" && /^\d+$/.test(value.trim()))
  ) {
    return null;
  }

  const capacity = Number(value);
  return Number.isSafeInteger(capacity) && capacity >= 1 && capacity <= 50
    ? capacity
    : null;
}

module.exports = { isValidDate, normalizeTime, parseCapacity };
