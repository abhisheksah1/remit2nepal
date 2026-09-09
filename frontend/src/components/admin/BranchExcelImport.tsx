import { useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Download, Upload } from "lucide-react";
import { api, getErrorMessage, unwrap } from "@/api/client";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";

interface ImportResult {
  created: number;
  updated: number;
  skipped: number;
  errors: Array<{ row: number; message: string }>;
}

export function BranchExcelImport() {
  const inputRef = useRef<HTMLInputElement>(null);
  const { push } = useToast();
  const client = useQueryClient();

  const download = useMutation({
    mutationFn: async () => {
      const response = await api.get<Blob>("/branches/import/template", {
        responseType: "blob",
        timeout: 60_000
      });
      const url = URL.createObjectURL(response.data);
      const link = document.createElement("a");
      link.href = url;
      link.download = "remit2nepal-agents-template.xlsx";
      link.click();
      URL.revokeObjectURL(url);
    },
    onError: (error) => push({ title: getErrorMessage(error, "Could not download template"), tone: "error" })
  });

  const upload = useMutation({
    mutationFn: async (file: File) => {
      const form = new FormData();
      form.append("file", file);
      return unwrap<ImportResult>(api.post("/branches/import", form, { timeout: 120_000 }));
    },
    onSuccess: async (result) => {
      await client.invalidateQueries({ queryKey: ["admin-branches"] });
      await client.invalidateQueries({ queryKey: ["public", "branches"] });
      const failed = result.errors.length;
      const sample = result.errors[0] ? ` Row ${result.errors[0].row}: ${result.errors[0].message}` : "";
      const saved = result.created + result.updated;
      push({
        title: saved
          ? `Saved ${result.created} new, updated ${result.updated}`
          : "No agents were saved",
        description: failed
          ? `${failed} row${failed === 1 ? "" : "s"} skipped.${sample}`
          : "Agents now appear in Admin and on the public branch page.",
        tone: saved && !failed ? "success" : saved ? "info" : "error"
      });
    },
    onError: (error) =>
      push({
        title: getErrorMessage(error, "Excel import failed"),
        description: "Use columns Agent Name, District and Address. Download the template if needed.",
        tone: "error"
      })
  });

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button variant="secondary" onClick={() => download.mutate()} disabled={download.isPending}>
        <Download className="h-4 w-4" />
        Excel template
      </Button>
      <Button variant="gold" onClick={() => inputRef.current?.click()} disabled={upload.isPending}>
        <Upload className="h-4 w-4" />
        {upload.isPending ? "Importing…" : "Upload Excel"}
      </Button>
      <input
        ref={inputRef}
        type="file"
        accept=".xlsx,.xls,.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv"
        className="sr-only"
        onChange={(event) => {
          const file = event.target.files?.[0];
          event.target.value = "";
          if (file) upload.mutate(file);
        }}
      />
    </div>
  );
}
