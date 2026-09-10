import {
  Banknote,
  Briefcase,
  Building2,
  Clock,
  Coins,
  CreditCard,
  Globe,
  Landmark,
  Send,
  ShieldCheck,
  Smartphone,
  Users,
  Wallet,
  Zap,
  type LucideIcon
} from "lucide-react";

export const SERVICE_ICON_OPTIONS = [
  { value: "globe", label: "Globe" },
  { value: "send", label: "Send" },
  { value: "banknote", label: "Cash" },
  { value: "building-2", label: "Bank" },
  { value: "smartphone", label: "Mobile" },
  { value: "briefcase", label: "Corporate" },
  { value: "wallet", label: "Wallet" },
  { value: "shield", label: "Shield" },
  { value: "landmark", label: "Landmark" },
  { value: "users", label: "People" },
  { value: "zap", label: "Fast" },
  { value: "clock", label: "Clock" },
  { value: "coins", label: "Coins" },
  { value: "credit-card", label: "Card" }
] as const;

export const SERVICE_ACCENT_OPTIONS = [
  { value: "#F5A623", label: "Gold" },
  { value: "#6D28D9", label: "Purple" },
  { value: "#2E3192", label: "Navy" },
  { value: "#E31E24", label: "Red" },
  { value: "#0EA5E9", label: "Sky" },
  { value: "#059669", label: "Teal" }
] as const;

const ICONS: Record<string, LucideIcon> = {
  globe: Globe,
  send: Send,
  banknote: Banknote,
  "building-2": Building2,
  building: Building2,
  smartphone: Smartphone,
  briefcase: Briefcase,
  wallet: Wallet,
  shield: ShieldCheck,
  landmark: Landmark,
  users: Users,
  zap: Zap,
  clock: Clock,
  coins: Coins,
  "credit-card": CreditCard
};

const FALLBACK_ACCENTS = SERVICE_ACCENT_OPTIONS.map((item) => item.value);

export function serviceIcon(name?: string): LucideIcon {
  if (name && ICONS[name]) return ICONS[name];
  return ShieldCheck;
}

export function serviceAccent(color?: string, index = 0) {
  if (color && /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(color.trim())) return color.trim();
  return FALLBACK_ACCENTS[index % FALLBACK_ACCENTS.length] ?? "#2E3192";
}
