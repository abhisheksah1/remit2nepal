import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

type Tone = "gold" | "navy" | "green" | "red" | "muted";

export function Badge({ children, tone = "navy" }: { children: ReactNode; tone?: Tone }) {
  const tones: Record<Tone, string> = {
    gold: "bg-gold-100 text-gold-700",
    navy: "bg-navy-100 text-navy-700",
    green: "bg-emerald-50 text-emerald-800",
    red: "bg-red-50 text-red-800",
    muted: "bg-cream-200 text-ink-muted"
  };
  return <span className={cn("inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium", tones[tone])}>{children}</span>;
}

export function statusTone(status: string): Tone {
  if (["ACTIVE", "PUBLISHED", "LIVE", "SUCCESS", "REPLIED"].includes(status)) return "green";
  if (["INACTIVE", "DRAFT", "ARCHIVED"].includes(status)) return "muted";
  if (["FAILED", "LOCKED", "ALERT", "MAINTENANCE"].includes(status)) return "red";
  if (["NEW", "NOTICE"].includes(status)) return "gold";
  return "navy";
}
