type ItemRow = Record<string, unknown>;

function asRow(value: unknown): ItemRow | null {
  if (!value || typeof value !== "object") return null;
  return value as ItemRow;
}

function text(row: ItemRow, key: string) {
  return String(row[key] ?? "").trim();
}

export type RemittancePoint = {
  title: string;
  description: string;
};

export function remittanceWord(items: unknown, heading = "") {
  if (Array.isArray(items)) {
    for (const item of items) {
      const row = asRow(item);
      if (!row) continue;
      const word = text(row, "word");
      if (word) return word.toUpperCase();
    }
  }
  const title = heading.trim();
  if (title && title.length <= 16 && !title.includes(" ")) return title.toUpperCase();
  return "REMITTANCE";
}

export function remittancePoints(items: unknown): RemittancePoint[] {
  if (!Array.isArray(items)) return [];
  return items
    .map(asRow)
    .filter((row): row is ItemRow => Boolean(row) && text(row, "title") && !text(row, "word"))
    .map((row) => ({
      title: text(row, "title"),
      description: text(row, "description")
    }));
}
