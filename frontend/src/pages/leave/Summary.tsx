import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Download, FileSpreadsheet, Printer } from "lucide-react";
import { leaveApi } from "@/api/leave.api";
import { publicApi } from "@/api/public.api";
import { PageHeader } from "@/components/admin/PageHeader";
import { Button } from "@/components/ui/Button";
import { SearchSelect } from "@/components/leave/SearchSelect";
import { BRAND } from "@/constants/brand";
import { exportLeaveReportExcel } from "@/utils/leave-report-export";
import {
  adToBs,
  availableBsYears,
  BS_MONTH_NAMES_NP,
  formatBsFull,
  nepalToday,
  toNepaliDigits
} from "@/utils/nepali-date";
import { entityId } from "@/utils/cn";
import type { ReportCellMark } from "@/types/leave";

const MARK: Record<ReportCellMark, { label: string; className: string; title: string }> = {
  P: { label: "P", className: "bg-emerald-50 text-emerald-800", title: "Present" },
  A: { label: "A", className: "bg-red-50 text-red-700", title: "Full leave / absent" },
  H: { label: "H", className: "bg-amber-50 text-amber-800", title: "Half leave" },
  O: { label: "O", className: "bg-sky-50 text-sky-800", title: "Overtime" },
  "": { label: "", className: "text-slate-300", title: "Not marked" }
};

