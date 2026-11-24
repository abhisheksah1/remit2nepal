import {
  Activity,
  Award,
  BadgeCheck,
  Banknote,
  BookOpen,
  Building2,
  ClipboardCheck,
  Compass,
  Eye,
  FileSearch,
  Fingerprint,
  Globe,
  Heart,
  HeartHandshake,
  Lock,
  MapPinned,
  Scale,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Target,
  UserCheck,
  Users,
  Wallet,
  Zap,
  type LucideIcon
} from "lucide-react";

export const ABOUT_ICON_OPTIONS = [
  { value: "shield", label: "Shield" },
  { value: "award", label: "Award" },
  { value: "check", label: "Check" },
  { value: "lock", label: "Lock" },
  { value: "zap", label: "Speed" },
  { value: "globe", label: "Globe" },
  { value: "building", label: "Building" },
  { value: "users", label: "People" },
  { value: "heart", label: "Heart" },
  { value: "map", label: "Map" },
  { value: "banknote", label: "Rates" },
  { value: "scale", label: "Scale" },
  { value: "compass", label: "Compass" },
  { value: "eye", label: "Eye" },
  { value: "sparkles", label: "Sparkles" },
  { value: "target", label: "Target" },
  { value: "book", label: "Book" },
  { value: "wallet", label: "Wallet" },
  { value: "activity", label: "Monitoring" },
  { value: "fingerprint", label: "Identity" },
  { value: "clipboard", label: "Reporting" },
  { value: "handshake", label: "Support" },
  { value: "search", label: "Review" },
  { value: "user", label: "Customer" },
  { value: "alert", label: "Risk" }
] as const;

const ICONS: Record<string, LucideIcon> = {
  shield: ShieldCheck,
  award: Award,
  check: BadgeCheck,
  lock: Lock,
  zap: Zap,
  globe: Globe,
  building: Building2,
  users: Users,
  heart: Heart,
  map: MapPinned,
  banknote: Banknote,
  scale: Scale,
  compass: Compass,
  eye: Eye,
  sparkles: Sparkles,
  target: Target,
  book: BookOpen,
  wallet: Wallet,
  activity: Activity,
  fingerprint: Fingerprint,
  clipboard: ClipboardCheck,
  handshake: HeartHandshake,
  search: FileSearch,
  user: UserCheck,
  alert: ShieldAlert
};

const TITLE_MATCH: Array<{ match: RegExp; icon: string }> = [
  { match: /secure|protect|integrity|trust/i, icon: "shield" },
  { match: /award|best|excellence/i, icon: "award" },
  { match: /fast|speed|same-day/i, icon: "zap" },
  { match: /country|world|global|corridor/i, icon: "globe" },
  { match: /branch|office|network/i, icon: "building" },
  { match: /customer|people|family|access/i, icon: "users" },
  { match: /rate|price|nrb/i, icon: "banknote" },
  { match: /license|legal|compliance/i, icon: "scale" },
  { match: /year|experience|story|history/i, icon: "book" },
  { match: /mission/i, icon: "target" },
  { match: /vision/i, icon: "eye" }
];

export function aboutIcon(name?: string, fallbackTitle = ""): LucideIcon {
  if (name && ICONS[name]) return ICONS[name];
  const fromTitle = TITLE_MATCH.find((entry) => entry.match.test(fallbackTitle))?.icon;
  return ICONS[fromTitle ?? "shield"] ?? ShieldCheck;
}
