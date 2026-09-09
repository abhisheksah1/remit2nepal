import type { ReactNode } from "react";
import { Inbox } from "lucide-react";
import { cn } from "@/utils/cn";

export function EmptyState({
  title,
  description,
  action,
  className
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center justify-center rounded-2xl border border-dashed border-navy/20 bg-white px-6 py-16 text-center", className)}>
      <Inbox className="mb-3 h-8 w-8 text-gold" aria-hidden />
      <p className="font-display text-xl text-navy">{title}</p>
      {description ? <p className="mt-2 max-w-md text-sm text-ink-muted">{description}</p> : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
