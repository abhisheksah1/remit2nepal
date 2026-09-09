export interface CurrencyMeta {
  country: string;
  flag: string;
  symbol: string;
  displayOrder: number;
}

export const CURRENCY_META: Record<string, CurrencyMeta> = {
  USD: { country: "United States", flag: "🇺🇸", symbol: "$", displayOrder: 1 },
  EUR: { country: "Eurozone", flag: "🇪🇺", symbol: "€", displayOrder: 2 },
  GBP: { country: "United Kingdom", flag: "🇬🇧", symbol: "£", displayOrder: 3 },
  AED: { country: "United Arab Emirates", flag: "🇦🇪", symbol: "د.إ", displayOrder: 4 },
  QAR: { country: "Qatar", flag: "🇶🇦", symbol: "ر.ق", displayOrder: 5 },
  SAR: { country: "Saudi Arabia", flag: "🇸🇦", symbol: "ر.س", displayOrder: 6 },
  AUD: { country: "Australia", flag: "🇦🇺", symbol: "A$", displayOrder: 7 },
  INR: { country: "India", flag: "🇮🇳", symbol: "₹", displayOrder: 8 },
  JPY: { country: "Japan", flag: "🇯🇵", symbol: "¥", displayOrder: 9 },
  MYR: { country: "Malaysia", flag: "🇲🇾", symbol: "RM", displayOrder: 10 },
  CAD: { country: "Canada", flag: "🇨🇦", symbol: "C$", displayOrder: 11 },
  CHF: { country: "Switzerland", flag: "🇨🇭", symbol: "CHF", displayOrder: 12 },
  SGD: { country: "Singapore", flag: "🇸🇬", symbol: "S$", displayOrder: 13 },
  CNY: { country: "China", flag: "🇨🇳", symbol: "¥", displayOrder: 14 },
  HKD: { country: "Hong Kong", flag: "🇭🇰", symbol: "HK$", displayOrder: 15 },
  KRW: { country: "South Korea", flag: "🇰🇷", symbol: "₩", displayOrder: 16 },
  THB: { country: "Thailand", flag: "🇹🇭", symbol: "฿", displayOrder: 17 },
  KWD: { country: "Kuwait", flag: "🇰🇼", symbol: "د.ك", displayOrder: 18 },
  BHD: { country: "Bahrain", flag: "🇧🇭", symbol: "ب.د", displayOrder: 19 },
  OMR: { country: "Oman", flag: "🇴🇲", symbol: "ر.ع.", displayOrder: 20 },
  DKK: { country: "Denmark", flag: "🇩🇰", symbol: "kr", displayOrder: 21 },
  SEK: { country: "Sweden", flag: "🇸🇪", symbol: "kr", displayOrder: 22 },
  NOK: { country: "Norway", flag: "🇳🇴", symbol: "kr", displayOrder: 23 },
  PKR: { country: "Pakistan", flag: "🇵🇰", symbol: "₨", displayOrder: 24 }
};

export function metaForCurrency(code: string): CurrencyMeta {
  return (
    CURRENCY_META[code] ?? {
      country: "",
      flag: "",
      symbol: code,
      displayOrder: 80
    }
  );
}
