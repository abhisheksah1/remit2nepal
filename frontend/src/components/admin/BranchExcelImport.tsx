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
      const response = await api.get<Blob>("/branches/import/template", { responseType: "blob" });
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
      return unwrap<ImportResult>(api.post("/branches/import", form));
    },
    onSuccess: async (result) => {
      await client.invalidateQueries({ queryKey: ["admin-branches"] });
      await client.invalidateQueries({ queryKey: ["public", "branches"] });
      const failed = result.errors.length;
      push({
        title: `Imported ${result.created} new, updated ${result.updated}`,
        description: failed ? `${failed} row${failed === 1 ? "" : "s"} need attention.` : "Agent list is up to date.",
        tone: failed ? "error" : "success"
      });
    },
    onError: (error) => push({ title: getErrorMessage(error, "Excel import failed"), tone: "error" })
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
        accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
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
