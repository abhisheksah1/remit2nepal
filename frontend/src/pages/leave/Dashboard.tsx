import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  CalendarCheck,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Clock3,
  Plus,
  UserPlus,
  Users
} from "lucide-react";
import { leaveApi } from "@/api/leave.api";
import { PageHeader } from "@/components/admin/PageHeader";
import { Badge, statusTone } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SkeletonLines } from "@/components/ui/Skeleton";
import { EmployeeAvatar } from "@/components/leave/EmployeeAvatar";
import { SearchSelect } from "@/components/leave/SearchSelect";
import {
  formatLeaveDays,
  leaveKindLabel,
  signedLeaveDays,
  type LeaveDayKind,
  type LeaveEmployee,
  type LeaveRecord,
  type LeaveType,
  type MonthCellMark
} from "@/types/leave";
import {
  adToBs,
  availableBsYears,
  BS_MONTH_NAMES_NP,
  formatBsFull,
  isoDateUtc,
  nepalToday,
  toNepaliDigits
} from "@/utils/nepali-date";
import { entityId } from "@/utils/cn";

const WEEKDAY_SHORT = ["आ", "सो", "मं", "बु", "बि", "शु", "श"];

const MARK: Record<MonthCellMark, { label: string; className: string }> = {
  P: { label: "P", className: "bg-emerald-500 text-white" },
  A: { label: "A", className: "bg-red-500 text-white" },
  H: { label: "H", className: "bg-amber-400 text-navy" },
  OT: { label: "O", className: "bg-sky-500 text-white" },
  W: { label: "—", className: "bg-slate-100 text-slate-400" },
  "": { label: "", className: "text-transparent" }
};

const KIND_TONE: Record<LeaveDayKind, string> = {
  PRESENT: "bg-emerald-50 text-emerald-800",
  FULL: "bg-red-50 text-red-700",
  HALF: "bg-amber-50 text-amber-800",
  OVERTIME: "bg-sky-50 text-sky-800"
};

function person(row: LeaveRecord) {
  return typeof row.employee === "object" && row.employee ? row.employee : null;
}
function leaveTypeOf(row: LeaveRecord) {
  return typeof row.leaveType === "object" && row.leaveType ? row.leaveType : null;
}

