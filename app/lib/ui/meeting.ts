const dateFormatter = new Intl.DateTimeFormat("id-ID", {
  weekday: "short",
  day: "numeric",
  month: "short",
  year: "numeric",
});

const timeFormatter = new Intl.DateTimeFormat("id-ID", {
  hour: "2-digit",
  minute: "2-digit",
});

export function formatMeetingDate(value: Date | null | undefined) {
  return value ? dateFormatter.format(value) : "Belum dijadwalkan";
}

export function formatMeetingTime(start: Date | null | undefined, end: Date | null | undefined) {
  if (!start) return "Waktu belum ditentukan";
  return end ? `${timeFormatter.format(start)}–${timeFormatter.format(end)}` : timeFormatter.format(start);
}
