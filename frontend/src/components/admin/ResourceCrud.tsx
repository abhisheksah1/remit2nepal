import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useSearchParams } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";
import type { ZodType } from "zod";
import type { ListParams, Paginated } from "@/types/api";
import { getErrorMessage } from "@/api/client";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/ui/Toast";
import { Badge, statusTone } from "@/components/ui/Badge";
import { DataTable, type Column } from "./DataTable";
import { FormDrawer } from "./FormDrawer";
import { PageHeader } from "./PageHeader";
import { entityId } from "@/utils/cn";
import { ImageUploadField } from "./ImageUploadField";
import { RepeatableListField, type ListItemField } from "./RepeatableListField";

export interface FieldSpec {
  name: string;
  label: string;
  type?: "text" | "textarea" | "number" | "select" | "checkbox" | "url" | "date" | "image" | "list" | "note";
  options?: Array<{ value: string; label: string }>;
  hint?: string;
  folder?: string;
  id?: string;
  group?: string;
  showWhen?: (values: Record<string, string | number | boolean>) => boolean;
  disabledWhen?: (values: Record<string, string | number | boolean>, editing: boolean) => boolean;
  itemFields?: ListItemField[];
  addLabel?: string;
  emptyItem?: Record<string, string>;
  ratioField?: string;
  previewFit?: "cover" | "contain";
}

function groupedFields(fields: FieldSpec[]) {
  const groups: Array<{ name: string; fields: FieldSpec[] }> = [];
  for (const field of fields) {
    const name = field.group ?? "";
    const last = groups[groups.length - 1];
    if (last && last.name === name) last.fields.push(field);
    else groups.push({ name, fields: [field] });
  }
  return groups;
}

