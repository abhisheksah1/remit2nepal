const CURRENCY_ISO: Record<string, string> = {
  AED: "ae",
  AUD: "au",
  BDT: "bd",
  BHD: "bh",
  BRL: "br",
  CAD: "ca",
  CHF: "ch",
  CNY: "cn",
  CZK: "cz",
  DKK: "dk",
  EGP: "eg",
  EUR: "eu",
  GBP: "gb",
  HKD: "hk",
  HUF: "hu",
  IDR: "id",
  ILS: "il",
  INR: "in",
  IQD: "iq",
  JOD: "jo",
  JPY: "jp",
  KES: "ke",
  KRW: "kr",
  KWD: "kw",
  LKR: "lk",
  MYR: "my",
  NOK: "no",
  NPR: "np",
  NZD: "nz",
  OMR: "om",
  PHP: "ph",
  PKR: "pk",
  PLN: "pl",
  QAR: "qa",
  RUB: "ru",
  SAR: "sa",
  SEK: "se",
  SGD: "sg",
  THB: "th",
  TRY: "tr",
  TWD: "tw",
  USD: "us",
  ZAR: "za"
};

export function currencyIso(code?: string) {
  const upper = (code || "").trim().toUpperCase();
  if (!upper) return "";
  if (CURRENCY_ISO[upper]) return CURRENCY_ISO[upper];
  return upper.slice(0, 2).toLowerCase();
}

export function currencyFlagSrc(code?: string, width = 40) {
  const iso = currencyIso(code);
  if (!iso) return "";
  return `https://flagcdn.com/w${width}/${iso}.png`;
}
