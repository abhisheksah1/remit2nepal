import { Fragment, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { leaveApi } from "@/api/leave.api";
import { getErrorMessage } from "@/api/client";
import { PageHeader } from "@/components/admin/PageHeader";
import { FormDrawer } from "@/components/admin/FormDrawer";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { EmptyState } from "@/components/ui/EmptyState";
import { SearchSelect } from "@/components/leave/SearchSelect";
import { NepaliMarkCalendar } from "@/components/leave/NepaliMarkCalendar";
import { useToast } from "@/components/ui/Toast";
import { EmployeeAvatar } from "@/components/leave/EmployeeAvatar";
import { entityId } from "@/utils/cn";
import { adToBs, BS_MONTH_NAMES_NP, formatBsFull, formatBsShort, parseIsoUtc, toNepaliDigits } from "@/utils/nepali-date";
import {
  formatLeaveDays,
  leaveKindLabel,
  signedLeaveDays,
  type AttendanceMark,
  type LeaveEmployee,
  type LeaveRecord,
  type LeaveStatus
} from "@/types/leave";

type HistoryView = "LEAVE" | "OVERTIME" | "PRESENT" | "ALL";

const MARK_PILL: Record<string, string> = {
  P: "bg-emerald-50 text-emerald-800",
  A: "bg-red-50 text-red-700",
  H: "bg-amber-50 text-amber-800",
  O: "bg-sky-50 text-sky-800"
};

const MARKS: Array<{ value: AttendanceMark; label: string; hint: string; className: string }> = [
  { value: "P", label: "P", hint: "Present", className: "border-emerald-300 bg-emerald-50 text-emerald-800" },
  { value: "A", label: "A", hint: "Full leave −1", className: "border-red-300 bg-red-50 text-red-700" },
  { value: "H", label: "H", hint: "Half leave −0.5", className: "border-amber-300 bg-amber-50 text-amber-800" },
  { value: "O", label: "O", hint: "Overtime +1", className: "border-sky-300 bg-sky-50 text-sky-800" }
];

function asEmployee(value: LeaveRecord["employee"]): LeaveEmployee | null {
  return typeof value === "object" && value ? value : null;
}

function dateLabel(row: LeaveRecord) {
  const from = formatBsFull(row.fromDate);
  const to = formatBsFull(row.toDate);
  return row.fromDate.slice(0, 10) === row.toDate.slice(0, 10) ? from : `${from} → ${to}`;
}

function rowMark(row: LeaveRecord): AttendanceMark {
  if (row.kind === "PRESENT") return "P";
  if (row.kind === "HALF") return "H";
  if (row.kind === "OVERTIME") return "O";
  return "A";
}

export default function Leaves() {
  const { push } = useToast();
  const client = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [employeeFilter, setEmployeeFilter] = useState("");
  const [kindFilter, setKindFilter] = useState<HistoryView>("LEAVE");
  const [statusFilter, setStatusFilter] = useState<LeaveStatus | "">("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<LeaveRecord | null>(null);
  const [employeeId, setEmployeeId] = useState("");
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [pending, setPending] = useState<Record<string, AttendanceMark>>({});
  const [mark, setMark] = useState<AttendanceMark | "">("");
  const [reason, setReason] = useState("");
  const [formError, setFormError] = useState("");
  const query = useQuery({
    queryKey: ["leave", "leaves", page, search, employeeFilter, kindFilter, statusFilter],
    queryFn: () =>
      leaveApi.leaves.list({
        page,
        limit: 30,
        search: search || undefined,
        employee: employeeFilter || undefined,
        kind: kindFilter === "ALL" ? undefined : kindFilter,
        status: statusFilter || undefined
      })
  });
  const employees = useQuery({ queryKey: ["leave", "employees", "all"], queryFn: () => leaveApi.employees.list({ limit: 200 }) });
  const selectedEmployee = (employees.data?.items ?? []).find((item) => entityId(item) === employeeId);
  const employeeLeaves = useQuery({
    enabled: Boolean(employeeId) && open,
    queryKey: ["leave", "leaves", "calendar", employeeId],
    queryFn: () => leaveApi.leaves.list({ employee: employeeId, limit: 200 })
  });
  const pages = Math.max(1, Math.ceil((query.data?.total ?? 0) / 30));

  const employeeOptions = useMemo(
    () =>
      (employees.data?.items ?? [])
        .filter((item) => item.status === "ACTIVE")
        .map((item) => ({
          value: entityId(item),
          label: `${item.employeeId} · ${item.name}`,
          hint: `${item.department} · leave left ${item.leaveLeft ?? 0}`
        })),
    [employees.data]
  );
  const monthGroups = useMemo(() => {
    const groups: Array<{ key: string; label: string; rows: LeaveRecord[] }> = [];
    for (const row of query.data?.items ?? []) {
      try {
        const bs = adToBs(parseIsoUtc(row.fromDate.slice(0, 10)));
        const key = `${bs.year}-${bs.month}`;
        const label = `${BS_MONTH_NAMES_NP[bs.month - 1]} ${toNepaliDigits(bs.year)}`;
        const last = groups[groups.length - 1];
        if (last?.key === key) last.rows.push(row);
        else groups.push({ key, label, rows: [row] });
      } catch {
        const last = groups[groups.length - 1];
        if (last?.key === "other") last.rows.push(row);
        else groups.push({ key: "other", label: "Other", rows: [row] });
      }
    }
    return groups;
  }, [query.data]);

  function startCreate() {
    setEditing(null);
    setEmployeeId("");
    setSelectedDates([]);
    setPending({});
    setMark("");
    setReason("");
    setFormError("");
    setOpen(true);
  }

  function startEdit(row: LeaveRecord) {
    setEditing(row);
    const employee = asEmployee(row.employee);
    setEmployeeId(employee ? entityId(employee) : String(row.employee));
    const dayMark = row.kind === "PRESENT" ? "P" : row.kind === "HALF" ? "H" : row.kind === "OVERTIME" ? "O" : "A";
    setSelectedDates([row.fromDate.slice(0, 10)]);
    setPending({ [row.fromDate.slice(0, 10)]: dayMark });
    setMark(dayMark);
    setReason(row.reason);
    setFormError("");
    setOpen(true);
  }

  function stampDates(dates: string[], nextMark: AttendanceMark) {
    if (!dates.length) return;
    setPending((current) => {
      const next = { ...current };
      for (const iso of dates) next[iso] = nextMark;
      return next;
    });
    setSelectedDates([]);
    setMark(nextMark);
    setFormError("");
  }

  function toggleDate(iso: string) {
    if (mark) {
      stampDates([iso], mark);
      return;
    }
    setSelectedDates((current) => (current.includes(iso) ? current.filter((item) => item !== iso) : [...current, iso].sort()));
    setFormError("");
  }

  const pendingDays = Object.entries(pending).map(([date, dayMark]) => ({ date, mark: dayMark }));

  const save = useMutation({
    mutationFn: () => {
      if (!employeeId) throw new Error("Select an employee");
      if (!pendingDays.length) throw new Error("Mark at least one date with P, A, H or O");
      return leaveApi.leaves.mark({ employee: employeeId, days: pendingDays, reason });
    },
    onSuccess: async (result) => {
      push({ title: `${result.count} day${result.count === 1 ? "" : "s"} saved`, tone: "success" });
      setOpen(false);
      await client.invalidateQueries({ queryKey: ["leave"] });
    },
    onError: (error) => {
      const message = getErrorMessage(error);
      setFormError(message);
      push({ title: message, tone: "error" });
    }
  });

  const rows = query.data?.items ?? [];

  return (
    <div>
      <PageHeader
        title="Leave history"
        description="Leave, overtime, and present days in Nepali date. Present is listed separately so actual leave stays easy to read."
        crumbs={[{ label: "Leave tracker", to: "/leave/tracker/dashboard" }, { label: "Leave history" }]}
        actionLabel="Add leave"
        onAction={startCreate}
      />

      <div className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Leave days", value: query.data?.leaveCount ?? 0, tone: "text-red-700" },
          { label: "Overtime", value: query.data?.overtime ?? 0, tone: "text-sky-800" },
          { label: "Present days", value: query.data?.present ?? 0, tone: "text-emerald-800" },
          { label: "Pending", value: query.data?.pending ?? 0, tone: "text-amber-700" }
        ].map((item) => (
          <div key={item.label} className="rounded-2xl border border-navy/10 bg-white px-4 py-3">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-navy/45">{item.label}</p>
            <p className={`mt-1 font-display text-2xl ${item.tone}`}>{item.value}</p>
          </div>
        ))}
      </div>

      <div className="mb-5 rounded-2xl border border-navy/10 bg-white p-4">
        <div className="mb-4 flex flex-wrap gap-2">
          {(
            [
              ["LEAVE", "Leave"],
              ["OVERTIME", "Overtime"],
              ["PRESENT", "Present"],
              ["ALL", "All days"]
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => {
                setKindFilter(value);
                setPage(1);
              }}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold ${
                kindFilter === value ? "bg-navy text-white" : "bg-navy-50 text-navy"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="grid gap-3 lg:grid-cols-3">
          <label className="space-y-1.5 text-sm">
            <span className="font-medium text-navy">Search</span>
            <input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              placeholder="Name, ID, department"
              className="w-full rounded-xl border border-navy/15 px-3 py-2.5 text-sm"
            />
          </label>
          <SearchSelect
            label="Employee"
            value={employeeFilter}
            placeholder="All employees"
            options={[{ value: "", label: "All employees" }, ...employeeOptions]}
            onChange={(value) => {
              setEmployeeFilter(value);
              setPage(1);
            }}
          />
          <label className="space-y-1.5 text-sm">
            <span className="font-medium text-navy">Status</span>
            <select
              value={statusFilter}
              onChange={(event) => {
                setStatusFilter(event.target.value as LeaveStatus | "");
                setPage(1);
              }}
              className="w-full rounded-xl border border-navy/15 px-3 py-2.5 text-sm"
            >
              <option value="">All statuses</option>
              <option value="APPROVED">Approved</option>
              <option value="PENDING">Pending</option>
              <option value="REJECTED">Rejected</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </label>
        </div>
      </div>

      {query.isLoading ? <p className="text-sm text-ink-muted">Loading history…</p> : null}
      {!query.isLoading && !rows.length ? (
        <EmptyState
          title={kindFilter === "LEAVE" ? "No leave days in this view" : "No records yet"}
          description="Use Add leave to mark the month. Present days live under the Present tab."
          action={<Button onClick={startCreate}>Add leave</Button>}
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-navy/10 bg-white shadow-sm">
          <table className="w-full min-w-[720px] border-collapse text-sm">
            <thead>
              <tr className="bg-navy text-left text-[11px] font-bold uppercase tracking-[0.14em] text-white/80">
                <th className="px-4 py-3">मिति</th>
                <th className="px-4 py-3">Employee</th>
                <th className="px-4 py-3">Day</th>
                <th className="px-4 py-3">Balance</th>
                <th className="px-4 py-3">Note</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {monthGroups.map((group) => (
                <Fragment key={group.key}>
                  <tr className="bg-navy-50">
                    <td colSpan={6} className="px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-navy/55">
                      {group.label}
                    </td>
                  </tr>
                  {group.rows.map((row) => {
                    const employee = asEmployee(row.employee);
                    const markCode = rowMark(row);
                    const days = signedLeaveDays(row);
                    return (
                      <tr key={entityId(row)} className="border-t border-navy/10 hover:bg-navy-50/50">
                        <td className="px-4 py-3">
                          <p className="font-medium text-navy">{formatBsShort(row.fromDate)}</p>
                          <p className="text-[11px] text-ink-muted">{dateLabel(row).split(" · ")[1]}</p>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <EmployeeAvatar
                              name={employee?.name || "NA"}
                              photoUrl={employee?.photoUrl}
                              size="sm"
                              className="rounded-xl"
                            />
                            <div>
                              <p className="font-semibold text-navy">{employee?.name}</p>
                              <p className="text-[11px] text-ink-muted">
                                {employee?.employeeId} · {employee?.department}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex min-w-10 justify-center rounded-lg px-2 py-1 text-xs font-bold ${MARK_PILL[markCode]}`}>
                            {markCode} · {leaveKindLabel(row.kind)}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-semibold text-navy">
                          {markCode === "P" ? "—" : formatLeaveDays(days)}
                        </td>
                        <td className="max-w-[14rem] truncate px-4 py-3 text-ink-muted">
                          {row.reason === "Present" || row.reason === "Full leave" || row.reason === "Half leave" || row.reason === "Overtime"
                            ? "—"
                            : row.reason}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Button type="button" variant="ghost" size="sm" onClick={() => startEdit(row)}>
                            Edit
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {pages > 1 ? (
        <div className="mt-5 flex items-center justify-between">
          <Button type="button" variant="secondary" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>
            <ChevronLeft className="h-4 w-4" /> Previous
          </Button>
          <p className="text-sm text-ink-muted">
            Page {page} of {pages}
          </p>
          <Button type="button" variant="secondary" size="sm" disabled={page >= pages} onClick={() => setPage(page + 1)}>
            Next <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      ) : null}

      <FormDrawer open={open} title={editing ? "Edit day" : "Add days"} onClose={() => setOpen(false)} wide>
        <form
          className="space-y-5"
          onSubmit={(event) => {
            event.preventDefault();
            if (!employeeId) return setFormError("Select an employee");
            if (!pendingDays.length) return setFormError("Mark dates with P, A, H or O first");
            save.mutate();
          }}
        >
          <section className="rounded-2xl border border-navy/10 bg-navy-50/60 p-4">
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.16em] text-navy/50">1 · Employee</p>
            <SearchSelect
              label="Employee"
              value={employeeId}
              options={employeeOptions}
              placeholder="Search employee ID or name"
              onChange={(value) => {
                setEmployeeId(value);
                setSelectedDates([]);
                setPending({});
                setMark("");
              }}
            />
            {selectedEmployee ? (
              <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
                <div className="rounded-xl bg-white p-2">
                  <p className="text-ink-muted">Entitlement</p>
                  <p className="font-bold text-navy">{selectedEmployee.entitlement ?? 0}</p>
                </div>
                <div className="rounded-xl bg-white p-2">
                  <p className="text-ink-muted">Used</p>
                  <p className="font-bold text-navy">{selectedEmployee.leaveTaken ?? 0}</p>
                </div>
                <div className="rounded-xl bg-white p-2">
                  <p className="text-ink-muted">Leave left</p>
                  <p className="font-bold text-gold">{selectedEmployee.leaveLeft ?? 0}</p>
                </div>
              </div>
            ) : null}
          </section>
          <section className="rounded-2xl border border-navy/10 p-4">
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.16em] text-navy/50">2 · Select dates</p>
            <NepaliMarkCalendar
              selected={selectedDates}
              pending={pending}
              records={employeeLeaves.data?.items ?? []}
              onToggle={toggleDate}
              onFillPresent={(dates) => {
                setPending((current) => {
                  const next = { ...current };
                  for (const iso of dates) {
                    if (next[iso] === "A" || next[iso] === "H" || next[iso] === "O") continue;
                    next[iso] = "P";
                  }
                  return next;
                });
                setSelectedDates([]);
                setMark("");
                setFormError("");
              }}
            />
            <p className="mt-2 text-sm text-navy">
              {pendingDays.length
                ? pendingDays.map((item) => `${item.date.slice(8, 10)}=${item.mark}`).join(" · ")
                : "No days marked yet."}
            </p>
          </section>
          <section className="rounded-2xl border border-navy/10 p-4">
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.16em] text-navy/50">3 · Mark</p>
            <div className="grid grid-cols-4 gap-2">
              {MARKS.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => {
                    if (selectedDates.length) stampDates(selectedDates, item.value);
                    else setMark(item.value);
                  }}
                  className={`rounded-xl border px-2 py-3 text-center ${
                    mark === item.value ? item.className + " ring-2 ring-navy/20" : "border-navy/15 text-ink-muted"
                  }`}
                >
                  <span className="block text-lg font-bold">{item.label}</span>
                  <span className="text-[10px] font-semibold">{item.hint}</span>
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs text-ink-muted">After All present, click A / H / O then the date you want to change.</p>
          </section>
          <Input label="Note (optional)" value={reason} onChange={(event) => setReason(event.target.value)} />
          {formError ? <p className="text-sm text-red-700">{formError}</p> : null}
          <Button type="submit" className="w-full" disabled={save.isPending}>
            {save.isPending ? "Saving…" : `Save ${pendingDays.length || ""} day${pendingDays.length === 1 ? "" : "s"}`}
          </Button>
        </form>
      </FormDrawer>
    </div>
  );
}
