import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CalendarDays, Mail, Phone, Search } from "lucide-react";
import { z } from "zod";
import { leaveApi } from "@/api/leave.api";
import { getErrorMessage } from "@/api/client";
import { PageHeader } from "@/components/admin/PageHeader";
import { FormDrawer } from "@/components/admin/FormDrawer";
import { EmployeeAvatar } from "@/components/leave/EmployeeAvatar";
import { EmployeePhotoField } from "@/components/leave/EmployeePhotoField";
import { NepaliDatePicker } from "@/components/leave/NepaliDatePicker";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Badge, statusTone } from "@/components/ui/Badge";
import { useToast } from "@/components/ui/Toast";
import { entityId } from "@/utils/cn";
import { formatBsFull, isoDateUtc, nepalToday } from "@/utils/nepali-date";
import type { LeaveEmployee } from "@/types/leave";

const schema = z.object({
  employeeId: z.string().min(1, "Employee ID is required"),
  name: z.string().min(2, "Employee name is required"),
  department: z.string().min(2, "Department is required"),
  designation: z.string().optional(),
  joinDate: z.string().min(8, "Join date is required"),
  email: z.string().optional(),
  phone: z.string().optional(),
  photoUrl: z.string().optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional()
});

type Values = z.infer<typeof schema>;