export function ResourceCrud<T extends { _id?: string; status?: string }>({
  title,
  description,
  crumbs,
  queryKey,
  list,
  create,
  update,
  remove,
  fields,
  columns,
  toForm,
  toPayload,
  schema,
  extraActions,
  itemTitle
}: {
  title: string;
  description?: string;
  crumbs: Array<{ label: string; to?: string }>;
  queryKey: string;
  list: (params: ListParams) => Promise<Paginated<T>>;
  create: (body: unknown) => Promise<T>;
  update: (id: string, body: unknown) => Promise<T>;
  remove: (id: string) => Promise<unknown>;
  fields: FieldSpec[];
  columns: Column<T>[];
  toForm: (item?: T) => Record<string, string | number | boolean>;
  toPayload: (values: Record<string, string | number | boolean>) => unknown;
  schema?: ZodType;
  extraActions?: ReactNode;
  itemTitle?: (item: T) => string;
}) {
  const { push } = useToast();
  const client = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [draft, setDraft] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setSearch(draft);
      setPage(1);
    }, 300);
    return () => window.clearTimeout(timer);
  }, [draft]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<T | null>(null);
  const [values, setValues] = useState<Record<string, string | number | boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pendingDelete, setPendingDelete] = useState<T | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const openedFromUrl = useRef(false);

  const query = useQuery({
    queryKey: [queryKey, page, search],
    queryFn: () => list({ page, limit: 50, search })
  });

  useEffect(() => {
    if (openedFromUrl.current || !query.data?.items?.length) return;
    const edit = searchParams.get("edit") || searchParams.get("key");
    if (!edit) return;
    const row = query.data.items.find((item) => {
      if (entityId(item) === edit) return true;
      return "key" in (item as object) && String((item as { key?: string }).key) === edit;
    });
    if (!row) return;
    openedFromUrl.current = true;
    setEditing(row);
    setValues(toForm(row));
    setErrors({});
    setOpen(true);
    const next = new URLSearchParams(searchParams);
    next.delete("edit");
    next.delete("key");
    setSearchParams(next, { replace: true });
  }, [query.data, searchParams, setSearchParams, toForm]);

  const save = useMutation({
    mutationFn: async () => {
      if (schema) {
        const parsed = schema.safeParse(values);
        if (!parsed.success) {
          const next: Record<string, string> = {};
          for (const issue of parsed.error.issues) {
            const key = String(issue.path[0] ?? "form");
            next[key] = issue.message;
          }
          setErrors(next);
          throw new Error("Please correct the highlighted fields.");
        }
      }
      const payload = toPayload(values);
      if (editing) return update(entityId(editing), payload);
      return create(payload);
    },
    onSuccess: async () => {
      push({ title: editing ? "Updated" : "Created", tone: "success" });
      setOpen(false);
      await client.invalidateQueries({ queryKey: [queryKey] });
      await client.invalidateQueries({ queryKey: ["public"] });
    },
    onError: (error) => push({ title: getErrorMessage(error), tone: "error" })
  });

  const destroy = useMutation({
    mutationFn: (id: string) => remove(id),
    onSuccess: async () => {
      push({ title: "Deleted", tone: "success" });
      setPendingDelete(null);
      await client.invalidateQueries({ queryKey: [queryKey] });
      await client.invalidateQueries({ queryKey: ["public"] });
    },
    onError: (error) => push({ title: getErrorMessage(error), tone: "error" })
  });

  const tableColumns = useMemo<Column<T>[]>(
    () => [
      ...columns,
      {
        key: "actions",
        header: "",
        render: (row) => (
          <div className="flex justify-end gap-2">
            <Button
              variant="ghost"
              size="sm"
              aria-label="Edit"
              onClick={() => {
                setEditing(row);
                setValues(toForm(row));
                setErrors({});
                setOpen(true);
              }}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" aria-label="Delete" onClick={() => setPendingDelete(row)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )
      }
    ],
    [columns, toForm]
  );

  return (
    <div>
      <PageHeader
        title={title}
        description={description}
        crumbs={crumbs}
        actionLabel={`New ${title.replace(/s$/, "")}`}
        onAction={() => {
          setEditing(null);
          setValues(toForm());
          setErrors({});
          setOpen(true);
        }}
        extra={extraActions}
      />
      <DataTable
        columns={tableColumns}
        rows={query.data?.items ?? []}
        loading={query.isLoading}
        search={draft}
        onSearch={setDraft}
        page={page}
        total={query.data?.total ?? 0}
        onPageChange={setPage}
        rowKey={(row) => entityId(row)}
      />
      <FormDrawer
        open={open}
        title={editing ? `Edit ${itemTitle?.(editing) || title}` : `New ${title.replace(/s$/, "")}`}
        onClose={() => setOpen(false)}
        wide
      >
        <form
          className="space-y-5"
          onSubmit={(event) => {
            event.preventDefault();
            save.mutate();
          }}
        >
          {groupedFields(fields.filter((field) => !field.showWhen || field.showWhen(values))).map((group) => {
            const body = group.fields.map((field) => (
              <Field
                key={field.id ?? `${field.name}-${field.label}`}
                field={field}
                value={values[field.name]}
                ratioValue={field.ratioField ? values[field.ratioField] : undefined}
                error={errors[field.name]}
                disabled={field.disabledWhen?.(values, Boolean(editing))}
                onChange={(next) => setValues((current) => ({ ...current, [field.name]: next }))}
                onMeta={(patch) => setValues((current) => ({ ...current, ...patch }))}
              />
            ));
            if (!group.name) {
              return (
                <div key="ungrouped" className="space-y-4">
                  {body}
                </div>
              );
            }
            return (
              <fieldset key={group.name} className="admin-field-group space-y-4">
                <legend>{group.name}</legend>
                {body}
              </fieldset>
            );
          })}
          <div className="admin-drawer-actions">
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={save.isPending}>
              {save.isPending ? "Saving…" : "Save"}
            </Button>
          </div>
        </form>
      </FormDrawer>
      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete this record?"
        description="This action cannot be undone."
        confirmLabel="Delete"
        danger
        busy={destroy.isPending}
        onClose={() => setPendingDelete(null)}
        onConfirm={() => pendingDelete && destroy.mutate(entityId(pendingDelete))}
      />
    </div>
  );
}

