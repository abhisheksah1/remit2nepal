import type { ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/utils/cn";

export function Modal({
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
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <button type="button" className="absolute inset-0 bg-navy/50" aria-label="Close dialog" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className={cn("relative max-h-[90vh] w-full overflow-y-auto rounded-2xl bg-white p-6 shadow-card", wide ? "max-w-3xl" : "max-w-lg")}
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <h2 id="modal-title" className="font-display text-2xl text-navy">
            {title}
          </h2>
          <button type="button" onClick={onClose} className="rounded p-1 text-ink-muted hover:bg-navy-50" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