export default function LeaveEmployees() {
  const { push } = useToast();
  const client = useQueryClient();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<LeaveEmployee | null>(null);
  const query = useQuery({
    queryKey: ["leave", "employees", search],
    queryFn: () => leaveApi.employees.list({ page: 1, limit: 200, search })
  });
  const form = useForm<Values>({ resolver: zodResolver(schema) });

  function startCreate() {
    setEditing(null);
    form.reset({
      employeeId: "",
      name: "",
      department: "",
      designation: "",
      joinDate: isoDateUtc(nepalToday()),
      email: "",
      phone: "",
      photoUrl: "",
      status: "ACTIVE"
    });
    setOpen(true);
  }

  function startEdit(row: LeaveEmployee) {
    setEditing(row);
    form.reset({
      employeeId: row.employeeId,
      name: row.name,
      department: row.department,
      designation: row.designation ?? "",
      joinDate: row.joinDate ? row.joinDate.slice(0, 10) : isoDateUtc(nepalToday()),
      email: row.email ?? "",
      phone: row.phone ?? "",
      photoUrl: row.photoUrl ?? "",
      status: row.status
    });
    setOpen(true);
  }

  const save = useMutation({
    mutationFn: (values: Values) =>
      editing ? leaveApi.employees.update(entityId(editing), values) : leaveApi.employees.create(values),
    onSuccess: async () => {
      push({ title: editing ? "Profile updated" : "Employee added", tone: "success" });
      setOpen(false);
      await client.invalidateQueries({ queryKey: ["leave"] });
    },
    onError: (error) => push({ title: getErrorMessage(error), tone: "error" })
  });

  const items = query.data?.items ?? [];

  return (
    <div>
      <PageHeader
        title="Employee profiles"
        description="Photo, role, and leave balance on one card. Join date still drives 14 days after 6 months."
        crumbs={[{ label: "Leave tracker", to: "/leave/tracker/dashboard" }, { label: "Employees" }]}
        actionLabel="Add employee"
        onAction={startCreate}
      />
      <label className="relative mb-6 block max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Filter by name, ID, or department"
          className="w-full rounded-2xl border border-navy/15 bg-white py-2.5 pl-10 pr-3 text-sm shadow-sm"
        />
      </label>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {query.isLoading ? <p className="text-sm text-ink-muted">Loading profiles…</p> : null}
        {items.map((row) => (
          <article
            key={entityId(row)}
            className="group overflow-hidden rounded-3xl border border-navy/10 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            <div className="relative h-24 bg-gradient-to-r from-navy via-navy-800 to-navy-700">
              <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_20%_20%,white,transparent_35%),radial-gradient(circle_at_80%_0%,#c9a227,transparent_40%)]" />
              <span className="absolute right-4 top-4">
                <Badge tone={statusTone(row.status)}>{row.status}</Badge>
              </span>
            </div>
            <div className="px-5 pb-5">
              <div className="-mt-12 flex items-end justify-between">
                <EmployeeAvatar name={row.name} photoUrl={row.photoUrl} size="lg" />
                <p className="mb-1 rounded-full bg-navy-50 px-3 py-1 text-[11px] font-semibold tracking-wide text-navy">
                  {row.employeeId}
                </p>
              </div>
              <h3 className="mt-3 font-display text-xl text-navy">{row.name}</h3>
              <p className="text-sm text-ink-muted">
                {row.designation || "Staff"} · {row.department}
              </p>
              <p className="mt-3 flex items-center gap-2 text-sm text-navy">
                <CalendarDays className="h-4 w-4 text-gold" />
                Join {formatBsFull(row.joinDate)}
              </p>
              {(row.email || row.phone) && (
                <div className="mt-2 space-y-1 text-xs text-ink-muted">
                  {row.email ? (
                    <p className="flex items-center gap-2 truncate">
                      <Mail className="h-3.5 w-3.5" />
                      {row.email}
                    </p>
                  ) : null}
                  {row.phone ? (
                    <p className="flex items-center gap-2">
                      <Phone className="h-3.5 w-3.5" />
                      {row.phone}
                    </p>
                  ) : null}
                </div>
              )}
              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                <div className="rounded-2xl bg-navy-50 px-2 py-3">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-ink-muted">Entitled</p>
                  <p className="font-display text-2xl text-navy">{row.entitlement ?? 0}</p>
                </div>
                <div className="rounded-2xl bg-navy-50 px-2 py-3">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-ink-muted">Used</p>
                  <p className="font-display text-2xl text-navy">{row.leaveTaken ?? 0}</p>
                </div>
                <div className="rounded-2xl bg-gold/15 px-2 py-3">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-gold">Left</p>
                  <p className="font-display text-2xl text-navy">{row.leaveLeft ?? 0}</p>
                </div>
              </div>
              <p className="mt-3 text-xs text-ink-muted">
                {row.eligible
                  ? `${row.tenureMonths} months · 14-day annual leave`
                  : `${row.tenureMonths ?? 0} months · new staff, 0 leave`}
              </p>
              <Button type="button" variant="secondary" size="sm" className="mt-4 w-full" onClick={() => startEdit(row)}>
                Open profile
              </Button>
            </div>
          </article>
        ))}
      </div>
      {!query.isLoading && !items.length ? (
        <p className="mt-6 text-sm text-ink-muted">No employee profiles yet. Add staff with a photo and join date to start.</p>
      ) : null}
      <FormDrawer open={open} title={editing ? "Employee profile" : "New employee"} onClose={() => setOpen(false)}>
        <form className="space-y-4" onSubmit={form.handleSubmit((values) => save.mutate(values))}>
          <EmployeePhotoField
            name={form.watch("name")}
            value={form.watch("photoUrl") ?? ""}
            onChange={(url) => form.setValue("photoUrl", url, { shouldDirty: true })}
          />
          <Input label="Employee ID" {...form.register("employeeId")} error={form.formState.errors.employeeId?.message} />
          <Input label="Full name" {...form.register("name")} error={form.formState.errors.name?.message} />
          <Input label="Department" {...form.register("department")} error={form.formState.errors.department?.message} />
          <Input label="Designation" {...form.register("designation")} />
          <NepaliDatePicker
            label="Join date (मिति)"
            value={form.watch("joinDate")}
            error={form.formState.errors.joinDate?.message}
            onChange={(iso) => form.setValue("joinDate", iso, { shouldValidate: true })}
          />
          <Input label="Email" {...form.register("email")} />
          <Input label="Phone" {...form.register("phone")} />
          <Select
            label="Status"
            options={[
              { value: "ACTIVE", label: "Active" },
              { value: "INACTIVE", label: "Inactive" }
            ]}
            {...form.register("status")}
          />
          {editing ? (
            <p className="rounded-xl bg-navy-50 px-3 py-2 text-xs text-navy">
              Leave left is {editing.leaveLeft} of {editing.entitlement} this Nepali year. It updates automatically when leave is saved.
            </p>
          ) : (
            <p className="text-xs text-ink-muted">New staff receive 0 days until they complete 6 months, then 14 days for the year.</p>
          )}
          <Button type="submit" className="w-full" disabled={save.isPending}>
            {save.isPending ? "Saving…" : "Save profile"}
          </Button>
        </form>
      </FormDrawer>
    </div>
  );
}