function Field({
  field,
  value,
  ratioValue,
  error,
  disabled,
  onChange,
  onMeta
}: {
  field: FieldSpec;
  value: string | number | boolean | undefined;
  ratioValue?: string | number | boolean;
  error?: string;
  disabled?: boolean;
  onChange: (value: string | number | boolean) => void;
  onMeta?: (patch: Record<string, string | number | boolean>) => void;
}) {
  const id = field.name;
  if (field.type === "note") {
    return (
      <p className="rounded-xl border border-dashed border-navy/15 bg-white px-3 py-3 text-sm text-ink-muted">
        {field.hint || field.label}
      </p>
    );
  }
  if (field.type === "checkbox") {
    return (
      <label className="flex items-center gap-2 text-sm text-navy" htmlFor={id}>
        <input
          id={id}
          type="checkbox"
          checked={Boolean(value)}
          disabled={disabled}
          onChange={(event) => onChange(event.target.checked)}
        />
        {field.label}
      </label>
    );
  }
  if (field.type === "textarea") {
    return (
      <label className="block space-y-1.5" htmlFor={id}>
        <span className="text-sm font-medium text-navy">{field.label}</span>
        <textarea
          id={id}
          className="w-full rounded-md border border-navy/15 bg-white px-3 py-2 text-sm disabled:bg-navy-50 disabled:text-ink-muted"
          rows={4}
          value={String(value ?? "")}
          disabled={disabled}
          onChange={(event) => onChange(event.target.value)}
        />
        {field.hint ? <span className="text-xs text-ink-muted">{field.hint}</span> : null}
        {error ? <span className="text-xs text-red-700">{error}</span> : null}
      </label>
    );
  }
  if (field.type === "list") {
    return (
      <RepeatableListField
        label={field.label}
        hint={field.hint}
        error={error}
        value={String(value ?? "[]")}
        itemFields={field.itemFields ?? [{ name: "title", label: "Text" }]}
        addLabel={field.addLabel}
        emptyItem={field.emptyItem ?? { title: "" }}
        onChange={onChange}
      />
    );
  }
  if (field.type === "image") {
    return (
      <ImageUploadField
        label={field.label}
        value={String(value ?? "")}
        folder={field.folder ?? "general"}
        hint={field.hint}
        fit={field.previewFit ?? "cover"}
        ratio={typeof ratioValue === "string" ? ratioValue : undefined}
        onChange={onChange}
        onRatioDetected={
          field.ratioField
            ? (next) => onMeta?.({ [field.ratioField as string]: next })
            : undefined
        }
      />
    );
  }
  if (field.type === "select") {
    return (
      <label className="block space-y-1.5" htmlFor={id}>
        <span className="text-sm font-medium text-navy">{field.label}</span>
        <select
          id={id}
          className="w-full rounded-md border border-navy/15 bg-white px-3 py-2.5 text-sm disabled:bg-navy-50 disabled:text-ink-muted"
          value={String(value ?? "")}
          disabled={disabled}
          onChange={(event) => onChange(event.target.value)}
        >
          {(field.options ?? []).map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {field.hint ? <span className="text-xs text-ink-muted">{field.hint}</span> : null}
        {error ? <span className="text-xs text-red-700">{error}</span> : null}
      </label>
    );
  }
  return (
    <label className="block space-y-1.5" htmlFor={id}>
      <span className="text-sm font-medium text-navy">{field.label}</span>
      <input
        id={id}
        type={field.type === "number" ? "number" : field.type === "date" ? "date" : field.type === "url" ? "url" : "text"}
        className="w-full rounded-md border border-navy/15 bg-white px-3 py-2.5 text-sm disabled:bg-navy-50 disabled:text-ink-muted"
        value={String(value ?? "")}
        disabled={disabled}
        onChange={(event) => onChange(field.type === "number" ? Number(event.target.value) : event.target.value)}
      />
      {field.hint ? <span className="text-xs text-ink-muted">{field.hint}</span> : null}
      {error ? <span className="text-xs text-red-700">{error}</span> : null}
    </label>
  );
}

export function StatusCell({ value }: { value?: string }) {
  if (!value) return null;
  return <Badge tone={statusTone(value)}>{value}</Badge>;
}
