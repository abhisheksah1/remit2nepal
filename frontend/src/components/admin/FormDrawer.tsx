import type { ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/utils/cn";

export function FormDrawer({
  open,
  title,
  children,
  onClose,
  wide
}: {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
  wide?: boolean;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] flex justify-end">
      <button type="button" className="absolute inset-0 bg-navy/40" aria-label="Close drawer" onClick={onClose} />
      <aside
        className={cn("relative flex h-full w-full flex-col bg-white shadow-card", wide ? "max-w-2xl" : "max-w-lg")}
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
      >
        <div className="flex items-center justify-between border-b border-navy/10 px-5 py-4">
          <h2 id="drawer-title" className="font-display text-2xl text-navy">
            {title}
          </h2>
          <button type="button" onClick={onClose} className="rounded p-1 hover:bg-navy-50" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-5">{children}</div>
      </aside>
    </div>
  );
}
