import { useEffect, useMemo, useRef, useState } from "react";
import { CalendarDays } from "lucide-react";
import { cn } from "@/utils/cn";
import {
  adToBs,
  availableBsYears,
  BS_MONTH_NAMES_NP,
  BS_WEEKDAYS_EN,
  bsToUtcDate,
  daysInBsMonth,
  formatBsFull,
  isoDateUtc,
  parseIsoUtc,
  toNepaliDigits
} from "@/utils/nepali-date";

export function NepaliDatePicker({
  label,
  value,
  error,
  onChange
}: {
  label?: string;
  value: string;
  error?: string;
  onChange: (iso: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const selected = value ? adToBs(parseIsoUtc(value)) : adToBs(new Date());
  const [year, setYear] = useState(selected.year);
  const [month, setMonth] = useState(selected.month);

  useEffect(() => {
    if (!value) return;
    const bs = adToBs(parseIsoUtc(value));
    setYear(bs.year);
    setMonth(bs.month);
  }, [value]);

  useEffect(() => {
    function close(event: MouseEvent) {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    }
    window.addEventListener("mousedown", close);
    return () => window.removeEventListener("mousedown", close);
  }, []);

  const cells = useMemo(() => {
    const first = bsToUtcDate(year, month, 1);
    const pad = first.getUTCDay();
    const count = daysInBsMonth(year, month);
    const list: Array<{ day: number; iso: string } | null> = [];
    for (let i = 0; i < pad; i += 1) list.push(null);
    for (let day = 1; day <= count; day += 1) {
      list.push({ day, iso: isoDateUtc(bsToUtcDate(year, month, day)) });
    }
    return list;
  }, [year, month]);

  return (
    <label className="block space-y-1.5">
      {label ? <span className="text-sm font-medium text-navy">{label}</span> : null}
      <div ref={root} className="relative">
        <button
          type="button"
          onClick={() => setOpen((open) => !open)}
          className={cn(
            "flex w-full items-center justify-between gap-2 rounded-xl border bg-white px-3 py-2.5 text-left text-sm shadow-sm outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/20",
            error ? "border-red-400" : "border-navy/15"
          )}
        >
          <span className={value ? "text-navy" : "text-ink-muted"}>{value ? formatBsFull(value) : "मिति छान्नुहोस्"}</span>
          <CalendarDays className="h-4 w-4 shrink-0 text-navy/45" />
        </button>
        {open ? (
          <div className="absolute z-40 mt-1 w-[20rem] rounded-2xl border border-navy/10 bg-white p-3 shadow-2xl">
            <div className="mb-3 grid grid-cols-2 gap-2">
              <select
                value={year}
                onChange={(event) => setYear(Number(event.target.value))}
                className="rounded-lg border border-navy/15 px-2 py-1.5 text-sm"
              >
                {availableBsYears().map((item) => (
                  <option key={item} value={item}>
                    {toNepaliDigits(item)} · {item}
                  </option>
                ))}
              </select>
              <select
                value={month}
                onChange={(event) => setMonth(Number(event.target.value))}
                className="rounded-lg border border-navy/15 px-2 py-1.5 text-sm"
              >
                {BS_MONTH_NAMES_NP.map((name, index) => (
                  <option key={name} value={index + 1}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold uppercase tracking-wide text-navy/45">
              {BS_WEEKDAYS_EN.map((day) => (
                <span key={day}>{day}</span>
              ))}
            </div>
            <div className="mt-1 grid grid-cols-7 gap-1">
              {cells.map((cell, index) =>
                cell ? (
                  <button
                    key={cell.iso}
                    type="button"
                    onClick={() => {
                      onChange(cell.iso);
                      setOpen(false);
                    }}
                    className={cn(
                      "grid h-8 place-items-center rounded-lg text-sm font-semibold",
                      cell.iso === value ? "bg-navy text-white" : "text-navy hover:bg-gold/15"
                    )}
                  >
                    {toNepaliDigits(cell.day)}
                  </button>
                ) : (
                  <span key={`e-${index}`} />
                )
              )}
            </div>
          </div>
        ) : null}
      </div>
      {error ? <span className="text-xs text-red-700">{error}</span> : null}
    </label>
  );
}