export default function LeaveSummary() {
  const today = adToBs(nepalToday());
  const [bsYear, setBsYear] = useState(today.year);
  const [bsMonth, setBsMonth] = useState(today.month);
  const [search, setSearch] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const site = useQuery({ queryKey: ["public", "site"], queryFn: publicApi.site, staleTime: 60_000 });
  const report = useQuery({
    queryKey: ["leave", "report", bsYear, bsMonth, search],
    queryFn: () => leaveApi.report({ bsYear, bsMonth, search })
  });
  const company = site.data?.settings?.companyName || BRAND.name;
  const data = report.data;
  const rows = useMemo(() => {
    const list = data?.employees ?? [];
    if (!employeeId) return list;
    return list.filter((row) => entityId(row) === employeeId);
  }, [data, employeeId]);

  function printReport() {
    document.body.classList.add("print-leave-summary");
    const done = () => {
      document.body.classList.remove("print-leave-summary");
      window.removeEventListener("afterprint", done);
    };
    window.addEventListener("afterprint", done);
    window.print();
  }

  return (
    <div className="leave-summary-page">
      <div className="no-print">
        <PageHeader
          title="Summary report"
          description="Generate the month sheet for all staff. Leave dates fill A / H / O; every other day is present. Balance follows the employee profile."
          crumbs={[{ label: "Leave tracker", to: "/leave/tracker/dashboard" }, { label: "Summary" }]}
        />
      </div>

      <section className="no-print mb-5 rounded-2xl border border-navy/10 bg-white p-5 shadow-sm">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-xl text-navy">Filters</h2>
            <p className="text-sm text-ink-muted">Only marked days show P / A / H / O. Empty cells are not present.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="secondary"
              disabled={!data}
              onClick={() => data && exportLeaveReportExcel({ ...data, employees: rows }, company)}
            >
              <FileSpreadsheet className="h-4 w-4" /> Export Excel
            </Button>
            <Button type="button" variant="secondary" disabled={!data} onClick={printReport}>
              <Printer className="h-4 w-4" /> Print / PDF
            </Button>
          </div>
        </div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          <label className="space-y-1.5 text-sm">
            <span className="font-medium text-navy">Year (वि.सं.)</span>
            <select value={bsYear} onChange={(event) => setBsYear(Number(event.target.value))} className="w-full rounded-xl border border-navy/15 px-3 py-2.5">
              {availableBsYears().map((year) => (
                <option key={year} value={year}>
                  {toNepaliDigits(year)} · {year}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-1.5 text-sm">
            <span className="font-medium text-navy">Month</span>
            <select value={bsMonth} onChange={(event) => setBsMonth(Number(event.target.value))} className="w-full rounded-xl border border-navy/15 px-3 py-2.5">
              {BS_MONTH_NAMES_NP.map((name, index) => (
                <option key={name} value={index + 1}>
                  {name}
                </option>
              ))}
            </select>
          </label>
          <SearchSelect
            label="Employee"
            value={employeeId}
            placeholder="All employees"
            options={[
              { value: "", label: "All employees" },
              ...(data?.employees ?? []).map((row) => ({
                value: entityId(row),
                label: `${row.employeeId} · ${row.name}`,
                hint: row.department
              }))
            ]}
            onChange={setEmployeeId}
          />
          <label className="space-y-1.5 text-sm">
            <span className="font-medium text-navy">Search</span>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Name, ID, department"
              className="w-full rounded-xl border border-navy/15 px-3 py-2.5 text-sm"
            />
          </label>
          <div className="flex items-end">
            <Button type="button" className="w-full" onClick={() => void report.refetch()} disabled={report.isFetching}>
              <Download className="h-4 w-4" /> {report.isFetching ? "Generating…" : "Generate report"}
            </Button>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          {Object.entries(MARK)
            .filter(([key]) => key)
            .map(([key, item]) => (
            <span key={key} className={`rounded-full px-2.5 py-1 font-bold ${item.className}`}>
              {item.label} · {item.title}
            </span>
          ))}
        </div>
      </section>

      <section className="leave-summary-sheet overflow-hidden rounded-2xl border border-navy/10 bg-white shadow-sm">
        <div className="border-b border-navy/10 px-5 py-4">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-gold">{company}</p>
          <h2 className="font-display text-2xl text-navy">Attendance summary</h2>
          <p className="text-sm text-ink-muted">
            {data ? `${data.monthNameNp} ${toNepaliDigits(data.bsYear)} · ${data.monthName}` : "—"} · {formatBsFull(new Date())}
          </p>
        </div>
        <div className="overflow-auto">
          <table className="min-w-max w-full border-collapse text-xs">
            <thead>
              <tr className="bg-navy text-white">
                <th className="sticky left-0 z-10 bg-navy px-3 py-2 text-left">Name</th>
                {(data?.days ?? []).map((day) => (
                  <th key={day.iso} className="min-w-8 px-1 py-2 text-center font-semibold">
                    {day.day}
                  </th>
                ))}
                <th className="px-2 py-2">Total present</th>
                <th className="px-2 py-2">Total Absent</th>
                <th className="px-2 py-2">Total Over Time</th>
                <th className="px-2 py-2">Total leave in a year</th>
                <th className="px-2 py-2">Balance</th>
              </tr>
            </thead>
            <tbody>
              {report.isLoading ? (
                <tr>
                  <td colSpan={99} className="px-4 py-8 text-ink-muted">
                    Generating report…
                  </td>
                </tr>
              ) : rows.length ? (
                rows.map((row) => (
                  <tr key={entityId(row)} className="border-t border-navy/10">
                    <td className="sticky left-0 z-10 bg-white px-3 py-2">
                      <p className="font-semibold text-navy">{row.name}</p>
                      <p className="text-[10px] text-ink-muted">{row.employeeId}</p>
                    </td>
                    {row.cells.map((cell) => (
                      <td key={cell.iso} className="px-0.5 py-1 text-center">
                        <span className={`inline-flex min-w-6 justify-center rounded-md px-1 py-0.5 font-bold ${MARK[cell.mark].className}`} title={MARK[cell.mark].title}>
                          {MARK[cell.mark].label}
                        </span>
                      </td>
                    ))}
                    <td className="px-2 text-center font-semibold text-emerald-800">{row.present}</td>
                    <td className="px-2 text-center font-semibold text-red-700">{row.absent}</td>
                    <td className="px-2 text-center font-semibold text-sky-800">{row.overtime}</td>
                    <td className="px-2 text-center font-semibold text-navy">{row.leaveInYear}</td>
                    <td className="px-2 text-center font-bold text-navy">{row.balance}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={99} className="px-4 py-8 text-ink-muted">
                    No employees in this filter. Add staff profiles, then generate the report.
                  </td>
                </tr>
              )}
            </tbody>
            {data && rows.length ? (
              <tfoot>
                <tr className="border-t-2 border-navy/20 bg-navy-50 font-semibold text-navy">
                  <td className="sticky left-0 bg-navy-50 px-3 py-2">Total · {rows.length} staff</td>
                  {(data.days ?? []).map((day) => (
                    <td key={day.iso} />
                  ))}
                  <td className="px-2 py-2 text-center">{rows.reduce((sum, row) => sum + row.present, 0)}</td>
                  <td className="px-2 py-2 text-center">{rows.reduce((sum, row) => sum + row.absent, 0)}</td>
                  <td className="px-2 py-2 text-center">{rows.reduce((sum, row) => sum + row.overtime, 0)}</td>
                  <td />
                  <td className="px-2 py-2 text-center">{rows.reduce((sum, row) => sum + row.balance, 0)}</td>
                </tr>
              </tfoot>
            ) : null}
          </table>
        </div>
      </section>
    </div>
  );
}
