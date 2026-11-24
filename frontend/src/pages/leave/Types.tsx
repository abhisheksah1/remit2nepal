import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { CalendarRange, CircleDollarSign, Plus, Sparkles } from "lucide-react";
import { leaveApi } from "@/api/leave.api";
import { getErrorMessage } from "@/api/client";
import { PageHeader } from "@/components/admin/PageHeader";
import { FormDrawer } from "@/components/admin/FormDrawer";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Badge, statusTone } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { useToast } from "@/components/ui/Toast";
import { entityId } from "@/utils/cn";
import type { LeaveType } from "@/types/leave";

const COLORS = ["#2E3192", "#C4A35A", "#E31E24", "#0f766e", "#1d4ed8", "#7c3aed", "#b45309", "#334155"];

const schema = z.object({
  name: z.string().min(2, "Type name is required"),
  daysAllowed: z.coerce.number().int().min(0),
  paid: z.enum(["yes", "no"]),
  color: z.string().optional(),
  description: z.string().optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional()
});

type Values = z.infer<typeof schema>;

export default function LeaveTypes() {
  const { push } = useToast();
  const client = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<LeaveType | null>(null);
  const query = useQuery({ queryKey: ["leave", "types"], queryFn: () => leaveApi.types.list({ limit: 100 }) });
  const form = useForm<Values>({ resolver: zodResolver(schema) });
  const color = form.watch("color") || "#2E3192";

  function startCreate() {
    setEditing(null);
    form.reset({ name: "", daysAllowed: 0, paid: "yes", color: "#2E3192", description: "", status: "ACTIVE" });
    setOpen(true);
  }

  function startEdit(row: LeaveType) {
    setEditing(row);
    form.reset({
      name: row.name,
      daysAllowed: row.daysAllowed,
      paid: row.paid ? "yes" : "no",
      color: row.color,
      description: row.description ?? "",
      status: row.status
    });
    setOpen(true);
  }

  const save = useMutation({
    mutationFn: (values: Values) => {
      const body = {
        name: values.name,
        daysAllowed: values.daysAllowed,
        paid: values.paid === "yes",
        color: values.color,
        description: values.description,
        status: values.status
      };
      return editing ? leaveApi.types.update(entityId(editing), body) : leaveApi.types.create(body);
    },
    onSuccess: async () => {
      push({ title: editing ? "Leave type updated" : "Leave type added", tone: "success" });
      setOpen(false);
      await client.invalidateQueries({ queryKey: ["leave", "types"] });
    },
    onError: (error) => push({ title: getErrorMessage(error), tone: "error" })
  });

  const items = query.data?.items ?? [];
  const active = items.filter((item) => item.status === "ACTIVE").length;

  return (
    <div>
      <PageHeader
        title="Leave types"
        description="Categories used when recording leave. Staff entitlement stays 14 days after 6 months, 0 until then."
        crumbs={[{ label: "Leave tracker", to: "/leave/tracker/dashboard" }, { label: "Leave types" }]}
        actionLabel="Add leave type"
        onAction={startCreate}
      />

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <article className="rounded-2xl border border-navy/10 bg-navy p-5 text-white shadow-sm">
          <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-white/60">
            <Sparkles className="h-3.5 w-3.5" /> Company rule
          </p>
          <p className="mt-3 font-display text-3xl">14 days</p>
          <p className="mt-1 text-sm text-white/70">After 6 months of service. New staff start at 0.</p>
        </article>
        <article className="rounded-2xl border border-navy/10 bg-white p-5 shadow-sm">
          <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-navy/45">
            <CalendarRange className="h-3.5 w-3.5" /> Active types
          </p>
          <p className="mt-3 font-display text-3xl text-navy">{active}</p>
          <p className="mt-1 text-sm text-ink-muted">Shown in the add-leave dropdown.</p>
        </article>
        <article className="rounded-2xl border border-navy/10 bg-white p-5 shadow-sm">
          <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-navy/45">
            <CircleDollarSign className="h-3.5 w-3.5" /> How to use
          </p>
          <p className="mt-3 text-sm leading-6 text-ink-muted">
            Types are reasons (annual, sick, casual). The profile balance is what actually deducts.
          </p>
        </article>
      </div>

      {query.isLoading ? <p className="text-sm text-ink-muted">Loading leave types…</p> : null}
      {!query.isLoading && !items.length ? (
        <EmptyState
          title="No leave types yet"
          description="Add Annual, Sick, Casual, or Unpaid so records can be classified."
          action={
            <Button onClick={startCreate}>
              <Plus className="h-4 w-4" /> Add leave type
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {items.map((row) => (
            <article
              key={entityId(row)}
              className="group relative overflow-hidden rounded-2xl border border-navy/10 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="absolute inset-y-0 left-0 w-1.5" style={{ background: row.color }} />
              <div className="p-5 pl-6">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span
                      className="grid h-11 w-11 place-items-center rounded-2xl text-sm font-bold text-white"
                      style={{ background: row.color }}
                    >
                      {row.name.slice(0, 1)}
                    </span>
                    <div>
                      <h3 className="font-display text-xl text-navy">{row.name}</h3>
                      <p className="text-xs text-ink-muted">{row.paid ? "Paid leave" : "Unpaid leave"}</p>
                    </div>
                  </div>
                  <Badge tone={statusTone(row.status)}>{row.status}</Badge>
                </div>
                <p className="mt-3 min-h-[40px] text-sm leading-6 text-ink-muted">{row.description || "No description"}</p>
                <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-xl bg-navy-50 px-2 py-2">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-ink-muted">Reference</p>
                    <p className="font-display text-lg text-navy">{row.daysAllowed}</p>
                  </div>
                  <div className="rounded-xl bg-navy-50 px-2 py-2">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-ink-muted">Records</p>
                    <p className="font-display text-lg text-navy">{row.usedCount ?? 0}</p>
                  </div>
                  <div className="rounded-xl bg-gold/10 px-2 py-2">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-gold">Days used</p>
                    <p className="font-display text-lg text-navy">{row.usedDays ?? 0}</p>
                  </div>
                </div>
                <Button type="button" variant="secondary" size="sm" className="mt-4 w-full" onClick={() => startEdit(row)}>
                  Edit type
                </Button>
              </div>
            </article>
          ))}
        </div>
      )}

      <FormDrawer open={open} title={editing ? "Edit leave type" : "New leave type"} onClose={() => setOpen(false)}>
        <form className="space-y-4" onSubmit={form.handleSubmit((values) => save.mutate(values))}>
          <Input label="Type name" placeholder="Annual, Sick, Casual…" {...form.register("name")} error={form.formState.errors.name?.message} />
          <Input
            label="Reference days"
            type="number"
            hint="Optional guide only. Staff balance is still 14 / 0 from the profile."
            {...form.register("daysAllowed")}
            error={form.formState.errors.daysAllowed?.message}
          />
          <Select
            label="Paid"
            options={[
              { value: "yes", label: "Paid" },
              { value: "no", label: "Unpaid" }
            ]}
            {...form.register("paid")}
          />
          <div className="space-y-1.5">
            <span className="text-sm font-medium text-navy">Colour</span>
            <div className="flex flex-wrap gap-2">
              {COLORS.map((item) => (
                <button
                  key={item}
                  type="button"
                  aria-label={item}
                  onClick={() => form.setValue("color", item)}
                  className="h-8 w-8 rounded-full ring-offset-2 transition"
                  style={{
                    background: item,
                    boxShadow: color === item ? `0 0 0 2px white, 0 0 0 4px ${item}` : undefined
                  }}
                />
              ))}
            </div>
            <input type="hidden" {...form.register("color")} />
          </div>
          <Input label="Description" placeholder="When this type should be used" {...form.register("description")} />
          <Select
            label="Status"
            options={[
              { value: "ACTIVE", label: "Active" },
              { value: "INACTIVE", label: "Inactive" }
            ]}
            {...form.register("status")}
          />
          <Button type="submit" className="w-full" disabled={save.isPending}>
            {save.isPending ? "Saving…" : "Save type"}
          </Button>
        </form>
      </FormDrawer>
    </div>
  );
}
