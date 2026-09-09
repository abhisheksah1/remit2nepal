import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/utils/cn";

export interface ToastMessage {
  id?: string;
  title: string;
  description?: string;
  tone?: "success" | "error" | "info";
}

interface ToastContextValue {
  push: (message: ToastMessage) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

type ToastItem = ToastMessage & { id: string };

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const push = useCallback((message: ToastMessage) => {
    const id = message.id ?? crypto.randomUUID();
    setItems((current) => [...current, { ...message, id, title: message.title }]);
    window.setTimeout(() => {
      setItems((current) => current.filter((item) => item.id !== id));
    }, 4200);
  }, []);

  const value = useMemo(() => ({ push }), [push]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed bottom-4 right-4 z-[80] flex w-[min(100%-2rem,22rem)] flex-col gap-2">
        {items.map((item) => (
          <div
            key={item.id}
            className={cn(
              "pointer-events-auto rounded-lg border bg-white px-4 py-3 shadow-card",
              item.tone === "error" && "border-red-200",
              item.tone === "success" && "border-gold-200",
              item.tone === "info" && "border-navy-200"
            )}
            role="status"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-navy">{item.title}</p>
                {item.description ? <p className="mt-1 text-sm text-ink-muted">{item.description}</p> : null}
              </div>
              <button
                type="button"
                className="rounded p-1 text-ink-muted hover:bg-navy-50"
                aria-label="Dismiss notification"
                onClick={() => setItems((current) => current.filter((toast) => toast.id !== item.id))}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
