import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/utils/cn";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function Card({ className, children, ...props }: CardProps) {
  return (
    <div className={cn("rounded-2xl border border-navy/10 bg-white p-5 shadow-[0_12px_28px_-22px_rgba(21,23,70,0.45)] sm:p-6", className)} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-5">
      <h3 className="font-display text-xl text-navy">{title}</h3>
      {subtitle ? <p className="mt-1 text-sm text-ink-muted">{subtitle}</p> : null}
    </div>
  );
}
