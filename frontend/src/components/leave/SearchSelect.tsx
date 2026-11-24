import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/utils/cn";

export interface SearchOption {
  value: string;
  label: string;
  hint?: string;
}

export function SearchSelect({
  label,
  value,
  options,
  placeholder = "Select",
  error,
  disabled,
  onChange
}: {
  label?: string;
  value: string;
  options: SearchOption[];
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const root = useRef<HTMLDivElement>(null);
  const selected = options.find((item) => item.value === value);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return options;
    return options.filter((item) => `${item.label} ${item.hint ?? ""}`.toLowerCase().includes(term));
  }, [options, query]);

  useEffect(() => {
    function close(event: MouseEvent) {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    }
    window.addEventListener("mousedown", close);
    return () => window.removeEventListener("mousedown", close);
  }, []);

  return (
    <label className="block space-y-1.5">
      {label ? <span className="text-sm font-medium text-navy">{label}</span> : null}
      <div ref={root} className="relative">
        <button
          type="button"
          disabled={disabled}
          onClick={() => setOpen((value) => !value)}
          className={cn(
            "flex w-full items-center justify-between gap-2 rounded-xl border bg-white px-3 py-2.5 text-left text-sm shadow-sm outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/20",
            error ? "border-red-400" : "border-navy/15",
            disabled && "opacity-60"
          )}
        >
          <span className={cn("truncate", selected ? "text-ink" : "text-ink-muted")}>
            {selected ? selected.label : placeholder}
          </span>
          <ChevronDown className="h-4 w-4 shrink-0 text-navy/50" />
        </button>
        {open ? (
          <div className="absolute z-30 mt-1 w-full overflow-hidden rounded-xl border border-navy/10 bg-white shadow-xl">
            <input
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search…"
              className="w-full border-b border-navy/10 px-3 py-2 text-sm outline-none"
            />
            <ul className="max-h-56 overflow-auto py-1">
              {filtered.length ? (
                filtered.map((item) => (
                  <li key={item.value}>
                    <button
                      type="button"
                      className={cn(
                        "flex w-full flex-col px-3 py-2 text-left text-sm hover:bg-navy-50",
                        item.value === value && "bg-gold/10"
                      )}
                      onClick={() => {
                        onChange(item.value);
                        setQuery("");
                        setOpen(false);
                      }}
                    >
                      <span className="font-medium text-navy">{item.label}</span>
                      {item.hint ? <span className="text-[11px] text-ink-muted">{item.hint}</span> : null}
                    </button>
                  </li>
                ))
              ) : (
                <li className="px-3 py-3 text-sm text-ink-muted">No matches</li>
              )}
            </ul>
          </div>
        ) : null}
      </div>
      {error ? <span className="text-xs text-red-700">{error}</span> : null}
    </label>
  );
}
