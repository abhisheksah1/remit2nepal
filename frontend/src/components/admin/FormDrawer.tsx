import { useEffect, type ReactNode } from "react";
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
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="admin-drawer-shell">
      <button type="button" className="admin-drawer-backdrop" aria-label="Close drawer" onClick={onClose} />
      <aside
        className={cn("admin-drawer", wide && "is-wide")}
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
      >
        <div className="admin-drawer-head">
          <h2 id="drawer-title">{title}</h2>
          <button type="button" onClick={onClose} className="admin-logout" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="admin-drawer-body">{children}</div>
      </aside>
    </div>
  );
}
