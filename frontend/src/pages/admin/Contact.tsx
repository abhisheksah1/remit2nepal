import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/api/admin.api";
import { getErrorMessage } from "@/api/client";
import { PageHeader } from "@/components/admin/PageHeader";
import { DataTable } from "@/components/admin/DataTable";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Badge, statusTone } from "@/components/ui/Badge";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { formatDateTime } from "@/utils/format";
import { entityId } from "@/utils/cn";
import type { ContactMessage } from "@/types/content";

export default function Contact() {
  const { push } = useToast();
  const client = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [pending, setPending] = useState<ContactMessage | null>(null);
  const query = useQuery({
    queryKey: ["admin-contact", page, search],
    queryFn: () => adminApi.contact.list({ page, search, limit: 20 })
  });

  const update = useMutation({
    mutationFn: ({ id, status }: { id: string; status: ContactMessage["status"] }) => adminApi.contact.update(id, status),
    onSuccess: async () => {
      await client.invalidateQueries({ queryKey: ["admin-contact"] });
    },
    onError: (error) => push({ title: getErrorMessage(error), tone: "error" })
  });

  const remove = useMutation({
    mutationFn: (id: string) => adminApi.contact.remove(id),
    onSuccess: async () => {
      setPending(null);
      push({ title: "Message deleted", tone: "success" });
      await client.invalidateQueries({ queryKey: ["admin-contact"] });
    },
    onError: (error) => push({ title: getErrorMessage(error), tone: "error" })
  });

  return (
    <div>
      <PageHeader title="Contact messages" crumbs={[{ label: "Admin", to: "/admin" }, { label: "Contact" }]} />
      <DataTable
        columns={[
          { key: "name", header: "From", render: (row) => `${row.name} · ${row.email}` },
          { key: "subject", header: "Subject", render: (row) => row.subject },
          { key: "message", header: "Message", render: (row) => <span className="line-clamp-2 max-w-sm">{row.message}</span> },
          { key: "status", header: "Status", render: (row) => <Badge tone={statusTone(row.status)}>{row.status}</Badge> },
          { key: "when", header: "Received", render: (row) => formatDateTime(row.createdAt) },
          {
            key: "act",
            header: "",
            render: (row) => (
              <div className="flex items-center gap-2">
                <Select
                  value={row.status}
                  onChange={(event) =>
                    update.mutate({ id: entityId(row), status: event.target.value as ContactMessage["status"] })
                  }
                  options={[
                    { value: "NEW", label: "New" },
                    { value: "READ", label: "Read" },
                    { value: "REPLIED", label: "Replied" },
                    { value: "ARCHIVED", label: "Archived" }
                  ]}
                />
                <Button size="sm" variant="ghost" onClick={() => setPending(row)}>
                  Delete
                </Button>
              </div>
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
        title="Delete this message?"
        description="The enquiry will be permanently removed."
        danger
        confirmLabel="Delete"
        busy={remove.isPending}
        onClose={() => setPending(null)}
        onConfirm={() => pending && remove.mutate(entityId(pending))}
      />
    </div>
  );
}
