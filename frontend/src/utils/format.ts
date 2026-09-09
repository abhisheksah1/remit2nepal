const dateFmt = new Intl.DateTimeFormat("en-NP", {
  day: "2-digit",
  month: "short",
  year: "numeric"
});

const dateTimeFmt = new Intl.DateTimeFormat("en-NP", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit"
});

function toDate(value: string | Date | null | undefined): Date | null {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatDate(value: string | Date | null | undefined): string {
  const date = toDate(value);
  return date ? dateFmt.format(date) : "—";
}

export function formatDateTime(value: string | Date | null | undefined): string {
  const date = toDate(value);
  return date ? dateTimeFmt.format(date) : "—";
}

export function formatNpr(value: number | null | undefined, decimals = 2): string {
  if (value == null || Number.isNaN(value)) return "—";
  return value.toLocaleString("en-NP", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
}

export function formatNumber(value: number | null | undefined): string {
  if (value == null || Number.isNaN(value)) return "—";
  return value.toLocaleString("en-NP");
}

export function formatPercent(value: number | string | null | undefined): string {
  if (value == null || value === "") return "—";
  const numeric = typeof value === "number" ? value : Number(value);
  if (Number.isNaN(numeric)) return "—";
  const sign = numeric > 0 ? "+" : "";
  return `${sign}${numeric.toFixed(2)}%`;
}

export function formatFileSize(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) return "—";
  if (bytes < 1024) return `${bytes} B`;
  const units = ["KB", "MB", "GB"];
  let size = bytes / 1024;
  let unit = 0;
  while (size >= 1024 && unit < units.length - 1) {
    size /= 1024;
    unit += 1;
  }
  return `${size.toFixed(size >= 10 ? 0 : 1)} ${units[unit]}`;
}

export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "R";
  const first = parts[0]?.[0] ?? "R";
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : "";
  return `${first}${last}`.toUpperCase();
}

export function isoDateInput(value?: string | Date | null): string {
  const date = toDate(value) ?? new Date();
  return date.toISOString().slice(0, 10);
}

export function rangeToDates(range: string, customFrom?: string, customTo?: string): { from: string; to: string } {
  const to = new Date();
  const from = new Date();
  switch (range) {
    case "today":
      from.setHours(0, 0, 0, 0);
      break;
    case "7d":
      from.setDate(from.getDate() - 7);
      break;
    case "30d":
      from.setDate(from.getDate() - 30);
      break;
    case "3m":
      from.setMonth(from.getMonth() - 3);
      break;
    case "6m":
      from.setMonth(from.getMonth() - 6);
      break;
    case "1y":
      from.setFullYear(from.getFullYear() - 1);
      break;
    case "custom":
      return {
        from: customFrom || isoDateInput(new Date(Date.now() - 30 * 86400000)),
        to: customTo || isoDateInput(to)
      };
    default:
      from.setDate(from.getDate() - 30);
  }
  return { from: isoDateInput(from), to: isoDateInput(to) };
}
