export type HeroSceneCard = {
  kicker: string;
  title: string;
  note: string;
};

type ItemRow = Record<string, unknown>;

function asRow(value: unknown): ItemRow | null {
  if (!value || typeof value !== "object") return null;
  return value as ItemRow;
}

function text(row: ItemRow, key: string) {
  return String(row[key] ?? "").trim();
}

export function isHeroSceneRow(row: ItemRow) {
  return Boolean(text(row, "kicker") || text(row, "note") || text(row, "strong"));
}

export function heroChips(items: unknown): string[] {
  if (!Array.isArray(items)) return [];
  return items
    .map(asRow)
    .filter((row): row is ItemRow => Boolean(row) && text(row, "title") && !("value" in row) && !isHeroSceneRow(row))
    .map((row) => text(row, "title"));
}

export function heroSceneCards(items: unknown): HeroSceneCard[] {
  if (!Array.isArray(items)) return [];
  return items
    .map(asRow)
    .filter((row): row is ItemRow => Boolean(row) && isHeroSceneRow(row))
    .map((row) => ({
      kicker: text(row, "kicker"),
      title: text(row, "title") || text(row, "strong"),
      note: text(row, "note") || text(row, "em")
    }))
    .filter((row) => row.kicker || row.title || row.note);
}

export function heroTitleParts(textValue: string) {
  const fallback = [
    { text: "Receiving from abroad.", tone: "is-navy" },
    { text: "Paying families in Nepal.", tone: "is-red" }
  ];
  const trimmed = textValue.trim();
  if (!trimmed) return fallback;
  if (trimmed.includes("//")) {
    return trimmed
      .split("//")
      .map((part, index) => ({ text: part.trim(), tone: index % 2 === 0 ? "is-navy" : "is-red" }))
      .filter((part) => part.text);
  }
  return [{ text: trimmed, tone: "is-navy" }];
}
