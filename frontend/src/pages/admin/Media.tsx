import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/api/admin.api";
import { getErrorMessage } from "@/api/client";
import { PageHeader } from "@/components/admin/PageHeader";
import { DataTable } from "@/components/admin/DataTable";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";
import { formatDateTime, formatFileSize } from "@/utils/format";
import { entityId, mediaUrl } from "@/utils/cn";
import type { MediaItem } from "@/types/content";

export default function Media() {
  const { push } = useToast();
  const client = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [altText, setAltText] = useState("");
  const [folder, setFolder] = useState("general");
  const [pending, setPending] = useState<MediaItem | null>(null);
  const query = useQuery({
    queryKey: ["admin-media", page, search],
    queryFn: () => adminApi.media.list({ page, search, limit: 20 })
  });

  const upload = useMutation({
    mutationFn: async (file: File) => adminApi.media.upload(file, altText, folder),
    onSuccess: async () => {
      push({ title: "File uploaded", tone: "success" });
      await client.invalidateQueries({ queryKey: ["admin-media"] });
    },
    onError: (error) => push({ title: getErrorMessage(error), tone: "error" })
  });

  const remove = useMutation({
    mutationFn: (id: string) => adminApi.media.remove(id),
    onSuccess: async () => {
      setPending(null);
      push({ title: "Deleted", tone: "success" });
      await client.invalidateQueries({ queryKey: ["admin-media"] });
    },
    onError: (error) => push({ title: getErrorMessage(error), tone: "error" })
  });

  return (
    <div>
      <PageHeader title="Media library" crumbs={[{ label: "Admin", to: "/admin" }, { label: "Media" }]} />
      <form
        className="admin-toolbar mb-6 md:grid-cols-4"
        onSubmit={(event) => event.preventDefault()}
      >
        <Input label="Alt text" value={altText} onChange={(event) => setAltText(event.target.value)} />
        <Input label="Folder" value={folder} onChange={(event) => setFolder(event.target.value)} />
        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-navy">File</span>
          <input
            type="file"
            className="block w-full text-sm"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) upload.mutate(file);
            }}
          />
        </label>
      </form>
      <DataTable
        columns={[
          {
            key: "preview",
            header: "File",
            render: (row) =>
              row.mimeType.startsWith("image/") ? (
                <img src={mediaUrl(row.url)} alt={row.altText} className="h-12 w-12 rounded object-cover" />
              ) : (
                row.originalName
              )
          },
          { key: "name", header: "Name", render: (row) => row.originalName },
          { key: "folder", header: "Folder", render: (row) => row.folder },
          { key: "size", header: "Size", render: (row) => formatFileSize(row.size) },
          { key: "when", header: "Uploaded", render: (row) => formatDateTime(row.createdAt) },
          { key: "url", header: "URL", render: (row) => <span className="text-xs">{row.url}</span> },
          {
            key: "del",
            header: "",
            render: (row) => (
              <Button size="sm" variant="ghost" onClick={() => setPending(row)}>
                Delete
              </Button>
            )
          }
        ]}
        rows={query.data?.items ?? []}
        loading={query.isLoading}
        search={search}
        onSearch={setSearch}
        page={page}
        total={query.data?.total}
        onPageChange={setPage}
        rowKey={(row) => entityId(row)}
      />
      <ConfirmDialog
        open={Boolean(pending)}
        title="Delete this file?"
        description="The file will be removed from the media library."
        danger
        confirmLabel="Delete"
        busy={remove.isPending}
        onClose={() => setPending(null)}
        onConfirm={() => pending && remove.mutate(entityId(pending))}
      />
    </div>
  );
}
