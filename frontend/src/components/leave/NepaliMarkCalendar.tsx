import { useMemo, useState } from "react";
import { cn } from "@/utils/cn";
import {
  adToBs,
  availableBsYears,
  BS_MONTH_NAMES_NP,
  BS_WEEKDAYS_EN,
  bsToUtcDate,
  daysInBsMonth,
  formatBsShort,
  isoDateUtc,
  nepalToday,
  parseIsoUtc,
  toNepaliDigits
} from "@/utils/nepali-date";
import type { AttendanceMark, LeaveRecord } from "@/types/leave";

const MARK_STYLE: Record<AttendanceMark, string> = {
  P: "bg-emerald-50 text-emerald-800",
  A: "bg-red-50 text-red-700",
  H: "bg-amber-50 text-amber-800",
  O: "bg-sky-50 text-sky-800"
};

const MARK_HINT: Record<AttendanceMark, string> = {
  P: "Present",
  A: "Full leave (−1)",
  H: "Half leave (−0.5)",
  O: "Overtime (+1)"
};

export function recordMark(row: LeaveRecord): AttendanceMark | "" {
  if (row.kind === "PRESENT") return "P";
  if (row.kind === "HALF") return "H";
  if (row.kind === "OVERTIME") return "O";
  if (row.kind === "FULL") return "A";
  return "";
}

export function NepaliMarkCalendar({
  selected,
  pending,
  records,
  onToggle,
  onFillPresent
}: {
  selected: string[];
  pending: Record<string, AttendanceMark>;
  records: LeaveRecord[];
  onToggle: (iso: string) => void;
  onFillPresent?: (dates: string[]) => void;
}) {
  const today = adToBs(nepalToday());
  const [year, setYear] = useState(today.year);
  const [month, setMonth] = useState(today.month);
  const selectedSet = useMemo(() => new Set(selected), [selected]);
  const saved = useMemo(() => {
    const map = new Map<string, AttendanceMark>();
    for (const row of records) {
      if (row.status !== "APPROVED") continue;
      const from = parseIsoUtc(row.fromDate.slice(0, 10));
      const to = parseIsoUtc(row.toDate.slice(0, 10));
      const mark = recordMark(row);
      if (!mark) continue;
      const cursor = new Date(from);
      while (cursor.getTime() <= to.getTime()) {
        map.set(isoDateUtc(cursor), mark);
        cursor.setUTCDate(cursor.getUTCDate() + 1);
      }
    }
    return map;
  }, [records]);

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
    <div className="rounded-2xl border border-navy/10 bg-white p-3">
      <div className="mb-3 grid grid-cols-2 gap-2">
        <select value={year} onChange={(event) => setYear(Number(event.target.value))} className="rounded-lg border border-navy/15 px-2 py-1.5 text-sm">
          {availableBsYears().map((item) => (
            <option key={item} value={item}>
              {toNepaliDigits(item)} · {item}
            </option>
          ))}
        </select>
        <select value={month} onChange={(event) => setMonth(Number(event.target.value))} className="rounded-lg border border-navy/15 px-2 py-1.5 text-sm">
          {BS_MONTH_NAMES_NP.map((name, index) => (
            <option key={name} value={index + 1}>
              {name}
            </option>
          ))}
        </select>
      </div>
      {onFillPresent ? (
        <button
          type="button"
          onClick={() => {
            const count = daysInBsMonth(year, month);
            const dates: string[] = [];
            for (let day = 1; day <= count; day += 1) {
              const iso = isoDateUtc(bsToUtcDate(year, month, day));
              const weekday = parseIsoUtc(iso).getUTCDay();
              if (weekday === 6) continue;
              const current = pending[iso] || saved.get(iso) || "";
              if (current === "A" || current === "H" || current === "O") continue;
              dates.push(iso);
            }
            onFillPresent(dates);
          }}
          className="mb-3 w-full rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-sm font-semibold text-emerald-800 hover:bg-emerald-100"
        >
          Make all present this month
        </button>
      ) : null}
      <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold uppercase tracking-wide text-navy/45">
        {BS_WEEKDAYS_EN.map((day) => (
          <span key={day}>{day}</span>
        ))}
      </div>
      <div className="mt-1 grid grid-cols-7 gap-1 overflow-visible">
        {cells.map((cell, index) => {
          if (!cell) return <span key={`e-${index}`} />;
          const mark = pending[cell.iso] || saved.get(cell.iso) || "";
          const selectedDay = selectedSet.has(cell.iso);
          return (
            <div key={cell.iso} className="group relative">
              <button
                type="button"
                title={mark ? `${formatBsShort(cell.iso)} · ${mark} · ${MARK_HINT[mark]}` : `${formatBsShort(cell.iso)} · Not marked`}
                onClick={() => onToggle(cell.iso)}
                className={cn(
                  "flex h-12 w-full flex-col items-center justify-center rounded-xl text-sm font-semibold transition",
                  selectedDay ? "ring-2 ring-navy ring-offset-1" : "hover:bg-gold/20",
                  mark && !selectedDay ? MARK_STYLE[mark] : "",
                  selectedDay && mark ? MARK_STYLE[mark] : "",
                  !mark && !selectedDay ? "text-navy" : "",
                  selectedDay && !mark ? "bg-navy text-white" : ""
                )}
              >
                <span>{toNepaliDigits(cell.day)}</span>
                {mark ? <span className="text-[9px] font-bold leading-none">{mark}</span> : null}
              </button>
              <div className="pointer-events-none absolute left-1/2 z-30 mt-1 hidden w-40 -translate-x-1/2 rounded-xl bg-navy px-2.5 py-2 text-center text-[11px] font-medium text-white shadow-lg group-hover:block">
                <p>{formatBsShort(cell.iso)}</p>
                <p className="mt-0.5 text-gold">{mark ? `${mark} · ${MARK_HINT[mark]}` : "Not marked"}</p>
              </div>
            </div>
          );
        })}
      </div>
      <p className="mt-3 text-xs text-ink-muted">Use All present first, then change any day to A, H or O. Saturday stays off. Hover a date to see its leave.</p>
    </div>
  );
}
