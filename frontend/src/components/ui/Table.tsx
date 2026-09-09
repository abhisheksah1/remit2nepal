import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

export function Table({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("rate-scroll overflow-x-auto rounded-2xl border border-navy/10 bg-white", className)}>
      <table className="w-full min-w-[36rem] text-left text-sm">{children}</table>
    </div>
  );
}

export function THead({ children }: { children: ReactNode }) {
  return <thead className="sticky top-0 bg-[#f4f6fb] text-[0.7rem] uppercase tracking-wider text-navy-500">{children}</thead>;
}

export function Th({ children, className }: { children: ReactNode; className?: string }) {
  return <th className={cn("px-4 py-3 font-medium", className)}>{children}</th>;
}

export function Td({ children, className }: { children: ReactNode; className?: string }) {
  return <td className={cn("border-t border-navy/10 px-4 py-3 text-ink", className)}>{children}</td>;
}
