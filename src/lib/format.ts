export function money(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

export function ago(at: number) {
  const minutes = Math.round((Date.now() - at) / 60000);
  if (!Number.isFinite(minutes) || minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days === 1) return "yesterday";
  return `${days}d ago`;
}

export function miles(n: number) {
  return `${new Intl.NumberFormat("en-US").format(n)} mi`;
}

export function yearsLabel(start: number, end: number) {
  return start === end ? String(start) : `${start}–${end}`;
}
