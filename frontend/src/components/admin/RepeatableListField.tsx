import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ImageUploadField } from "./ImageUploadField";

export interface ListItemField {
  name: string;
  label: string;
  type?: "text" | "textarea" | "image";
  folder?: string;
}

function parseRows(raw: string): Record<string, string>[] {
  try {
    const parsed = JSON.parse(raw || "[]") as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((row) => row && typeof row === "object" && !Array.isArray(row))
      .map((row) => {
        const next: Record<string, string> = {};
        for (const [key, value] of Object.entries(row as Record<string, unknown>)) {
          if (value == null || typeof value === "object") continue;
          next[key] = String(value);
        }
        return next;
      });
  } catch {
    return [];
  }
}

export function RepeatableListField({
  label,
  hint,
  error,
  value,
  itemFields,
  addLabel = "Add item",
  emptyItem,
  onChange
}: {
  label: string;
  hint?: string;
  error?: string;
  value: string;
  itemFields: ListItemField[];
  addLabel?: string;
  emptyItem: Record<string, string>;
  onChange: (value: string) => void;
}) {
  const rows = parseRows(value);

  const commit = (next: Record<string, string>[]) => {
    onChange(JSON.stringify(next));
  };

  const updateRow = (index: number, key: string, nextValue: string) => {
    commit(rows.map((row, rowIndex) => (rowIndex === index ? { ...row, [key]: nextValue } : row)));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-navy">{label}</span>
        <Button type="button" variant="secondary" size="sm" onClick={() => commit([...rows, { ...emptyItem }])}>
          <Plus className="h-4 w-4" />
          {addLabel}
        </Button>
      </div>
      {rows.length === 0 ? <p className="text-sm text-ink-muted">None yet. Use Add to create one.</p> : null}
      {rows.map((row, index) => (
        <div key={`${label}-${index}`} className="space-y-3 rounded-xl border border-navy/10 bg-navy-50/40 p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-ink-muted">Item {index + 1}</p>
            <button
              type="button"
              className="rounded p-1 text-ink-muted hover:bg-white hover:text-gold"
              onClick={() => commit(rows.filter((_, rowIndex) => rowIndex !== index))}
              aria-label={`Remove ${label} ${index + 1}`}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
          {itemFields.map((field) => {
            const fieldId = `${label}-${index}-${field.name}`;
            if (field.type === "image") {
              return (
                <ImageUploadField
                  key={field.name}
                  label={field.label}
                  value={row[field.name] ?? ""}
                  folder={field.folder ?? "sections"}
                  onChange={(url) => updateRow(index, field.name, url)}
                />
              );
            }
            if (field.type === "textarea") {
              return (
                <label key={field.name} className="block space-y-1.5" htmlFor={fieldId}>
                  <span className="text-sm font-medium text-navy">{field.label}</span>
                  <textarea
                    id={fieldId}
                    className="w-full rounded-md border border-navy/15 bg-white px-3 py-2 text-sm"
                    rows={3}
                    value={row[field.name] ?? ""}
                    onChange={(event) => updateRow(index, field.name, event.target.value)}
                  />
                </label>
              );
            }
            return (
              <label key={field.name} className="block space-y-1.5" htmlFor={fieldId}>
                <span className="text-sm font-medium text-navy">{field.label}</span>
                <input
                  id={fieldId}
                  type="text"
                  className="w-full rounded-md border border-navy/15 bg-white px-3 py-2.5 text-sm"
                  value={row[field.name] ?? ""}
                  onChange={(event) => updateRow(index, field.name, event.target.value)}
                />
              </label>
            );
          })}
        </div>
      ))}
      {hint ? <p className="text-xs text-ink-muted">{hint}</p> : null}
      {error ? <p className="text-xs text-red-700">{error}</p> : null}
    </div>
  );
}
