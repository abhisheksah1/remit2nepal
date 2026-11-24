/** Bikram Sambat month lengths. 2000 BS Baisakh 1 = 14 Apr 1943 AD. */
const BS_MONTHS: Record<number, number[]> = {
  2000: [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  2001: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2002: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  2003: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  2004: [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  2005: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2006: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  2007: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  2008: [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 29, 31],
  2009: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2010: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  2011: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  2012: [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30],
  2013: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2014: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  2015: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  2016: [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30],
  2017: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2018: [31, 32, 31, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  2019: [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  2020: [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30],
  2021: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2022: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30],
  2023: [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  2024: [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30],
  2025: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2026: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  2027: [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  2028: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2029: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  2030: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  2031: [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  2032: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2033: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  2034: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  2035: [30, 32, 31, 32, 31, 31, 29, 30, 30, 29, 29, 31],
  2036: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2037: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  2038: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  2039: [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30],
  2040: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2041: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  2042: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  2043: [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30],
  2044: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2045: [31, 32, 31, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  2046: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  2047: [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30],
  2048: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2049: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30],
  2050: [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  2051: [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30],
  2052: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2053: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30],
  2054: [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  2055: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2056: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  2057: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  2058: [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  2059: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2060: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  2061: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  2062: [30, 32, 31, 32, 31, 31, 29, 30, 29, 30, 29, 31],
  2063: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2064: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  2065: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  2066: [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 29, 31],
  2067: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2068: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  2069: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  2070: [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30],
  2071: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2072: [31, 32, 31, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  2073: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  2074: [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30],
  2075: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2076: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30],
  2077: [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  2078: [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30],
  2079: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2080: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30],
  2081: [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  2082: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2083: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  2084: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  2085: [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  2086: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2087: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  2088: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  2089: [30, 32, 31, 32, 31, 31, 29, 30, 30, 29, 29, 31],
  2090: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30]
};

const BS_EPOCH_AD = Date.UTC(1943, 3, 14);

export const BS_MONTH_NAMES_EN = [
  "Baisakh",
  "Jestha",
  "Ashadh",
  "Shrawan",
  "Bhadra",
  "Ashwin",
  "Kartik",
  "Mangsir",
  "Poush",
  "Magh",
  "Falgun",
  "Chaitra"
];

export const BS_MONTH_NAMES_NP = ["वैशाख", "जेठ", "असार", "साउन", "भदौ", "असोज", "कार्तिक", "मंसिर", "पुस", "माघ", "फागुन", "चैत"];

export type BsDate = { year: number; month: number; day: number };

export function daysInBsMonth(year: number, month: number) {
  const row = BS_MONTHS[year];
  if (!row) throw new Error("Nepali year is out of range");
  return row[month - 1] ?? 30;
}

function daysBeforeBsYear(year: number) {
  let total = 0;
  for (let y = 2000; y < year; y += 1) {
    const row = BS_MONTHS[y];
    if (!row) throw new Error("Nepali year is out of range");
    total += row.reduce((sum, n) => sum + n, 0);
  }
  return total;
}

function daysBeforeBsMonth(year: number, month: number) {
  const row = BS_MONTHS[year];
  if (!row) throw new Error("Nepali year is out of range");
  return row.slice(0, month - 1).reduce((sum, n) => sum + n, 0);
}

export function bsToUtcDate(year: number, month: number, day: number) {
  const offset = daysBeforeBsYear(year) + daysBeforeBsMonth(year, month) + (day - 1);
  return new Date(BS_EPOCH_AD + offset * 86400000);
}

export function nepalToday(value = new Date()) {
  const shifted = new Date(value.getTime() + (5 * 60 + 45) * 60_000);
  return new Date(Date.UTC(shifted.getUTCFullYear(), shifted.getUTCMonth(), shifted.getUTCDate()));
}

export function adToBs(value: Date): BsDate {
  const utc = Date.UTC(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate());
  let remaining = Math.round((utc - BS_EPOCH_AD) / 86400000);
  if (remaining < 0) throw new Error("Date is before the Nepali calendar range");
  let year = 2000;
  while (year <= 2090) {
    const row = BS_MONTHS[year];
    if (!row) break;
    const yearDays = row.reduce((sum, n) => sum + n, 0);
    if (remaining < yearDays) break;
    remaining -= yearDays;
    year += 1;
  }
  let month = 1;
  const row = BS_MONTHS[year];
  if (!row) throw new Error("Nepali year is out of range");
  for (let i = 0; i < 12; i += 1) {
    if (remaining < row[i]!) break;
    remaining -= row[i]!;
    month += 1;
  }
  return { year, month, day: remaining + 1 };
}

export function isoDateUtc(value: Date) {
  return value.toISOString().slice(0, 10);
}

export function parseIsoUtc(iso: string) {
  const parts = iso.slice(0, 10).split("-");
  const year = Number(parts[0] || 1970);
  const month = Number(parts[1] || 1);
  const day = Number(parts[2] || 1);
  return new Date(Date.UTC(year, month - 1, day));
}

export function bsMonthRange(year: number, month: number) {
  const start = bsToUtcDate(year, month, 1);
  const end = bsToUtcDate(year, month, daysInBsMonth(year, month));
  return { start, end };
}

export function bsYearRange(year: number) {
  return { start: bsToUtcDate(year, 1, 1), end: bsToUtcDate(year, 12, daysInBsMonth(year, 12)) };
}

export function eachUtcDay(start: Date, end: Date) {
  const days: Date[] = [];
  const cursor = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate()));
  const last = Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), end.getUTCDate());
  while (cursor.getTime() <= last) {
    days.push(new Date(cursor));
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  return days;
}

export const ANNUAL_LEAVE_DAYS = 14;
export const TENURE_MONTHS_FOR_LEAVE = 6;

export function monthsOfService(joinDate: Date, asOf = new Date()) {
  const join = Date.UTC(joinDate.getUTCFullYear(), joinDate.getUTCMonth(), joinDate.getUTCDate());
  const now = Date.UTC(asOf.getUTCFullYear(), asOf.getUTCMonth(), asOf.getUTCDate());
  if (now < join) return 0;
  let months = (asOf.getUTCFullYear() - joinDate.getUTCFullYear()) * 12 + (asOf.getUTCMonth() - joinDate.getUTCMonth());
  if (asOf.getUTCDate() < joinDate.getUTCDate()) months -= 1;
  return Math.max(0, months);
}

export function annualEntitlement(joinDate: Date | null | undefined, asOf = new Date()) {
  if (!joinDate) return 0;
  return monthsOfService(joinDate, asOf) >= TENURE_MONTHS_FOR_LEAVE ? ANNUAL_LEAVE_DAYS : 0;
}

const NP_DIGITS = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"];
export const BS_WEEKDAYS_NP = ["आइतबार", "सोमबार", "मंगलबार", "बुधबार", "बिहिबार", "शुक्रबार", "शनिबार"];
export const BS_WEEKDAYS_EN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function toNepaliDigits(value: number | string) {
  return String(value).replace(/\d/g, (digit) => NP_DIGITS[Number(digit)] ?? digit);
}

export function formatBsFull(value: string | Date | null | undefined) {
  if (!value) return "—";
  const date = typeof value === "string" ? parseIsoUtc(value.slice(0, 10)) : nepalToday(value);
  if (Number.isNaN(date.getTime())) return "—";
  try {
    const bs = adToBs(date);
    const weekday = BS_WEEKDAYS_NP[date.getUTCDay()] ?? "";
    return `${toNepaliDigits(bs.day)} ${BS_MONTH_NAMES_NP[bs.month - 1]} ${toNepaliDigits(bs.year)} · ${weekday}`;
  } catch {
    return "—";
  }
}

export function formatBsShort(value: string | Date | null | undefined) {
  if (!value) return "—";
  const date = typeof value === "string" ? parseIsoUtc(value.slice(0, 10)) : value;
  if (Number.isNaN(date.getTime())) return "—";
  try {
    const bs = adToBs(date);
    return `${toNepaliDigits(bs.day)} ${BS_MONTH_NAMES_NP[bs.month - 1]} ${toNepaliDigits(bs.year)}`;
  } catch {
    return "—";
  }
}

export function availableBsYears() {
  return Array.from({ length: 16 }, (_, i) => 2075 + i);
}
