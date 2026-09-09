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
    <div className="fixed inset-0 z-[70] flex items-end justify-center p-0 sm:items-center sm:p-4">
      <button type="button" className="absolute inset-0 bg-[#0c1030]/50 backdrop-blur-[6px]" aria-label="Close dialog" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className={cn(
          "relative max-h-[92dvh] w-full overflow-y-auto rounded-t-2xl bg-white p-5 shadow-[0_-18px_50px_-24px_rgba(15,18,60,0.45)] sm:rounded-2xl sm:p-6",
          wide ? "sm:max-w-3xl" : "sm:max-w-lg"
        )}
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <h2 id="modal-title" className="font-display text-2xl text-navy">
            {title}
          </h2>
          <button type="button" onClick={onClose} className="grid h-10 w-10 place-items-center rounded-xl border border-navy/10 text-ink-muted hover:bg-navy-50" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