export default function LeaveDashboard() {
  const today = adToBs(nepalToday());
  const todayIso = isoDateUtc(nepalToday());
  const [bsYear, setBsYear] = useState(today.year);
  const [bsMonth, setBsMonth] = useState(today.month);
  const [employeeId, setEmployeeId] = useState("");
  const [search, setSearch] = useState("");
  const query = useQuery({ queryKey: ["leave", "dashboard"], queryFn: leaveApi.dashboard });
  const register = useQuery({
    queryKey: ["leave", "month", bsYear, bsMonth, search],
    queryFn: () => leaveApi.monthRegister({ bsYear, bsMonth, search })
  });
  const data = query.data;
  const sheet = register.data;
  const rows = useMemo(() => {
    const list = sheet?.employees ?? [];
    if (!employeeId) return list;
    return list.filter((row) => entityId(row) === employeeId);
  }, [sheet, employeeId]);
  const recent = useMemo(() => {
    const items = data?.recent ?? [];
    const leaveOnly = items.filter((row) => row.kind !== "PRESENT");
    return (leaveOnly.length ? leaveOnly : items).slice(0, 6);
  }, [data]);
  const deptMax = Math.max(1, ...(data?.departments ?? []).map((row) => row.count));
  const years = availableBsYears();

  function shiftMonth(delta: number) {
    let month = bsMonth + delta;
    let year = bsYear;
    if (month < 1) {
      month = 12;
      year -= 1;
    } else if (month > 12) {
      month = 1;
      year += 1;
    }
    if (year < years[0] || year > years[years.length - 1]) return;
    setBsYear(year);
    setBsMonth(month);
  }

  if (query.isLoading) return <SkeletonLines rows={8} />;

  return (
    <div>
      <PageHeader
        title="Leave dashboard"
        description={`${formatBsFull(new Date())}. Staff with 6+ months get 14 days this year; new staff start at 0.`}
        crumbs={[{ label: "Leave tracker", to: "/leave/tracker/dashboard" }, { label: "Dashboard" }]}
        extra={
          <>
            <Link
              to="/leave/tracker/summary"
              className="inline-flex items-center gap-2 rounded-md border border-navy/15 bg-white px-4 py-2.5 text-sm font-medium text-navy"
            >
              <ClipboardList className="h-4 w-4" />
              Summary
            </Link>
            <Link
              to="/leave/tracker/leaves"
              className="inline-flex items-center gap-2 rounded-md bg-navy px-4 py-2.5 text-sm font-medium text-cream"
            >
              <Plus className="h-4 w-4" />
              Add leave
            </Link>
          </>
        }
      />

      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-navy via-navy-700 to-navy-900 p-5 text-white shadow-sm sm:p-6">
        <div className="pointer-events-none absolute inset-0 opacity-25 [background-image:radial-gradient(circle_at_12%_20%,white,transparent_32%),radial-gradient(circle_at_92%_0%,#e31e24,transparent_36%)]" />
        <div className="relative grid gap-5 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/55">आज · Today</p>
            <p className="mt-1 font-display text-2xl sm:text-3xl">{formatBsFull(new Date())}</p>
            <p className="mt-2 max-w-xl text-sm text-white/70">
              {sheet?.monthNameNp} {toNepaliDigits(bsYear)} register · empty cells are unmarked, not present
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "On leave today", value: data?.onLeaveToday ?? 0 },
              { label: "Pending", value: data?.pending ?? 0 },
              { label: "Approved this month", value: data?.approvedMonth ?? 0 }
            ].map((item) => (
              <div key={item.label} className="rounded-2xl bg-white/10 px-3 py-3 backdrop-blur-sm">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-white/60">{item.label}</p>
                <p className="mt-1 font-display text-2xl">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Employees", value: data?.employees ?? 0, hint: "Active staff", icon: Users, to: "/leave/tracker/employees", tone: "bg-navy-50 text-navy" },
          { label: "Eligible", value: data?.eligible ?? 0, hint: "14 days this year", icon: CalendarCheck, to: "/leave/tracker/employees", tone: "bg-emerald-50 text-emerald-800" },
          { label: "New staff", value: data?.newStaff ?? 0, hint: "Under 6 months · 0 leave", icon: UserPlus, to: "/leave/tracker/employees", tone: "bg-amber-50 text-amber-800" },
          { label: "Leave left", value: data?.leaveLeft ?? 0, hint: "All staff combined", icon: Clock3, to: "/leave/tracker/leaves", tone: "bg-gold/10 text-gold" }
        ].map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              to={item.to}
              className="rounded-3xl border border-navy/10 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-navy/45">{item.label}</p>
                  <p className="mt-2 font-display text-3xl text-navy">{item.value}</p>
                  <p className="mt-1 text-xs text-ink-muted">{item.hint}</p>
                </div>
                <span className={`grid h-11 w-11 place-items-center rounded-2xl ${item.tone}`}>
                  <Icon className="h-5 w-5" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      <section className="mt-6 overflow-hidden rounded-3xl border border-navy/10 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-navy/10 px-5 py-4">
          <div className="flex items-center gap-2">
            <Button type="button" variant="secondary" size="sm" onClick={() => shiftMonth(-1)} aria-label="Previous month">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="min-w-[180px] text-center">
              <h2 className="font-display text-xl text-navy">
                {sheet?.monthNameNp ?? BS_MONTH_NAMES_NP[bsMonth - 1]} {toNepaliDigits(bsYear)}
              </h2>
              <p className="text-xs text-ink-muted">Monthly attendance register</p>
            </div>
            <Button type="button" variant="secondary" size="sm" onClick={() => shiftMonth(1)} aria-label="Next month">
              <ChevronRight className="h-4 w-4" />
            </Button>
            {bsYear !== today.year || bsMonth !== today.month ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setBsYear(today.year);
                  setBsMonth(today.month);
                }}
              >
                This month
              </Button>
            ) : null}
          </div>
          <div className="flex flex-wrap items-end gap-3">
            <label className="space-y-1 text-sm">
              <span className="font-medium text-navy">Year</span>
              <select value={bsYear} onChange={(event) => setBsYear(Number(event.target.value))} className="block rounded-xl border border-navy/15 bg-navy-50 px-3 py-2">
                {years.map((year) => (
                  <option key={year} value={year}>
                    {toNepaliDigits(year)}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-1 text-sm">
              <span className="font-medium text-navy">Month</span>
              <select value={bsMonth} onChange={(event) => setBsMonth(Number(event.target.value))} className="block rounded-xl border border-navy/15 bg-navy-50 px-3 py-2">
                {BS_MONTH_NAMES_NP.map((name, index) => (
                  <option key={name} value={index + 1}>
                    {name}
                  </option>
                ))}
              </select>
            </label>
            <div className="min-w-[220px]">
              <SearchSelect
                label="Employee"
                value={employeeId}
                placeholder="All employees"
                options={[
                  { value: "", label: "All employees" },
                  ...(sheet?.employees ?? []).map((row) => ({
                    value: entityId(row),
                    label: `${row.employeeId} · ${row.name}`,
                    hint: `${row.department} · left ${row.leaveLeft}`
                  }))
                ]}
                onChange={setEmployeeId}
              />
            </div>
            <label className="space-y-1 text-sm">
              <span className="font-medium text-navy">Search</span>
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Name, ID, department"
                className="block rounded-xl border border-navy/15 bg-navy-50 px-3 py-2 text-sm"
              />
            </label>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 px-5 py-3">
          {[
            { label: "P Present", className: "bg-emerald-500" },
            { label: "A Leave", className: "bg-red-500" },
            { label: "H Half", className: "bg-amber-400" },
            { label: "O Overtime", className: "bg-sky-500" },
            { label: "Empty unmarked", className: "bg-slate-200" }
          ].map((item) => (
            <span key={item.label} className="inline-flex items-center gap-1.5 rounded-full bg-navy-50 px-2.5 py-1 text-[11px] font-semibold text-navy">
              <span className={`h-2.5 w-2.5 rounded-full ${item.className}`} />
              {item.label}
            </span>
          ))}
        </div>

        <div className="overflow-auto">
          <table className="min-w-max border-collapse text-xs">
            <thead>
              <tr>
                <th className="sticky left-0 z-20 min-w-[240px] bg-navy px-4 py-3 text-left font-semibold text-white shadow-[6px_0_12px_rgba(21,23,70,0.18)]">
                  Employee
                </th>
                {(sheet?.days ?? []).map((day) => {
                  const isToday = day.iso === todayIso;
                  return (
                    <th
                      key={day.iso}
                      className={`min-w-9 px-1 py-2 text-center ${
                        isToday ? "bg-gold text-white" : day.weekend ? "bg-navy-800 text-white/45" : "bg-navy text-white/85"
                      }`}
                    >
                      <span className="block text-[9px] font-medium uppercase tracking-wide opacity-80">
                        {WEEKDAY_SHORT[day.weekday] ?? ""}
                      </span>
                      <span className="font-bold">{toNepaliDigits(day.day)}</span>
                    </th>
                  );
                })}
                <th className="bg-navy px-3 py-2 text-white">P</th>
                <th className="bg-navy px-3 py-2 text-white">A</th>
                <th className="bg-navy px-3 py-2 text-white">Left</th>
              </tr>
            </thead>
            <tbody>
              {register.isLoading ? (
                <tr>
                  <td colSpan={99} className="px-4 py-8 text-ink-muted">
                    Loading register…
                  </td>
                </tr>
              ) : rows.length ? (
                rows.map((row, index) => (
                  <tr key={entityId(row)} className={index % 2 ? "bg-navy-50/60" : "bg-white"}>
                    <td className={`sticky left-0 z-10 min-w-[240px] px-4 py-2.5 shadow-[6px_0_12px_rgba(21,23,70,0.06)] ${index % 2 ? "bg-[#f7f8fc]" : "bg-white"}`}>
                      <div className="flex items-center gap-3">
                        <EmployeeAvatar name={row.name} photoUrl={row.photoUrl} size="sm" />
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-navy">{row.name}</p>
                          <p className="text-[10px] text-ink-muted">
                            {row.employeeId} · {row.department} · {row.eligible ? "14 days" : "New · 0"}
                          </p>
                        </div>
                      </div>
                    </td>
                    {row.cells.map((cell, cellIndex) => {
                      const day = sheet?.days[cellIndex];
                      const isToday = cell.iso === todayIso;
                      return (
                        <td
                          key={cell.iso}
                          className={`px-0.5 py-1.5 text-center ${day?.weekend ? "bg-slate-50/80" : ""} ${isToday ? "bg-gold/10" : ""}`}
                        >
                          {cell.mark ? (
                            <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold ${MARK[cell.mark].className}`}>
                              {MARK[cell.mark].label}
                            </span>
                          ) : (
                            <span className="inline-block h-1.5 w-1.5 rounded-full bg-slate-200" />
                          )}
                        </td>
                      );
                    })}
                    <td className="px-3 text-center font-semibold text-emerald-800">{row.present}</td>
                    <td className="px-3 text-center font-semibold text-red-700">{row.absent}</td>
                    <td className="px-3 text-center font-bold text-navy">{row.leaveLeft}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={99} className="px-4 py-8 text-ink-muted">
                    No employees in this filter. Add staff profiles first.
                  </td>
                </tr>
              )}
            </tbody>
            {sheet ? (
              <tfoot>
                <tr className="border-t border-navy/15 bg-navy-50 font-semibold text-navy">
                  <td className="sticky left-0 z-10 bg-navy-50 px-4 py-3 shadow-[6px_0_12px_rgba(21,23,70,0.06)]">
                    Total · {sheet.totals.employees} staff
                  </td>
                  {(sheet.days ?? []).map((day) => (
                    <td key={day.iso} />
                  ))}
                  <td className="px-3 py-3 text-center text-emerald-800">{sheet.totals.present}</td>
                  <td className="px-3 py-3 text-center text-red-700">{sheet.totals.absent}</td>
                  <td className="px-3 py-3 text-center">{sheet.totals.leaveLeft}</td>
                </tr>
              </tfoot>
            ) : null}
          </table>
        </div>
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
        <section className="rounded-3xl border border-navy/10 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-xl text-navy">Recent leave</h2>
              <p className="text-xs text-ink-muted">{data?.onLeaveToday ?? 0} staff on leave today</p>
            </div>
            <Link to="/leave/tracker/leaves" className="text-sm font-semibold text-navy hover:text-gold">
              View history
            </Link>
          </div>
          <ul className="space-y-2">
            {recent.length ? (
              recent.map((row) => {
                const employee = person(row) as LeaveEmployee | null;
                const type = leaveTypeOf(row) as LeaveType | null;
                const kind = (row.kind ?? "FULL") as LeaveDayKind;
                return (
                  <li key={row._id} className="flex items-center justify-between gap-3 rounded-2xl border border-navy/10 px-3 py-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <EmployeeAvatar name={employee?.name || "Employee"} photoUrl={employee?.photoUrl} size="sm" />
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-navy">{employee?.name || "Employee"}</p>
                        <p className="truncate text-xs text-ink-muted">
                          {formatBsShortRange(row.fromDate, row.toDate)} · {type?.name || "Attendance"}
                        </p>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${KIND_TONE[kind]}`}>
                        {leaveKindLabel(kind)} {formatLeaveDays(signedLeaveDays(row))}
                      </span>
                      <Badge tone={statusTone(row.status)}>{row.status}</Badge>
                    </div>
                  </li>
                );
              })
            ) : (
              <p className="rounded-2xl bg-navy-50 px-4 py-8 text-center text-sm text-ink-muted">No leave recorded yet.</p>
            )}
          </ul>
        </section>
        <section className="rounded-3xl border border-navy/10 bg-white p-5 shadow-sm">
          <h2 className="font-display text-xl text-navy">By department</h2>
          <p className="mb-4 text-xs text-ink-muted">Active staff split</p>
          <ul className="space-y-4">
            {(data?.departments ?? []).length ? (
              data?.departments.map((row) => (
                <li key={row.department}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="font-medium text-navy">{row.department}</span>
                    <span className="text-xs font-bold text-gold">{row.count}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-navy-50">
                    <div className="h-full rounded-full bg-gradient-to-r from-navy to-gold" style={{ width: `${Math.round((row.count / deptMax) * 100)}%` }} />
                  </div>
                </li>
              ))
            ) : (
              <p className="text-sm text-ink-muted">Add employees to see department counts.</p>
            )}
          </ul>
        </section>
      </div>
    </div>
  );
}

function formatBsShortRange(from: string, to: string) {
  const start = formatBsFull(from);
  const end = formatBsFull(to);
  return start === end ? start : `${start} → ${end}`;
}
