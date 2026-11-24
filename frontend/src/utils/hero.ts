export type HeroSceneCard = {
  kicker: string;
  title: string;
  note: string;
};

export type HeroBgSlide = {
  title: string;
  imageUrl: string;
};

type ItemRow = Record<string, unknown>;

function asRow(value: unknown): ItemRow | null {
  if (!value || typeof value !== "object") return null;
  return value as ItemRow;
}

function text(row: ItemRow, key: string) {
  return String(row[key] ?? "").trim();
}

export function isHeroBgSettingsRow(row: ItemRow) {
  return text(row, "kind") === "heroBgSettings";
}

export function isHeroSlideRow(row: ItemRow) {
  if (isHeroBgSettingsRow(row)) return false;
  return text(row, "kind") === "heroSlide" || Boolean(text(row, "imageUrl"));
}

export function isHeroSceneRow(row: ItemRow) {
  if (isHeroSlideRow(row) || isHeroBgSettingsRow(row)) return false;
  return Boolean(text(row, "kicker") || text(row, "note") || text(row, "strong"));
}

export function heroChips(items: unknown): string[] {
  if (!Array.isArray(items)) return [];
  return items
    .map(asRow)
    .filter(
      (row): row is ItemRow =>
        Boolean(row) && text(row, "title") && !("value" in row) && !isHeroSceneRow(row) && !isHeroSlideRow(row) && !isHeroBgSettingsRow(row)
    )
    .map((row) => text(row, "title"));
}

export function heroBgSlides(items: unknown, fallbackUrl = ""): HeroBgSlide[] {
  const slides: HeroBgSlide[] = [];
  if (Array.isArray(items)) {
    for (const value of items) {
      const row = asRow(value);
      if (!row || !isHeroSlideRow(row)) continue;
      const imageUrl = text(row, "imageUrl");
      if (!imageUrl) continue;
      slides.push({ title: text(row, "title"), imageUrl });
    }
  }
  const fallback = fallbackUrl.trim();
  if (!slides.length && fallback) return [{ title: "", imageUrl: fallback }];
  return slides;
}

export function heroBgSeconds(items: unknown, fallback = 5) {
  if (!Array.isArray(items)) return fallback;
  for (const value of items) {
    const row = asRow(value);
    if (!row || !isHeroBgSettingsRow(row)) continue;
    const seconds = Number(row.seconds);
    if (Number.isFinite(seconds) && seconds >= 3 && seconds <= 30) return Math.round(seconds);
  }
  return fallback;
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
